import { useState } from "react";
import { Button, Card, NumberBall, Modal, Badge } from "../../components";
import { useAppStore } from "../../store/useAppStore";
import { formatCurrency } from "../../utils";
import toast from "react-hot-toast";

const DRAW_SCHEDULES = [
  { id: "draw-11am", label: "11:00 AM Draw", time: "11:00 AM", status: "open" },
  { id: "draw-4pm", label: "4:00 PM Draw", time: "4:00 PM", status: "open" },
  {
    id: "draw-9pm",
    label: "9:00 PM Draw",
    time: "9:00 PM",
    status: "upcoming",
  },
];

const QUICK_AMOUNTS = [5, 10, 20, 50, 100, 500];
const NUMBERS = Array.from({ length: 37 }, (_, i) => i + 1);

export default function BetPage() {
  const balance = useAppStore((s) => s.balance);
  const betSlip = useAppStore((s) => s.betSlip);
  const addToBetSlip = useAppStore((s) => s.addToBetSlip);
  const removeFromBetSlip = useAppStore((s) => s.removeFromBetSlip);
  const clearBetSlip = useAppStore((s) => s.clearBetSlip);
  const setBalance = useAppStore((s) => s.setBalance);

  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [amount, setAmount] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedDraw, setSelectedDraw] = useState(DRAW_SCHEDULES[0].id);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      const rand = Math.floor(Math.random() * 37) + 1;
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
    if (!isNaN(parsed) && parsed >= 5) {
      setAmount(parsed);
    }
  };

  const handleAddToBetSlip = () => {
    if (selectedNumbers.length !== 2) {
      toast.error("Select exactly 2 numbers");
      return;
    }
    if (amount < 5) {
      toast.error("Minimum bet is ₱5");
      return;
    }

    const draw = DRAW_SCHEDULES.find((d) => d.id === selectedDraw)!;
    addToBetSlip({
      id: `${Date.now()}-${Math.random()}`,
      numbers: [selectedNumbers[0], selectedNumbers[1]],
      amount,
      drawScheduleId: draw.id,
      drawScheduleLabel: draw.label,
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

    setSubmitting(true);
    try {
      // Simulated API call
      await new Promise((r) => setTimeout(r, 1500));
      setBalance(balance - totalBet);
      clearBetSlip();
      setShowConfirm(false);
      toast.success("Bets placed successfully! Good luck! 🍀");
    } catch {
      toast.error("Failed to place bets");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Place Your Bet</h1>
        <p className="text-gray-400 text-sm">
          Pick 2 numbers from 1-37, min ₱5
        </p>
      </div>

      {/* Balance Bar */}
      <Card className="flex items-center justify-between bg-gradient-to-r from-surface-card to-surface-elevated">
        <div>
          <p className="text-xs text-gray-400">Available Balance</p>
          <p className="text-lg font-bold text-brand-gold">
            {formatCurrency(balance)}
          </p>
        </div>
        <Badge variant={balance >= 5 ? "green" : "red"}>
          {balance >= 5 ? "Ready to Bet" : "Low Balance"}
        </Badge>
      </Card>

      {/* Draw Selection */}
      <section>
        <h3 className="text-sm font-semibold text-gray-300 mb-2">
          Select Draw
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {DRAW_SCHEDULES.map((draw) => (
            <button
              key={draw.id}
              type="button"
              onClick={() => setSelectedDraw(draw.id)}
              disabled={draw.status !== "open"}
              className={`rounded-lg p-3 border text-center transition-all cursor-pointer ${
                selectedDraw === draw.id
                  ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                  : draw.status === "open"
                    ? "border-gray-600 bg-surface-elevated text-gray-300 hover:border-gray-500"
                    : "border-gray-700 bg-surface-card text-gray-500 opacity-50 cursor-not-allowed"
              }`}
            >
              <p className="text-xs font-bold">{draw.time}</p>
              <p className="text-[10px] mt-0.5">
                {draw.status === "open" ? "Open" : "Soon"}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Number Selection */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-300">
            Pick 2 Numbers{" "}
            <span className="text-brand-red">({selectedNumbers.length}/2)</span>
          </h3>
          <Button size="sm" variant="secondary" onClick={handleQuickPick}>
            🎲 Quick Pick
          </Button>
        </div>

        {/* Selected Number Display */}
        <Card className="mb-3 flex items-center justify-center gap-4 py-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-16 h-16 rounded-full border-3 flex items-center justify-center text-2xl font-bold transition-all ${
                selectedNumbers[0]
                  ? "bg-brand-red border-brand-gold text-white shadow-lg shadow-brand-red/30"
                  : "bg-surface-elevated border-gray-600 border-dashed text-gray-500"
              }`}
            >
              {selectedNumbers[0] || "?"}
            </div>
            <span className="text-2xl font-bold text-brand-gold">—</span>
            <div
              className={`w-16 h-16 rounded-full border-3 flex items-center justify-center text-2xl font-bold transition-all ${
                selectedNumbers[1]
                  ? "bg-brand-red border-brand-gold text-white shadow-lg shadow-brand-red/30"
                  : "bg-surface-elevated border-gray-600 border-dashed text-gray-500"
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
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Bet Amount</h3>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => handleAmountSelect(amt)}
              className={`rounded-lg py-2.5 border font-bold text-sm transition-all cursor-pointer ${
                amount === amt && !customAmount
                  ? "border-brand-green bg-brand-green/10 text-brand-green"
                  : "border-gray-600 bg-surface-elevated text-gray-300 hover:border-gray-500"
              }`}
            >
              ₱{amt}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
            ₱
          </span>
          <input
            type="number"
            placeholder="Custom amount (min ₱5)"
            value={customAmount}
            onChange={(e) => handleCustomAmount(e.target.value)}
            min={5}
            className="w-full rounded-lg border border-gray-600 bg-surface-elevated pl-8 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold focus:outline-none"
          />
        </div>
      </section>

      {/* Add to Bet Slip */}
      <Button
        fullWidth
        size="lg"
        variant="primary"
        onClick={handleAddToBetSlip}
        disabled={selectedNumbers.length !== 2 || amount < 5}
      >
        Add to Bet Slip — {formatCurrency(amount)}
      </Button>

      {/* Bet Slip */}
      {betSlip.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white">
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
            {betSlip.map((bet) => (
              <Card key={bet.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {bet.numbers.map((num) => (
                      <span
                        key={num}
                        className="w-8 h-8 rounded-full bg-brand-red text-white text-xs font-bold flex items-center justify-center border border-brand-gold"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {bet.numbers[0]} - {bet.numbers[1]}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {bet.drawScheduleLabel}
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
                    className="text-gray-500 hover:text-red-400 cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Total & Submit */}
          <Card className="mt-3 bg-surface-elevated">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">Total Bets</span>
              <span className="text-white font-bold">
                {betSlip.length} bet(s)
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Total Amount</span>
              <span className="text-brand-gold font-bold text-lg">
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
              className="flex items-center justify-between bg-surface-elevated rounded-lg p-3"
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {bet.numbers.map((num) => (
                    <span
                      key={num}
                      className="w-7 h-7 rounded-full bg-brand-red text-white text-xs font-bold flex items-center justify-center"
                    >
                      {num}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-400">
                  {bet.drawScheduleLabel}
                </span>
              </div>
              <span className="text-brand-gold font-bold text-sm">
                {formatCurrency(bet.amount)}
              </span>
            </div>
          ))}

          <div className="border-t border-gray-700 pt-3 flex items-center justify-between">
            <span className="text-white font-semibold">Total</span>
            <span className="text-brand-gold font-bold text-xl">
              {formatCurrency(totalBet)}
            </span>
          </div>

          <p className="text-xs text-gray-400 text-center">
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
              isLoading={submitting}
              onClick={handleConfirmAll}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
