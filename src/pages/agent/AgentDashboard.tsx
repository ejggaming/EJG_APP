import { Link } from "react-router-dom";
import { CardGrid, StatCard, DataTable } from "../../components/bento";
import type { DataTableColumn } from "../../components/bento";
import { Button } from "../../components";
import { useAppStore } from "../../store/useAppStore";
import { formatCurrency } from "../../utils";
import {
  Dices,
  Wallet,
  TrendingUp,
  Clock,
  Trophy,
  AlertCircle,
} from "lucide-react";
import { AgentDashboardSkeleton } from "../../components/ChineseSkeleton";
import { useTodaysDrawsQuery, useBetHistoryQuery, drawTypeLabel } from "../../hooks/useBet";
import { useCommissionSummaryQuery } from "../../hooks/useCommission";
import type { JuetengBet, JuetengDraw } from "../../services/betService";

const drawStatusColors: Record<string, string> = {
  OPEN: "bg-brand-green/20 text-brand-green",
  SCHEDULED: "bg-brand-gold/20 text-brand-gold",
  CLOSED: "bg-brand-red/20 text-brand-red",
  DRAWN: "bg-purple-500/20 text-purple-400",
  SETTLED: "bg-gray-500/20 text-gray-400",
};

const betStatusColors: Record<string, string> = {
  PENDING: "bg-brand-gold/20 text-brand-gold",
  WON: "bg-brand-green/20 text-brand-green",
  LOST: "bg-gray-500/20 text-gray-400",
  VOID: "bg-brand-red/20 text-brand-red",
  REFUNDED: "bg-blue-500/20 text-blue-400",
};

