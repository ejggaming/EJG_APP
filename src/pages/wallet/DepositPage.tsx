import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input } from "../../components";
import { useAppStore } from "../../store/useAppStore";
import { formatCurrency } from "../../utils";
import toast from "react-hot-toast";

const PAYMENT_METHODS = [
  { id: "gcash", name: "GCash", icon: "📱", description: "Instant deposit" },
  { id: "maya", name: "Maya", icon: "💳", description: "Instant deposit" },
  { id: "bank", name: "Bank Transfer", icon: "🏦", description: "1-2 hours" },
];

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export default function DepositPage() {
  const navigate = useNavigate();
  const { balance, setBalance } = useAppStore();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const numAmount = parseFloat(amount) || 0;

  const handleDeposit = async () => {
    if (!selectedMethod) {
      toast.error("Select a payment method");
      return;
    }
    if (numAmount < 50) {
      toast.error("Minimum deposit is ₱50");
      return;
    }
    if (numAmount > 50000) {
      toast.error("Maximum deposit is ₱50,000");
      return;
    }

    setIsProcessing(true);
    // Mock API call
    await new Promise((r) => setTimeout(r, 1500));
    setBalance(balance + numAmount);
    toast.success(`${formatCurrency(numAmount)} deposited successfully!`);
    setIsProcessing(false);
    navigate("/wallet");
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">Deposit Funds</h1>
        <p className="text-gray-400 text-sm">
          Current balance:{" "}
          <span className="text-brand-gold font-semibold">
            {formatCurrency(balance)}
          </span>
        </p>
      </div>

      {/* Payment Method */}
      <div>
        <h2 className="text-sm font-semibold text-gray-300 mb-2">
          Payment Method
        </h2>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((method) => (
            <Card
              key={method.id}
              className={`flex items-center gap-3 cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? "ring-2 ring-brand-red border-brand-red"
                  : "hover:bg-surface-elevated"
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <span className="text-2xl">{method.icon}</span>
              <div className="flex-1">
                <p className="text-white font-medium">{method.name}</p>
                <p className="text-xs text-gray-400">{method.description}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === method.id
                    ? "border-brand-red bg-brand-red"
                    : "border-gray-500"
                }`}
              >
                {selectedMethod === method.id && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div>
        <h2 className="text-sm font-semibold text-gray-300 mb-2">Amount</h2>
        <Input
          label=""
          type="number"
          placeholder="Enter amount (₱50 - ₱50,000)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="grid grid-cols-3 gap-2 mt-2">
          {QUICK_AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(String(a))}
              className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                numAmount === a
                  ? "bg-brand-red text-white"
                  : "bg-surface-elevated text-gray-300 hover:bg-gray-600"
              }`}
            >
              {formatCurrency(a)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      {numAmount >= 50 && selectedMethod && (
        <Card className="border border-brand-gold/30">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Deposit Amount</span>
              <span className="text-white">{formatCurrency(numAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Service Fee</span>
              <span className="text-brand-green">FREE</span>
            </div>
            <hr className="border-gray-700 my-1" />
            <div className="flex justify-between font-bold">
              <span className="text-white">Total</span>
              <span className="text-brand-gold">
                {formatCurrency(numAmount)}
              </span>
            </div>
          </div>
        </Card>
      )}

      <Button
        variant="primary"
        fullWidth
        disabled={!selectedMethod || numAmount < 50}
        isLoading={isProcessing}
        onClick={handleDeposit}
      >
        Deposit {numAmount >= 50 ? formatCurrency(numAmount) : ""}
      </Button>
    </div>
  );
}
