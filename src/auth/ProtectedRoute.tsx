import { Navigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { AdminLoadingState } from '@/pages/admin/components/AdminStates';

// Guards the /admin section: waits for session bootstrap, then redirects to
// the login page when there is no authenticated admin.
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070214] p-6">
        <AdminLoadingState />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
