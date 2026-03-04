import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, NumberBall } from "../../components";
import { ArrowLeft, Trophy, CalendarDays } from "lucide-react";
import { useDrawResultsQuery, drawTypeLabel } from "../../hooks/useBet";
import { formatCurrency } from "../../utils";

export default function ResultDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useDrawResultsQuery({ limit: 100 });

  const draw = data?.draws?.find((d: any) => d.id === id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-surface-card border border-brand-gold/10">
            <ArrowLeft className="w-4 h-4 text-text-muted" />
          </button>
          <h1 className="text-xl font-extrabold text-text-primary chinese-header">Result</h1>
        </div>
        <Card bento className="lantern-card animate-pulse h-40" />
      </div>
    );
  }

  if (!draw) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-surface-card border border-brand-gold/10">
            <ArrowLeft className="w-4 h-4 text-text-muted" />
          </button>
          <h1 className="text-xl font-extrabold text-text-primary chinese-header">Result</h1>
        </div>
        <Card bento className="lantern-card text-center py-10">
          <p className="text-text-muted text-sm">Result not found</p>
          <p className="text-text-muted text-xs mt-1 font-mono">{id}</p>
        </Card>
      </div>
    );
  }

  const rows = [
    { label: "Draw Type", value: drawTypeLabel(draw.drawType) },
    { label: "Status", value: draw.status ?? "—" },
    { label: "Total Bets", value: draw.totalBets?.toString() ?? "—" },
    { label: "Total Payout", value: draw.totalPayout ? formatCurrency(draw.totalPayout) : "—" },
    { label: "Draw Date", value: draw.scheduledAt ? new Date(draw.scheduledAt).toLocaleString() : "—" },
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
        <h1 className="text-xl font-extrabold text-text-primary chinese-header">Draw Result</h1>
      </div>

      {/* Winning numbers */}
      <Card bento className="lantern-card text-center py-6">
        <div className="flex items-center justify-center gap-1.5 mb-3 text-brand-gold">
          <Trophy className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Winning Numbers</span>
        </div>
        <div className="flex justify-center gap-3">
          {[draw.number1, draw.number2].filter((n): n is number => n != null).map((n: number, i: number) => (
            <NumberBall key={i} number={n} size="lg" />
          ))}
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-3 text-text-muted">
          <CalendarDays className="w-3.5 h-3.5" />
          <span className="text-xs">{drawTypeLabel(draw.drawType)}</span>
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

      <Link to="/results" className="block text-center text-xs text-brand-gold/60 hover:text-brand-gold transition-colors">
        ← Back to Results
      </Link>
    </div>
  );
}
