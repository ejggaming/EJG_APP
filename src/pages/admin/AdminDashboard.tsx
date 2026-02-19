import { Card, Badge } from "../../components";
import { formatCurrency } from "../../utils";

const METRICS = [
  {
    label: "Total Bets Today",
    value: "3,247",
    change: "+12%",
    color: "text-text-primary",
  },
  {
    label: "Revenue Today",
    value: formatCurrency(162350),
    change: "+8%",
    color: "text-brand-gold",
  },
  {
    label: "Active Players",
    value: "1,892",
    change: "+5%",
    color: "text-brand-green",
  },
  {
    label: "Active Agents",
    value: "156",
    change: "+2",
    color: "text-brand-blue",
  },
  {
    label: "Pending Withdrawals",
    value: "23",
    change: "",
    color: "text-brand-red",
  },
  { label: "Pending KYC", value: "12", change: "", color: "text-brand-gold" },
];

const RECENT_ACTIVITY = [
  {
    id: "1",
    action: "Draw Result Encoded",
    detail: "11:00 AM Draw — 12, 35",
    time: "11:05 AM",
    type: "draw",
  },
  {
    id: "2",
    action: "KYC Approved",
    detail: "Maria Santos — National ID",
    time: "10:45 AM",
    type: "kyc",
  },
  {
    id: "3",
    action: "Large Withdrawal",
    detail: "Jose Garcia — ₱15,000 via GCash",
    time: "10:30 AM",
    type: "finance",
  },
  {
    id: "4",
    action: "New Agent Approved",
    detail: "Carlos Mendoza — Tondo, Manila",
    time: "10:15 AM",
    type: "agent",
  },
  {
    id: "5",
    action: "Suspicious Bet Flagged",
    detail: "Account #4521 — same numbers 10x",
    time: "10:00 AM",
    type: "risk",
  },
];

const DRAW_STATUS = [
  {
    time: "11:00 AM",
    status: "completed" as const,
    bets: 1245,
    revenue: 62250,
  },
  { time: "4:00 PM", status: "open" as const, bets: 892, revenue: 44600 },
  { time: "9:00 PM", status: "upcoming" as const, bets: 0, revenue: 0 },
];

const drawStatusBadge = {
  completed: { variant: "green" as const, label: "Completed" },
  open: { variant: "gold" as const, label: "Open" },
  upcoming: { variant: "gray" as const, label: "Upcoming" },
};

const REGIONAL_DATA = [
  { region: "NCR - Manila", bets: 1200, revenue: 60000, agents: 45 },
  { region: "Region III - Pampanga", bets: 450, revenue: 22500, agents: 22 },
  { region: "Region IV - Cavite", bets: 380, revenue: 19000, agents: 18 },
  { region: "Region VII - Cebu", bets: 520, revenue: 26000, agents: 28 },
  { region: "Region XI - Davao", bets: 290, revenue: 14500, agents: 15 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Operations Dashboard
        </h1>
        <p className="text-text-muted text-sm">
          {new Date().toLocaleDateString("en-PH", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {METRICS.map((m) => (
          <Card key={m.label}>
            <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs text-text-muted mt-1">{m.label}</p>
            {m.change && (
              <p className="text-[10px] text-brand-green mt-0.5">{m.change}</p>
            )}
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Today's Draws */}
        <Card>
          <h2 className="text-sm font-semibold text-text-secondary mb-3">
            Today's Draws
          </h2>
          <div className="space-y-3">
            {DRAW_STATUS.map((draw) => {
              const badge = drawStatusBadge[draw.status];
              return (
                <div
                  key={draw.time}
                  className="flex items-center justify-between py-2 border-b border-border-default last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-text-primary">
                      {draw.time}
                    </span>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-brand-gold">
                      {formatCurrency(draw.revenue)}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {draw.bets.toLocaleString()} bets
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <h2 className="text-sm font-semibold text-text-secondary mb-3">
            Recent Activity
          </h2>
          <div className="space-y-2.5">
            {RECENT_ACTIVITY.map((a) => (
              <div key={a.id} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-gold mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary">{a.action}</p>
                  <p className="text-xs text-text-muted truncate">{a.detail}</p>
                </div>
                <span className="text-[10px] text-text-muted whitespace-nowrap">
                  {a.time}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Regional Performance */}
      <Card>
        <h2 className="text-sm font-semibold text-text-secondary mb-3">
          Regional Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] text-text-muted uppercase">
                <th className="pb-2 pr-4">Region</th>
                <th className="pb-2 pr-4">Bets</th>
                <th className="pb-2 pr-4">Revenue</th>
                <th className="pb-2">Agents</th>
              </tr>
            </thead>
            <tbody>
              {REGIONAL_DATA.map((r) => (
                <tr key={r.region} className="border-t border-border-default">
                  <td className="py-2 pr-4 text-text-primary font-medium">
                    {r.region}
                  </td>
                  <td className="py-2 pr-4 text-text-secondary">
                    {r.bets.toLocaleString()}
                  </td>
                  <td className="py-2 pr-4 text-brand-gold font-semibold">
                    {formatCurrency(r.revenue)}
                  </td>
                  <td className="py-2 text-text-secondary">{r.agents}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
