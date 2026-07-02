import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { api, clearToken, getToken, setToken } from '@/lib/api';
import type { AuthedAdmin, LoginResponse } from '@/pages/admin/api-types';

interface AuthState {
  admin: AuthedAdmin | null;
  loading: boolean; // true while bootstrapping the session from a stored token
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthedAdmin>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AuthedAdmin | null>(null);
  const [loading, setLoading] = useState<boolean>(!!getToken());

  // Validate a stored token on mount by loading the current admin.
  useEffect(() => {
    let cancelled = false;
    if (!getToken()) {
      setLoading(false);
      return;
    }
    api
      .get<AuthedAdmin>('/admin/auth/me')
      .then((me) => {
        if (!cancelled) setAdmin(me);
      })
      .catch(() => {
        if (!cancelled) {
          clearToken();
          setAdmin(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<LoginResponse>('/admin/auth/login', {
      email,
      password,
    });
    setToken(res.accessToken);
    setAdmin(res.admin);
    return res.admin;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setAdmin(null);
    window.location.href = '/admin/login';
  }, []);

  const value: AuthState = {
    admin,
    loading,
    isSuperAdmin: admin?.role === 'super_admin',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
