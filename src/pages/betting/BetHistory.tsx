import { Card, Badge } from "../../components";
import { formatCurrency } from "../../utils";
import { Clock, Trophy, XCircle, PartyPopper, Wallet } from "lucide-react";
import { BetHistorySkeleton } from "../../components/ChineseSkeleton";
import { useBetHistoryQuery, useGameConfigQuery, drawTypeLabel } from "../../hooks/useBet";
import { useMyWalletQuery } from "../../hooks/useWallet";

const statusBadge = {
  PENDING: { variant: "gold" as const, label: "Awaiting Draw", Icon: Clock },
  WON: { variant: "green" as const, label: "Won", Icon: Trophy },
  LOST: { variant: "red" as const, label: "Lost", Icon: XCircle },
  VOID: { variant: "red" as const, label: "Void", Icon: XCircle },
  REFUNDED: { variant: "gold" as const, label: "Refunded", Icon: Clock },
};

export default function BetHistoryPage() {
  const { data, isLoading } = useBetHistoryQuery({});
  const { data: walletData } = useMyWalletQuery();
  const { data: gameConfig } = useGameConfigQuery();

  const multiplier = gameConfig?.payoutMultiplier ?? 0;
  const balance = walletData?.wallet?.balance ?? 0;
  const bets = data?.bets ?? [];

  if (isLoading) return <BetHistorySkeleton />;
  const totalBets = bets.length;
  const wonBets = bets.filter((b) => b.status === "WON").length;
  const totalWon = bets
    .filter((b) => b.status === "WON")
    .reduce((sum, b) => sum + (b.payoutAmount ?? 0), 0);
  const pendingPotential = bets
    .filter((b) => b.status === "PENDING")
    .reduce((sum, b) => sum + b.amount * multiplier, 0);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold text-text-primary chinese-header">
          Bet History
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Your past bets and results
        </p>
      </div>

      {/* Balance */}
      <Card bento delay={50} className="lantern-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-brand-gold/15 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-brand-gold" />
            </div>
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Current Balance</p>
              <p className="text-xl font-extrabold gold-shimmer">{formatCurrency(balance)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-2">
        <Card bento delay={100} className="text-center lantern-card">
          <p className="text-lg font-extrabold text-text-primary">
            {totalBets}
          </p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">
            Total Bets
          </p>
        </Card>
        <Card bento delay={200} className="text-center lantern-card">
          <p className="text-lg font-extrabold text-brand-green">{wonBets}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">
            Won
          </p>
        </Card>
        <Card bento delay={300} className="text-center lantern-card">
          <p className="text-lg font-extrabold gold-shimmer">
            {formatCurrency(totalWon)}
          </p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">
            Total Won
          </p>
        </Card>
        {multiplier > 0 && pendingPotential > 0 && (
          <Card bento delay={400} className="text-center lantern-card">
            <p className="text-lg font-extrabold text-brand-gold">
              {formatCurrency(pendingPotential)}
            </p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">
              Pending Potential
            </p>
          </Card>
        )}
      </div>

      {/* Cloud Divider */}
      <div className="cloud-divider" />

      {/* Bet List */}
      {bets.length === 0 ? (
        <Card bento className="text-center py-8 lantern-card">
          <p className="text-text-muted text-sm">No bets placed yet</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {bets.map((bet, index) => {
            const badge =
              statusBadge[bet.status as keyof typeof statusBadge] ??
              statusBadge.PENDING;
            const drawTime = bet.draw?.drawType
              ? drawTypeLabel(bet.draw.drawType)
              : "";
            return (
              <Card
                key={bet.id}
                bento
                delay={350 + index * 80}
                className="lantern-card"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="lottery-ball w-9 h-9 text-sm">
                        {bet.number1}
                      </span>
                      <span className="lottery-ball w-9 h-9 text-sm">
                        {bet.number2}
                      </span>
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
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>{drawTime} Draw</span>
                  <span>
                    {new Date(bet.placedAt ?? bet.createdAt).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" },
                    )}
                  </span>
                </div>
                {/* Multiplier & potential payout */}
                {multiplier > 0 && (
                  <div className="flex items-center justify-between text-xs mt-1.5 pt-1.5 border-t border-white/5">
                    <span className="text-text-muted">
                      <span className="text-brand-gold font-bold">{multiplier}×</span>
                      {" "}multiplier
                    </span>
                    <span
                      className={
                        bet.status === "LOST" || bet.status === "VOID"
                          ? "text-text-muted line-through"
                          : bet.status === "WON"
                            ? "text-brand-green font-bold"
                            : "text-brand-gold font-bold"
                      }
                    >
                      {formatCurrency(bet.amount * multiplier)}
                    </span>
                  </div>
                )}
                {bet.status === "WON" && (
                  <div className="mt-2 win-glow rounded-xl p-2 text-center border border-brand-green/30 bg-brand-green/5">
                    <p className="text-brand-green font-bold text-sm">
                      <PartyPopper className="w-4 h-4 inline mr-1" /> Won{" "}
                      {formatCurrency(bet.payoutAmount ?? 0)}
                    </p>
                  </div>
                )}
                <p className="text-[10px] text-text-muted mt-1">
                  {bet.reference}
                </p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
