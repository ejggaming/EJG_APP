import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../services/apiClient";
import {
  CardGrid,
  StatCard,
  ChartCard,
  DataTable,
} from "../../components/bento";
import type { DataTableColumn, MenuAction } from "../../components/bento";
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
  const gradientStops = segments
    .reduce<{ stops: string[]; cum: number }>(
      ({ stops, cum }, seg) => {
        const start = total > 0 ? (cum / total) * 100 : 0;
        const next = cum + seg.value;
        const end = total > 0 ? (next / total) * 100 : 0;
        return { stops: [...stops, `${seg.color} ${start}% ${end}%`], cum: next };
      },
      { stops: [], cum: 0 },
    )
    .stops.join(", ");

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
            {total >= 1_000_000
              ? `₱${(total / 1_000_000).toFixed(1)}M`
              : total >= 1_000
                ? `₱${(total / 1_000).toFixed(1)}K`
                : `₱${total.toLocaleString()}`}
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
      const typeMap: Record<string, string> = {
        DEPOSIT: "deposit",
        WITHDRAWAL: "withdrawal",
        JUETENG_BET: "bet",
        JUETENG_PAYOUT: "payout",
      };
      const relTime = (d: string) => {
        const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
        if (mins < 1) return "just now";
        if (mins < 60) return `${mins} min ago`;
        if (mins < 1440) return `${Math.floor(mins / 60)} hr ago`;
        return `${Math.floor(mins / 1440)} day ago`;
      };
      const [summaryRes, txRes, betsRes, schedulesRes] = await Promise.all([
        apiClient.get("/reports/summary", {
          params: { from: dateRange.from, to: dateRange.to },
        }),
        apiClient.get("/wallet/admin/transactions", { params: { limit: 10 } }),
        apiClient.get("/juetengBet", {
          params: {
            count: "true",
            filter: "status:PENDING",
          },
        }),
        apiClient.get("/juetengDraw", {
          params: {
            document: "true",
            filter: "status:SCHEDULED,status:OPEN",
            sort: "scheduledAt",
            order: "asc",
            limit: "5",
          },
        }),
      ]);

      const s = summaryRes.data.data;
      const txData = txRes.data.data;
      const pendingBets: number = betsRes.data.data?.count ?? 0;
      const upcomingDraws: { drawType: string; scheduledAt: string; status: string }[] =
        schedulesRes.data.data?.juetengDraws ?? [];

      const nextDraw = (() => {
        const now = Date.now();
        // Pick the earliest draw that hasn't passed yet
        const next = upcomingDraws.find(
          (d) => new Date(d.scheduledAt).getTime() > now,
        ) ?? upcomingDraws[0];

        if (!next) {
          return { time: "--", schedule: "No upcoming draw", countdown: "--" };
        }

        const scheduledMs = new Date(next.scheduledAt).getTime();
        const diffMs = Math.max(0, scheduledMs - now);
        const diffMin = Math.floor(diffMs / 60000);
        const h = Math.floor(diffMin / 60);
        const mn = diffMin % 60;

        const label =
          next.drawType === "MORNING"
            ? "Morning Draw"
            : next.drawType === "AFTERNOON"
              ? "Afternoon Draw"
              : "Evening Draw";

        const d = new Date(next.scheduledAt);
        const timeLabel = d.toLocaleTimeString("en-PH", {
          timeZone: "Asia/Manila",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        return {
          time: timeLabel,
          schedule: label,
          countdown: diffMin === 0 ? "now" : h > 0 ? `${h}h ${mn}m` : `${mn}m`,
        };
      })();

      return {
        totalUsers: s.totalUsers,
        activeUsers: 0,
        onlineNow: 0,
        totalRevenue: s.net,
        pendingBets,
        pendingWithdrawals: 0,
        todayWinners: 0,
        todayGovShare: s.govShare,
        kycPending: 0,
        suspiciousBets: (s.complianceLogs as unknown[]).length,
        todayDeposits: s.totalDeposits,
        todayWithdrawals: s.totalWithdrawals,
        todayBets: s.revenue,
        todayPayouts: s.payouts,
        platformBalance: s.net,
        operatorMargin: s.profitMargin,
        nextDraw,
        revenueBreakdown: [
          { label: "Betting Revenue", value: s.revenue, color: "#dc2626" },
          { label: "Deposits", value: s.totalDeposits, color: "#d97706" },
          { label: "Commissions", value: s.totalCommissions, color: "#2563eb" },
          { label: "Payouts", value: s.payouts, color: "#16a34a" },
        ],
        recentTransactions: (
          txData.transactions as {
            id: string;
            type: string;
            amount: number;
            metadata: Record<string, string> | null;
            userName: string;
            createdAt: string;
          }[]
        ).map((tx) => ({
          id: tx.id,
          user: tx.userName,
          type: typeMap[tx.type] ?? tx.type.toLowerCase(),
          amount: `₱${tx.amount.toLocaleString()}`,
          method:
            tx.metadata?.paymentMethod ??
            (tx.type === "JUETENG_PAYOUT" ? "Auto" : "Wallet"),
          time: relTime(tx.createdAt),
        })),
        topRegions: [] as { name: string; bets: number; revenue: number; pct: number }[],
      };
    },
    staleTime: 2 * 60 * 1000,
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
            <div style={{ overflowY: "auto", maxHeight: "240px", scrollbarWidth: "thin", scrollbarColor: "#8b0000 transparent" }}>
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
        actions={(): MenuAction[] => [
          { label: "View", variant: "default", onClick: () => {} },
        ]}
      />
    </div>
  );
}
