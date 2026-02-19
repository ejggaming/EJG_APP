import { Link } from "react-router-dom";
import { CardGrid, StatCard, DataTable } from "../../components/bento";
import type { DataTableColumn } from "../../components/bento";
import { Button } from "../../components";
import { useAppStore } from "../../store/useAppStore";
import { formatCurrency } from "../../utils";
import {
  Dices,
  Wallet,
  Users,
  TrendingUp,
  Clock,
  MapPin,
  Trophy,
  AlertCircle,
} from "lucide-react";

/* ── Agent Info (from /api/auth/me + /api/agent) ── */
const AGENT_INFO = {
  role: "COBRADOR",
  status: "ACTIVE" as const,
  territory: {
    name: "Brgy. San Antonio",
    barangay: "San Antonio",
    municipality: "Tondo, Manila",
    region: "NCR",
  },
  supervisorName: "Cabo Ramos",
  commissionRate: 0.15,
};

const MOCK_STATS = {
  totalCustomers: 45,
  totalBetsToday: 128,
  collectionToday: 8450,
  commissionToday: 1267.5,
  commissionTotal: 32450,
  pendingPayouts: 3,
  wonBetsToday: 2,
  wonPayoutToday: 5000,
};

/* ── Today's Draws (from /api/juetengDraw) ── */
const TODAYS_DRAWS = [
  {
    id: "d1",
    drawType: "MORNING",
    scheduledAt: "11:00 AM",
    status: "SETTLED" as const,
    number1: 12,
    number2: 35,
    combinationKey: "12-35",
    totalBets: 87,
    totalStake: 4350,
    totalPayout: 5000,
    grossProfit: -650,
  },
  {
    id: "d2",
    drawType: "AFTERNOON",
    scheduledAt: "4:00 PM",
    status: "OPEN" as const,
    number1: null,
    number2: null,
    combinationKey: null,
    totalBets: 41,
    totalStake: 2050,
    totalPayout: 0,
    grossProfit: 0,
  },
];

const drawStatusColors: Record<string, string> = {
  OPEN: "bg-brand-green/20 text-brand-green",
  SCHEDULED: "bg-brand-gold/20 text-brand-gold",
  CLOSED: "bg-brand-red/20 text-brand-red",
  DRAWN: "bg-purple-500/20 text-purple-400",
  SETTLED: "bg-gray-500/20 text-gray-400",
};

const MOCK_RECENT_BETS = [
  {
    id: "1",
    customer: "Maria Santos",
    numbers: "12 - 35",
    amount: 50,
    draw: "11:00 AM",
    status: "WON" as const,
    reference: "20260219-MRN-00012",
    time: "10:12 AM",
  },
  {
    id: "2",
    customer: "Pedro Reyes",
    numbers: "7 - 23",
    amount: 100,
    draw: "11:00 AM",
    status: "LOST" as const,
    reference: "20260219-MRN-00011",
    time: "10:08 AM",
  },
  {
    id: "3",
    customer: "Anna Cruz",
    numbers: "19 - 31",
    amount: 20,
    draw: "4:00 PM",
    status: "PENDING" as const,
    reference: "20260219-AFT-00001",
    time: "3:55 PM",
  },
  {
    id: "4",
    customer: "Jose Garcia",
    numbers: "3 - 28",
    amount: 50,
    draw: "11:00 AM",
    status: "LOST" as const,
    reference: "20260219-MRN-00010",
    time: "9:40 AM",
  },
];

const betStatusColors: Record<string, string> = {
  PENDING: "bg-brand-gold/20 text-brand-gold",
  WON: "bg-brand-green/20 text-brand-green",
  LOST: "bg-gray-500/20 text-gray-400",
  VOID: "bg-brand-red/20 text-brand-red",
  REFUNDED: "bg-blue-500/20 text-blue-400",
};

export default function AgentDashboard() {
  const { user, balance } = useAppStore();

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
                Welcome, {user?.name ?? "Agent"}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-white/15 text-white/80">
                  {AGENT_INFO.role}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-brand-green/30 text-emerald-300">
                  {AGENT_INFO.status}
                </span>
              </div>
              <p className="text-white/60 text-xs mt-1 flex items-center gap-1">
                <MapPin size={10} />
                {AGENT_INFO.territory.name}, {AGENT_INFO.territory.municipality}{" "}
                · Supervisor: {AGENT_INFO.supervisorName}
              </p>
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
                value: MOCK_STATS.totalBetsToday.toString(),
                positive: true,
              },
              {
                label: "Collections",
                value: formatCurrency(MOCK_STATS.collectionToday),
                positive: true,
              },
              {
                label: "Commission",
                value: formatCurrency(MOCK_STATS.commissionToday),
                positive: true,
              },
              {
                label: "Winning Bets",
                value: `${MOCK_STATS.wonBetsToday} (${formatCurrency(MOCK_STATS.wonPayoutToday)})`,
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
          value={MOCK_STATS.totalBetsToday}
          icon={<Dices size={18} />}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          label="Collections"
          value={formatCurrency(MOCK_STATS.collectionToday)}
          icon={<Wallet size={18} />}
          color="orange"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          label="Commission"
          value={formatCurrency(MOCK_STATS.commissionToday)}
          icon={<TrendingUp size={18} />}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          label="Customers"
          value={MOCK_STATS.totalCustomers}
          icon={<Users size={18} />}
          color="purple"
        />
        <StatCard
          label="Pending Payouts"
          value={MOCK_STATS.pendingPayouts}
          icon={<AlertCircle size={18} />}
          color="orange"
        />
        <StatCard
          label="Total Earned"
          value={formatCurrency(MOCK_STATS.commissionTotal)}
          icon={<Trophy size={18} />}
          color="green"
          trend={{ value: 5, isPositive: true }}
        />
      </CardGrid>

      {/* ── Today's Draws ── */}
      <div className="card-3d p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Clock size={16} className="text-brand-gold" />
          Today's Draws
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TODAYS_DRAWS.map((draw) => (
            <div
              key={draw.id}
              className="p-4 rounded-xl bg-surface-elevated border border-border-default"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-text-primary">
                    {draw.scheduledAt}
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

              {/* Winning numbers */}
              {draw.number1 !== null && draw.number2 !== null && (
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

      {/* Recent Collections DataTable */}
      <DataTable
        title="Recent Collections"
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
            { key: "customer", label: "Customer", sortable: true },
            {
              key: "numbers",
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
            { key: "draw", label: "Draw", sortable: true },
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
            { key: "time", label: "Time", sortable: true },
          ] satisfies DataTableColumn[]
        }
        data={MOCK_RECENT_BETS}
        pageSize={10}
        exportable
      />
    </div>
  );
}
