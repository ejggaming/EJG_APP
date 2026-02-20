import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input } from "../../components";
import { useAppStore } from "../../store/useAppStore";
import { formatCurrency } from "../../utils";
import { useWithdrawMutation } from "../../hooks/useWallet";
import {
  Smartphone,
  CreditCard,
  Landmark,
  Check,
  ArrowUpRight,
} from "lucide-react";

const WITHDRAW_METHODS = [
  { id: "gcash", name: "GCash", Icon: Smartphone, description: "Instant" },
  { id: "maya", name: "Maya", Icon: CreditCard, description: "Instant" },
  {
    id: "bank",
    name: "Bank Transfer",
    Icon: Landmark,
    description: "1-3 business days",
  },
];

export default function WithdrawPage() {
  const navigate = useNavigate();
  const balance = useAppStore((s) => s.balance);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const withdrawMutation = useWithdrawMutation();

  const numAmount = parseFloat(amount) || 0;

  const handleWithdraw = () => {
    if (!selectedMethod) return;
    if (numAmount < 100 || numAmount > balance) return;
    if (!accountNumber.trim() || !accountName.trim()) return;

    withdrawMutation.mutate(
      {
        amount: numAmount,
        paymentMethod: selectedMethod,
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim(),
      },
      { onSuccess: () => navigate("/wallet") },
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold text-text-primary chinese-header">
          Withdraw Funds
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Available balance:{" "}
          <span className="gold-shimmer font-semibold">
            {formatCurrency(balance)}
          </span>
        </p>
      </div>

      {/* Withdrawal Method */}
      <div>
        <h2 className="text-sm font-semibold text-text-secondary mb-2">
          ✦ Withdrawal Method
        </h2>
        <div className="space-y-2">
          {WITHDRAW_METHODS.map((method, index) => (
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

      {/* Account Details */}
      {selectedMethod && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-text-secondary">
            ✦ Account Details
          </h2>
          <Input
            label="Account Number / Mobile"
            placeholder={
              selectedMethod === "bank"
                ? "Enter bank account number"
                : "09XX XXX XXXX"
            }
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <Input
            label="Account Name"
            placeholder="Enter full name on account"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
        </div>
      )}

      {/* Amount */}
      <div>
        <h2 className="text-sm font-semibold text-text-secondary mb-2">
          ✦ Amount
        </h2>
        <Input
          label=""
          type="number"
          placeholder={`Min ₱100 · Max ${formatCurrency(balance)}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          onClick={() => setAmount(String(balance))}
          className="text-xs text-brand-gold mt-1 hover:underline"
        >
          Withdraw all ({formatCurrency(balance)})
        </button>
      </div>

      {/* Summary */}
      {numAmount >= 100 && selectedMethod && (
        <Card ornate bento delay={400} className="lantern-card">
          <h3 className="text-sm font-semibold text-text-secondary mb-2">
            ✦ Summary
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Withdraw Amount</span>
              <span className="text-text-primary">
                {formatCurrency(numAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Processing Fee</span>
              <span className="text-brand-green">FREE</span>
            </div>
            <hr className="border-brand-gold/15 my-1" />
            <div className="flex justify-between font-bold">
              <span className="text-text-primary">You will receive</span>
              <span className="gold-shimmer">{formatCurrency(numAmount)}</span>
            </div>
          </div>
        </Card>
      )}

      <Button
        variant="primary"
        fullWidth
        disabled={!selectedMethod || numAmount < 100 || numAmount > balance}
        isLoading={withdrawMutation.isPending}
        onClick={handleWithdraw}
      >
        <ArrowUpRight className="w-4 h-4 inline mr-1" /> Withdraw{" "}
        {numAmount >= 100 ? formatCurrency(numAmount) : ""}
      </Button>
    </div>
  );
}
