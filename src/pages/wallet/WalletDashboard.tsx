import { Link } from "react-router-dom";
import { Card, Badge } from "../../components";
import { useAppStore } from "../../store/useAppStore";
import { useThemeStore } from "../../store/useThemeStore";
import { formatCurrency } from "../../utils";
import { useMyWalletQuery } from "../../hooks/useWallet";
import type { Transaction } from "../../services/walletService";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  Target,
  Trophy,
  Clock,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { WalletSkeleton } from "../../components/ChineseSkeleton";
import appLogo from "../../assets/logo.png";

const txTypeStyles: Record<
  string,
  { Icon: LucideIcon; color: string; label: string }
> = {
  DEPOSIT: { Icon: Wallet, color: "text-brand-green", label: "Deposit" },
  WITHDRAWAL: {
    Icon: ArrowUpRight,
    color: "text-brand-red",
    label: "Withdraw",
  },
  JUETENG_BET: { Icon: Target, color: "text-brand-gold", label: "Bet" },
  JUETENG_PAYOUT: {
    Icon: Trophy,
    color: "text-brand-green",
    label: "Winning",
  },
  COMMISSION_PAYOUT: {
    Icon: Wallet,
    color: "text-brand-green",
    label: "Commission",
  },
  ADJUSTMENT: { Icon: Wallet, color: "text-text-muted", label: "Adjustment" },
};

