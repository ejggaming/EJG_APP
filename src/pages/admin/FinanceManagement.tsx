import { useState } from "react";
import {
  CardGrid,
  StatCard,
  ChartCard,
  DataTable,
} from "../../components/bento";
import type { DataTableColumn, MenuAction } from "../../components/bento";
import {
  TrendingUp,
  DollarSign,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { FinanceSkeleton } from "../../components/ChineseSkeleton";
import { Button } from "../../components";
import { useAdminTransactionsQuery } from "../../hooks/useAdmin";
import type { AdminTransaction } from "../../hooks/useAdmin";
import {
  useApproveTransactionMutation,
  useRejectTransactionMutation,
} from "../../hooks/useWallet";
import {
  DateRangeFilter,
  getInitialDateRange,
  dateRangeLabel,
} from "../../components/DateRangeFilter";
import type { DateRange } from "../../components/DateRangeFilter";

export default function FinanceManagement() {
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>(
    getInitialDateRange("week"),
  );

  // All transactions
  const { data: txData, isLoading } = useAdminTransactionsQuery({
    type: typeFilter || undefined,
    status: statusFilter || undefined,
    limit: 500,
  });

  // Pending transactions only (for the approval queue)
  const { data: pendingData, isLoading: isPendingLoading } =
    useAdminTransactionsQuery({ status: "PENDING", limit: 50 });

  const approveMutation = useApproveTransactionMutation();
  const rejectMutation = useRejectTransactionMutation();

  const rawTx = txData?.transactions ?? [];
  const pendingTx = pendingData?.transactions ?? [];
  const totalCount = txData?.count ?? 0;

  // Filter transactions by selected date range
  const allTx = rawTx.filter((t) => {
    const d = new Date(t.createdAt);
    return (
      d >= new Date(dateRange.from) &&
      d <= new Date(dateRange.to + "T23:59:59.999")
    );
  });

  // Compute stats from date-filtered transactions
  const completedTx = allTx.filter((t) => t.status === "COMPLETED");
  const totalDeposits = completedTx
    .filter((t) => t.type === "DEPOSIT")
    .reduce((s, t) => s + t.amount, 0);
  const totalWithdrawals = completedTx
    .filter((t) => t.type === "WITHDRAWAL")
    .reduce((s, t) => s + t.amount, 0);
  const totalPayouts = completedTx
    .filter((t) => t.type === "JUETENG_PAYOUT")
    .reduce((s, t) => s + t.amount, 0);
  const pendingAmount = pendingTx.reduce((s, t) => s + t.amount, 0);

  if (isLoading) return <FinanceSkeleton />;

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

      {/* Date Range Filter */}
      <div className="bg-surface-card border border-border-default rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Viewing transactions for
          </p>
          <p className="text-sm font-medium text-text-primary mt-0.5">
            {dateRangeLabel(dateRange)}
          </p>
        </div>
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      {/* Financial Metrics */}
      <CardGrid columns={4}>
        <StatCard
          label="Total Deposits"
          value={`₱${totalDeposits.toLocaleString()}`}
          icon={<DollarSign size={18} />}
          color="green"
        />
        <StatCard
          label="Total Withdrawals"
          value={`₱${totalWithdrawals.toLocaleString()}`}
          icon={<ArrowDownLeft size={18} />}
          color="red"
        />
        <StatCard
          label="Total Payouts"
          value={`₱${totalPayouts.toLocaleString()}`}
          icon={<TrendingUp size={18} />}
          color="blue"
        />
        <StatCard
          label="Pending Amount"
          value={`₱${pendingAmount.toLocaleString()}`}
          icon={<Clock size={18} />}
          color="orange"
        />
      </CardGrid>

      {/* Pending Transactions Approval Queue */}
      <div className="bg-surface-card border border-border-default rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Pending Approvals
            </h2>
            <p className="text-sm text-text-muted">
              Deposits and withdrawals awaiting admin approval
            </p>
          </div>
          {pendingTx.length > 0 && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-brand-gold/10 text-brand-gold">
              {pendingTx.length} pending
            </span>
          )}
        </div>

        {isPendingLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
          </div>
        ) : pendingTx.length === 0 ? (
          <p className="text-center text-text-muted text-sm py-8">
            No pending transactions
          </p>
        ) : (
          <div className="space-y-2">
            {pendingTx.map((tx) => {
              const isDeposit = tx.type === "DEPOSIT";
              return (
                <div
                  key={tx.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-surface-elevated rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                        isDeposit
                          ? "bg-brand-green/10 text-brand-green-light"
                          : "bg-brand-red/10 text-brand-red-light"
                      }`}
                    >
                      {tx.userName?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {tx.userName}
                      </p>
                      <p className="text-xs text-text-muted">
                        {tx.type.replace("_", " ")} · {tx.reference}
                      </p>
                      <p className="text-[10px] text-text-muted">
                        {new Date(tx.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-brand-gold-light">
                      ₱{tx.amount.toLocaleString()}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="green"
                        disabled={
                          approveMutation.isPending || rejectMutation.isPending
                        }
                        onClick={() => approveMutation.mutate(tx.id)}
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={
                          approveMutation.isPending || rejectMutation.isPending
                        }
                        onClick={() =>
                          rejectMutation.mutate({
                            id: tx.id,
                            reason: "Rejected by admin",
                          })
                        }
                      >
                        <XCircle size={14} className="mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <CardGrid columns={2}>
        <ChartCard title="Transaction Summary" subtitle="By type">
          <div className="space-y-3">
            {[
              {
                label: "Deposits",
                count: allTx.filter((t) => t.type === "DEPOSIT").length,
                color: "text-brand-green",
              },
              {
                label: "Withdrawals",
                count: allTx.filter((t) => t.type === "WITHDRAWAL").length,
                color: "text-brand-red-light",
              },
              {
                label: "Bet Deductions",
                count: allTx.filter((t) => t.type === "JUETENG_BET").length,
                color: "text-brand-gold",
              },
              {
                label: "Payouts",
                count: allTx.filter((t) => t.type === "JUETENG_PAYOUT").length,
                color: "text-brand-blue",
              },
              {
                label: "Commission Payouts",
                count: allTx.filter((t) => t.type === "COMMISSION_PAYOUT")
                  .length,
                color: "text-purple-400",
              },
              {
                label: "Adjustments",
                count: allTx.filter((t) => t.type === "ADJUSTMENT").length,
                color: "text-cyan-400",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center"
              >
                <span className="text-sm text-text-muted">{item.label}</span>
                <span className={`text-sm font-semibold ${item.color}`}>
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Status Breakdown" subtitle="Current batch">
          <div className="space-y-3">
            {[
              {
                label: "Completed",
                count: allTx.filter((t) => t.status === "COMPLETED").length,
                color: "text-brand-green",
              },
              {
                label: "Pending",
                count: allTx.filter((t) => t.status === "PENDING").length,
                color: "text-brand-gold",
              },
              {
                label: "Failed",
                count: allTx.filter((t) => t.status === "FAILED").length,
                color: "text-brand-red-light",
              },
              {
                label: "Reversed",
                count: allTx.filter((t) => t.status === "REVERSED").length,
                color: "text-purple-400",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center"
              >
                <span className="text-sm text-text-muted">{item.label}</span>
                <span className={`text-sm font-semibold ${item.color}`}>
                  {item.count}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
              <span className="text-sm text-text-muted">Total</span>
              <span className="text-sm font-bold text-text-primary">
                {totalCount}
              </span>
            </div>
          </div>
        </ChartCard>
      </CardGrid>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-surface-elevated border border-border-default rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
        >
          <option value="">All Types</option>
          <option value="DEPOSIT">Deposit</option>
          <option value="WITHDRAWAL">Withdrawal</option>
          <option value="JUETENG_BET">Jueteng Bet</option>
          <option value="JUETENG_PAYOUT">Jueteng Payout</option>
          <option value="COMMISSION_PAYOUT">Commission Payout</option>
          <option value="ADJUSTMENT">Adjustment</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface-elevated border border-border-default rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
          <option value="REVERSED">Reversed</option>
        </select>
      </div>

      {/* Transactions DataTable */}
      <DataTable
        title="All Transactions"
        columns={
          [
            {
              key: "type",
              label: "Type",
              sortable: true,
              render: (v: string) => {
                const color =
                  v === "DEPOSIT"
                    ? "text-brand-green bg-brand-green/10"
                    : v === "WITHDRAWAL"
                      ? "text-brand-red bg-brand-red/10"
                      : v === "JUETENG_BET"
                        ? "text-brand-gold bg-brand-gold/10"
                        : v === "JUETENG_PAYOUT"
                          ? "text-brand-blue bg-brand-blue/10"
                          : v === "COMMISSION_PAYOUT"
                            ? "text-purple-400 bg-purple-400/10"
                            : "text-cyan-400 bg-cyan-400/10";
                return (
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${color}`}
                  >
                    {v.replace(/_/g, " ")}
                  </span>
                );
              },
            },
            {
              key: "userName",
              label: "User",
              sortable: true,
            },
            {
              key: "amount",
              label: "Amount",
              align: "right" as const,
              sortable: true,
              render: (v: number) => (
                <span className="font-medium">₱{v.toLocaleString()}</span>
              ),
            },
            {
              key: "reference",
              label: "Reference",
              sortable: true,
              render: (v: string) => (
                <span className="text-xs font-mono text-text-muted">{v}</span>
              ),
            },
            {
              key: "status",
              label: "Status",
              sortable: true,
              render: (v: string) => {
                const statusColor =
                  v === "COMPLETED"
                    ? "text-brand-green bg-brand-green/10"
                    : v === "PENDING"
                      ? "text-brand-gold bg-brand-gold/10"
                      : v === "REVERSED"
                        ? "text-purple-400 bg-purple-400/10"
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
            {
              key: "createdAt",
              label: "Date",
              sortable: true,
              render: (v: string) => new Date(v).toLocaleString(),
            },
          ] satisfies DataTableColumn[]
        }
        data={allTx}
        pageSize={10}
        exportable
        actions={(row: AdminTransaction): MenuAction[] | null =>
          row.status === "PENDING"
            ? [
                {
                  label: "Approve",
                  icon: <CheckCircle size={14} />,
                  variant: "success",
                  disabled: approveMutation.isPending || rejectMutation.isPending,
                  onClick: () => approveMutation.mutate(row.id),
                },
                {
                  label: "Reject",
                  icon: <XCircle size={14} />,
                  variant: "danger",
                  separator: true,
                  disabled: approveMutation.isPending || rejectMutation.isPending,
                  onClick: () =>
                    rejectMutation.mutate({ id: row.id, reason: "Rejected by admin" }),
                },
              ]
            : null
        }
      />
    </div>
  );
}
