import { Link } from "react-router-dom";
import { Card, Badge, Button } from "../../components";
import { useAppStore } from "../../store/useAppStore";
import { formatCurrency } from "../../utils";

const MOCK_STATS = {
  totalCustomers: 45,
  totalBetsToday: 128,
  collectionToday: 8450,
  commissionToday: 1267.5,
  commissionTotal: 32450,
  pendingPayouts: 3,
};

const MOCK_RECENT_BETS = [
  {
    id: "1",
    customer: "Maria Santos",
    numbers: [12, 35],
    amount: 50,
    draw: "11:00 AM",
    time: "10:12 AM",
  },
  {
    id: "2",
    customer: "Pedro Reyes",
    numbers: [7, 23],
    amount: 100,
    draw: "11:00 AM",
    time: "10:08 AM",
  },
  {
    id: "3",
    customer: "Anna Cruz",
    numbers: [19, 31],
    amount: 20,
    draw: "4:00 PM",
    time: "9:55 AM",
  },
  {
    id: "4",
    customer: "Jose Garcia",
    numbers: [3, 28],
    amount: 50,
    draw: "11:00 AM",
    time: "9:40 AM",
  },
];

export default function AgentDashboard() {
  const { user, balance } = useAppStore();

  return (
    <div className="space-y-4 pb-20 md:pb-4">
      {/* Welcome */}
      <Card className="bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border-brand-gold/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300">Welcome back,</p>
            <h1 className="text-lg font-bold text-white">
              {user?.name ?? "Agent"}
            </h1>
            <Badge variant="gold" className="mt-1">
              Cobrador
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Commission Wallet</p>
            <p className="text-2xl font-bold text-brand-gold">
              {formatCurrency(balance)}
            </p>
            <Link to="/agent/wallet">
              <Button variant="gold" size="sm" className="mt-1">
                Withdraw
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Today's Stats */}
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <p className="text-2xl font-bold text-white">
            {MOCK_STATS.totalBetsToday}
          </p>
          <p className="text-xs text-gray-400">Bets Today</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-brand-gold">
            {formatCurrency(MOCK_STATS.collectionToday)}
          </p>
          <p className="text-xs text-gray-400">Collections Today</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-brand-green">
            {formatCurrency(MOCK_STATS.commissionToday)}
          </p>
          <p className="text-xs text-gray-400">Commission Today (15%)</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-white">
            {MOCK_STATS.totalCustomers}
          </p>
          <p className="text-xs text-gray-400">Total Customers</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Link to="/agent/collect-bet">
          <Button variant="primary" fullWidth size="lg">
            🎲 Collect Bet
          </Button>
        </Link>
        <Link to="/agent/customers">
          <Button variant="outline" fullWidth size="lg">
            👥 My Customers
          </Button>
        </Link>
      </div>

      {/* Recent Collections */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-300">
            Recent Collections
          </h2>
          <Link
            to="/agent/collect-bet"
            className="text-xs text-brand-gold hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="space-y-2">
          {MOCK_RECENT_BETS.map((bet) => (
            <Card key={bet.id} className="flex items-center gap-3">
              <div className="flex gap-1">
                {bet.numbers.map((n) => (
                  <span
                    key={n}
                    className="w-8 h-8 rounded-full bg-brand-red text-white text-xs font-bold flex items-center justify-center border border-brand-gold"
                  >
                    {n}
                  </span>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {bet.customer}
                </p>
                <p className="text-[10px] text-gray-500">
                  {bet.draw} Draw · {bet.time}
                </p>
              </div>
              <span className="text-sm font-bold text-brand-gold">
                {formatCurrency(bet.amount)}
              </span>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance */}
      <Card className="border border-brand-green/30">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">
          Performance Summary
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-400">Total Commission</p>
            <p className="font-bold text-brand-green">
              {formatCurrency(MOCK_STATS.commissionTotal)}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Pending Payouts</p>
            <p className="font-bold text-brand-gold">
              {MOCK_STATS.pendingPayouts}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Commission Rate</p>
            <p className="font-bold text-white">15%</p>
          </div>
          <div>
            <p className="text-gray-400">Territory</p>
            <p className="font-bold text-white">Tondo, Manila</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
