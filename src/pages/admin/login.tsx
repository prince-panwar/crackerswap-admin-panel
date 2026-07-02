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
      <div className="min-h-screen bg-[#070214] flex items-center justify-center p-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,106,26,0.06)_0%,transparent_70%)] blur-[100px]" />
          <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(108,77,255,0.06)_0%,transparent_70%)] blur-[100px]" />
        </div>
        <div className="relative z-10 w-full max-w-md rounded-[28px] bg-[#0F0D1A] border border-[#1A1A2E] shadow-[0_32px_96px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FF5B5B]/10 border border-[#FF5B5B]/20 flex items-center justify-center">
              <i className="ri-shield-user-line text-2xl text-[#FF5B5B]"></i>
            </div>
            <h2 className="text-xl font-bold text-[#F6F2EA] mt-5">Access Restricted</h2>
            <p className="text-sm text-[#A69DB7] mt-2 leading-relaxed">
              You do not have permission to access this admin area. Only authorized personnel with admin credentials can access the CrackerSwap operations dashboard.
            </p>
            <button
              onClick={() => { setUnauthorized(false); setEmail(''); setPassword(''); }}
              className="mt-6 px-6 py-2.5 rounded-full bg-[#FF8A3D]/10 border border-[#FF8A3D]/20 text-[#FF8A3D] text-sm font-semibold hover:bg-[#FF8A3D]/20 transition-all cursor-pointer whitespace-nowrap"
            >
              Return to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070214] flex items-center justify-center p-6 relative">
      {/* Ambient glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,106,26,0.06)_0%,transparent_70%)] blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(108,77,255,0.06)_0%,transparent_70%)] blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6A1A] to-[#FF7A22] flex items-center justify-center shadow-[0_0_12px_rgba(255,106,26,0.35)]">
              <i className="ri-admin-line text-white text-xl"></i>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">CrackerSwap Admin</span>
          </div>
        </div>

        {/* Login card */}
        <div className="rounded-[28px] bg-[#0F0D1A] border border-[#1A1A2E] shadow-[0_32px_96px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-bold text-[#F6F2EA]">Admin Login</h2>
            <p className="text-sm text-[#A69DB7] mt-1.5">Access CrackerSwap operations dashboard.</p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              {error && (
                <div className="px-4 py-3 rounded-xl bg-[#FF5B5B]/10 border border-[#FF5B5B]/20 flex items-center gap-3">
                  <i className="ri-error-warning-line text-[#FF5B5B] text-sm"></i>
                  <span className="text-sm text-[#FF5B5B]">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#D8D1E6] mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@crackerswap.io"
                  className="w-full px-4 py-3 rounded-2xl bg-[#0A0618] border border-[#1A1A2E] text-sm text-[#F6F2EA] placeholder-[#6E667E] outline-none transition-all focus:border-[#6C4DFF]/30 focus:ring-2 focus:ring-[#6C4DFF]/8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#D8D1E6] mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-2xl bg-[#0A0618] border border-[#1A1A2E] text-sm text-[#F6F2EA] placeholder-[#6E667E] outline-none transition-all focus:border-[#6C4DFF]/30 focus:ring-2 focus:ring-[#6C4DFF]/8"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#6C4DFF] to-[#7B61FF] text-white text-sm font-semibold shadow-[0_0_20px_rgba(108,77,255,0.3)] hover:shadow-[0_0_30px_rgba(108,77,255,0.45)] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
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

            <p className="text-center text-xs text-[#6E667E] mt-4">
              <span className="cursor-pointer hover:text-[#A69DB7] transition-colors">Forgot password?</span>
            </p>
          </div>

          <div className="px-8 py-4 border-t border-[#1A1A2E]/40 bg-[#0A0618]/50">
            <p className="text-center text-[11px] text-[#6E667E]">
              <i className="ri-shield-check-line mr-1"></i>
              Authorized access only. All login attempts are logged.
            </p>
          </div>
        </div>

        {/* Sign in with the admin credentials provisioned on the backend. */}
        <p className="text-center text-[11px] text-[#6E667E] mt-4">
          Use your CrackerSwap admin credentials.
        </p>
      </div>
    </div>
  );
}