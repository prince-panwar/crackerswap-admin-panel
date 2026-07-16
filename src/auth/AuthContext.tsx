import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  api,
  hasSession,
  login as apiLogin,
  logout as apiLogout,
  refreshSession,
} from '@/lib/api';
import type { AuthedAdmin } from '@/pages/admin/api-types';

interface AuthState {
  admin: AuthedAdmin | null;
  loading: boolean; // true while restoring the session on load
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthedAdmin>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AuthedAdmin | null>(null);
  // The access token lives only in memory, so on every load we must attempt a
  // silent refresh before we know whether there's a session.
  const [loading, setLoading] = useState<boolean>(hasSession());

  useEffect(() => {
    let cancelled = false;
    if (!hasSession()) {
      setLoading(false);
      return;
    }
    refreshSession()
      .then((ok) => {
        if (!ok) return null;
        return api.get<AuthedAdmin>('/admin/auth/me');
      })
      .then((me) => {
        if (!cancelled) setAdmin(me ?? null);
      })
      .catch(() => {
        if (!cancelled) setAdmin(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const session = await apiLogin(email, password);
    setAdmin(session.admin);
    return session.admin;
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
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
