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
import BetHistoryPage from "../pages/betting/BetHistory";

// Player - Results
import ResultsPage from "../pages/results/ResultsPage";

// Player - Wallet
import WalletDashboard from "../pages/wallet/WalletDashboard";
import DepositPage from "../pages/wallet/DepositPage";
import WithdrawPage from "../pages/wallet/WithdrawPage";

// Player - Profile
import ProfilePage from "../pages/profile/ProfilePage";
import KycUploadPage from "../pages/profile/KycUploadPage";

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
import Reports from "../pages/admin/Reports";
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

      // Betting
      { path: "/bet", element: <BetPage /> },
      { path: "/bet-history", element: <BetHistoryPage /> },

      // Results
      { path: "/results", element: <ResultsPage /> },

      // Wallet
      { path: "/wallet", element: <WalletDashboard /> },
      { path: "/wallet/deposit", element: <DepositPage /> },
      { path: "/wallet/withdraw", element: <WithdrawPage /> },

      // Profile
      { path: "/profile", element: <ProfilePage /> },
      { path: "/profile/kyc", element: <KycUploadPage /> },

      // Redirects
      { path: "/notifications", element: <Navigate to="/" replace /> },
      { path: "/help", element: <Navigate to="/" replace /> },
      { path: "/terms", element: <Navigate to="/" replace /> },
      {
        path: "/profile/security",
        element: <Navigate to="/profile" replace />,
      },
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
      { path: "/agent/collect", element: <CollectBet /> },
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
      { path: "/admin/agents", element: <AgentManagement /> },
      { path: "/admin/draws", element: <DrawManagement /> },
      { path: "/admin/finance", element: <FinanceManagement /> },
      { path: "/admin/reports", element: <Reports /> },
      { path: "/admin/settings", element: <SystemSettings /> },
    ],
  },

  // 404
  { path: "*", element: <NotFoundPage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
