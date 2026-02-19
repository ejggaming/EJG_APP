import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import AuthLayout from "../components/layouts/AuthLayout";

import HomePage from "../pages/Home";
import NotFoundPage from "../pages/NotFound";

// Auth
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";
import VerifyOtpPage from "../pages/auth/VerifyOtp";

// Betting
import BetPage from "../pages/betting/BetPage";
import BetHistoryPage from "../pages/betting/BetHistory";

// Results
import ResultsPage from "../pages/results/ResultsPage";

// Wallet
import WalletDashboard from "../pages/wallet/WalletDashboard";
import DepositPage from "../pages/wallet/DepositPage";
import WithdrawPage from "../pages/wallet/WithdrawPage";

// Profile
import ProfilePage from "../pages/profile/ProfilePage";
import KycUploadPage from "../pages/profile/KycUploadPage";

const router = createBrowserRouter([
  // Auth routes (no bottom nav)
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/verify-otp", element: <VerifyOtpPage /> },
    ],
  },

  // Main app routes (with bottom nav)
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

  // 404
  { path: "*", element: <NotFoundPage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
