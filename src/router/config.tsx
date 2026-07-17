import { Navigate, type RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../auth/ProtectedRoute";
import AdminShell from "../pages/admin/page";
import AdminLogin from "../pages/admin/login";
import AdminDashboard from "../pages/admin/dashboard";
import TokenModerationPage from "../pages/admin/tokens";
import FeaturedTokensPage from "../pages/admin/featured";
import PlatformMonitoringPage from "../pages/admin/monitoring";
import AdminUsersPage from "../pages/admin/users";
import TransactionsPage from "../pages/admin/audit-logs";
import PlatformFeePage from "../pages/admin/platform-fee";
// NO API: token-queue (ingestion approval workflow) and settings have no
// backend endpoint, so their routes are disabled.
// import TokenIngestionQueue from "../pages/admin/token-queue";
// import AdminSettingsPage from "../pages/admin/settings";

const routes: RouteObject[] = [
  {
    // This build is the admin panel; send the root to the admin login.
    path: "/",
    element: <Navigate to="/admin/login" replace />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "tokens", element: <TokenModerationPage /> },
      { path: "featured", element: <FeaturedTokensPage /> },
      { path: "monitoring", element: <PlatformMonitoringPage /> },
      { path: "users", element: <AdminUsersPage /> },
      // Audit Logs has no backend; the page is repurposed as the
      // Transactions feed (GET /admin/transactions).
      { path: "transactions", element: <TransactionsPage /> },
      { path: "platform-fee", element: <PlatformFeePage /> },
      // NO API: token-queue and settings routes disabled.
      // { path: "token-queue", element: <TokenIngestionQueue /> },
      // { path: "settings", element: <AdminSettingsPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
