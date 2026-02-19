import { Card, Badge } from "../../components";
import { formatCurrency } from "../../utils";

const MOCK_BETS = [
  {
    id: "1",
    numbers: [12, 35],
    amount: 50,
    draw: "11:00 AM Draw",
    date: "Feb 19, 2026",
    status: "pending" as const,
    reference: "BET-2026021901",
  },
  {
    id: "2",
    numbers: [7, 23],
    amount: 100,
    draw: "4:00 PM Draw",
    date: "Feb 18, 2026",
    status: "won" as const,
    winnings: 5000,
    reference: "BET-2026021802",
  },
  {
    id: "3",
    numbers: [3, 15],
    amount: 20,
    draw: "9:00 PM Draw",
    date: "Feb 18, 2026",
    status: "lost" as const,
    reference: "BET-2026021803",
  },
  {
    id: "4",
    numbers: [22, 37],
    amount: 10,
    draw: "11:00 AM Draw",
    date: "Feb 17, 2026",
    status: "lost" as const,
    reference: "BET-2026021704",
  },
];

const statusBadge = {
  pending: { variant: "gold" as const, label: "Pending" },
  won: { variant: "green" as const, label: "Won" },
  lost: { variant: "red" as const, label: "Lost" },
};

export default function BetHistoryPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">Bet History</h1>
        <p className="text-gray-400 text-sm">Your past bets and results</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="text-center">
          <p className="text-lg font-bold text-white">12</p>
          <p className="text-xs text-gray-400">Total Bets</p>
        </Card>
        <Card className="text-center">
          <p className="text-lg font-bold text-brand-green">2</p>
          <p className="text-xs text-gray-400">Won</p>
        </Card>
        <Card className="text-center">
          <p className="text-lg font-bold text-brand-gold">
            {formatCurrency(5000)}
          </p>
          <p className="text-xs text-gray-400">Total Won</p>
        </Card>
      </div>

      {/* Bet List */}
      <div className="space-y-2">
        {MOCK_BETS.map((bet) => {
          const badge = statusBadge[bet.status];
          return (
            <Card key={bet.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {bet.numbers.map((num) => (
                      <span
                        key={num}
                        className="w-9 h-9 rounded-full bg-brand-red text-white text-sm font-bold flex items-center justify-center border-2 border-brand-gold"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>
                <span className="text-brand-gold font-bold">
                  {formatCurrency(bet.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{bet.draw}</span>
                <span>{bet.date}</span>
              </div>
              {bet.status === "won" && (
                <div className="mt-2 bg-brand-green/10 border border-brand-green/30 rounded-lg p-2 text-center">
                  <p className="text-brand-green font-bold text-sm">
                    🎉 Won {formatCurrency(bet.winnings!)}
                  </p>
                </div>
              )}
              <p className="text-[10px] text-gray-500 mt-1">{bet.reference}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
