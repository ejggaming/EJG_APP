import { CardGrid, StatCard, DataTable } from "../../components/bento";
import type { DataTableColumn, MenuAction } from "../../components/bento";
import {
  Users,
  UserPlus,
  Banknote,
  Edit2,
  Ban,
  CheckCircle,
  Clock,
} from "lucide-react";
import { formatCurrency } from "../../utils";
import toast from "react-hot-toast";

interface AgentRow {
  id: string;
  name: string;
  mobile: string;
  role: string;
  tier: string;
  territory: string;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE" | "PENDING";
  commissionRate: number;
  totalCollected: number;
  collectionTarget: number;
  totalCommission: number;
  customers: number;
  activeCustomers: number;
  joined: string;
}

const MOCK_AGENTS: AgentRow[] = [
  {
    id: "1",
    name: "Ricardo Dalisay",
    mobile: "09171112233",
    role: "COBRADOR",
    tier: "Gold",
    territory: "Tondo, Manila",
    status: "ACTIVE",
    commissionRate: 0.15,
    totalCollected: 125000,
    collectionTarget: 150000,
    totalCommission: 18750,
    customers: 45,
    activeCustomers: 38,
    joined: "Oct 2025",
  },
  {
    id: "2",
    name: "Lorna Tolentino",
    mobile: "09182223344",
    role: "COBRADOR",
    tier: "Silver",
    territory: "Quiapo, Manila",
    status: "ACTIVE",
    commissionRate: 0.15,
    totalCollected: 98000,
    collectionTarget: 120000,
    totalCommission: 14700,
    customers: 32,
    activeCustomers: 25,
    joined: "Nov 2025",
  },
  {
    id: "3",
    name: "Bong Revilla",
    mobile: "09193334455",
    role: "CABO",
    tier: "Gold",
    territory: "Manila District",
    status: "ACTIVE",
    commissionRate: 0.05,
    totalCollected: 450000,
    collectionTarget: 500000,
    totalCommission: 22500,
    customers: 0,
    activeCustomers: 0,
    joined: "Sep 2025",
  },
  {
    id: "4",
    name: "Manny Villar",
    mobile: "09204445566",
    role: "CAPITALISTA",
    tier: "Platinum",
    territory: "NCR",
    status: "ACTIVE",
    commissionRate: 0.25,
    totalCollected: 1200000,
    collectionTarget: 1000000,
    totalCommission: 300000,
    customers: 0,
    activeCustomers: 0,
    joined: "Aug 2025",
  },
  {
    id: "5",
    name: "Jun Arroyo",
    mobile: "09215556677",
    role: "COBRADOR",
    tier: "Bronze",
    territory: "Sampaloc, Manila",
    status: "SUSPENDED",
    commissionRate: 0.15,
    totalCollected: 45000,
    collectionTarget: 100000,
    totalCommission: 6750,
    customers: 18,
    activeCustomers: 8,
    joined: "Dec 2025",
  },
  {
    id: "6",
    name: "Nora Aunor",
    mobile: "09226667788",
    role: "PAGADOR",
    tier: "Silver",
    territory: "Tondo, Manila",
    status: "ACTIVE",
    commissionRate: 0.0,
    totalCollected: 0,
    collectionTarget: 0,
    totalCommission: 0,
    customers: 0,
    activeCustomers: 0,
    joined: "Jan 2026",
  },
  {
    id: "7",
    name: "Danny Reyes",
    mobile: "09237778899",
    role: "BOLADOR",
    tier: "Silver",
    territory: "Quezon City",
    status: "ACTIVE",
    commissionRate: 0.02,
    totalCollected: 280000,
    collectionTarget: 300000,
    totalCommission: 5600,
    customers: 0,
    activeCustomers: 0,
    joined: "Nov 2025",
  },
  {
    id: "8",
    name: "Teresa Aquino",
    mobile: "09248889900",
    role: "COBRADOR",
    tier: "Bronze",
    territory: "Pasig City",
    status: "PENDING",
    commissionRate: 0.15,
    totalCollected: 0,
    collectionTarget: 50000,
    totalCommission: 0,
    customers: 0,
    activeCustomers: 0,
    joined: "Feb 2026",
  },
  {
    id: "9",
    name: "Ramon Santos",
    mobile: "09259990011",
    role: "OPERATOR",
    tier: "Platinum",
    territory: "Metro Manila",
    status: "ACTIVE",
    commissionRate: 0.3,
    totalCollected: 3500000,
    collectionTarget: 3000000,
    totalCommission: 1050000,
    customers: 0,
    activeCustomers: 0,
    joined: "Jul 2025",
  },
];

