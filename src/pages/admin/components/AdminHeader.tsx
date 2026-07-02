import { useState, useRef, useEffect } from 'react';
import DataFreshnessPill from '@/components/feature/DataFreshnessPill';
import { useAuth } from '@/auth/AuthContext';
import { initialsFromEmail, roleLabel } from '@/auth/permissions';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onToggleSidebar: () => void;
}

export default function AdminHeader({ title, subtitle, onToggleSidebar }: AdminHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { admin, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials = initialsFromEmail(admin?.email);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="h-[72px] flex items-center bg-[#0A0618]/80 backdrop-blur-xl border-b border-[#1A1A2E]/60 sticky top-0 z-30">
      <div className="w-full flex items-center justify-between px-6">
        {/* Left: hamburger + title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#8B8FA3] hover:text-white hover:bg-[#1A1A2E]/40 transition-all cursor-pointer lg:hidden"
          >
            <i className="ri-menu-line text-lg"></i>
          </button>
          <div>
            <h1 className="text-lg font-semibold text-[#F6F2EA]">{title}</h1>
            {subtitle && (
              <p className="text-xs text-[#A69DB7] mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: env pill, freshness, profile */}
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-full bg-[#FF8A3D]/10 border border-[#FF8A3D]/20 text-[#FF8A3D] text-[11px] font-medium">
            Staging
          </span>
          <DataFreshnessPill />

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#1A1A2E]/40 border border-[#2A2A3E]/40 hover:border-[#3A3A4E]/60 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6C4DFF] to-[#7B61FF] flex items-center justify-center text-white text-[10px] font-bold">
                {initials}
              </div>
              <span className="text-sm text-[#D8D1E6] hidden sm:block">{roleLabel(admin?.role)}</span>
              <i className={`ri-arrow-down-s-line text-xs text-[#8B8FA3] transition-transform ${profileOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#0F0D1A] border border-[#1A1A2E] shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl overflow-hidden z-50">
                <div className="p-4 border-b border-[#1A1A2E]/40">
                  <p className="text-sm font-semibold text-[#F6F2EA] truncate">{admin?.email ?? '—'}</p>
                  <p className="text-[11px] text-[#34D07F] mt-0.5">{roleLabel(admin?.role)}</p>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={() => { setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#D8D1E6] hover:bg-[#1A1A2E]/40 transition-all cursor-pointer"
                  >
                    <i className="ri-user-line text-base text-[#A69DB7]"></i>
                    View Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#FF5B5B] hover:bg-[#FF5B5B]/10 transition-all cursor-pointer"
                  >
                    <i className="ri-logout-box-line text-base"></i>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}