export default function WalletDashboard() {
  const balance = useAppStore((s) => s.balance);
  const user = useAppStore((s) => s.user);
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const { data, isLoading } = useMyWalletQuery();

  const card = {
    bg: isDark
      ? "linear-gradient(135deg, #0d0000 0%, #4a0505 30%, #7a0e0e 60%, #0d0000 100%)"
      : "linear-gradient(135deg, #6b0f0f 0%, #991b1b 30%, #c0221e 55%, #7f1414 100%)",
    shadow: isDark
      ? "0 12px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(245,158,11,0.2)"
      : "0 12px 40px rgba(120,14,14,0.45), inset 0 1px 0 rgba(245,158,11,0.25)",
    border: isDark
      ? "1px solid rgba(245,158,11,0.18)"
      : "1px solid rgba(245,158,11,0.22)",
    stripe: "#f59e0b",
    brandColor: "rgba(245,158,11,0.85)",
    nameColor: "rgba(255,255,255,0.50)",
    balanceLabelColor: "rgba(255,255,255,0.45)",
    dotColor: "rgba(245,158,11,0.40)",
    cashOutColor: "rgba(255,255,255,0.75)",
    cashOutBorder: "rgba(255,255,255,0.25)",
    cashOutBg: "rgba(0,0,0,0.15)",
  };

  const stats = data?.stats;
  const transactions: Transaction[] = data?.wallet?.transactions ?? [];

  if (isLoading) return <WalletSkeleton />;

  return (
    <div className="space-y-4">
      {/* ── Casino Digital Card ── */}
      <div
        className="relative rounded-2xl overflow-hidden select-none"
        style={{
          background: card.bg,
          boxShadow: card.shadow,
          border: card.border,
          minHeight: 190,
        }}
      >
        {/* Diagonal stripe texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage: `repeating-linear-gradient(45deg,${card.stripe} 0,${card.stripe} 1px,transparent 0,transparent 50%)`,
            backgroundSize: "12px 12px",
          }}
        />

        {/* Top row: brand + EMV chip */}
        <div className="relative flex items-center justify-between px-5 pt-4 pb-1">
          <div className="flex items-center gap-2">
            <img src={appLogo} alt="logo" className="h-6 w-auto" />
            <span
              style={{ letterSpacing: "0.22em", color: card.brandColor }}
              className="text-[11px] font-bold uppercase"
            >
              JuetengPH
            </span>
          </div>
          {/* EMV chip */}
          <svg width="40" height="30" viewBox="0 0 40 30">
            <defs>
              <linearGradient id="wg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f0c040" />
                <stop offset="50%" stopColor="#b8860b" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>
            </defs>
            <rect x="1" y="1" width="38" height="28" rx="4" fill="url(#wg)" stroke="#78350f" strokeWidth="1" />
            <rect x="14" y="1" width="12" height="28" fill="none" stroke="#78350f" strokeWidth="0.7" />
            <rect x="1" y="10" width="38" height="10" fill="none" stroke="#78350f" strokeWidth="0.7" />
            <rect x="14" y="10" width="12" height="10" rx="1" fill="#c9a227" opacity="0.45" />
          </svg>
        </div>

        {/* Decorative card dots */}
        <div className="relative flex flex-wrap items-center gap-3 px-5 py-2">
          {[0, 1, 2, 3].map((g) => (
            <div key={g} className="flex gap-1.5">
              {[0, 1, 2, 3].map((d) => (
                <div
                  key={d}
                  className="rounded-full"
                  style={{ width: 6, height: 6, background: card.dotColor }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Name + Balance (right-aligned) */}
        <div className="relative px-5 pb-1">
          <p style={{ color: card.nameColor }} className="text-[10px] uppercase tracking-widest font-medium">
            {user?.person?.firstName} {user?.person?.lastName}
          </p>
          <div className="flex justify-end mt-2">
            <div className="text-right">
              <p style={{ color: card.balanceLabelColor }} className="text-[9px] uppercase tracking-widest">
                Wallet Balance
              </p>
              <p className="text-[clamp(20px,6vw,28px)] font-extrabold gold-shimmer leading-tight text-right">
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="relative flex flex-col min-[360px]:flex-row gap-2 px-5 pb-5 pt-2">
          <Link to="/wallet/deposit" className="w-full min-[360px]:flex-1">
            <button
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold text-black transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                boxShadow: "0 2px 12px rgba(245,158,11,0.4)",
              }}
            >
              <ArrowDownToLine className="w-3.5 h-3.5" /> Cash In
            </button>
          </Link>
          <Link to="/wallet/withdraw" className="w-full min-[360px]:flex-[0.75]">
            <button
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={{
                color: card.cashOutColor,
                border: `1px solid ${card.cashOutBorder}`,
                background: card.cashOutBg,
              }}
            >
              <ArrowUpFromLine className="w-3.5 h-3.5" /> Cash Out
            </button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 min-[380px]:grid-cols-3 gap-2">
        <Card bento delay={100} className="text-center lantern-card">
          <p className="text-[clamp(14px,4.5vw,18px)] font-extrabold text-brand-green">
            {isLoading ? "—" : formatCurrency(stats?.totalDeposits ?? 0)}
          </p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">
            Total Deposits
          </p>
        </Card>
        <Card bento delay={200} className="text-center lantern-card">
          <p className="text-[clamp(14px,4.5vw,18px)] font-extrabold gold-shimmer">
            {isLoading ? "—" : formatCurrency(stats?.totalWinnings ?? 0)}
          </p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">
            Total Winnings
          </p>
        </Card>
        <Card bento delay={300} className="text-center lantern-card">
          <p className="text-[clamp(14px,4.5vw,18px)] font-extrabold text-brand-red-light">
            {isLoading ? "—" : formatCurrency(stats?.totalWithdrawals ?? 0)}
          </p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">
            Withdrawn
          </p>
        </Card>
      </div>

      {/* Cloud Divider */}
      <div className="cloud-divider" />

      {/* Transaction History */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3 chinese-header">
          Recent Transactions
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-brand-gold" />
          </div>
        ) : transactions.length === 0 ? (
          <Card bento className="text-center lantern-card py-8">
            <p className="text-text-muted text-sm">No transactions yet</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx, index) => {
              const style = txTypeStyles[tx.type] ?? txTypeStyles.ADJUSTMENT;
              const isCredit =
                tx.type === "DEPOSIT" ||
                tx.type === "JUETENG_PAYOUT" ||
                tx.type === "COMMISSION_PAYOUT";

              return (
                <Card
                  key={tx.id}
                  bento
                  delay={350 + index * 80}
                  className="flex items-center gap-3 lantern-card"
                >
                  <style.Icon className={`w-5 h-5 ${style.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-text-primary">
                        {style.label}
                      </p>
                      {tx.status === "PENDING" && (
                        <Badge variant="gold">
                          <Clock className="w-3 h-3 inline mr-0.5" />
                          Pending
                        </Badge>
                      )}
                      {tx.status === "FAILED" && (
                        <Badge variant="red">Rejected</Badge>
                      )}
                    </div>
                    <p className="text-xs text-text-muted truncate">
                      {tx.description ?? tx.reference}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p
                    className={`text-sm font-bold ${isCredit ? "text-brand-green" : "text-text-muted"}`}
                  >
                    {isCredit ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </p>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
