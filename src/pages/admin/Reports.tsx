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
import Spinner from "../../components/Spinner";
import { Button } from "../../components";
import toast from "react-hot-toast";

type TimeRange = "daily" | "weekly" | "monthly";

export default function Reports() {
  const [range, setRange] = useState<TimeRange>("daily");

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ["admin-reports", range],
    queryFn: async () => {
      const rangeData = {
        daily: {
          bets: 487,
          revenue: 162350,
          payouts: 48200,
          net: 114150,
          govShare: 48705,
        },
        weekly: {
          bets: 3210,
          revenue: 1024500,
          payouts: 302800,
          net: 721700,
          govShare: 307350,
        },
        monthly: {
          bets: 12840,
          revenue: 4098000,
          payouts: 1211200,
          net: 2886800,
          govShare: 1229400,
        },
      };

      return {
        ...rangeData[range],
        profitMargin:
          range === "daily" ? 70.3 : range === "weekly" ? 70.5 : 70.4,
        avgBetAmount: range === "daily" ? 333 : range === "weekly" ? 319 : 319,
        peakHour: "11:00 AM",
        regionalData: [
          {
            region: "NCR",
            bets: 145,
            revenue: 52000,
            agents: 12,
            payout: 15600,
            net: 36400,
            growth: "+12%",
          },
          {
            region: "Region III",
            bets: 98,
            revenue: 31200,
            agents: 8,
            payout: 9360,
            net: 21840,
            growth: "+8%",
          },
          {
            region: "Region IV-A",
            bets: 72,
            revenue: 24800,
            agents: 6,
            payout: 7440,
            net: 17360,
            growth: "+15%",
          },
          {
            region: "Region VII",
            bets: 65,
            revenue: 22100,
            agents: 5,
            payout: 6630,
            net: 15470,
            growth: "+5%",
          },
          {
            region: "Region XI",
            bets: 56,
            revenue: 18400,
            agents: 4,
            payout: 5520,
            net: 12880,
            growth: "+18%",
          },
        ],
        topAgents: [
          {
            id: 1,
            rank: 1,
            name: "Ricardo Dalisay",
            role: "COBRADOR",
            collections: 42000,
            commission: 6300,
            customers: 45,
            winRate: "12%",
          },
          {
            id: 2,
            rank: 2,
            name: "Juan Torres",
            role: "COBRADOR",
            collections: 38500,
            commission: 5775,
            customers: 38,
            winRate: "10%",
          },
          {
            id: 3,
            rank: 3,
            name: "Maria dela Cruz",
            role: "CABO",
            collections: 95000,
            commission: 9500,
            customers: 120,
            winRate: "8%",
          },
          {
            id: 4,
            rank: 4,
            name: "Pedro Manalo",
            role: "COBRADOR",
            collections: 31000,
            commission: 4650,
            customers: 28,
            winRate: "14%",
          },
        ],
        drawReports: [
          {
            id: 1,
            draw: "11:00 AM - Feb 19",
            bets: 1245,
            stake: 62250,
            payout: 21000,
            winners: 3,
            margin: "66.3%",
          },
          {
            id: 2,
            draw: "4:00 PM - Feb 18",
            bets: 1120,
            stake: 56000,
            payout: 14000,
            winners: 2,
            margin: "75.0%",
          },
          {
            id: 3,
            draw: "9:00 PM - Feb 18",
            bets: 980,
            stake: 49000,
            payout: 7000,
            winners: 1,
            margin: "85.7%",
          },
          {
            id: 4,
            draw: "11:00 AM - Feb 18",
            bets: 1580,
            stake: 79000,
            payout: 35000,
            winners: 5,
            margin: "55.7%",
          },
        ],
        complianceLogs: [
          {
            id: 1,
            event: "Daily PCSO Report Generated",
            user: "System",
            timestamp: "Feb 19, 2026 12:00 AM",
            type: "Auto",
          },
          {
            id: 2,
            event: "Suspicious Bet Flagged - Bet #4521",
            user: "System",
            timestamp: "Feb 19, 2026 10:30 AM",
            type: "Alert",
          },
          {
            id: 3,
            event: "KYC Override Approved",
            user: "Admin Maria",
            timestamp: "Feb 19, 2026 9:15 AM",
            type: "Manual",
          },
          {
            id: 4,
            event: "Draw Result Audit Passed",
            user: "Admin Juan",
            timestamp: "Feb 18, 2026 11:30 PM",
            type: "Audit",
          },
          {
            id: 5,
            event: "Agent Commission Reconciled",
            user: "System",
            timestamp: "Feb 18, 2026 11:59 PM",
            type: "Auto",
          },
        ],
      };
    },
  });

  if (isLoading) return <Spinner />;

  const data = reportsData;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Reports</h1>
          <p className="text-text-muted mt-1">
            Revenue, bets, compliance, and performance analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="green"
            onClick={() => toast.success("PCSO report exported")}
          >
            <Download size={14} className="mr-1" />
            PCSO Export
          </Button>
          <Button size="sm" onClick={() => toast.success("CSV exported")}>
            <FileText size={14} className="mr-1" />
            CSV
          </Button>
          <div className="flex card-3d overflow-hidden !p-0">
            {(["daily", "weekly", "monthly"] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  range === r
                    ? "bg-brand-red text-white"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
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
        <ChartCard title="Revenue Trend" subtitle={`Last ${range}`}>
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
            {
              key: "bets",
              label: "Bets",
              align: "right" as const,
              sortable: true,
            },
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
                <span className="text-brand-red-light">
                  -₱{v.toLocaleString()}
                </span>
              ),
            },
            {
              key: "net",
              label: "Net",
              align: "right" as const,
              sortable: true,
              render: (v: number) => (
                <span className="text-brand-green font-medium">
                  ₱{v.toLocaleString()}
                </span>
              ),
            },
            {
              key: "agents",
              label: "Agents",
              align: "right" as const,
              sortable: true,
            },
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
                <span className="font-semibold text-brand-gold-light">
                  ₱{v.toLocaleString()}
                </span>
              ),
            },
            {
              key: "commission",
              label: "Commission",
              align: "right" as const,
              sortable: true,
              render: (v: number) => (
                <span className="text-brand-green-light">
                  +₱{v.toLocaleString()}
                </span>
              ),
            },
            {
              key: "customers",
              label: "Customers",
              align: "right" as const,
              sortable: true,
            },
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
            {
              key: "bets",
              label: "Bets",
              align: "right" as const,
              sortable: true,
            },
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
                <span className="text-brand-red-light">
                  -₱{v.toLocaleString()}
                </span>
              ),
            },
            {
              key: "winners",
              label: "Winners",
              align: "right" as const,
              sortable: true,
            },
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
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${color}`}
                  >
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
            <span className="text-text-muted">Gross Revenue ({range})</span>
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
            <span className="text-text-muted">Government Share (30%)</span>
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
