import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { initialsFromEmail } from '@/auth/permissions';

interface SidebarItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  permission: string;
}

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', icon: 'ri-dashboard-3-line', permission: 'dashboard' },
  { id: 'tokens', label: 'Token Moderation', path: '/admin/tokens', icon: 'ri-shield-check-line', permission: 'token-moderation' },
  { id: 'featured', label: 'Featured Tokens', path: '/admin/featured', icon: 'ri-star-line', permission: 'featured-tokens' },
  { id: 'monitoring', label: 'Platform Monitoring', path: '/admin/monitoring', icon: 'ri-pulse-line', permission: 'monitoring' },
  { id: 'users', label: 'Admin Users', path: '/admin/users', icon: 'ri-user-settings-line', permission: 'users-roles' },
  { id: 'transactions', label: 'Transactions', path: '/admin/transactions', icon: 'ri-exchange-line', permission: 'transactions' },
  // NO API: Token Queue (ingestion approval) and Settings removed from nav.
  // { id: 'token-queue', label: 'Token Queue', path: '/admin/token-queue', icon: 'ri-inbox-line', permission: 'token-moderation' },
  // { id: 'settings', label: 'Settings', path: '/admin/settings', icon: 'ri-settings-3-line', permission: 'settings' },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  userRole: string;
  userPermissions: string[];
}

export default function AdminSidebar({ collapsed, onToggle, userRole, userPermissions }: AdminSidebarProps) {
  const location = useLocation();
  const { admin } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const hasPermission = (permission: string) => userPermissions.includes(permission);

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 flex flex-col
          ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-[72px]' : 'translate-x-0 w-[260px]'}
        `}
      >
        <div className="flex-1 flex flex-col bg-[#0A0618]/95 backdrop-blur-xl border-r border-[#1A1A2E]/60">
          {/* Logo */}
          <div className="h-[72px] flex items-center px-5 border-b border-[#1A1A2E]/40">
            <Link to="/admin/dashboard" className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6A1A] to-[#FF7A22] flex items-center justify-center shadow-[0_0_12px_rgba(255,106,26,0.35)] flex-shrink-0">
                <i className="ri-admin-line text-white text-lg"></i>
              </div>
              {!collapsed && (
                <span className="text-white font-semibold text-base tracking-tight whitespace-nowrap">
                  CrackerSwap
                </span>
              )}
            </Link>
          </div>

          {/* Collapse toggle on desktop */}
          <button
            onClick={onToggle}
            className="hidden lg:flex absolute -right-3 top-[88px] w-6 h-6 rounded-full bg-[#1A1A2E] border border-[#2A2A3E] items-center justify-center text-[#8B8FA3] hover:text-white cursor-pointer z-10"
          >
            <i className={`text-xs ${collapsed ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'}`}></i>
          </button>

          {/* Admin label */}
          <div className={`px-5 pt-4 pb-2 ${collapsed ? 'lg:px-3' : ''}`}>
            <span className={`text-[11px] font-semibold uppercase tracking-widest text-[#6E667E] ${collapsed ? 'lg:hidden' : ''}`}>
              Admin Panel
            </span>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
            {sidebarItems.map((item) => {
              const active = isActive(item.path);
              const permitted = hasPermission(item.permission);

              if (!permitted) return null;

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group
                    ${collapsed ? 'lg:justify-center lg:px-2' : ''}
                    ${active
                      ? 'bg-[#FF6A1A]/10 text-[#FF7A22] border border-[#FF6A1A]/20'
                      : 'text-[#8B8FA3] hover:text-white hover:bg-[#1A1A2E]/40 border border-transparent'
                    }
                  `}
                >
                  <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${active ? 'text-[#FF7A22]' : ''}`}>
                    <i className={`${item.icon} text-lg`}></i>
                  </div>
                  {!collapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className={`p-4 border-t border-[#1A1A2E]/40 ${collapsed ? 'lg:p-3' : ''}`}>
            <div className={`flex items-center gap-2.5 ${collapsed ? 'lg:justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C4DFF] to-[#7B61FF] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initialsFromEmail(admin?.email)}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#F6F2EA] truncate">{admin?.email ?? '—'}</p>
                  <p className="text-[11px] text-[#34D07F]">{userRole}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}