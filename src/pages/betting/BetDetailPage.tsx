import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, NumberBall } from "../../components";
import { formatCurrency } from "../../utils";
import { ArrowLeft, Trophy, Clock, XCircle } from "lucide-react";
import { useBetHistoryQuery, drawLabel, drawTypeLabel } from "../../hooks/useBet";

const statusConfig = {
  PENDING: { icon: <Clock className="w-5 h-5 text-brand-gold" />, label: "Pending", color: "text-brand-gold" },
  WON: { icon: <Trophy className="w-5 h-5 text-brand-green" />, label: "Won", color: "text-brand-green" },
  LOST: { icon: <XCircle className="w-5 h-5 text-brand-red" />, label: "Lost", color: "text-brand-red" },
  CANCELLED: { icon: <XCircle className="w-5 h-5 text-text-muted" />, label: "Cancelled", color: "text-text-muted" },
};

export default function BetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useBetHistoryQuery({ limit: 100 });

  const bet = data?.bets?.find((b: any) => b.id === id);
  const status = statusConfig[bet?.status as keyof typeof statusConfig] ?? statusConfig.PENDING;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-surface-card border border-brand-gold/10">
            <ArrowLeft className="w-4 h-4 text-text-muted" />
          </button>
          <h1 className="text-xl font-extrabold text-text-primary chinese-header">Bet Details</h1>
        </div>
        <Card bento className="lantern-card animate-pulse h-40" />
      </div>
    );
  }

  if (!bet) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-surface-card border border-brand-gold/10">
            <ArrowLeft className="w-4 h-4 text-text-muted" />
          </button>
          <h1 className="text-xl font-extrabold text-text-primary chinese-header">Bet Details</h1>
        </div>
        <Card bento className="lantern-card text-center py-10">
          <p className="text-text-muted text-sm">Bet not found</p>
          <p className="text-text-muted text-xs mt-1 font-mono">{id}</p>
        </Card>
      </div>
    );
  }

  const rows = [
    { label: "Draw", value: bet.draw ? drawLabel(bet.draw) : (bet.drawId ?? "—") },
    { label: "Type", value: bet.draw ? drawTypeLabel(bet.draw.drawType) : "—" },
    { label: "Amount", value: formatCurrency(bet.amount) },
    { label: "Payout", value: bet.payoutAmount ? formatCurrency(bet.payoutAmount) : "—" },
    { label: "Placed At", value: bet.createdAt ? new Date(bet.createdAt).toLocaleString() : "—" },
    { label: "Reference", value: bet.id },
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
        <h1 className="text-xl font-extrabold text-text-primary chinese-header">Bet Details</h1>
      </div>

      {/* Numbers hero */}
      <Card bento className="lantern-card text-center py-6">
        <div className="flex justify-center gap-3 mb-3">
          {[bet.number1, bet.number2].filter((n): n is number => n != null).map((n: number, i: number) => (
            <NumberBall key={i} number={n} size="lg" />
          ))}
        </div>
        <div className="flex justify-center items-center gap-1.5 mt-2">
          {status.icon}
          <span className={`text-sm font-semibold ${status.color}`}>{status.label}</span>
        </div>
      </Card>

      <Card bento className="lantern-card divide-y divide-brand-gold/10">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-3 px-1">
            <span className="text-xs text-text-muted uppercase tracking-wider">{row.label}</span>
            <span className="text-sm font-medium text-text-primary text-right max-w-[60%] truncate">{row.value}</span>
          </div>
        ))}
      </Card>

      <Link to="/bet?tab=me" className="block text-center text-xs text-brand-gold/60 hover:text-brand-gold transition-colors">
        ← Back to My Bets
      </Link>
    </div>
  );
}
