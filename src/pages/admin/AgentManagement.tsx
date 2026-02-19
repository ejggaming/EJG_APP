import { useState } from "react";
import { Card, Badge, Button, Input } from "../../components";
import { formatCurrency } from "../../utils";
import toast from "react-hot-toast";

interface AgentRow {
  id: string;
  name: string;
  mobile: string;
  role: string;
  territory: string;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  commissionRate: number;
  totalCollected: number;
  totalCommission: number;
  customers: number;
  joined: string;
}

const MOCK_AGENTS: AgentRow[] = [
  {
    id: "1",
    name: "Ricardo Dalisay",
    mobile: "09171112233",
    role: "COBRADOR",
    territory: "Tondo, Manila",
    status: "ACTIVE",
    commissionRate: 0.15,
    totalCollected: 125000,
    totalCommission: 18750,
    customers: 45,
    joined: "Oct 2025",
  },
  {
    id: "2",
    name: "Lorna Tolentino",
    mobile: "09182223344",
    role: "COBRADOR",
    territory: "Quiapo, Manila",
    status: "ACTIVE",
    commissionRate: 0.15,
    totalCollected: 98000,
    totalCommission: 14700,
    customers: 32,
    joined: "Nov 2025",
  },
  {
    id: "3",
    name: "Bong Revilla",
    mobile: "09193334455",
    role: "CABO",
    territory: "Manila District",
    status: "ACTIVE",
    commissionRate: 0.05,
    totalCollected: 450000,
    totalCommission: 22500,
    customers: 0,
    joined: "Sep 2025",
  },
  {
    id: "4",
    name: "Manny Villar",
    mobile: "09204445566",
    role: "CAPITALISTA",
    territory: "NCR",
    status: "ACTIVE",
    commissionRate: 0.25,
    totalCollected: 1200000,
    totalCommission: 300000,
    customers: 0,
    joined: "Aug 2025",
  },
  {
    id: "5",
    name: "Jun Arroyo",
    mobile: "09215556677",
    role: "COBRADOR",
    territory: "Sampaloc, Manila",
    status: "SUSPENDED",
    commissionRate: 0.15,
    totalCollected: 45000,
    totalCommission: 6750,
    customers: 18,
    joined: "Dec 2025",
  },
  {
    id: "6",
    name: "Nora Aunor",
    mobile: "09226667788",
    role: "PAGADOR",
    territory: "Tondo, Manila",
    status: "ACTIVE",
    commissionRate: 0.0,
    totalCollected: 0,
    totalCommission: 0,
    customers: 0,
    joined: "Jan 2026",
  },
];

const roleBadge: Record<
  string,
  { variant: "red" | "gold" | "green" | "blue" | "gray" }
> = {
  COBRADOR: { variant: "gold" },
  CABO: { variant: "blue" },
  CAPITALISTA: { variant: "green" },
  PAGADOR: { variant: "red" },
  BOLADOR: { variant: "gray" },
  OPERATOR: { variant: "gray" },
};

const statusBadge = {
  ACTIVE: { variant: "green" as const, label: "Active" },
  SUSPENDED: { variant: "red" as const, label: "Suspended" },
  INACTIVE: { variant: "gray" as const, label: "Inactive" },
};

export default function AgentManagement() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_AGENTS.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.mobile.includes(search),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Agent Management
          </h1>
          <p className="text-text-muted text-sm">
            {MOCK_AGENTS.length} agents registered
          </p>
        </div>
        <Button variant="gold" size="sm">
          + Register Agent
        </Button>
      </div>

      <Input
        label=""
        placeholder="Search agents..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <p className="text-xl font-bold text-text-primary">
            {MOCK_AGENTS.filter((a) => a.role === "COBRADOR").length}
          </p>
          <p className="text-xs text-text-muted">Cobradors</p>
        </Card>
        <Card>
          <p className="text-xl font-bold text-brand-blue">
            {MOCK_AGENTS.filter((a) => a.role === "CABO").length}
          </p>
          <p className="text-xs text-text-muted">Cabos</p>
        </Card>
        <Card>
          <p className="text-xl font-bold text-brand-green">
            {MOCK_AGENTS.filter((a) => a.role === "CAPITALISTA").length}
          </p>
          <p className="text-xs text-text-muted">Capitalistas</p>
        </Card>
        <Card>
          <p className="text-xl font-bold text-brand-gold">
            {formatCurrency(
              MOCK_AGENTS.reduce((a, c) => a + c.totalCommission, 0),
            )}
          </p>
          <p className="text-xs text-text-muted">Total Commissions</p>
        </Card>
      </div>

      {/* Agent Cards */}
      <div className="space-y-2">
        {filtered.map((agent) => {
          const roleStyle = roleBadge[agent.role] ?? {
            variant: "gray" as const,
          };
          const status = statusBadge[agent.status];
          return (
            <Card key={agent.id}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold">
                    {agent.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {agent.name}
                    </p>
                    <p className="text-xs text-text-muted">{agent.mobile}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={roleStyle.variant}>{agent.role}</Badge>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mt-2 pt-2 border-t border-border-default">
                <div>
                  <p className="text-text-muted">Territory</p>
                  <p className="text-text-primary font-medium">
                    {agent.territory}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Commission Rate</p>
                  <p className="text-text-primary font-medium">
                    {(agent.commissionRate * 100).toFixed(0)}%
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Total Collected</p>
                  <p className="text-brand-gold font-medium">
                    {formatCurrency(agent.totalCollected)}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Total Commission</p>
                  <p className="text-brand-green font-medium">
                    {formatCurrency(agent.totalCommission)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {agent.status === "ACTIVE" ? (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => toast.success("Agent suspended")}
                  >
                    Suspend
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="green"
                    onClick={() => toast.success("Agent activated")}
                  >
                    Activate
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => toast.success("Details opened")}
                >
                  View Details
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
