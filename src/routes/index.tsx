import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import AuthLayout from "../components/layouts/AuthLayout";
import AgentLayout from "../components/layouts/AgentLayout";
import AdminLayout from "../components/layouts/AdminLayout";
import RoleGuard from "../components/guards/RoleGuard";

import HomePage from "../pages/Home";
import NotFoundPage from "../pages/NotFound";

// Auth
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";
import VerifyOtpPage from "../pages/auth/VerifyOtp";

// Player - Betting
import BetPage from "../pages/betting/BetPage";
import BetDetailPage from "../pages/betting/BetDetailPage";
import BetHistoryPage from "../pages/betting/BetHistory";

// Player - Results
import ResultsPage from "../pages/results/ResultsPage";

// Player - Wallet
import WalletDashboard from "../pages/wallet/WalletDashboard";
import DepositPage from "../pages/wallet/DepositPage";
import WithdrawPage from "../pages/wallet/WithdrawPage";
import TransactionDetailPage from "../pages/wallet/TransactionDetailPage";

// Player - Profile
import ProfilePage from "../pages/profile/ProfilePage";
import KycUploadPage from "../pages/profile/KycUploadPage";
import SecurityPage from "../pages/profile/SecurityPage";

// Player - Notifications
import NotificationsPage from "../pages/notifications/NotificationsPage";

// Player - Support & Legal
import SupportPage from "../pages/support/SupportPage";
import LegalPage from "../pages/legal/LegalPage";

// Agent Portal
import AgentDashboard from "../pages/agent/AgentDashboard";
import AgentCustomers from "../pages/agent/AgentCustomers";
import CollectBet from "../pages/agent/CollectBet";
import AgentCommissions from "../pages/agent/AgentCommissions";
import AgentWallet from "../pages/agent/AgentWallet";

// Admin Dashboard
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import AgentManagement from "../pages/admin/AgentManagement";
import DrawManagement from "../pages/admin/DrawManagement";
import FinanceManagement from "../pages/admin/FinanceManagement";
import KycManagement from "../pages/admin/KycManagement";
import Reports from "../pages/admin/Reports";
import AuditLog from "../pages/admin/AuditLog";
import SystemSettings from "../pages/admin/SystemSettings";

const router = createBrowserRouter([
  // Auth routes (no layout chrome)
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/verify-otp", element: <VerifyOtpPage /> },
    ],
  },

  // Player routes (bottom nav)
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },

      // Betting — ?tab=all|me|auto + deep-link /bet/:id
      { path: "/bet", element: <BetPage /> },
      { path: "/bet/:id", element: <BetDetailPage /> },
      { path: "/bet-history", element: <BetHistoryPage /> },

      // Results — ?date=YYYY-MM-DD + deep-link /results/:id
      { path: "/results", element: <ResultsPage /> },

      // Wallet — /wallet/:id for transaction detail
      { path: "/wallet", element: <WalletDashboard /> },
      { path: "/wallet/deposit", element: <DepositPage /> },
      { path: "/wallet/withdraw", element: <WithdrawPage /> },
      { path: "/wallet/:id", element: <TransactionDetailPage /> },

      // Profile — all sub-routes scoped to /profile/:id
      { path: "/profile/:id", element: <ProfilePage /> },
      { path: "/profile/:id/kyc", element: <KycUploadPage /> },
      { path: "/profile/:id/notifications", element: <NotificationsPage /> },
      { path: "/profile/:id/security", element: <SecurityPage /> },

      // Support & Legal
      { path: "/support", element: <SupportPage /> },
      { path: "/legal", element: <LegalPage /> },

      // Legacy redirects (keep old URLs working)
      { path: "/profile", element: <Navigate to="/profile/me" replace /> },
      { path: "/notifications", element: <Navigate to="/profile/me/notifications" replace /> },
      { path: "/help", element: <Navigate to="/support" replace /> },
      { path: "/terms", element: <Navigate to="/legal" replace /> },
      { path: "/profile/kyc", element: <Navigate to="/profile/me/kyc" replace /> },
      { path: "/profile/security", element: <Navigate to="/profile/me/security" replace /> },
    ],
  },

  // Agent Portal routes (sidebar + bottom nav)
  {
    element: (
      <RoleGuard allowedRoles={["AGENT"]}>
        <AgentLayout />
      </RoleGuard>
    ),
    children: [
      { path: "/agent", element: <AgentDashboard /> },
      { path: "/agent/customers", element: <AgentCustomers /> },
      { path: "/agent/collect-bet", element: <CollectBet /> },
      { path: "/agent/commissions", element: <AgentCommissions /> },
      { path: "/agent/wallet", element: <AgentWallet /> },
    ],
  },

  // Admin Dashboard routes (sidebar)
  {
    element: (
      <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
        <AdminLayout />
      </RoleGuard>
    ),
    children: [
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/admin/users", element: <UserManagement /> },
      { path: "/admin/kyc", element: <KycManagement /> },
      { path: "/admin/agents", element: <AgentManagement /> },
      { path: "/admin/draws", element: <DrawManagement /> },
      { path: "/admin/finance", element: <FinanceManagement /> },
      { path: "/admin/reports", element: <Reports /> },
      { path: "/admin/audit-log", element: <AuditLog /> },
      { path: "/admin/settings", element: <SystemSettings /> },
    ],
  },

  // 404
  { path: "*", element: <NotFoundPage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
