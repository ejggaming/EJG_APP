import { Link, useParams, useNavigate } from "react-router-dom";
import { Card } from "../../components";
import { useMyWalletQuery } from "../../hooks/useWallet";
import { formatCurrency } from "../../utils";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

const txTypeStyles: Record<string, { label: string; color: string }> = {
  DEPOSIT: { label: "Deposit", color: "text-brand-green" },
  WITHDRAWAL: { label: "Withdrawal", color: "text-brand-red" },
  JUETENG_BET: { label: "Bet Placed", color: "text-brand-gold" },
  JUETENG_PAYOUT: { label: "Winning Payout", color: "text-brand-green" },
  COMMISSION_PAYOUT: { label: "Commission", color: "text-brand-green" },
};

const statusIcons = {
  COMPLETED: <CheckCircle2 className="w-5 h-5 text-brand-green" />,
  PENDING: <Clock className="w-5 h-5 text-brand-gold" />,
  FAILED: <XCircle className="w-5 h-5 text-brand-red" />,
  CANCELLED: <AlertCircle className="w-5 h-5 text-text-muted" />,
};

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useMyWalletQuery();

  const transaction = data?.wallet?.transactions?.find((tx: any) => tx.id === id);
  const style = txTypeStyles[transaction?.type ?? ""] ?? {
    label: transaction?.type ?? "Transaction",
    color: "text-text-primary",
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-surface-card border border-brand-gold/10">
            <ArrowLeft className="w-4 h-4 text-text-muted" />
          </button>
          <h1 className="text-xl font-extrabold text-text-primary chinese-header">Transaction</h1>
        </div>
        <Card bento className="lantern-card animate-pulse h-40" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-surface-card border border-brand-gold/10">
            <ArrowLeft className="w-4 h-4 text-text-muted" />
          </button>
          <h1 className="text-xl font-extrabold text-text-primary chinese-header">Transaction</h1>
        </div>
        <Card bento className="lantern-card text-center py-10">
          <p className="text-text-muted text-sm">Transaction not found</p>
          <p className="text-text-muted text-xs mt-1 font-mono">{id}</p>
        </Card>
      </div>
    );
  }

  const rows = [
    { label: "Type", value: style.label },
    { label: "Status", value: transaction.status ?? "—" },
    { label: "Reference", value: transaction.reference ?? transaction.id },
    {
      label: "Date",
      value: transaction.createdAt
        ? new Date(transaction.createdAt).toLocaleString()
        : "—",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-surface-card border border-brand-gold/10 hover:border-brand-gold/30 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-text-muted" />
        </button>
        <h1 className="text-xl font-extrabold text-text-primary chinese-header">
          Transaction Details
        </h1>
      </div>

      <Card bento className="lantern-card text-center py-6">
        <p className={`text-3xl font-extrabold ${style.color}`}>
          {formatCurrency(transaction.amount)}
        </p>
        <p className="text-text-muted text-sm mt-1">{style.label}</p>
        <div className="flex justify-center items-center gap-1.5 mt-2">
          {statusIcons[transaction.status as keyof typeof statusIcons]}
          <span className="text-sm text-text-muted">{transaction.status}</span>
        </div>
      </Card>

      <Card bento className="lantern-card divide-y divide-brand-gold/10">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-3 px-1">
            <span className="text-xs text-text-muted uppercase tracking-wider">
              {row.label}
            </span>
            <span className="text-sm font-medium text-text-primary text-right max-w-[60%] truncate">
              {row.value}
            </span>
          </div>
        ))}
      </Card>

      <Link
        to="/wallet"
        className="block text-center text-xs text-brand-gold/60 hover:text-brand-gold transition-colors"
      >
        ← Back to Wallet
      </Link>
    </div>
  );
}
