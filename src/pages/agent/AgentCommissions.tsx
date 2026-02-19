import { useState } from "react";
import { Card, Badge } from "../../components";
import { formatCurrency } from "../../utils";

const TABS = ["Daily", "Weekly", "Monthly"];

interface Commission {
  id: string;
  date: string;
  drawTime: string;
  totalCollected: number;
  rate: number;
  commission: number;
  status: "credited" | "pending";
}

const MOCK_COMMISSIONS: Commission[] = [
  {
    id: "1",
    date: "Feb 19, 2026",
    drawTime: "11:00 AM",
    totalCollected: 3200,
    rate: 0.15,
    commission: 480,
    status: "pending",
  },
  {
    id: "2",
    date: "Feb 18, 2026",
    drawTime: "9:00 PM",
    totalCollected: 2800,
    rate: 0.15,
    commission: 420,
    status: "credited",
  },
  {
    id: "3",
    date: "Feb 18, 2026",
    drawTime: "4:00 PM",
    totalCollected: 4100,
    rate: 0.15,
    commission: 615,
    status: "credited",
  },
  {
    id: "4",
    date: "Feb 18, 2026",
    drawTime: "11:00 AM",
    totalCollected: 1950,
    rate: 0.15,
    commission: 292.5,
    status: "credited",
  },
  {
    id: "5",
    date: "Feb 17, 2026",
    drawTime: "9:00 PM",
    totalCollected: 3600,
    rate: 0.15,
    commission: 540,
    status: "credited",
  },
  {
    id: "6",
    date: "Feb 17, 2026",
    drawTime: "4:00 PM",
    totalCollected: 2200,
    rate: 0.15,
    commission: 330,
    status: "credited",
  },
  {
    id: "7",
    date: "Feb 17, 2026",
    drawTime: "11:00 AM",
    totalCollected: 1800,
    rate: 0.15,
    commission: 270,
    status: "credited",
  },
];

export default function AgentCommissions() {
  const [activeTab, setActiveTab] = useState("Daily");

  const totalCommission = MOCK_COMMISSIONS.reduce(
    (a, c) => a + c.commission,
    0,
  );
  const totalCollected = MOCK_COMMISSIONS.reduce(
    (a, c) => a + c.totalCollected,
    0,
  );
  const pendingCount = MOCK_COMMISSIONS.filter(
    (c) => c.status === "pending",
  ).length;

  return (
    <div className="space-y-4 pb-20 md:pb-4">
      <div>
        <h1 className="text-xl font-bold text-text-primary">
          Commission Reports
        </h1>
        <p className="text-text-muted text-sm">
          Your earnings from bet collections
        </p>
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-brand-green/10 to-brand-gold/10 border-brand-green/30">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xl font-bold text-brand-green">
              {formatCurrency(totalCommission)}
            </p>
            <p className="text-[10px] text-text-muted">Total Commission</p>
          </div>
          <div>
            <p className="text-xl font-bold text-brand-gold">
              {formatCurrency(totalCollected)}
            </p>
            <p className="text-[10px] text-text-muted">Total Collected</p>
          </div>
          <div>
            <p className="text-xl font-bold text-text-primary">15%</p>
            <p className="text-[10px] text-text-muted">Rate</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-brand-gold text-white"
                : "bg-surface-elevated text-text-muted hover:text-text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Commission List */}
      <div className="space-y-2">
        {MOCK_COMMISSIONS.map((c) => (
          <Card key={c.id}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-text-primary">
                  {c.drawTime} Draw
                </p>
                <Badge variant={c.status === "credited" ? "green" : "gold"}>
                  {c.status === "credited" ? "Credited" : "Pending"}
                </Badge>
              </div>
              <p className="text-sm font-bold text-brand-green">
                {formatCurrency(c.commission)}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>{c.date}</span>
              <span>
                Collected: {formatCurrency(c.totalCollected)} × {c.rate * 100}%
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Pending note */}
      {pendingCount > 0 && (
        <Card className="border border-brand-gold/30 text-center">
          <p className="text-sm text-brand-gold">
            {pendingCount} pending commission{pendingCount > 1 ? "s" : ""} will
            be credited after draw results
          </p>
        </Card>
      )}
    </div>
  );
}
