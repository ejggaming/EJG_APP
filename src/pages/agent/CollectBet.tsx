import { useState } from "react";
import { Card, Button, Input, Modal } from "../../components";
import { useAppStore } from "../../store/useAppStore";
import { formatCurrency } from "../../utils";
import toast from "react-hot-toast";

const DRAW_SCHEDULES = [
  { id: "d1", label: "11:00 AM Draw", status: "open" },
  { id: "d2", label: "4:00 PM Draw", status: "upcoming" },
  { id: "d3", label: "9:00 PM Draw", status: "upcoming" },
];

const CUSTOMERS = [
  { id: "1", name: "Maria Santos", mobile: "09171234567" },
  { id: "2", name: "Pedro Reyes", mobile: "09189876543" },
  { id: "3", name: "Anna Cruz", mobile: "09201234567" },
  { id: "4", name: "Jose Garcia", mobile: "09221111222" },
];

const BET_AMOUNTS = [5, 10, 20, 50, 100, 500];

export default function CollectBet() {
  const { balance, setBalance } = useAppStore();
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedDraw, setSelectedDraw] = useState(DRAW_SCHEDULES[0].id);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const betAmount = parseFloat(amount || customAmount) || 0;

  const toggleNumber = (n: number) => {
    if (numbers.includes(n)) {
      setNumbers(numbers.filter((x) => x !== n));
    } else if (numbers.length < 2) {
      setNumbers([...numbers, n]);
    }
  };

  const resetForm = () => {
    setNumbers([]);
    setAmount("");
    setCustomAmount("");
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    const commission = betAmount * 0.15;
    setBalance(balance + commission);
    toast.success(`Bet collected! Commission: ${formatCurrency(commission)}`);
    setIsSubmitting(false);
    setShowConfirm(false);
    resetForm();
  };

  const canSubmit =
    selectedCustomer && numbers.length === 2 && betAmount >= 5 && selectedDraw;

  const drawLabel =
    DRAW_SCHEDULES.find((d) => d.id === selectedDraw)?.label ?? "";
  const customerName =
    CUSTOMERS.find((c) => c.id === selectedCustomer)?.name ?? "";

  return (
    <div className="space-y-4 pb-20 md:pb-4">
      <div>
        <h1 className="text-xl font-bold text-white">Collect Bet</h1>
        <p className="text-gray-400 text-sm">Place bet on behalf of customer</p>
      </div>

      {/* Customer Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Customer
        </label>
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="w-full bg-surface-elevated border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none"
        >
          <option value="">Select customer</option>
          {CUSTOMERS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.mobile})
            </option>
          ))}
        </select>
      </div>

      {/* Draw Schedule */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Draw Schedule
        </label>
        <div className="grid grid-cols-3 gap-2">
          {DRAW_SCHEDULES.map((draw) => (
            <button
              key={draw.id}
              onClick={() => setSelectedDraw(draw.id)}
              disabled={draw.status === "closed"}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                selectedDraw === draw.id
                  ? "bg-brand-gold text-white"
                  : "bg-surface-elevated text-gray-300 hover:bg-gray-600"
              } disabled:opacity-40`}
            >
              {draw.label}
            </button>
          ))}
        </div>
      </div>

      {/* Number Grid */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-300">
            Select 2 Numbers ({numbers.length}/2)
          </label>
          {numbers.length > 0 && (
            <button
              onClick={() => setNumbers([])}
              className="text-xs text-brand-gold hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        {numbers.length === 2 && (
          <div className="flex items-center justify-center gap-3 py-3">
            {numbers.map((n) => (
              <span
                key={n}
                className="w-12 h-12 rounded-full bg-brand-red text-white text-lg font-bold flex items-center justify-center border-2 border-brand-gold"
              >
                {n}
              </span>
            ))}
          </div>
        )}
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 37 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => toggleNumber(n)}
              className={`w-full aspect-square rounded-full text-sm font-bold transition-all ${
                numbers.includes(n)
                  ? "bg-brand-red text-white border-2 border-brand-gold scale-110"
                  : "bg-surface-elevated text-gray-300 hover:bg-gray-600 border border-gray-600"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Bet Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Bet Amount
        </label>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {BET_AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => {
                setAmount(String(a));
                setCustomAmount("");
              }}
              className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                betAmount === a
                  ? "bg-brand-gold text-white"
                  : "bg-surface-elevated text-gray-300 hover:bg-gray-600"
              }`}
            >
              ₱{a}
            </button>
          ))}
        </div>
        <Input
          label=""
          type="number"
          placeholder="Or enter custom amount (min ₱5)"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
            setAmount("");
          }}
        />
      </div>

      {/* Submit */}
      <Button
        variant="gold"
        fullWidth
        size="lg"
        disabled={!canSubmit}
        onClick={() => setShowConfirm(true)}
      >
        Collect Bet — {betAmount >= 5 ? formatCurrency(betAmount) : "₱0.00"}
      </Button>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Bet Collection"
      >
        <div className="space-y-3">
          <Card>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Customer</span>
                <span className="text-white font-medium">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Numbers</span>
                <span className="text-white font-bold">
                  {numbers.join(" - ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Draw</span>
                <span className="text-white">{drawLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bet Amount</span>
                <span className="text-brand-gold font-bold">
                  {formatCurrency(betAmount)}
                </span>
              </div>
              <hr className="border-gray-700" />
              <div className="flex justify-between">
                <span className="text-gray-400">Your Commission (15%)</span>
                <span className="text-brand-green font-bold">
                  {formatCurrency(betAmount * 0.15)}
                </span>
              </div>
            </div>
          </Card>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="gold"
              fullWidth
              isLoading={isSubmitting}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
