import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, NumberBall, Modal } from "../../components";
import { useAppStore } from "../../store/useAppStore";
import { formatCurrency } from "../../utils";
import toast from "react-hot-toast";
import {
  Target,
  CircleDot,
  Coins,
  Dices,
  Sparkles,
  X,
  Check,
} from "lucide-react";
import {
  useTodaysDrawsQuery,
  useGameConfigQuery,
  usePlaceBetMutation,
  drawLabel,
  drawTypeLabel,
} from "../../hooks/useBet";
import { useMyWalletQuery } from "../../hooks/useWallet";

export default function BetPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const balance = useAppStore((s) => s.balance);
  const betSlip = useAppStore((s) => s.betSlip);
  const addToBetSlip = useAppStore((s) => s.addToBetSlip);
  const removeFromBetSlip = useAppStore((s) => s.removeFromBetSlip);
  const clearBetSlip = useAppStore((s) => s.clearBetSlip);
  const pendingBet = useAppStore((s) => s.pendingBet);
  const setPendingBet = useAppStore((s) => s.setPendingBet);

  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [amount, setAmount] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedDraw, setSelectedDraw] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Real API data
  const { data: todaysDraws = [] } = useTodaysDrawsQuery();
  const { data: gameConfig } = useGameConfigQuery();
  const placeBet = usePlaceBetMutation();
  const { refetch: refetchWallet } = useMyWalletQuery();

  const maxNumber = gameConfig?.maxNumber ?? 37;
  const minBet = gameConfig?.minBet ?? 5;
  const maxBet = gameConfig?.maxBet ?? 1000;
  const NUMBERS = Array.from({ length: maxNumber }, (_, i) => i + 1);
  const QUICK_AMOUNTS = [5, 10, 20, 50, 100, 500].filter(
    (a) => a >= minBet && a <= maxBet,
  );

  // Only show OPEN draws for selection
  const openDraws = todaysDraws.filter((d) => d.status === "OPEN");

  // Auto-select first open draw if none selected
  const effectiveDraw =
    selectedDraw && openDraws.find((d) => d.id === selectedDraw)
      ? selectedDraw
      : openDraws[0]?.id ?? "";

  // Restore pending bet after successful login redirect
  useEffect(() => {
    if (pendingBet && isAuthenticated && openDraws.length > 0) {
      setSelectedNumbers(pendingBet.numbers);
      setAmount(pendingBet.amount);
      // Try to match the draw from pending bet, otherwise use first open
      const matchingDraw = openDraws.find((d) => d.id === pendingBet.drawId);
      if (matchingDraw) setSelectedDraw(matchingDraw.id);

      // Auto-add to bet slip
      const draw = matchingDraw ?? openDraws[0];
      if (draw) {
        addToBetSlip({
          id: `${Date.now()}-${Math.random()}`,
          numbers: pendingBet.numbers,
          amount: pendingBet.amount,
          drawId: draw.id,
          drawLabel: drawLabel(draw),
        });
        toast.success(
          `Added ${pendingBet.numbers[0]}-${pendingBet.numbers[1]} to bet slip`,
        );
      }
      setPendingBet(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, openDraws.length]);

  const handleNumberClick = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers((prev) => prev.filter((n) => n !== num));
    } else if (selectedNumbers.length < 2) {
      setSelectedNumbers((prev) => [...prev, num]);
    }
  };

  const handleQuickPick = () => {
    const nums: number[] = [];
    while (nums.length < 2) {
      const rand = Math.floor(Math.random() * maxNumber) + 1;
      if (!nums.includes(rand)) nums.push(rand);
    }
    setSelectedNumbers(nums.sort((a, b) => a - b));
  };

  const handleAmountSelect = (amt: number) => {
    setAmount(amt);
    setCustomAmount("");
  };

  const handleCustomAmount = (val: string) => {
    setCustomAmount(val);
    const parsed = parseInt(val);
    if (!isNaN(parsed) && parsed >= minBet) {
      setAmount(parsed);
    }
  };

  const handleAddToBetSlip = () => {
    if (selectedNumbers.length !== 2) {
      toast.error("Select exactly 2 numbers");
      return;
    }
    if (amount < minBet) {
      toast.error(`Minimum bet is ₱${minBet}`);
      return;
    }
    if (!effectiveDraw) {
      toast.error("No open draw available");
      return;
    }

    // If not logged in, save selections and redirect to login
    if (!isAuthenticated) {
      const draw = openDraws.find((d) => d.id === effectiveDraw)!;
      setPendingBet({
        numbers: [selectedNumbers[0], selectedNumbers[1]],
        amount,
        drawId: draw.id,
        drawLabel: drawLabel(draw),
      });
      toast("Please login to place your bet", { icon: "🔒" });
      navigate("/login");
      return;
    }

    const draw = openDraws.find((d) => d.id === effectiveDraw)!;
    addToBetSlip({
      id: `${Date.now()}-${Math.random()}`,
      numbers: [selectedNumbers[0], selectedNumbers[1]],
      amount,
      drawId: draw.id,
      drawLabel: drawLabel(draw),
    });

    toast.success(
      `Added ${selectedNumbers[0]}-${selectedNumbers[1]} to bet slip`,
    );
    setSelectedNumbers([]);
  };

  const totalBet = betSlip.reduce((sum, b) => sum + b.amount, 0);

  const handleConfirmAll = async () => {
    if (betSlip.length === 0) return;
    if (totalBet > balance) {
      toast.error("Insufficient balance");
      return;
    }

    try {
      for (const bet of betSlip) {
        await placeBet.mutateAsync({
          drawId: bet.drawId,
          number1: bet.numbers[0],
          number2: bet.numbers[1],
          amount: bet.amount,
        });
      }
      clearBetSlip();
      setShowConfirm(false);
      refetchWallet();
      toast.success("Bets placed successfully! Good luck!");
    } catch {
      toast.error("Failed to place bets");
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-text-primary chinese-header">
          Place Your Bet
        </h1>
        <p className="text-text-muted text-sm mt-1">
          <Target className="w-3.5 h-3.5 inline mr-1" />
          Pick 2 numbers from 1-{maxNumber}, min ₱{minBet}
        </p>
      </div>

      {/* Balance Bar */}
      <Card
        bento
        delay={100}
        className="flex items-center justify-between lantern-card"
      >
        <div>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">
            Available Balance
          </p>
          <p className="text-lg font-extrabold gold-shimmer">
            {formatCurrency(balance)}
          </p>
        </div>
        <span className="fortune-badge">
          {balance >= minBet ? (
            <>
              <Sparkles className="w-3 h-3 inline mr-1" />
              Ready to Bet
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 inline mr-1" />
              Low Balance
            </>
          )}
        </span>
      </Card>

      {/* Draw Selection */}
      <section>
        <h3 className="text-sm font-semibold text-text-secondary mb-2">
          ✦ Select Draw
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {openDraws.length === 0 ? (
            <p className="text-text-muted text-sm col-span-full text-center py-4">
              No open draws available right now
            </p>
          ) : (
            openDraws.map((draw) => (
              <button
                key={draw.id}
                type="button"
                onClick={() => setSelectedDraw(draw.id)}
                className={`rounded-xl p-3 border-2 text-center transition-all cursor-pointer ${
                  effectiveDraw === draw.id
                    ? "border-brand-gold bg-brand-gold/10 text-brand-gold shadow-[0_0_12px_rgba(217,119,6,0.15)]"
                    : "border-brand-gold/20 bg-surface-card text-text-muted hover:border-brand-gold/40"
                }`}
              >
                <p className="text-xs font-bold">{drawTypeLabel(draw.drawType)}</p>
                <p className="text-[10px] mt-0.5">● Open</p>
              </button>
            ))
          )}
        </div>
      </section>

      {/* Number Selection */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-text-secondary">
            <CircleDot className="w-3.5 h-3.5 inline mr-1" />
            Pick 2 Numbers{" "}
            <span className="text-brand-red">({selectedNumbers.length}/2)</span>
          </h3>
          <Button size="sm" variant="secondary" onClick={handleQuickPick}>
            <Dices className="w-3.5 h-3.5 inline mr-1" /> Quick Pick
          </Button>
        </div>

        {/* Selected Number Display — Grand lottery display */}
        <Card className="mb-3 py-5 chinese-frame" ornate bento delay={200}>
          <div className="flex items-center justify-center gap-6">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-extrabold transition-all ${
                selectedNumbers[0]
                  ? "lottery-ball lottery-ball-selected"
                  : "bg-surface-elevated border-2 border-dashed border-brand-gold/30 text-text-muted"
              }`}
            >
              {selectedNumbers[0] || "?"}
            </div>
            <span className="text-2xl font-extrabold gold-shimmer">—</span>
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-extrabold transition-all ${
                selectedNumbers[1]
                  ? "lottery-ball lottery-ball-selected"
                  : "bg-surface-elevated border-2 border-dashed border-brand-gold/30 text-text-muted"
              }`}
            >
              {selectedNumbers[1] || "?"}
            </div>
          </div>
        </Card>

        {/* Number Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {NUMBERS.map((num) => (
            <NumberBall
              key={num}
              number={num}
              selected={selectedNumbers.includes(num)}
              disabled={
                selectedNumbers.length >= 2 && !selectedNumbers.includes(num)
              }
              onClick={() => handleNumberClick(num)}
            />
          ))}
        </div>
      </section>

      {/* Bet Amount */}
      <section>
        <h3 className="text-sm font-semibold text-text-secondary mb-2">
          <Coins className="w-3.5 h-3.5 inline mr-1" />
          Bet Amount
        </h3>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => handleAmountSelect(amt)}
              className={`rounded-xl py-2.5 border-2 font-bold text-sm transition-all cursor-pointer ${
                amount === amt && !customAmount
                  ? "border-brand-green bg-brand-green/10 text-brand-green shadow-[0_0_10px_rgba(22,163,74,0.15)]"
                  : "border-brand-gold/15 bg-surface-card text-text-muted hover:border-brand-gold/30"
              }`}
            >
              ₱{amt}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold font-bold">
            ₱
          </span>
          <input
            type="number"
            placeholder={`Custom amount (min ₱${minBet})`}
            value={customAmount}
            onChange={(e) => handleCustomAmount(e.target.value)}
            min={5}
            className="w-full rounded-xl border-2 border-brand-gold/20 bg-surface-card pl-8 pr-4 py-2.5 text-text-primary placeholder-text-muted focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 focus:outline-none"
          />
        </div>
      </section>

      {/* Add to Bet Slip */}
      <Button
        fullWidth
        size="lg"
        variant="primary"
        onClick={handleAddToBetSlip}
        disabled={selectedNumbers.length !== 2 || amount < minBet || !effectiveDraw}
      >
        <Target className="w-4 h-4 inline mr-1" /> Add to Bet Slip —{" "}
        {formatCurrency(amount)}
      </Button>

      {/* Bet Slip */}
      {betSlip.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-text-primary chinese-header">
              Bet Slip ({betSlip.length})
            </h3>
            <button
              type="button"
              onClick={clearBetSlip}
              className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {betSlip.map((bet, index) => (
              <Card
                key={bet.id}
                bento
                delay={300 + index * 80}
                className="flex items-center justify-between lantern-card"
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {bet.numbers.map((num) => (
                      <span key={num} className="lottery-ball w-8 h-8 text-xs">
                        {num}
                      </span>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {bet.numbers[0]} - {bet.numbers[1]}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {bet.drawLabel}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-gold font-bold text-sm">
                    {formatCurrency(bet.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromBetSlip(bet.id)}
                    className="text-text-muted hover:text-red-400 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Total & Submit */}
          <Card className="mt-3 lantern-card" ornate bento delay={400}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-text-muted text-sm">Total Bets</span>
              <span className="text-text-primary font-bold">
                {betSlip.length} bet(s)
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-muted text-sm">Total Amount</span>
              <span className="font-extrabold text-lg gold-shimmer">
                {formatCurrency(totalBet)}
              </span>
            </div>
            <Button
              fullWidth
              size="lg"
              variant="green"
              onClick={() => setShowConfirm(true)}
              disabled={totalBet > balance}
            >
              {totalBet > balance
                ? "Insufficient Balance"
                : `Confirm All Bets — ${formatCurrency(totalBet)}`}
            </Button>
          </Card>
        </section>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Your Bets"
      >
        <div className="space-y-3">
          {betSlip.map((bet) => (
            <div
              key={bet.id}
              className="flex items-center justify-between bg-surface-elevated rounded-xl p-3 border border-brand-gold/10"
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {bet.numbers.map((num) => (
                    <span key={num} className="lottery-ball w-7 h-7 text-xs">
                      {num}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-text-muted">
                  {bet.drawLabel}
                </span>
              </div>
              <span className="text-brand-gold font-bold text-sm">
                {formatCurrency(bet.amount)}
              </span>
            </div>
          ))}

          <div className="border-t border-brand-gold/20 pt-3 flex items-center justify-between">
            <span className="text-text-primary font-semibold">Total</span>
            <span className="font-extrabold text-xl gold-shimmer">
              {formatCurrency(totalBet)}
            </span>
          </div>

          <p className="text-xs text-text-muted text-center">
            By confirming, the amount will be deducted from your wallet. Bets
            cannot be cancelled after placement.
          </p>

          <div className="flex gap-2 pt-2">
            <Button
              fullWidth
              variant="secondary"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="green"
              isLoading={placeBet.isPending}
              onClick={handleConfirmAll}
            >
              <Check className="w-4 h-4 inline mr-1" /> Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
