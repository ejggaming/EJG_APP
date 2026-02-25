import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input } from "../../components";
import { useAppStore } from "../../store/useAppStore";
import { formatCurrency } from "../../utils";
import { useDepositMutation } from "../../hooks/useWallet";
import { Smartphone, CreditCard, Landmark, Check, Wallet } from "lucide-react";

const PAYMENT_METHODS = [
  {
    id: "gcash",
    name: "GCash",
    Icon: Smartphone,
    description: "Instant deposit",
  },
  {
    id: "maya",
    name: "Maya",
    Icon: CreditCard,
    description: "Instant deposit",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    Icon: Landmark,
    description: "1-2 hours",
  },
];

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export default function DepositPage() {
  const navigate = useNavigate();
  const balance = useAppStore((s) => s.balance);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState("");

  const depositMutation = useDepositMutation();

  const numAmount = parseFloat(amount) || 0;

  const handleDeposit = () => {
    if (!selectedMethod) return;
    if (numAmount < 50 || numAmount > 50000) return;

    depositMutation.mutate(
      { amount: numAmount, paymentMethod: selectedMethod },
      { onSuccess: () => navigate("/wallet") },
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold text-text-primary chinese-header">
          Deposit Funds
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Current balance:{" "}
          <span className="gold-shimmer font-semibold">
            {formatCurrency(balance)}
          </span>
        </p>
      </div>

      {/* Payment Method */}
      <div>
        <h2 className="text-sm font-semibold text-text-secondary mb-2">
          ✦ Payment Method
        </h2>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((method, index) => (
            <Card
              key={method.id}
              bento
              delay={100 + index * 100}
              className={`flex items-center gap-3 cursor-pointer transition-all lantern-card ${
                selectedMethod === method.id
                  ? "ring-2 ring-brand-gold border-brand-gold/50"
                  : "hover:border-brand-gold/20"
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <method.Icon className="w-6 h-6 text-brand-gold" />
              <div className="flex-1">
                <p className="text-text-primary font-medium">{method.name}</p>
                <p className="text-xs text-text-muted">{method.description}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === method.id
                    ? "border-brand-gold bg-brand-gold"
                    : "border-border-default"
                }`}
              >
                {selectedMethod === method.id && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div>
        <h2 className="text-sm font-semibold text-text-secondary mb-2">
          ✦ Amount
        </h2>
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
              className={`py-2 rounded-xl text-sm font-semibold transition-all border-2 ${
                numAmount === a
                  ? "bg-brand-red/15 text-brand-red border-brand-red/30"
                  : "bg-surface-card text-text-muted border-brand-gold/10 hover:border-brand-gold/25"
              }`}
            >
              {formatCurrency(a)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      {numAmount >= 50 && selectedMethod && (
        <Card ornate bento delay={400} className="lantern-card">
          <h3 className="text-sm font-semibold text-text-secondary mb-2">
            ✦ Summary
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Deposit Amount</span>
              <span className="text-text-primary">
                {formatCurrency(numAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Service Fee</span>
              <span className="text-brand-green">FREE</span>
            </div>
            <hr className="border-brand-gold/15 my-1" />
            <div className="flex justify-between font-bold">
              <span className="text-text-primary">Total</span>
              <span className="gold-shimmer">{formatCurrency(numAmount)}</span>
            </div>
          </div>
        </Card>
      )}

      <Button
        variant="primary"
        fullWidth
        disabled={!selectedMethod || numAmount < 50}
        isLoading={depositMutation.isPending}
        onClick={handleDeposit}
      >
        <Wallet className="w-4 h-4 inline mr-1" /> Deposit{" "}
        {numAmount >= 50 ? formatCurrency(numAmount) : ""}
      </Button>
    </div>
  );
}
