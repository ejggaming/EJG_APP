import { CardGrid, StatCard, DataTable } from "../../components/bento";
import type { DataTableColumn } from "../../components/bento";
import { formatCurrency } from "../../utils";
import {
  TrendingUp,
  Wallet,
  Percent,
  Clock,
  Download,
  MapPin,
} from "lucide-react";
import { AgentCommissionsSkeleton } from "../../components/ChineseSkeleton";
import { useMyCommissionsQuery, useCommissionSummaryQuery } from "../../hooks/useCommission";
import type { Commission } from "../../services/commissionService";

const statusColors: Record<string, string> = {
  PAID: "bg-brand-green/20 text-brand-green",
  PENDING: "bg-brand-gold/20 text-brand-gold",
  CANCELLED: "bg-brand-red/20 text-brand-red",
};

const typeColors: Record<string, string> = {
  COLLECTION: "bg-blue-500/20 text-blue-400",
  WINNER_BONUS: "bg-purple-500/20 text-purple-400",
  CAPITALISTA: "bg-brand-gold/20 text-brand-gold",
  FIXED: "bg-gray-500/20 text-gray-400",
};

function drawTimeLabel(drawType?: string): string {
  if (drawType === "MORNING") return "11:00 AM";
  if (drawType === "AFTERNOON") return "4:00 PM";
  if (drawType === "EVENING") return "9:00 PM";
  return "—";
}

export default function AgentCommissions() {
  const { data: commissions = [], isLoading } = useMyCommissionsQuery();
  const { data: summary } = useCommissionSummaryQuery();

  const pendingCount = commissions.filter((c) => c.status === "PENDING").length;
  const paidCount = commissions.filter((c) => c.status === "PAID").length;

  if (isLoading) return <AgentCommissionsSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Commission Reports
          </h1>
          <p className="text-text-muted mt-1 flex items-center gap-1">
            <MapPin size={12} />
            Your earnings from bet collections
          </p>
        </div>
        <button className="bg-brand-gold text-white px-4 py-2 rounded-xl font-medium hover:bg-brand-gold/80 flex items-center gap-2 transition-colors">
          <Download size={18} />
          Export
        </button>
      </div>

      {/* Summary Stats */}
      <CardGrid>
        <StatCard
          label="Total Earned"
          value={formatCurrency(summary?.totalEarned ?? 0)}
          icon={<TrendingUp size={20} />}
          color="green"
        />
        <StatCard
          label="This Month"
          value={formatCurrency(summary?.thisMonth ?? 0)}
          icon={<Wallet size={20} />}
          color="orange"
        />
        <StatCard
          label="Paid"
          value={formatCurrency(summary?.paid ?? 0)}
          icon={<Percent size={20} />}
          color="blue"
        />
        <StatCard
          label="Pending"
          value={pendingCount}
          icon={<Clock size={20} />}
          color="purple"
        />
      </CardGrid>

      {/* Commission DataTable */}
      <DataTable
          title="Commission History"
          columns={
            [
              {
                key: "createdAt",
                label: "Date",
                sortable: true,
                render: (v: string) =>
                  new Date(v).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }),
              },
              {
                key: "draw",
                label: "Draw",
                sortable: false,
                render: (_v: unknown, row: Commission) => (
                  <div>
                    <span className="font-medium">
                      {row.draw ? drawTimeLabel(row.draw.drawType) : "—"}
                    </span>
                    {row.draw && (
                      <span className="text-[10px] text-text-muted ml-1">
                        {new Date(row.draw.drawDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                ),
              },
              {
                key: "type",
                label: "Type",
                sortable: true,
                render: (v: string) => (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${typeColors[v] ?? ""}`}
                  >
                    {v.replace("_", " ")}
                  </span>
                ),
              },
              {
                key: "baseAmount",
                label: "Base Amount",
                align: "right" as const,
                sortable: true,
                render: (v: number) => (
                  <span className="text-text-secondary">{formatCurrency(v)}</span>
                ),
              },
              {
                key: "rate",
                label: "Rate",
                align: "right" as const,
                sortable: false,
                searchable: false,
                render: (v: number) => (
                  <span className="text-text-muted">{(v * 100).toFixed(0)}%</span>
                ),
              },
              {
                key: "amount",
                label: "Commission",
                align: "right" as const,
                sortable: true,
                render: (v: number) => (
                  <span className="font-bold text-brand-green">
                    {formatCurrency(v)}
                  </span>
                ),
              },
              {
                key: "status",
                label: "Status",
                sortable: true,
                render: (v: string) => (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[v] ?? ""}`}
                  >
                    {v}
                  </span>
                ),
              },
            ] satisfies DataTableColumn[]
          }
          data={commissions}
          pageSize={10}
          exportable
        />

      {/* Pending note */}
      {pendingCount > 0 && (
        <div className="card-3d p-4 text-center border border-brand-gold/20">
          <p className="text-sm text-brand-gold">
            {pendingCount} pending commission{pendingCount > 1 ? "s" : ""} will
            be credited after draw settlement · {paidCount} already paid
          </p>
        </div>
      )}
    </div>
  );
}
