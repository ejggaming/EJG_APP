import { Card, Badge } from "../../components";
import { formatCurrency } from "../../utils";
import { Clock, Trophy, XCircle, PartyPopper } from "lucide-react";

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
  pending: { variant: "gold" as const, label: "Pending", Icon: Clock },
  won: { variant: "green" as const, label: "Won", Icon: Trophy },
  lost: { variant: "red" as const, label: "Lost", Icon: XCircle },
};

export default function BetHistoryPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold text-white chinese-header">
          Bet History
        </h1>
        <p className="text-gray-500 text-sm mt-1">Your past bets and results</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="text-center lantern-card">
          <p className="text-lg font-extrabold text-white">12</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
            Total Bets
          </p>
        </Card>
        <Card className="text-center lantern-card">
          <p className="text-lg font-extrabold text-brand-green">2</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
            Won
          </p>
        </Card>
        <Card className="text-center lantern-card">
          <p className="text-lg font-extrabold gold-shimmer">
            {formatCurrency(5000)}
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
            Total Won
          </p>
        </Card>
      </div>

      {/* Cloud Divider */}
      <div className="cloud-divider" />

      {/* Bet List */}
      <div className="space-y-2">
        {MOCK_BETS.map((bet) => {
          const badge = statusBadge[bet.status];
          return (
            <Card key={bet.id} className="lantern-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {bet.numbers.map((num) => (
                      <span key={num} className="lottery-ball w-9 h-9 text-sm">
                        {num}
                      </span>
                    ))}
                  </div>
                  <Badge variant={badge.variant}>
                    <badge.Icon className="w-3 h-3 inline mr-0.5" />
                    {badge.label}
                  </Badge>
                </div>
                <span className="text-brand-gold font-bold">
                  {formatCurrency(bet.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{bet.draw}</span>
                <span>{bet.date}</span>
              </div>
              {bet.status === "won" && (
                <div className="mt-2 win-glow rounded-xl p-2 text-center border border-brand-green/30 bg-brand-green/5">
                  <p className="text-brand-green font-bold text-sm">
                    <PartyPopper className="w-4 h-4 inline mr-1" /> Won{" "}
                    {formatCurrency(bet.winnings!)}
                  </p>
                </div>
              )}
              <p className="text-[10px] text-gray-600 mt-1">{bet.reference}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
