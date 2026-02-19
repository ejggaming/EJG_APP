import { Link } from "react-router-dom";
import { Card, Badge, Button } from "../../components";
import { useAppStore } from "../../store/useAppStore";
import { formatCurrency } from "../../utils";
import {
  Wallet,
  ArrowUpRight,
  Target,
  Trophy,
  Clock,
  type LucideIcon,
} from "lucide-react";

const MOCK_TRANSACTIONS = [
  {
    id: "1",
    type: "deposit" as const,
    amount: 500,
    method: "GCash",
    date: "Feb 19, 2026 10:30 AM",
    status: "completed" as const,
  },
  {
    id: "2",
    type: "bet" as const,
    amount: -50,
    label: "Bet #2026021901",
    date: "Feb 19, 2026 10:15 AM",
    status: "completed" as const,
  },
  {
    id: "3",
    type: "win" as const,
    amount: 5000,
    label: "Win #2026021802",
    date: "Feb 18, 2026 4:30 PM",
    status: "completed" as const,
  },
  {
    id: "4",
    type: "bet" as const,
    amount: -100,
    label: "Bet #2026021802",
    date: "Feb 18, 2026 3:50 PM",
    status: "completed" as const,
  },
  {
    id: "5",
    type: "deposit" as const,
    amount: 1000,
    method: "Maya",
    date: "Feb 17, 2026 9:00 AM",
    status: "completed" as const,
  },
  {
    id: "6",
    type: "withdraw" as const,
    amount: -2000,
    method: "GCash",
    date: "Feb 16, 2026 2:00 PM",
    status: "pending" as const,
  },
];

const txTypeStyles: Record<
  string,
  { Icon: LucideIcon; color: string; label: string }
> = {
  deposit: { Icon: Wallet, color: "text-brand-green", label: "Deposit" },
  withdraw: { Icon: ArrowUpRight, color: "text-brand-red", label: "Withdraw" },
  bet: { Icon: Target, color: "text-brand-gold", label: "Bet" },
  win: { Icon: Trophy, color: "text-brand-green", label: "Winning" },
};

export default function WalletDashboard() {
  const balance = useAppStore((s) => s.balance);

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
            {formatCurrency(6500)}
          </p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">
            Total Deposits
          </p>
        </Card>
        <Card bento delay={200} className="text-center lantern-card">
          <p className="text-lg font-extrabold gold-shimmer">
            {formatCurrency(5000)}
          </p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">
            Total Winnings
          </p>
        </Card>
        <Card bento delay={300} className="text-center lantern-card">
          <p className="text-lg font-extrabold text-brand-red-light">
            {formatCurrency(2000)}
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
          Transactions
        </h2>
        <div className="space-y-2">
          {MOCK_TRANSACTIONS.map((tx, index) => {
            const style = txTypeStyles[tx.type];
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
                    {tx.status === "pending" && (
                      <Badge variant="gold">
                        <Clock className="w-3 h-3 inline mr-0.5" />
                        Pending
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-text-muted truncate">
                    {"method" in tx ? tx.method : tx.label}
                  </p>
                  <p className="text-[10px] text-text-muted">{tx.date}</p>
                </div>
                <p
                  className={`text-sm font-bold ${tx.amount >= 0 ? "text-brand-green" : "text-text-muted"}`}
                >
                  {tx.amount >= 0 ? "+" : ""}
                  {formatCurrency(Math.abs(tx.amount))}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
