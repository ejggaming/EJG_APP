import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CardGrid,
  StatCard,
  ChartCard,
  DataTable,
} from "../../components/bento";
import type { DataTableColumn } from "../../components/bento";
import {
  TrendingUp,
  Users,
  Wallet,
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
  Dices,
  Trophy,
  CreditCard,
  BarChart3,
  Clock,
  Eye,
} from "lucide-react";
import { AdminDashboardSkeleton } from "../../components/ChineseSkeleton";
import {
  DateRangeFilter,
  getInitialDateRange,
  dateRangeLabel,
} from "../../components/DateRangeFilter";
import type { DateRange } from "../../components/DateRangeFilter";

/* ── Donut ring component (pure CSS) ── */
function DonutChart({
  segments,
}: {
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let cumulative = 0;
  const gradientStops = segments
    .map((seg) => {
      const start = (cumulative / total) * 100;
      cumulative += seg.value;
      const end = (cumulative / total) * 100;
      return `${seg.color} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-36 h-36 shrink-0">
        <div
          className="w-full h-full rounded-full"
          style={{
            background: `conic-gradient(${gradientStops})`,
          }}
        />
        <div className="absolute inset-3 rounded-full bg-surface-card flex items-center justify-center flex-col">
          <span className="text-xl font-bold text-text-primary">
            ₱{(total / 1000).toFixed(0)}K
          </span>
          <span className="text-[10px] text-text-muted">Total</span>
        </div>
      </div>
      <div className="space-y-2.5 flex-1">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: seg.color }}
              />
              <span className="text-xs text-text-secondary">{seg.label}</span>
            </div>
            <span className="text-xs font-semibold text-text-primary">
              ₱{seg.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Transaction row component ── */
function TransactionRow({
  icon,
  iconBg,
  label,
  subtitle,
  amount,
  isPositive,
  time,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  subtitle: string;
  amount: string;
  isPositive: boolean;
  time: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border-subtle last:border-0">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">
          {label}
        </p>
        <p className="text-xs text-text-muted">{subtitle}</p>
      </div>
      <div className="text-right">
        <p
          className={`text-sm font-semibold ${isPositive ? "text-brand-green-light" : "text-brand-red-light"}`}
        >
          {isPositive ? "+" : "-"}
          {amount}
        </p>
        <p className="text-[10px] text-text-muted">{time}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>(
    getInitialDateRange("today"),
  );

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-dashboard", dateRange.from, dateRange.to],
    queryFn: async () => {
      // Fake data — swap for real API using dateRange.from / dateRange.to
      return {
        totalUsers: 12450,
        activeUsers: 3890,
        onlineNow: 482,
        totalRevenue: 548290,
        pendingBets: 234,
        pendingWithdrawals: 18,
        todayWinners: 42,
        todayGovShare: 14445,
        kycPending: 67,
        suspiciousBets: 5,
        todayDeposits: 45230,
        todayWithdrawals: 18900,
        todayBets: 32100,
        todayPayouts: 12500,
        platformBalance: 1248500,
        operatorMargin: 55,
        nextDraw: {
          time: "4:00 PM",
          schedule: "Afternoon Draw",
          countdown: "2h 15m",
        },
        revenueBreakdown: [
          { label: "Betting Revenue", value: 325000, color: "#dc2626" },
          { label: "Deposits", value: 128000, color: "#d97706" },
          { label: "Commissions", value: 58290, color: "#2563eb" },
          { label: "Other", value: 37000, color: "#16a34a" },
        ],
        recentTransactions: [
          { id: 1, user: "Maria Santos", type: "deposit", amount: "₱1,000", method: "GCash", time: "2 min ago" },
          { id: 2, user: "Pedro Reyes", type: "withdrawal", amount: "₱500", method: "Maya", time: "5 min ago" },
          { id: 3, user: "Anna Cruz", type: "bet", amount: "₱2,500", method: "Wallet", time: "12 min ago" },
          { id: 4, user: "Jose Garcia", type: "payout", amount: "₱15,000", method: "Auto", time: "30 min ago" },
          { id: 5, user: "Rosa Bautista", type: "deposit", amount: "₱3,000", method: "Bank", time: "1 hr ago" },
        ],
        topRegions: [
          { name: "NCR", bets: 145, revenue: 52000, pct: 38 },
          { name: "Region III", bets: 98, revenue: 31200, pct: 24 },
          { name: "Region IV-A", bets: 72, revenue: 24800, pct: 18 },
          { name: "Region VII", bets: 65, revenue: 22100, pct: 13 },
          { name: "Others", bets: 42, revenue: 12990, pct: 7 },
        ],
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <AdminDashboardSkeleton />;
  if (error)
    return <div className="text-brand-red-light">Failed to load data</div>;

  const txIcons: Record<string, { icon: React.ReactNode; bg: string }> = {
    deposit: {
      icon: <ArrowDownLeft className="w-4 h-4 text-brand-green-light" />,
      bg: "bg-brand-green/15",
    },
    withdrawal: {
      icon: <ArrowUpRight className="w-4 h-4 text-brand-red-light" />,
      bg: "bg-brand-red/15",
    },
    bet: {
      icon: <Dices className="w-4 h-4 text-brand-gold-light" />,
      bg: "bg-brand-gold/15",
    },
    payout: {
      icon: <Trophy className="w-4 h-4 text-brand-blue-light" />,
      bg: "bg-brand-blue/15",
    },
  };

  const rangeLabel = dateRangeLabel(dateRange);

  return (
    <div className="space-y-5">
      {/* ── Hero Card ── */}
      <div
        className="card-3d overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #7f1d1d 0%, #991b1b 30%, #b91c1c 60%, #7f1d1d 100%)",
        }}
      >
        <div className="relative p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-widest">
                ✦ Admin Panel ✦
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Welcome back, Admin
              </h1>
              <p className="text-white/70 text-sm mt-1">
                Here's your platform overview for today
              </p>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-[10px] text-white/50 uppercase tracking-widest">
                Platform Balance
              </p>
              <p className="text-2xl font-extrabold gold-shimmer">
                ₱{(dashboardData?.platformBalance ?? 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Inline quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
            {[
              {
                label: "Deposits",
                value: `₱${(dashboardData?.todayDeposits ?? 0).toLocaleString()}`,
                positive: true,
              },
              {
                label: "Withdrawals",
                value: `₱${(dashboardData?.todayWithdrawals ?? 0).toLocaleString()}`,
                positive: false,
              },
              {
                label: "Bets",
                value: `₱${(dashboardData?.todayBets ?? 0).toLocaleString()}`,
                positive: true,
              },
              {
                label: "Payouts",
                value: `₱${(dashboardData?.todayPayouts ?? 0).toLocaleString()}`,
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

          {/* Mobile platform balance */}
          <div className="sm:hidden mt-4 bg-black/20 rounded-lg p-3 text-center">
            <p className="text-[10px] text-white/50 uppercase tracking-widest">
              Platform Balance
            </p>
            <p className="text-2xl font-extrabold gold-shimmer mt-0.5">
              ₱{(dashboardData?.platformBalance ?? 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* ── Date Range Filter ── */}
      <div className="bg-surface-card border border-border-default rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Viewing data for
          </p>
          <p className="text-sm font-medium text-text-primary mt-0.5">
            {rangeLabel}
          </p>
        </div>
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      {/* ── Key Metrics ── */}
      <CardGrid columns={6}>
        <StatCard
          label="Total Users"
          value={(dashboardData?.totalUsers ?? 0).toLocaleString()}
          icon={<Users size={18} />}
          color="blue"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          label="Online Now"
          value={(dashboardData?.onlineNow ?? 0).toLocaleString()}
          icon={<Eye size={18} />}
          color="green"
        />
        <StatCard
          label="Total Revenue"
          value={`₱${(dashboardData?.totalRevenue ?? 0).toLocaleString()}`}
          icon={<Wallet size={18} />}
          color="purple"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          label="Active Users"
          value={(dashboardData?.activeUsers ?? 0).toLocaleString()}
          icon={<Activity size={18} />}
          color="green"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          label="Pending Bets"
          value={dashboardData?.pendingBets ?? 0}
          icon={<TrendingUp size={18} />}
          color="orange"
          trend={{ value: 3, isPositive: false }}
        />
        <StatCard
          label="Next Draw"
          value={dashboardData?.nextDraw?.countdown ?? "--"}
          icon={<Clock size={18} />}
          color="blue"
        />
      </CardGrid>

      {/* ── Revenue Breakdown + Transactions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
        {/* Revenue Donut */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Revenue Breakdown"
            subtitle={rangeLabel}
            className="h-full"
          >
            <div className="flex items-center justify-center h-full py-2">
              <DonutChart segments={dashboardData?.revenueBreakdown ?? []} />
            </div>
          </ChartCard>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-3">
          <div className="card-3d p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text-primary">
                Latest Transactions
              </h3>
            </div>
            <div>
              {dashboardData?.recentTransactions.map((tx: any) => {
                const style = txIcons[tx.type] ?? txIcons.deposit;
                return (
                  <TransactionRow
                    key={tx.id}
                    icon={style.icon}
                    iconBg={style.bg}
                    label={tx.user}
                    subtitle={`${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} · ${tx.method}`}
                    amount={tx.amount}
                    isPositive={tx.type === "deposit" || tx.type === "payout"}
                    time={tx.time}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Charts Row ── */}
      <CardGrid columns={2}>
        <ChartCard
          title="Revenue Trend"
          subtitle={rangeLabel}
          action={<BarChart3 size={18} />}
        >
          <div className="h-full flex items-center justify-center text-text-muted">
            <div className="text-center">
              <BarChart3 size={40} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs">Revenue chart placeholder</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Betting Activity"
          subtitle="Bets per draw schedule"
          action={<CreditCard size={18} />}
        >
          <div className="h-full flex items-center justify-center text-text-muted">
            <div className="text-center">
              <CreditCard size={40} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs">Activity chart placeholder</p>
            </div>
          </div>
        </ChartCard>
      </CardGrid>

      {/* ── Regional Performance DataTable ── */}
      <DataTable
        title="Regional Performance"
        columns={
          [
            { key: "name", label: "Region", sortable: true, searchable: true },
            {
              key: "bets",
              label: "Bets",
              align: "right" as const,
              sortable: true,
              searchable: false,
            },
            {
              key: "revenue",
              label: "Revenue",
              align: "right" as const,
              sortable: true,
              searchable: false,
              render: (v: number) => `₱${v.toLocaleString()}`,
            },
            {
              key: "pct",
              label: "Share",
              align: "right" as const,
              sortable: true,
              searchable: false,
              render: (v: number) => (
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block w-8 h-1.5 rounded-full overflow-hidden"
                    style={{ background: "var(--glass-divider)" }}
                  >
                    <span
                      className="block h-full rounded-full bg-brand-red"
                      style={{ width: `${v}%` }}
                    />
                  </span>
                  {v}%
                </span>
              ),
            },
          ] satisfies DataTableColumn[]
        }
        data={dashboardData?.topRegions ?? []}
        pageSize={10}
        exportable
      />

      {/* ── All Transactions DataTable ── */}
      <DataTable
        title="All Transactions"
        columns={
          [
            { key: "user", label: "User", sortable: true },
            {
              key: "type",
              label: "Type",
              sortable: true,
              render: (_: any, row: any) => {
                const t = row.type.charAt(0).toUpperCase() + row.type.slice(1);
                const color =
                  row.type === "deposit"
                    ? "text-brand-green bg-brand-green/10"
                    : row.type === "withdrawal"
                      ? "text-brand-red bg-brand-red/10"
                      : row.type === "bet"
                        ? "text-brand-gold bg-brand-gold/10"
                        : "text-brand-blue bg-brand-blue/10";
                return (
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${color}`}
                  >
                    {t}
                  </span>
                );
              },
            },
            {
              key: "amount",
              label: "Amount",
              align: "right" as const,
              sortable: true,
            },
            { key: "method", label: "Method", sortable: true },
            { key: "time", label: "Time", sortable: true },
          ] satisfies DataTableColumn[]
        }
        data={dashboardData?.recentTransactions ?? []}
        pageSize={10}
        exportable
        actions={() => (
          <button className="text-xs px-2.5 py-1 bg-brand-blue/10 text-brand-blue-light rounded-lg hover:bg-brand-blue/15 transition-colors">
            View
          </button>
        )}
      />
    </div>
  );
}
