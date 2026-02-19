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
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Landmark,
  CreditCard,
} from "lucide-react";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";
import { Button } from "../../components";

export default function FinanceManagement() {
  const { data: financeData, isLoading } = useQuery({
    queryKey: ["admin-finance"],
    queryFn: async () => {
      return {
        totalRevenue: 548290,
        totalPayouts: 320450,
        pendingTransfers: 89000,
        monthlyProfit: 227840,
        govShare: 14445,
        operatorMargin: 55,
        totalCommissions: 32400,
        walletBalance: 1245800,
        paymentMethods: {
          gcash: { count: 1240, volume: 312000 },
          maya: { count: 680, volume: 170000 },
          bank: { count: 215, volume: 107500 },
        },
        dailySettlement: {
          date: "Feb 19, 2026",
          totalBets: 290850,
          totalPayouts: 105000,
          commissions: 8640,
          govShare: 14445,
          netRevenue: 162765,
          status: "Pending" as const,
        },
        pendingWithdrawals: [
          {
            id: "1",
            user: "Jose Garcia",
            mobile: "09221111222",
            amount: 15000,
            method: "GCash",
            account: "09221111222",
            date: "Feb 19, 2026 10:30 AM",
          },
          {
            id: "2",
            user: "Maria Santos",
            mobile: "09171234567",
            amount: 5000,
            method: "Maya",
            account: "09171234567",
            date: "Feb 19, 2026 9:15 AM",
          },
          {
            id: "3",
            user: "Pedro Reyes",
            mobile: "09189876543",
            amount: 3000,
            method: "Bank",
            account: "1234-5678-9012",
            date: "Feb 18, 2026 4:00 PM",
          },
          {
            id: "4",
            user: "Luis Bautista",
            mobile: "09331234567",
            amount: 8500,
            method: "GCash",
            account: "09331234567",
            date: "Feb 19, 2026 11:00 AM",
          },
        ],
        transactions: [
          {
            id: 1,
            type: "Deposit",
            user: "Anna Cruz",
            amount: 1000,
            method: "GCash",
            status: "Completed",
            date: "Feb 19, 2026 10:45 AM",
            reference: "TXN-20260219-001",
          },
          {
            id: 2,
            type: "Payout",
            user: "Jose Garcia",
            amount: 5000,
            method: "Auto",
            status: "Completed",
            date: "Feb 19, 2026 11:05 AM",
            reference: "TXN-20260219-002",
          },
          {
            id: 3,
            type: "Withdrawal",
            user: "Rosa Bautista",
            amount: 2000,
            method: "Maya",
            status: "Completed",
            date: "Feb 19, 2026 8:30 AM",
            reference: "TXN-20260219-003",
          },
          {
            id: 4,
            type: "Commission",
            user: "Ricardo Dalisay",
            amount: 480,
            method: "Auto",
            status: "Completed",
            date: "Feb 19, 2026 11:05 AM",
            reference: "TXN-20260219-004",
          },
          {
            id: 5,
            type: "Gov Share",
            user: "PCSO Remittance",
            amount: 14445,
            method: "Bank",
            status: "Pending",
            date: "Feb 19, 2026 12:00 PM",
            reference: "TXN-20260219-005",
          },
          {
            id: 6,
            type: "Settlement",
            user: "Daily Settlement",
            amount: 162765,
            method: "System",
            status: "Processing",
            date: "Feb 19, 2026 11:59 PM",
            reference: "TXN-20260219-006",
          },
          {
            id: 7,
            type: "Deposit",
            user: "Elena Villanueva",
            amount: 2500,
            method: "Maya",
            status: "Completed",
            date: "Feb 19, 2026 7:20 AM",
            reference: "TXN-20260219-007",
          },
          {
            id: 8,
            type: "Withdrawal",
            user: "Carlos Mendoza",
            amount: 10000,
            method: "Bank",
            status: "Failed",
            date: "Feb 18, 2026 11:30 PM",
            reference: "TXN-20260218-042",
          },
        ],
      };
    },
  });

  const handleApprove = (id: string) => {
    toast.success(`Withdrawal ${id} approved`);
  };

  const handleReject = (id: string) => {
    toast.error(`Withdrawal ${id} rejected`);
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Financial Management
        </h1>
        <p className="text-text-muted mt-1">
          Manage deposits, withdrawals, and settlements
        </p>
      </div>

      {/* Financial Metrics */}
      <CardGrid columns={6}>
        <StatCard
          label="Total Revenue"
          value={`₱${financeData?.totalRevenue?.toLocaleString()}`}
          icon={<DollarSign size={18} />}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          label="Total Payouts"
          value={`₱${financeData?.totalPayouts?.toLocaleString()}`}
          icon={<ArrowDownLeft size={18} />}
          color="red"
        />
        <StatCard
          label="Monthly Profit"
          value={`₱${financeData?.monthlyProfit?.toLocaleString()}`}
          icon={<TrendingUp size={18} />}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          label="Pending Transfers"
          value={`₱${financeData?.pendingTransfers?.toLocaleString()}`}
          icon={<ArrowUpRight size={18} />}
          color="orange"
        />
        <StatCard
          label="Gov't Share"
          value={`₱${financeData?.govShare?.toLocaleString()}`}
          icon={<Landmark size={18} />}
          color="purple"
        />
        <StatCard
          label="Wallet Balance"
          value={`₱${financeData?.walletBalance?.toLocaleString()}`}
          icon={<CreditCard size={18} />}
          color="green"
        />
      </CardGrid>

      {/* Charts + Settlement */}
      <CardGrid columns={2}>
        <ChartCard
          title="Revenue Comparison"
          subtitle="Deposits vs Betting Revenue"
        >
          <div className="h-full flex items-center justify-center text-text-muted">
            Revenue comparison chart
          </div>
        </ChartCard>

        <ChartCard title="Payout Trends" subtitle="Last 30 days">
          <div className="h-full flex items-center justify-center text-text-muted">
            Payout trends chart
          </div>
        </ChartCard>
      </CardGrid>

      {/* Daily Settlement & Payment Method Breakdown */}
      <CardGrid columns={2}>
        <ChartCard
          title="Daily Settlement"
          subtitle={financeData?.dailySettlement?.date}
        >
          <div className="space-y-3">
            {[
              {
                label: "Total Bets",
                value: financeData?.dailySettlement?.totalBets,
                color: "text-brand-blue",
              },
              {
                label: "Total Payouts",
                value: financeData?.dailySettlement?.totalPayouts,
                color: "text-brand-red-light",
              },
              {
                label: "Commissions",
                value: financeData?.dailySettlement?.commissions,
                color: "text-brand-gold",
              },
              {
                label: "Gov't Share",
                value: financeData?.dailySettlement?.govShare,
                color: "text-purple-400",
              },
              {
                label: "Net Revenue",
                value: financeData?.dailySettlement?.netRevenue,
                color: "text-brand-green",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center"
              >
                <span className="text-sm text-text-muted">{item.label}</span>
                <span className={`text-sm font-semibold ${item.color}`}>
                  ₱{item.value?.toLocaleString()}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
              <span className="text-sm text-text-muted">Status</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full text-brand-gold bg-brand-gold/10">
                {financeData?.dailySettlement?.status}
              </span>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Payment Methods" subtitle="Volume by method">
          <div className="space-y-4">
            {[
              {
                name: "GCash",
                ...financeData?.paymentMethods?.gcash,
                color: "bg-blue-500",
              },
              {
                name: "Maya",
                ...financeData?.paymentMethods?.maya,
                color: "bg-green-500",
              },
              {
                name: "Bank Transfer",
                ...financeData?.paymentMethods?.bank,
                color: "bg-purple-500",
              },
            ].map((m) => (
              <div key={m.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-text-primary font-medium">
                    {m.name}
                  </span>
                  <span className="text-text-muted">
                    {m.count?.toLocaleString()} txns · ₱
                    {m.volume?.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full ${m.color}`}
                    style={{
                      width: `${((m.volume || 0) / (financeData?.paymentMethods?.gcash?.volume || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </CardGrid>

      {/* Pending Withdrawals */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          Pending Withdrawals
        </h2>
        <div className="space-y-2">
          {financeData?.pendingWithdrawals.map((w: any) => (
            <div key={w.id} className="card-3d p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-red/10 flex items-center justify-center text-brand-red-light font-bold">
                    {w.user[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {w.user}
                    </p>
                    <p className="text-xs text-text-muted">
                      {w.mobile} · {w.method} → {w.account}
                    </p>
                    <p className="text-[10px] text-text-muted">{w.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-bold text-brand-gold-light">
                    ₱{w.amount.toLocaleString()}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="green"
                      onClick={() => handleApprove(w.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleReject(w.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions DataTable */}
      <DataTable
        title="Recent Transactions"
        columns={
          [
            {
              key: "type",
              label: "Type",
              sortable: true,
              render: (v: string) => {
                const color =
                  v === "Deposit"
                    ? "text-brand-green bg-brand-green/10"
                    : v === "Withdrawal"
                      ? "text-brand-red bg-brand-red/10"
                      : v === "Commission"
                        ? "text-brand-blue bg-brand-blue/10"
                        : v === "Gov Share"
                          ? "text-purple-400 bg-purple-400/10"
                          : v === "Settlement"
                            ? "text-cyan-400 bg-cyan-400/10"
                            : "text-brand-gold bg-brand-gold/10";
                return (
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${color}`}
                  >
                    {v}
                  </span>
                );
              },
            },
            { key: "user", label: "User", sortable: true },
            {
              key: "amount",
              label: "Amount",
              align: "right" as const,
              sortable: true,
              render: (v: number) => (
                <span className="font-medium">₱{v.toLocaleString()}</span>
              ),
            },
            { key: "method", label: "Method", sortable: true },
            { key: "reference", label: "Reference", sortable: true },
            {
              key: "status",
              label: "Status",
              sortable: true,
              render: (v: string) => {
                const statusColor =
                  v === "Completed"
                    ? "text-brand-green bg-brand-green/10"
                    : v === "Pending"
                      ? "text-brand-gold bg-brand-gold/10"
                      : v === "Processing"
                        ? "text-brand-blue bg-brand-blue/10"
                        : "text-brand-red bg-brand-red/10";
                return (
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColor}`}
                  >
                    {v}
                  </span>
                );
              },
            },
            { key: "date", label: "Date", sortable: true },
          ] satisfies DataTableColumn[]
        }
        data={financeData?.transactions || []}
        pageSize={10}
        exportable
      />
    </div>
  );
}
