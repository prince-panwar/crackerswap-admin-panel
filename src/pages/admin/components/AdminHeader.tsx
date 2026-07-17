import { useState, useRef, useEffect } from 'react';
import DataFreshnessPill from '@/components/feature/DataFreshnessPill';
import ThemeToggle from '@/components/base/ThemeToggle';
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
    <header className="h-[72px] flex items-center bg-surface-strong backdrop-blur-xl border-b border-card-border sticky top-0 z-30">
      <div className="w-full flex items-center justify-between px-6">
        {/* Left: hamburger + title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface transition-all cursor-pointer lg:hidden"
          >
            <i className="ri-menu-line text-lg"></i>
          </button>
          <div>
            <h1 className="text-lg font-semibold text-fg">{title}</h1>
            {subtitle && (
              <p className="text-xs text-fg-tertiary mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: env pill, freshness, theme toggle, profile */}
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-full bg-warning-soft border border-warning-soft text-warning text-[11px] font-medium">
            Staging
          </span>
          <DataFreshnessPill />
          <ThemeToggle />

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-surface border border-card-border hover:border-fg-subtle transition-all cursor-pointer"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                style={{ backgroundImage: 'var(--grad-brand)' }}
              >
                {initials}
              </div>
              <span className="text-sm text-fg-secondary hidden sm:block">{roleLabel(admin?.role)}</span>
              <i className={`ri-arrow-down-s-line text-xs text-fg-muted transition-transform ${profileOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-popup-bg border border-popup-border shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl overflow-hidden z-50">
                <div className="p-4 border-b border-popup-border">
                  <p className="text-sm font-semibold text-fg truncate">{admin?.email ?? '—'}</p>
                  <p className="text-[11px] text-success mt-0.5">{roleLabel(admin?.role)}</p>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={() => { setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-fg-secondary hover:bg-surface transition-all cursor-pointer"
                  >
                    <i className="ri-user-line text-base text-fg-tertiary"></i>
                    View Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-danger hover:bg-danger-soft transition-all cursor-pointer"
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