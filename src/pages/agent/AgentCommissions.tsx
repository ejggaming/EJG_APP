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

/* ── Commission Types (from BRD) ── */
// COLLECTION — % of total stake collected by cobrador (15%)
// WINNER_BONUS — % of winner payout paid to cabo (5%)
// CAPITALISTA — % of total collections to financier (25%)
// FIXED — Fixed salary for bolador / pagador

type CommissionType = "COLLECTION" | "WINNER_BONUS" | "CAPITALISTA" | "FIXED";
type CommissionStatus = "PENDING" | "PAID" | "CANCELLED";

interface Commission {
  id: string;
  date: string;
  drawTime: string;
  drawType: "MORNING" | "AFTERNOON";
  type: CommissionType;
  baseAmount: number;
  rate: number;
  commission: number;
  status: CommissionStatus;
  territory: string;
}

const MOCK_COMMISSIONS: Commission[] = [
  {
    id: "1",
    date: "Feb 19, 2026",
    drawTime: "11:00 AM",
    drawType: "MORNING",
    type: "COLLECTION",
    baseAmount: 3200,
    rate: 0.15,
    commission: 480,
    status: "PENDING",
    territory: "Brgy. San Antonio",
  },
  {
    id: "2",
    date: "Feb 18, 2026",
    drawTime: "4:00 PM",
    drawType: "AFTERNOON",
    type: "COLLECTION",
    baseAmount: 2800,
    rate: 0.15,
    commission: 420,
    status: "PAID",
    territory: "Brgy. San Antonio",
  },
  {
    id: "3",
    date: "Feb 18, 2026",
    drawTime: "11:00 AM",
    drawType: "MORNING",
    type: "COLLECTION",
    baseAmount: 4100,
    rate: 0.15,
    commission: 615,
    status: "PAID",
    territory: "Brgy. San Antonio",
  },
  {
    id: "4",
    date: "Feb 17, 2026",
    drawTime: "4:00 PM",
    drawType: "AFTERNOON",
    type: "COLLECTION",
    baseAmount: 1950,
    rate: 0.15,
    commission: 292.5,
    status: "PAID",
    territory: "Brgy. San Antonio",
  },
  {
    id: "5",
    date: "Feb 17, 2026",
    drawTime: "11:00 AM",
    drawType: "MORNING",
    type: "COLLECTION",
    baseAmount: 3600,
    rate: 0.15,
    commission: 540,
    status: "PAID",
    territory: "Brgy. San Antonio",
  },
  {
    id: "6",
    date: "Feb 16, 2026",
    drawTime: "4:00 PM",
    drawType: "AFTERNOON",
    type: "COLLECTION",
    baseAmount: 2200,
    rate: 0.15,
    commission: 330,
    status: "PAID",
    territory: "Brgy. San Antonio",
  },
  {
    id: "7",
    date: "Feb 16, 2026",
    drawTime: "11:00 AM",
    drawType: "MORNING",
    type: "COLLECTION",
    baseAmount: 1800,
    rate: 0.15,
    commission: 270,
    status: "PAID",
    territory: "Brgy. San Antonio",
  },
];

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

export default function AgentCommissions() {
  const totalCommission = MOCK_COMMISSIONS.reduce(
    (a, c) => a + c.commission,
    0,
  );
  const totalCollected = MOCK_COMMISSIONS.reduce((a, c) => a + c.baseAmount, 0);
  const pendingCount = MOCK_COMMISSIONS.filter(
    (c) => c.status === "PENDING",
  ).length;
  const paidCount = MOCK_COMMISSIONS.filter((c) => c.status === "PAID").length;

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
            Brgy. San Antonio, Tondo · Your earnings from bet collections
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
          label="Total Commission"
          value={formatCurrency(totalCommission)}
          icon={<TrendingUp size={20} />}
          color="green"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          label="Base Collected"
          value={formatCurrency(totalCollected)}
          icon={<Wallet size={20} />}
          color="orange"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          label="Commission Rate"
          value="15%"
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
            { key: "date", label: "Date", sortable: true },
            {
              key: "drawTime",
              label: "Draw",
              sortable: true,
              render: (v: string, row: Commission) => (
                <div>
                  <span className="font-medium">{v}</span>
                  <span className="text-[10px] text-text-muted ml-1">
                    {row.drawType}
                  </span>
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
              key: "commission",
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
        data={MOCK_COMMISSIONS}
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
