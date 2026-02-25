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
  BarChart3,
  TrendingUp,
  Percent,
  Download,
  FileText,
  Shield,
} from "lucide-react";
import { ReportsSkeleton } from "../../components/ChineseSkeleton";
import { Button } from "../../components";
import toast from "react-hot-toast";
import {
  DateRangeFilter,
  getInitialDateRange,
  dateRangeLabel,
} from "../../components/DateRangeFilter";
import type { DateRange } from "../../components/DateRangeFilter";
import apiClient from "../../services/apiClient";

export default function Reports() {
  const [dateRange, setDateRange] = useState<DateRange>(
    getInitialDateRange("today"),
  );

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ["admin-reports", dateRange.from, dateRange.to],
    queryFn: async () => {
      const res = await apiClient.get("/reports/summary", {
        params: { from: dateRange.from, to: dateRange.to },
      });
      return res.data.data as {
        bets: number;
        revenue: number;
        payouts: number;
        net: number;
        profitMargin: number;
        govShare: number;
        govRate: number;
        avgBetAmount: number;
        totalDeposits: number;
        totalWithdrawals: number;
        totalUsers: number;
        totalCommissions: number;
        drawReports: { id: string; draw: string; bets: number; stake: number; payout: number; winners: number; margin: string }[];
        regionalData: Record<string, any>[];
        topAgents: Record<string, any>[];
        complianceLogs: { id: string; type: string; event: string; user: string; timestamp: string; severity?: string; amount?: number }[];
      };
    },
  });

  if (isLoading) return <ReportsSkeleton />;

  const data = reportsData;
  const rangeLabel = dateRangeLabel(dateRange);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Reports</h1>
          <p className="text-text-muted mt-1">
            Revenue, bets, compliance, and performance analytics
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Button
            size="sm"
            variant="green"
            onClick={async () => {
              try {
                const params = new URLSearchParams();
                if (dateRange.from) params.set("from", dateRange.from);
                if (dateRange.to) params.set("to", dateRange.to);
                const res = await apiClient.get(`/reports/export/pcso?${params}`, { responseType: "blob" });
                const url = URL.createObjectURL(new Blob([res.data], { type: "text/csv" }));
                const a = document.createElement("a");
                a.href = url;
                a.download = `pcso-report-${new Date().toISOString().split("T")[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success("PCSO report downloaded");
              } catch {
                toast.error("Failed to export PCSO report");
              }
            }}
          >
            <Download size={14} className="mr-1" />
            PCSO Export
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (!reportsData?.drawReports?.length) {
                toast.error("No draw data to export");
                return;
              }
              const header = "Draw,Bets,Total Stake,Payout,Margin";
              const rows = reportsData.drawReports.map(
                (d) => `"${d.draw}",${d.bets},${d.stake},${d.payout},"${d.margin}"`
              );
              const csv = [header, ...rows].join("\r\n");
              const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
              const a = document.createElement("a");
              a.href = url;
              a.download = `draw-reports-${new Date().toISOString().split("T")[0]}.csv`;
              a.click();
              URL.revokeObjectURL(url);
              toast.success("CSV exported");
            }}
          >
            <FileText size={14} className="mr-1" />
            CSV
          </Button>
        </div>
      </div>

      {/* ── Date Range Filter ── */}
      <div className="bg-surface-card border border-border-default rounded-2xl px-4 py-3">
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      {/* Revenue Summary */}
      <CardGrid columns={6}>
        <StatCard
          label="Total Bets"
          value={(data?.bets ?? 0).toLocaleString()}
          icon={<BarChart3 size={18} />}
          color="blue"
        />
        <StatCard
          label="Gross Revenue"
          value={`₱${(data?.revenue ?? 0).toLocaleString()}`}
          icon={<TrendingUp size={18} />}
          color="purple"
        />
        <StatCard
          label="Total Payouts"
          value={`₱${(data?.payouts ?? 0).toLocaleString()}`}
          icon={<Percent size={18} />}
          color="red"
        />
        <StatCard
          label="Net Revenue"
          value={`₱${(data?.net ?? 0).toLocaleString()}`}
          icon={<TrendingUp size={18} />}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          label="Profit Margin"
          value={`${data?.profitMargin ?? 0}%`}
          icon={<Percent size={18} />}
          color="green"
        />
        <StatCard
          label="Gov't Share"
          value={`₱${(data?.govShare ?? 0).toLocaleString()}`}
          icon={<Shield size={18} />}
          color="purple"
        />
      </CardGrid>

      {/* Charts */}
      <CardGrid columns={2}>
        <ChartCard title="Revenue Trend" subtitle={rangeLabel}>
          <div className="h-full flex items-center justify-center text-text-muted">
            Revenue chart
          </div>
        </ChartCard>

        <ChartCard title="Regional Distribution" subtitle="By region">
          <div className="h-full flex items-center justify-center text-text-muted">
            Regional chart
          </div>
        </ChartCard>
      </CardGrid>

      {/* Regional Performance DataTable */}
      <DataTable
        title="Regional Performance"
        columns={
          [
            { key: "region", label: "Region", sortable: true },
            { key: "bets", label: "Bets", align: "right" as const, sortable: true },
            {
              key: "revenue",
              label: "Revenue",
              align: "right" as const,
              sortable: true,
              render: (v: number) => `₱${v.toLocaleString()}`,
            },
            {
              key: "payout",
              label: "Payout",
              align: "right" as const,
              sortable: true,
              render: (v: number) => (
                <span className="text-brand-red-light">-₱{v.toLocaleString()}</span>
              ),
            },
            {
              key: "net",
              label: "Net",
              align: "right" as const,
              sortable: true,
              render: (v: number) => (
                <span className="text-brand-green font-medium">₱{v.toLocaleString()}</span>
              ),
            },
            { key: "agents", label: "Agents", align: "right" as const, sortable: true },
            {
              key: "growth",
              label: "Growth",
              align: "right" as const,
              sortable: true,
              render: (v: string) => (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full text-brand-green bg-brand-green/10">
                  {v}
                </span>
              ),
            },
          ] satisfies DataTableColumn[]
        }
        data={reportsData?.regionalData || []}
        pageSize={10}
        exportable
      />

      {/* Top Performing Agents DataTable */}
      <DataTable
        title="Top Performing Agents"
        columns={
          [
            {
              key: "rank",
              label: "#",
              sortable: true,
              searchable: false,
              render: (v: number) => (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-brand-gold/10 text-brand-gold-light text-xs font-bold">
                  {v}
                </span>
              ),
            },
            { key: "name", label: "Agent", sortable: true },
            {
              key: "role",
              label: "Role",
              sortable: true,
              render: (v: string) => (
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-surface-elevated text-text-secondary"
                  style={{ border: "1px solid var(--glass-divider)" }}
                >
                  {v}
                </span>
              ),
            },
            {
              key: "collections",
              label: "Collections",
              align: "right" as const,
              sortable: true,
              render: (v: number) => (
                <span className="font-semibold text-brand-gold-light">₱{v.toLocaleString()}</span>
              ),
            },
            {
              key: "commission",
              label: "Commission",
              align: "right" as const,
              sortable: true,
              render: (v: number) => (
                <span className="text-brand-green-light">+₱{v.toLocaleString()}</span>
              ),
            },
            { key: "customers", label: "Customers", align: "right" as const, sortable: true },
            {
              key: "winRate",
              label: "Win Rate",
              align: "right" as const,
              sortable: true,
              render: (v: string) => (
                <span className="text-brand-blue font-medium">{v}</span>
              ),
            },
          ] satisfies DataTableColumn[]
        }
        data={reportsData?.topAgents || []}
        pageSize={10}
        exportable
      />

      {/* Draw-Level Reports */}
      <DataTable
        title="Draw Performance Reports"
        columns={
          [
            { key: "draw", label: "Draw", sortable: true },
            { key: "bets", label: "Bets", align: "right" as const, sortable: true },
            {
              key: "stake",
              label: "Total Stake",
              align: "right" as const,
              sortable: true,
              render: (v: number) => `₱${v.toLocaleString()}`,
            },
            {
              key: "payout",
              label: "Payout",
              align: "right" as const,
              sortable: true,
              render: (v: number) => (
                <span className="text-brand-red-light">-₱{v.toLocaleString()}</span>
              ),
            },
            { key: "winners", label: "Winners", align: "right" as const, sortable: true },
            {
              key: "margin",
              label: "Margin",
              align: "right" as const,
              sortable: true,
              render: (v: string) => (
                <span className="text-brand-green font-medium">{v}</span>
              ),
            },
          ] satisfies DataTableColumn[]
        }
        data={reportsData?.drawReports || []}
        pageSize={10}
        exportable
      />

      {/* Compliance & Audit Trail */}
      <DataTable
        title="Compliance & Audit Trail"
        columns={
          [
            {
              key: "type",
              label: "Type",
              sortable: true,
              render: (v: string) => {
                const color =
                  v === "Auto"
                    ? "text-brand-blue bg-brand-blue/10"
                    : v === "Alert"
                      ? "text-brand-red bg-brand-red/10"
                      : v === "Audit"
                        ? "text-brand-green bg-brand-green/10"
                        : "text-brand-gold bg-brand-gold/10";
                return (
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${color}`}>
                    {v}
                  </span>
                );
              },
            },
            { key: "event", label: "Event", sortable: true },
            { key: "user", label: "Performed By", sortable: true },
            { key: "timestamp", label: "Timestamp", sortable: true },
          ] satisfies DataTableColumn[]
        }
        data={reportsData?.complianceLogs || []}
        pageSize={10}
        exportable
      />

      {/* Government Share Report */}
      <div className="card-3d p-5">
        <h2 className="text-lg font-bold text-text-primary mb-4">
          Government Share Report
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Gross Revenue ({rangeLabel})</span>
            <span className="text-text-primary font-medium">
              ₱{(data?.revenue ?? 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Less: Payouts</span>
            <span className="text-brand-red-light font-medium">
              -₱{(data?.payouts ?? 0).toLocaleString()}
            </span>
          </div>
          <div className="border-t border-border-subtle pt-3 flex justify-between text-sm">
            <span className="text-text-muted">Net Revenue</span>
            <span className="text-brand-green-light font-medium">
              ₱{(data?.net ?? 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Government Share ({data?.govRate ?? 30}%)</span>
            <span className="text-text-primary font-bold">
              ₱{(data?.govShare ?? 0).toLocaleString()}
            </span>
          </div>
          <div className="border-t border-border-subtle pt-3 flex justify-between text-sm">
            <span className="text-text-muted">Operator Retained</span>
            <span className="text-brand-gold-light font-bold">
              ₱{((data?.net ?? 0) - (data?.govShare ?? 0)).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
