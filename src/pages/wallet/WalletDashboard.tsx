import { Link } from "react-router-dom";
import { Card, Badge, Button } from "../../components";
import { useAppStore } from "../../store/useAppStore";
import { formatCurrency } from "../../utils";
import { useMyWalletQuery } from "../../hooks/useWallet";
import type { Transaction } from "../../services/walletService";
import {
  Wallet,
  ArrowUpRight,
  Target,
  Trophy,
  Clock,
  Loader2,
  type LucideIcon,
} from "lucide-react";

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
  const { data, isLoading } = useMyWalletQuery();

  const stats = data?.stats;
  const transactions: Transaction[] = data?.wallet?.transactions ?? [];

  return (
    <div className="space-y-4">
      {/* Balance Card — Grand fortune card */}
      <div
        className="auspicious-bg chinese-frame rounded-xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #7f1d1d 0%, #991b1b 30%, #b91c1c 60%, #7f1d1d 100%)",
        }}
      >
        <div className="relative p-4">
          <p className="text-[10px] text-white/60 uppercase tracking-widest">
            ✦ Available Balance ✦
          </p>
          <p className="text-3xl font-extrabold gold-shimmer mt-1">
            {formatCurrency(balance)}
          </p>
          <div className="flex gap-2 mt-4">
            <Link to="/wallet/deposit" className="flex-1">
              <Button variant="gold" size="sm" fullWidth>
                <Wallet className="w-3.5 h-3.5 inline mr-1" /> Deposit
              </Button>
            </Link>
            <Link to="/wallet/withdraw" className="flex-1">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                className="border-white/30 text-white hover:bg-white/10"
              >
                <ArrowUpRight className="w-3.5 h-3.5 inline mr-1" /> Withdraw
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card bento delay={100} className="text-center lantern-card">
          <p className="text-lg font-extrabold text-brand-green">
            {isLoading ? "—" : formatCurrency(stats?.totalDeposits ?? 0)}
          </p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">
            Total Deposits
          </p>
        </Card>
        <Card bento delay={200} className="text-center lantern-card">
          <p className="text-lg font-extrabold gold-shimmer">
            {isLoading ? "—" : formatCurrency(stats?.totalWinnings ?? 0)}
          </p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">
            Total Winnings
          </p>
        </Card>
        <Card bento delay={300} className="text-center lantern-card">
          <p className="text-lg font-extrabold text-brand-red-light">
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
