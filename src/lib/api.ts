// Thin fetch wrapper for the CrackerSwap admin API.
// - Base URL from VITE_API_BASE_URL (includes the /v1 prefix).
// - Access token is held IN MEMORY only (never localStorage) and sent as a
//   Bearer header. The refresh token lives in an httpOnly cookie the browser
//   sends automatically (credentials: 'include').
// - The CSRF token is kept in localStorage (it is NOT a bearer secret) so it
//   survives a page reload, and echoed in the X-CSRF-Token header on the
//   cookie-authenticated endpoints (refresh/logout).
// - On a 401 for an authenticated request we attempt a single silent refresh
//   and replay the request once before bouncing to the login screen.

import type { SessionResponse } from '@/pages/admin/api-types';

const BASE_URL = resolveBaseUrl();

function resolveBaseUrl(): string {
  const configured = (import.meta.env.VITE_API_BASE_URL as string | undefined)
    ?.trim()
    .replace(/\/+$/, '');
  if (configured) return configured;
  // Only fall back to a plaintext localhost URL during local development —
  // never ship a build that transmits tokens over http:// to a real host.
  if (import.meta.env.DEV) return 'http://localhost:8000/v1';
  throw new Error('VITE_API_BASE_URL is not set');
}

// CSRF token is safe to persist (not a session credential); a cross-site
// attacker cannot read our origin's localStorage.
const CSRF_KEY = 'cs_admin_csrf';

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setSession(session: SessionResponse): void {
  accessToken = session.accessToken;
  localStorage.setItem(CSRF_KEY, session.csrfToken);
}

export function clearSession(): void {
  accessToken = null;
  localStorage.removeItem(CSRF_KEY);
}

function getCsrf(): string | null {
  return localStorage.getItem(CSRF_KEY);
}

/** Whether there is evidence of a prior session worth trying to refresh. */
export function hasSession(): boolean {
  return !!getCsrf();
}

export interface ApiError {
  status: number;
  message: string;
}

interface RequestOptions {
  /** Send the X-CSRF-Token header (refresh/logout). */
  csrf?: boolean;
  /** Attempt a silent refresh + single replay on 401. Default true. */
  retryOn401?: boolean;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  opts: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (opts.csrf) {
    const csrf = getCsrf();
    if (csrf) headers['X-CSRF-Token'] = csrf;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isAuthEndpoint = path.startsWith('/admin/auth/');

  // A 401 on an authenticated (non-auth) request means the short-lived access
  // token expired. Try one silent refresh, then replay the original request
  // once. Only give up (and bounce to login) if the refresh also fails.
  if (res.status === 401 && !isAuthEndpoint && opts.retryOn401 !== false) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return request<T>(method, path, body, { ...opts, retryOn401: false });
    }
    handleSessionEnd();
    throw { status: 401, message: 'Session expired' } as ApiError;
  }

  const text = await res.text();
  const data = text ? safeJson(text) : undefined;

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Request failed (${res.status})`;
    throw {
      status: res.status,
      message: Array.isArray(message) ? message.join(', ') : String(message),
    } as ApiError;
  }

  return data as T;
}

function safeJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

// Single-flight guard so concurrent 401s trigger only one /refresh.
let refreshInFlight: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (!hasSession()) return false;
  if (!refreshInFlight) {
    refreshInFlight = request<SessionResponse>(
      'POST',
      '/admin/auth/refresh',
      undefined,
      { csrf: true, retryOn401: false },
    )
      .then((session) => {
        setSession(session);
        return true;
      })
      .catch(() => {
        clearSession();
        return false;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

function handleSessionEnd(): void {
  clearSession();
  if (!location.pathname.endsWith('/admin/login')) {
    location.href = '/admin/login';
  }
}

/** Log in with credentials; stores the returned session (access token in
 *  memory, CSRF token in localStorage, refresh token set as a cookie). */
export async function login(
  email: string,
  password: string,
): Promise<SessionResponse> {
  const session = await request<SessionResponse>(
    'POST',
    '/admin/auth/login',
    { email, password },
    { retryOn401: false },
  );
  setSession(session);
  return session;
}

/** Restore a session on app load using the refresh cookie. Returns true if a
 *  fresh access token was obtained. */
export function refreshSession(): Promise<boolean> {
  return tryRefresh();
}

/** Revoke the current session server-side and clear local state. */
export async function logout(): Promise<void> {
  try {
    await request('POST', '/admin/auth/logout', undefined, {
      csrf: true,
      retryOn401: false,
    });
  } catch {
    // Even if the server call fails, drop local state below.
  }
  clearSession();
}

function query(params?: Record<string, unknown>): string {
  if (!params) return '';
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return qs ? `?${qs}` : '';
}

export const api = {
  get: <T>(path: string, params?: Record<string, unknown>) =>
    request<T>('GET', `${path}${query(params)}`),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
