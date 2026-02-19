import { Link, useNavigate } from "react-router-dom";
import { Card, Badge, Button } from "../../components";
import { useAppStore } from "../../store/useAppStore";
import { formatCurrency } from "../../utils";

const MENU_ITEMS = [
  {
    icon: "🆔",
    label: "KYC Verification",
    path: "/profile/kyc",
    description: "Verify your identity",
  },
  {
    icon: "📜",
    label: "Bet History",
    path: "/bet-history",
    description: "View past bets",
  },
  {
    icon: "🔔",
    label: "Notifications",
    path: "/notifications",
    description: "Manage alerts",
  },
  {
    icon: "🔒",
    label: "Security",
    path: "/profile/security",
    description: "Password & 2FA",
  },
  {
    icon: "❓",
    label: "Help & Support",
    path: "/help",
    description: "FAQ & contact us",
  },
  {
    icon: "📄",
    label: "Terms & Conditions",
    path: "/terms",
    description: "Legal information",
  },
];

const kycStatusMap = {
  none: {
    badge: "gray" as const,
    label: "Not Submitted",
    message: "Complete KYC to unlock full features",
  },
  pending: {
    badge: "gold" as const,
    label: "Under Review",
    message: "Your documents are being verified",
  },
  approved: {
    badge: "green" as const,
    label: "Verified",
    message: "Your identity is verified",
  },
  rejected: {
    badge: "red" as const,
    label: "Rejected",
    message: "Please resubmit your documents",
  },
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, balance, logout } = useAppStore();

  const kycStatus = user?.kycStatus ?? "none";
  const kyc = kycStatusMap[kycStatus];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="space-y-4">
      {/* User Card */}
      <Card className="bg-gradient-to-br from-surface-elevated to-surface-card">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-brand-red flex items-center justify-center text-white text-xl font-bold">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">
              {user?.name ?? "Guest User"}
            </h2>
            <p className="text-sm text-gray-400">
              {user?.mobile ?? "No mobile"}
            </p>
            <div className="mt-1">
              <Badge variant={kyc.badge}>{kyc.label}</Badge>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Wallet Balance</span>
            <span className="text-lg font-bold text-brand-gold">
              {formatCurrency(balance)}
            </span>
          </div>
        </div>
      </Card>

      {/* KYC Prompt */}
      {kycStatus !== "approved" && (
        <Card className="border border-brand-gold/30">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{kyc.message}</p>
              <p className="text-xs text-gray-400">
                Required to place bets and withdraw
              </p>
            </div>
            <Link to="/profile/kyc">
              <Button variant="gold" size="sm">
                {kycStatus === "rejected" ? "Resubmit" : "Verify"}
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Menu Items */}
      <div className="space-y-1">
        {MENU_ITEMS.map((item) => (
          <Link key={item.path} to={item.path}>
            <Card className="flex items-center gap-3 hover:bg-surface-elevated transition-colors">
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Card>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <Button variant="danger" fullWidth onClick={handleLogout}>
        Logout
      </Button>

      <p className="text-center text-[10px] text-gray-600">
        JuetengPH v1.0.0 · © 2026
      </p>
    </div>
  );
}
