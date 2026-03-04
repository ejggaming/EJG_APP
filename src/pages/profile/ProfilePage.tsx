import { Link, useParams } from "react-router-dom";
import { Card, Badge, Button } from "../../components";
import { useAppStore } from "../../store/useAppStore";
import { formatCurrency } from "../../utils";
import { useLogoutMutation } from "../../hooks/useAuth";
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

function buildMenuItems(userId: string) {
  return [
    {
      Icon: BadgeCheck,
      label: "KYC Verification",
      path: `/profile/${userId}/kyc`,
      description: "Verify your identity",
    },
    {
      Icon: ScrollText,
      label: "Bet History",
      path: "/bet?tab=me",
      description: "View past bets",
    },
    {
      Icon: Bell,
      label: "Notifications",
      path: `/profile/${userId}/notifications`,
      description: "Manage alerts",
    },
    {
      Icon: Lock,
      label: "Security",
      path: `/profile/${userId}/security`,
      description: "Password & 2FA",
    },
    {
      Icon: HelpCircle,
      label: "Help & Support",
      path: "/support",
      description: "FAQ & contact us",
    },
    {
      Icon: FileText,
      label: "Terms & Legal",
      path: "/legal",
      description: "Terms & privacy policy",
    },
  ] as { Icon: LucideIcon; label: string; path: string; description: string }[];
}

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
  const { id: paramId } = useParams<{ id: string }>();
  const { user, balance, isAuthenticated } = useAppStore();
  const logoutMutation = useLogoutMutation();
  const userId = paramId ?? user?.id ?? "me";
  const menuItems = buildMenuItems(userId);

  const kycStatus = (user?.kyc?.status?.toLowerCase() ?? "none") as keyof typeof kycStatusMap;
  const kyc = kycStatusMap[kycStatus] ?? kycStatusMap.none;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="space-y-4">
      {/* User Card — Chinese-themed profile header */}
      <div
        className="auspicious-bg chinese-frame rounded-xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #7f1d1d 0%, #991b1b 30%, #b91c1c 60%, #7f1d1d 100%)",
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
              {user?.person?.firstName?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-extrabold text-white truncate">
                {[user?.person?.firstName, user?.person?.lastName].filter(Boolean).join(" ") || "Guest User"}
              </h2>
              <p className="text-sm text-white/70 truncate">
                {user?.phoneNumber ?? "No phone number"}
              </p>
              <div className="mt-1">
                <Badge variant={kyc.badge}>{kyc.label}</Badge>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-brand-gold/15">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/60 uppercase tracking-wider">
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
      {isAuthenticated && kycStatus !== "approved" && (
        <Card
          bento
          delay={100}
          className="lantern-card border-brand-gold/20"
          ornate
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-brand-gold" />
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">
                {kyc.message}
              </p>
              <p className="text-xs text-text-muted">
                Required to place bets and withdraw
              </p>
            </div>
            <Link to={`/profile/${userId}/kyc`}>
              <Button variant="gold" size="sm">
                {kycStatus === "rejected" ? "Resubmit" : "Verify"}
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Menu Items */}
      <div className="space-y-1.5">
        {menuItems.map((item, index) => (
          <Link key={item.path} to={item.path}>
            <Card
              bento
              delay={200 + index * 80}
              className="flex items-center gap-3 lantern-card hover:border-brand-gold/20 transition-all"
            >
              <item.Icon className="w-5 h-5 text-brand-gold/70" />
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">
                  {item.label}
                </p>
                <p className="text-xs text-text-muted">{item.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-brand-gold/40" />
            </Card>
          </Link>
        ))}
      </div>

      {/* Auth action */}
      {isAuthenticated ? (
        <Button
          variant="danger"
          fullWidth
          onClick={handleLogout}
          isLoading={logoutMutation.isPending}
        >
          Logout
        </Button>
      ) : (
        <Link to="/login">
          <Button variant="primary" fullWidth>
            Login to Continue
          </Button>
        </Link>
      )}

      <p className="text-center text-[10px] text-text-muted">
        JuetengPH v1.0.0 · © 2026
      </p>
    </div>
  );
}