export default function AgentManagement() {
  const activeAgents = MOCK_AGENTS.filter((a) => a.status === "ACTIVE").length;
  const pendingApproval = MOCK_AGENTS.filter(
    (a) => a.status === "PENDING",
  ).length;
  const totalComm = MOCK_AGENTS.reduce((a, c) => a + c.totalCommission, 0);
  const totalAgents = MOCK_AGENTS.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Agent Management
          </h1>
          <p className="text-text-muted mt-1">
            {totalAgents} agents registered · {pendingApproval} pending approval
          </p>
        </div>
        <button className="bg-brand-red text-white px-4 py-2 rounded-xl font-medium hover:bg-brand-red-dark flex items-center gap-2 transition-colors">
          <UserPlus size={18} />
          Register Agent
        </button>
      </div>

      {/* Agent Summary */}
      <CardGrid>
        <StatCard
          label="Total Agents"
          value={totalAgents}
          icon={<Users size={18} />}
          color="blue"
        />
        <StatCard
          label="Active"
          value={activeAgents}
          icon={<CheckCircle size={18} />}
          color="green"
        />
        <StatCard
          label="Pending Approval"
          value={pendingApproval}
          icon={<Clock size={18} />}
          color="orange"
        />
        <StatCard
          label="Total Commissions"
          value={formatCurrency(totalComm)}
          icon={<Banknote size={18} />}
          color="purple"
        />
      </CardGrid>

      {/* Agent DataTable */}
      <DataTable
        title="All Agents"
        columns={
          [
            {
              key: "name",
              label: "Agent",
              sortable: true,
              render: (_: unknown, row: AgentRow) => (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold text-xs font-bold">
                    {row.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {row.name}
                    </p>
                    <p className="text-[10px] text-text-muted">{row.mobile}</p>
                  </div>
                </div>
              ),
            },
            {
              key: "role",
              label: "Role",
              sortable: true,
              render: (v: string) => {
                const color =
                  v === "COBRADOR"
                    ? "text-brand-gold bg-brand-gold/10"
                    : v === "CABO"
                      ? "text-brand-blue bg-brand-blue/10"
                      : v === "CAPITALISTA"
                        ? "text-brand-green bg-brand-green/10"
                        : v === "BOLADOR"
                          ? "text-purple-400 bg-purple-400/10"
                          : v === "OPERATOR"
                            ? "text-cyan-400 bg-cyan-400/10"
                            : "text-brand-red bg-brand-red/10";
                return (
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${color}`}
                  >
                    {v}
                  </span>
                );
              },
            },
            {
              key: "tier",
              label: "Tier",
              sortable: true,
              render: (v: string) => {
                const color =
                  v === "Platinum"
                    ? "text-cyan-400 bg-cyan-400/10"
                    : v === "Gold"
                      ? "text-brand-gold bg-brand-gold/10"
                      : v === "Silver"
                        ? "text-gray-400 bg-gray-400/10"
                        : "text-amber-700 bg-amber-700/10";
                return (
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${color}`}
                  >
                    {v}
                  </span>
                );
              },
            },
            { key: "territory", label: "Territory", sortable: true },
            {
              key: "status",
              label: "Status",
              sortable: true,
              render: (v: string) => {
                const color =
                  v === "ACTIVE"
                    ? "text-brand-green bg-brand-green/10"
                    : v === "SUSPENDED"
                      ? "text-brand-red bg-brand-red/10"
                      : v === "PENDING"
                        ? "text-brand-gold bg-brand-gold/10"
                        : "text-text-muted bg-white/5";
                return (
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${color}`}
                  >
                    {v}
                  </span>
                );
              },
            },
            {
              key: "commissionRate",
              label: "Comm. Rate",
              align: "right" as const,
              sortable: true,
              render: (v: number) => `${(v * 100).toFixed(0)}%`,
            },
            {
              key: "totalCollected",
              label: "Collected",
              align: "right" as const,
              sortable: true,
              render: (_: number, row: AgentRow) => {
                const pct =
                  row.collectionTarget > 0
                    ? Math.round(
                        (row.totalCollected / row.collectionTarget) * 100,
                      )
                    : 0;
                return (
                  <div>
                    <span className="text-brand-gold font-medium">
                      {formatCurrency(row.totalCollected)}
                    </span>
                    {row.collectionTarget > 0 && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className="inline-block w-10 h-1.5 rounded-full overflow-hidden"
                          style={{ background: "var(--glass-divider)" }}
                        >
                          <span
                            className={`block h-full rounded-full ${pct >= 100 ? "bg-brand-green" : pct >= 75 ? "bg-brand-gold" : "bg-brand-red"}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </span>
                        <span className="text-[9px] text-text-muted">
                          {pct}%
                        </span>
                      </div>
                    )}
                  </div>
                );
              },
            },
            {
              key: "totalCommission",
              label: "Commission",
              align: "right" as const,
              sortable: true,
              render: (v: number) => (
                <span className="text-brand-green font-medium">
                  {formatCurrency(v)}
                </span>
              ),
            },
            {
              key: "customers",
              label: "Customers",
              align: "right" as const,
              sortable: true,
              render: (_: number, row: AgentRow) => (
                <span>
                  <span className="text-brand-green font-medium">
                    {row.activeCustomers}
                  </span>
                  <span className="text-text-muted">/{row.customers}</span>
                </span>
              ),
            },
            { key: "joined", label: "Joined", sortable: true },
          ] satisfies DataTableColumn[]
        }
        data={MOCK_AGENTS}
        pageSize={10}
        exportable
        actions={(row: AgentRow): MenuAction[] => [
          {
            label: "Edit",
            icon: <Edit2 size={14} />,
            variant: "default",
            onClick: () => toast.success("Details opened"),
          },
          row.status === "ACTIVE"
            ? {
                label: "Suspend",
                icon: <Ban size={14} />,
                variant: "danger",
                separator: true,
                onClick: () => toast.success("Agent suspended"),
              }
            : {
                label: "Activate",
                icon: <CheckCircle size={14} />,
                variant: "success",
                separator: true,
                onClick: () => toast.success("Agent activated"),
              },
        ]}
      />
    </div>
  );
}
