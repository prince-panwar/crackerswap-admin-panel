import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import type { ApiError } from '@/lib/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/admin/dashboard');
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr?.status === 403) {
        setUnauthorized(true);
      } else {
        setError(apiErr?.message || 'Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        {/* Ambient glow — accent violet at low opacity; can't reference
         * `var(--accent)` with a Tailwind opacity modifier (custom CSS-var
         * colors silently drop the `/N` modifier), so it's the literal rgb
         * of #614FE1 (accent) at 6% alpha instead. */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(97,79,225,0.06)_0%,transparent_70%)] blur-[100px]" />
          <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(97,79,225,0.06)_0%,transparent_70%)] blur-[100px]" />
        </div>
        <div className="relative z-10 w-full max-w-md rounded-[28px] bg-surface-strong border border-card-border shadow-[0_32px_96px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-danger-soft border border-danger-soft flex items-center justify-center">
              <i className="ri-shield-user-line text-2xl text-danger"></i>
            </div>
            <h2 className="text-xl font-bold text-fg mt-5">Access Restricted</h2>
            <p className="text-sm text-fg-tertiary mt-2 leading-relaxed">
              You do not have permission to access this admin area. Only authorized personnel with admin credentials can access the CrackerSwap operations dashboard.
            </p>
            <button
              onClick={() => { setUnauthorized(false); setEmail(''); setPassword(''); }}
              className="mt-6 px-6 py-2.5 rounded-full bg-warning-soft border border-warning-soft text-warning text-sm font-semibold hover:brightness-110 transition-all cursor-pointer whitespace-nowrap"
            >
              Return to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative">
      {/* Ambient glows — see the accent-tint note in the unauthorized state above. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(97,79,225,0.06)_0%,transparent_70%)] blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(97,79,225,0.06)_0%,transparent_70%)] blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_0_12px_var(--accent-soft)]"
              style={{ backgroundImage: 'var(--grad-brand)' }}
            >
              <i className="ri-admin-line text-white text-xl"></i>
            </div>
            <span className="text-fg font-semibold text-lg tracking-tight">CrackerSwap Admin</span>
          </div>
        </div>

        {/* Login card */}
        <div className="rounded-[28px] bg-surface-strong border border-card-border shadow-[0_32px_96px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-bold text-fg">Admin Login</h2>
            <p className="text-sm text-fg-tertiary mt-1.5">Access CrackerSwap operations dashboard.</p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              {error && (
                <div className="px-4 py-3 rounded-xl bg-danger-soft border border-danger-soft flex items-center gap-3">
                  <i className="ri-error-warning-line text-danger text-sm"></i>
                  <span className="text-sm text-danger">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-fg-secondary mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@crackerswap.io"
                  className="w-full px-4 py-3 rounded-2xl bg-surface border border-card-border text-sm text-fg placeholder-fg-subtle outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent-soft"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-fg-secondary mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-2xl bg-surface border border-card-border text-sm text-fg placeholder-fg-subtle outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent-soft"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundImage: 'var(--grad-brand)' }}
                className="w-full py-3 rounded-full text-white text-sm font-semibold shadow-[0_0_20px_var(--accent-soft)] hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin text-sm"></i>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="text-center text-xs text-fg-subtle mt-4">
              <span className="cursor-pointer hover:text-fg-tertiary transition-colors">Forgot password?</span>
            </p>
          </div>

          <div className="px-8 py-4 border-t border-card-border bg-surface">
            <p className="text-center text-[11px] text-fg-subtle">
              <i className="ri-shield-check-line mr-1"></i>
              Authorized access only. All login attempts are logged.
            </p>
          </div>
        </div>

        {/* Sign in with the admin credentials provisioned on the backend. */}
        <p className="text-center text-[11px] text-fg-subtle mt-4">
          Use your CrackerSwap admin credentials.
        </p>
      </div>
    </div>
  );
}