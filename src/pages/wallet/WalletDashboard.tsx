import { Link } from "react-router-dom";
import { Card, Badge, Button } from "../../components";
import { useAppStore } from "../../store/useAppStore";
import { formatCurrency } from "../../utils";

const MOCK_TRANSACTIONS = [
  {
    id: "1",
    type: "deposit" as const,
    amount: 500,
    method: "GCash",
    date: "Feb 19, 2026 10:30 AM",
    status: "completed" as const,
  },
  {
    id: "2",
    type: "bet" as const,
    amount: -50,
    label: "Bet #2026021901",
    date: "Feb 19, 2026 10:15 AM",
    status: "completed" as const,
  },
  {
    id: "3",
    type: "win" as const,
    amount: 5000,
    label: "Win #2026021802",
    date: "Feb 18, 2026 4:30 PM",
    status: "completed" as const,
  },
  {
    id: "4",
    type: "bet" as const,
    amount: -100,
    label: "Bet #2026021802",
    date: "Feb 18, 2026 3:50 PM",
    status: "completed" as const,
  },
  {
    id: "5",
    type: "deposit" as const,
    amount: 1000,
    method: "Maya",
    date: "Feb 17, 2026 9:00 AM",
    status: "completed" as const,
  },
  {
    id: "6",
    type: "withdraw" as const,
    amount: -2000,
    method: "GCash",
    date: "Feb 16, 2026 2:00 PM",
    status: "pending" as const,
  },
];

const txTypeStyles = {
  deposit: { icon: "↓", color: "text-brand-green", label: "Deposit" },
  withdraw: { icon: "↑", color: "text-brand-red", label: "Withdraw" },
  bet: { icon: "🎲", color: "text-brand-gold", label: "Bet" },
  win: { icon: "🏆", color: "text-brand-green", label: "Winning" },
};

export default function WalletDashboard() {
  const balance = useAppStore((s) => s.balance);

  return (
    <div className="space-y-4">
      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-brand-red to-brand-red-dark text-white">
        <p className="text-sm opacity-80">Available Balance</p>
        <p className="text-3xl font-bold text-brand-gold mt-1">
          {formatCurrency(balance)}
        </p>
        <div className="flex gap-2 mt-4">
          <Link to="/wallet/deposit" className="flex-1">
            <Button variant="gold" size="sm" fullWidth>
              Deposit
            </Button>
          </Link>
          <Link to="/wallet/withdraw" className="flex-1">
            <Button variant="outline" size="sm" fullWidth>
              Withdraw
            </Button>
          </Link>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="text-center">
          <p className="text-lg font-bold text-brand-green">
            {formatCurrency(6500)}
          </p>
          <p className="text-[10px] text-gray-400">Total Deposits</p>
        </Card>
        <Card className="text-center">
          <p className="text-lg font-bold text-brand-gold">
            {formatCurrency(5000)}
          </p>
          <p className="text-[10px] text-gray-400">Total Winnings</p>
        </Card>
        <Card className="text-center">
          <p className="text-lg font-bold text-brand-red">
            {formatCurrency(2000)}
          </p>
          <p className="text-[10px] text-gray-400">Withdrawn</p>
        </Card>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">Transactions</h2>
        <div className="space-y-2">
          {MOCK_TRANSACTIONS.map((tx) => {
            const style = txTypeStyles[tx.type];
            return (
              <Card key={tx.id} className="flex items-center gap-3">
                <div className={`text-2xl ${style.color}`}>{style.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">
                      {style.label}
                    </p>
                    {tx.status === "pending" && (
                      <Badge variant="gold">Pending</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {"method" in tx ? tx.method : tx.label}
                  </p>
                  <p className="text-[10px] text-gray-500">{tx.date}</p>
                </div>
                <p
                  className={`text-sm font-bold ${tx.amount >= 0 ? "text-brand-green" : "text-white"}`}
                >
                  {tx.amount >= 0 ? "+" : ""}
                  {formatCurrency(Math.abs(tx.amount))}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
