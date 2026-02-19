import { Link, useNavigate } from "react-router-dom";
import { Card, Badge, Button } from "../../components";
import { useAppStore } from "../../store/useAppStore";
import { formatCurrency } from "../../utils";
import {
  BadgeCheck,
  ScrollText,
  Bell,
  Lock,
  HelpCircle,
  FileText,
  ShieldCheck,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

const MENU_ITEMS: {
  Icon: LucideIcon;
  label: string;
  path: string;
  description: string;
}[] = [
  {
    Icon: BadgeCheck,
    label: "KYC Verification",
    path: "/profile/kyc",
    description: "Verify your identity",
  },
  {
    Icon: ScrollText,
    label: "Bet History",
    path: "/bet-history",
    description: "View past bets",
  },
  {
    Icon: Bell,
    label: "Notifications",
    path: "/notifications",
    description: "Manage alerts",
  },
  {
    Icon: Lock,
    label: "Security",
    path: "/profile/security",
    description: "Password & 2FA",
  },
  {
    Icon: HelpCircle,
    label: "Help & Support",
    path: "/help",
    description: "FAQ & contact us",
  },
  {
    Icon: FileText,
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
      {/* User Card — Chinese-themed profile header */}
      <div
        className="auspicious-bg chinese-frame rounded-xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1a0808 0%, #2a1515 50%, #1a0808 100%)",
        }}
      >
        <div className="relative p-4">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-extrabold"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #ef4444 0%, #991b1b 60%, #7f1d1d 100%)",
                border: "3px solid rgba(217, 119, 6, 0.5)",
                boxShadow: "0 0 15px rgba(220, 38, 38, 0.25)",
              }}
            >
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-extrabold text-white">
                {user?.name ?? "Guest User"}
              </h2>
              <p className="text-sm text-gray-500">
                {user?.mobile ?? "No mobile"}
              </p>
              <div className="mt-1">
                <Badge variant={kyc.badge}>{kyc.label}</Badge>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-brand-gold/15">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                Wallet Balance
              </span>
              <span className="text-lg font-extrabold gold-shimmer">
                {formatCurrency(balance)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Prompt */}
      {kycStatus !== "approved" && (
        <Card className="lantern-card border-brand-gold/20" ornate>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-brand-gold" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{kyc.message}</p>
              <p className="text-xs text-gray-500">
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
      <div className="space-y-1.5">
        {MENU_ITEMS.map((item) => (
          <Link key={item.path} to={item.path}>
            <Card className="flex items-center gap-3 lantern-card hover:border-brand-gold/20 transition-all">
              <item.Icon className="w-5 h-5 text-brand-gold/70" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-gray-600">{item.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-brand-gold/40" />
            </Card>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <Button variant="danger" fullWidth onClick={handleLogout}>
        Logout
      </Button>

      <p className="text-center text-[10px] text-gray-700">
        JuetengPH v1.0.0 · © 2026
      </p>
    </div>
  );
}