export default function AgentDashboard() {
  const { user, balance } = useAppStore();

  const { data: todaysDraws = [], isLoading: drawsLoading } = useTodaysDrawsQuery();
  const { data: summary } = useCommissionSummaryQuery();
  const { data: betData, isLoading: betsLoading } = useBetHistoryQuery({ limit: 10 });

  const recentBets = betData?.bets ?? [];

  if (drawsLoading || betsLoading) return <AgentDashboardSkeleton />;

  // Aggregate today's stats from draws
  const totalBetsToday = todaysDraws.reduce((s, d) => s + d.totalBets, 0);
  const collectionToday = todaysDraws.reduce((s, d) => s + d.totalStake, 0);

  return (
    <div className="space-y-5">
      {/* ── Hero Card ── */}
      <div
        className="card-3d overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #78350f 0%, #92400e 30%, #b45309 60%, #78350f 100%)",
        }}
      >
        <div className="relative p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-widest">
                ✦ Agent Portal ✦
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Welcome, {user?.person?.firstName ?? "Agent"}
              </h1>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-[10px] text-white/50 uppercase tracking-widest">
                Commission Wallet
              </p>
              <p className="text-2xl font-extrabold gold-shimmer">
                {formatCurrency(balance)}
              </p>
              <Link to="/agent/wallet">
                <button className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/10">
                  Withdraw
                </button>
              </Link>
            </div>
          </div>

          {/* Inline quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
            {[
              {
                label: "Today's Bets",
                value: totalBetsToday.toLocaleString(),
                positive: true,
              },
              {
                label: "Collections",
                value: formatCurrency(collectionToday),
                positive: true,
              },
              {
                label: "This Month",
                value: formatCurrency(summary?.thisMonth ?? 0),
                positive: true,
              },
              {
                label: "Total Earned",
                value: formatCurrency(summary?.totalEarned ?? 0),
                positive: false,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-xl px-3 py-2.5 backdrop-blur-xl border border-white/15 shadow-lg
                  transition-all duration-300 hover:scale-[1.03] hover:border-white/25 hover:shadow-xl
                  animate-[fadeSlideUp_0.5s_ease-out_both]"
                style={{
                  background: "rgba(0,0,0,0.45)",
                  animationDelay: `${i * 100}ms`,
                }}
              >
                <p className="text-[9px] text-white/70 uppercase tracking-wider font-medium">
                  {stat.label}
                </p>
                <p
                  className={`text-base font-bold mt-0.5 ${stat.positive ? "text-emerald-300" : "text-amber-300"}`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile wallet balance */}
          <div className="sm:hidden mt-4 bg-black/20 rounded-lg p-3 text-center">
            <p className="text-[10px] text-white/50 uppercase tracking-widest">
              Commission Wallet
            </p>
            <p className="text-2xl font-extrabold gold-shimmer mt-0.5">
              {formatCurrency(balance)}
            </p>
            <Link to="/agent/wallet">
              <button className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/10">
                Withdraw
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Key Metrics ── */}
      <CardGrid columns={6}>
        <StatCard
          label="Bets Today"
          value={totalBetsToday}
          icon={<Dices size={18} />}
          color="blue"
        />
        <StatCard
          label="Collections"
          value={formatCurrency(collectionToday)}
          icon={<Wallet size={18} />}
          color="orange"
        />
        <StatCard
          label="Commission (Month)"
          value={formatCurrency(summary?.thisMonth ?? 0)}
          icon={<TrendingUp size={18} />}
          color="green"
        />
        <StatCard
          label="Pending"
          value={formatCurrency(summary?.pending ?? 0)}
          icon={<AlertCircle size={18} />}
          color="orange"
        />
        <StatCard
          label="Total Earned"
          value={formatCurrency(summary?.totalEarned ?? 0)}
          icon={<Trophy size={18} />}
          color="green"
        />
        <StatCard
          label="Total Paid Out"
          value={formatCurrency(summary?.paid ?? 0)}
          icon={<Wallet size={18} />}
          color="blue"
        />
      </CardGrid>

      {/* ── Today's Draws ── */}
      <div className="card-3d p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Clock size={16} className="text-brand-gold" />
          Today's Draws
        </h2>
        {todaysDraws.length === 0 ? (
          <p className="text-center text-text-muted text-sm py-4">No draws scheduled for today.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {todaysDraws.map((draw: JuetengDraw) => (
              <div
                key={draw.id}
                className="p-4 rounded-xl bg-surface-elevated border border-border-default"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-primary">
                      {drawTypeLabel(draw.drawType)}
                    </span>
                    <span className="text-[10px] text-text-muted uppercase">
                      {draw.drawType}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${drawStatusColors[draw.status] ?? ""}`}
                  >
                    {draw.status}
                  </span>
                </div>

                {draw.number1 != null && draw.number2 != null && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-full bg-brand-red text-white text-sm font-bold flex items-center justify-center border-2 border-brand-gold">
                      {draw.number1}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-brand-red text-white text-sm font-bold flex items-center justify-center border-2 border-brand-gold">
                      {draw.number2}
                    </span>
                    <span className="text-xs text-text-muted ml-1">
                      Key: {draw.combinationKey}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] text-text-muted">Bets</p>
                    <p className="text-sm font-bold text-text-primary">
                      {draw.totalBets}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted">Stake</p>
                    <p className="text-sm font-bold text-brand-gold">
                      {formatCurrency(draw.totalStake)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted">Payout</p>
                    <p className="text-sm font-bold text-brand-red">
                      {formatCurrency(draw.totalPayout)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/agent/collect-bet">
          <Button variant="primary" fullWidth size="lg">
            Collect Bet
          </Button>
        </Link>
        <Link to="/agent/customers">
          <Button variant="outline" fullWidth size="lg">
            My Customers
          </Button>
        </Link>
      </div>

      {/* Recent Bet Activity DataTable */}
      <DataTable
          title="Recent Bet Activity"
          columns={
            [
              {
                key: "reference",
                label: "Ref",
                sortable: true,
                render: (v: string) => (
                  <span className="font-mono text-xs text-text-primary">{v}</span>
                ),
              },
              {
                key: "combinationKey",
                label: "Numbers",
                sortable: false,
                searchable: false,
                render: (v: string) => (
                  <span className="font-mono font-bold text-brand-red">{v}</span>
                ),
              },
              {
                key: "amount",
                label: "Stake",
                align: "right" as const,
                sortable: true,
                render: (v: number) => (
                  <span className="font-semibold text-brand-gold">
                    {formatCurrency(v)}
                  </span>
                ),
              },
              {
                key: "draw",
                label: "Draw",
                sortable: false,
                render: (_v: unknown, row: JuetengBet) =>
                  row.draw ? drawTypeLabel(row.draw.drawType) : "—",
              },
              {
                key: "status",
                label: "Status",
                sortable: true,
                render: (v: string) => (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${betStatusColors[v] ?? ""}`}
                  >
                    {v}
                  </span>
                ),
              },
              {
                key: "placedAt",
                label: "Time",
                sortable: true,
                render: (v: string) =>
                  new Date(v).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }),
              },
            ] satisfies DataTableColumn[]
          }
          data={recentBets}
          pageSize={10}
          exportable
        />
    </div>
  );
}
