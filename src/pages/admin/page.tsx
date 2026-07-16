import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import { useAuth } from '@/auth/AuthContext';
import { permissionsForRole, roleLabel } from '@/auth/permissions';

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  '/admin/dashboard': { title: 'Dashboard', subtitle: 'Platform operations overview and key metrics.' },
  '/admin/tokens': { title: 'Token Moderation', subtitle: 'Manage token metadata, verification, and visibility.' },
  '/admin/featured': { title: 'Featured Tokens', subtitle: 'Curate and order tokens highlighted in discovery.' },
  '/admin/monitoring': { title: 'Platform Monitoring', subtitle: 'Backend dependency health and RPC status.' },
  '/admin/users': { title: 'Admin Users', subtitle: 'Manage admin access and roles.' },
  '/admin/transactions': { title: 'Transactions', subtitle: 'Global swap and transaction activity across chains.' },
  '/admin/platform-fee': { title: 'Platform Fee', subtitle: 'Configure the swap fee and the wallet that collects it.' },
};

export default function AdminShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { admin } = useAuth();

  const { title, subtitle } = pageTitles[location.pathname] || { title: 'Admin', subtitle: '' };
  const userRole = roleLabel(admin?.role);
  const userPermissions = permissionsForRole(admin?.role);

  return (
    <div className="min-h-screen bg-[#070214]">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole={userRole}
        userPermissions={userPermissions}
      />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'}`}>
        <AdminHeader
          title={title}
          subtitle={subtitle}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}