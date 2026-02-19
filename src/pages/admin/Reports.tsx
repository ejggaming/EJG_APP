import { useState } from "react";
import { Card, Badge } from "../../components";
import { formatCurrency } from "../../utils";

type TimeRange = "daily" | "weekly" | "monthly";

const REVENUE_DATA = {
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

const REGIONAL_DATA = [
  {
    region: "NCR",
    bets: 145,
    revenue: 52000,
    agents: 12,
    topGame: "Jueteng",
    growth: "+12%",
  },
  {
    region: "Region III",
    bets: 98,
    revenue: 31200,
    agents: 8,
    topGame: "Jueteng",
    growth: "+8%",
  },
  {
    region: "Region IV-A",
    bets: 72,
    revenue: 24800,
    agents: 6,
    topGame: "Jueteng",
    growth: "+15%",
  },
  {
    region: "Region VII",
    bets: 65,
    revenue: 22100,
    agents: 5,
    topGame: "Jueteng",
    growth: "+5%",
  },
  {
    region: "Region XI",
    bets: 56,
    revenue: 18400,
    agents: 4,
    topGame: "Jueteng",
    growth: "+18%",
  },
  {
    region: "Others",
    bets: 51,
    revenue: 13850,
    agents: 9,
    topGame: "Jueteng",
    growth: "+3%",
  },
];

const TOP_AGENTS = [
  {
    name: "Ricardo Dalisay",
    role: "COBRADOR",
    collections: 42000,
    commission: 6300,
    customers: 45,
  },
  {
    name: "Juan Torres",
    role: "COBRADOR",
    collections: 38500,
    commission: 5775,
    customers: 38,
  },
  {
    name: "Maria dela Cruz",
    role: "CABO",
    collections: 95000,
    commission: 9500,
    customers: 120,
  },
  {
    name: "Pedro Manalo",
    role: "COBRADOR",
    collections: 31000,
    commission: 4650,
    customers: 28,
  },
  {
    name: "Ana Rivera",
    role: "COBRADOR",
    collections: 27500,
    commission: 4125,
    customers: 22,
  },
];

export default function Reports() {
  const [range, setRange] = useState<TimeRange>("daily");
  const data = REVENUE_DATA[range];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-gray-400 text-sm">
            Revenue, bets, and performance analytics
          </p>
        </div>
        <div className="flex bg-surface-card rounded-lg overflow-hidden border border-gray-700/50">
          {(["daily", "weekly", "monthly"] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                range === r
                  ? "bg-brand-red text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <p className="text-xl font-bold text-brand-blue">
            {data.bets.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400">Total Bets</p>
        </Card>
        <Card>
          <p className="text-xl font-bold text-brand-gold">
            {formatCurrency(data.revenue)}
          </p>
          <p className="text-xs text-gray-400">Gross Revenue</p>
        </Card>
        <Card>
          <p className="text-xl font-bold text-brand-red">
            {formatCurrency(data.payouts)}
          </p>
          <p className="text-xs text-gray-400">Total Payouts</p>
        </Card>
        <Card>
          <p className="text-xl font-bold text-brand-green">
            {formatCurrency(data.net)}
          </p>
          <p className="text-xs text-gray-400">Net Revenue</p>
        </Card>
        <Card className="col-span-2 md:col-span-1">
          <p className="text-xl font-bold text-white">
            {formatCurrency(data.govShare)}
          </p>
          <p className="text-xs text-gray-400">PCSO Share (30%)</p>
        </Card>
      </div>

      {/* Regional Performance */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">
          Regional Performance
        </h2>
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] text-gray-500 uppercase border-b border-gray-700/50">
                <th className="pb-3 pr-4">Region</th>
                <th className="pb-3 pr-4">Bets</th>
                <th className="pb-3 pr-4">Revenue</th>
                <th className="pb-3 pr-4">Agents</th>
                <th className="pb-3 pr-4">Growth</th>
              </tr>
            </thead>
            <tbody>
              {REGIONAL_DATA.map((r) => (
                <tr key={r.region} className="border-b border-gray-700/30">
                  <td className="py-2.5 pr-4 text-white font-medium">
                    {r.region}
                  </td>
                  <td className="py-2.5 pr-4 text-gray-300">{r.bets}</td>
                  <td className="py-2.5 pr-4 text-brand-gold font-semibold">
                    {formatCurrency(r.revenue)}
                  </td>
                  <td className="py-2.5 pr-4 text-gray-300">{r.agents}</td>
                  <td className="py-2.5 pr-4">
                    <Badge variant="green">{r.growth}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Top Performing Agents */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">
          Top Performing Agents
        </h2>
        <div className="space-y-2">
          {TOP_AGENTS.map((agent, i) => (
            <Card key={agent.name}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold text-sm font-bold">
                    #{i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {agent.name}
                    </p>
                    <div className="flex gap-2 items-center">
                      <Badge variant={agent.role === "CABO" ? "gold" : "blue"}>
                        {agent.role}
                      </Badge>
                      <span className="text-[10px] text-gray-500">
                        {agent.customers} customers
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brand-gold">
                    {formatCurrency(agent.collections)}
                  </p>
                  <p className="text-[10px] text-brand-green">
                    +{formatCurrency(agent.commission)} comm.
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* PCSO Report Summary */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">
          PCSO Government Share Report
        </h2>
        <Card>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Gross Revenue ({range})</span>
              <span className="text-white font-medium">
                {formatCurrency(data.revenue)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Less: Payouts</span>
              <span className="text-brand-red font-medium">
                -{formatCurrency(data.payouts)}
              </span>
            </div>
            <div className="border-t border-gray-700/50 pt-3 flex justify-between text-sm">
              <span className="text-gray-400">Net Revenue</span>
              <span className="text-brand-green font-medium">
                {formatCurrency(data.net)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Government Share (30%)</span>
              <span className="text-white font-bold">
                {formatCurrency(data.govShare)}
              </span>
            </div>
            <div className="border-t border-gray-700/50 pt-3 flex justify-between text-sm">
              <span className="text-gray-400">Operator Retained</span>
              <span className="text-brand-gold font-bold">
                {formatCurrency(data.net - data.govShare)}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
