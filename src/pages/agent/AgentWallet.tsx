import { useState } from "react";
import { Card, Button, Input } from "../../components";
import { useAppStore } from "../../store/useAppStore";
import { formatCurrency } from "../../utils";
import toast from "react-hot-toast";

const METHODS = [
  { id: "gcash", name: "GCash", icon: "📱" },
  { id: "maya", name: "Maya", icon: "💳" },
  { id: "bank", name: "Bank Transfer", icon: "🏦" },
];

const MOCK_TX = [
  {
    id: "1",
    type: "commission",
    amount: 480,
    label: "11:00 AM Draw Commission",
    date: "Feb 19, 2026",
  },
  {
    id: "2",
    type: "commission",
    amount: 420,
    label: "9:00 PM Draw Commission",
    date: "Feb 18, 2026",
  },
  {
    id: "3",
    type: "withdraw",
    amount: -2000,
    label: "GCash Withdrawal",
    date: "Feb 17, 2026",
  },
  {
    id: "4",
    type: "commission",
    amount: 615,
    label: "4:00 PM Draw Commission",
    date: "Feb 18, 2026",
  },
];

export default function AgentWallet() {
  const { balance, setBalance } = useAppStore();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const numAmount = parseFloat(amount) || 0;

  const handleWithdraw = async () => {
    if (!method) {
      toast.error("Select a method");
      return;
    }
    if (numAmount < 100) {
      toast.error("Minimum ₱100");
      return;
    }
    if (numAmount > balance) {
      toast.error("Insufficient balance");
      return;
    }
    if (!account.trim()) {
      toast.error("Enter account number");
      return;
    }

    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setBalance(balance - numAmount);
    toast.success(`${formatCurrency(numAmount)} withdrawal submitted!`);
    setIsProcessing(false);
    setShowWithdraw(false);
    setAmount("");
    setAccount("");
    setMethod("");
  };

  return (
    <div className="space-y-4 pb-20 md:pb-4">
      {/* Balance */}
      <Card className="bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border-brand-gold/30">
        <p className="text-sm text-gray-300">Commission Wallet</p>
        <p className="text-3xl font-bold text-brand-gold mt-1">
          {formatCurrency(balance)}
        </p>
        <Button
          variant="gold"
          size="sm"
          className="mt-3"
          onClick={() => setShowWithdraw(!showWithdraw)}
        >
          {showWithdraw ? "Cancel" : "Withdraw"}
        </Button>
      </Card>

      {/* Withdraw Form */}
      {showWithdraw && (
        <Card className="border border-brand-gold/30 space-y-3">
          <h3 className="text-sm font-semibold text-white">
            Withdraw Commission
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`py-2 rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition-colors ${
                  method === m.id
                    ? "bg-brand-gold text-white"
                    : "bg-surface-elevated text-gray-300 hover:bg-gray-600"
                }`}
              >
                <span className="text-lg">{m.icon}</span>
                {m.name}
              </button>
            ))}
          </div>
          <Input
            label="Account Number / Mobile"
            placeholder="09XX XXX XXXX"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
          <Input
            label="Amount"
            type="number"
            placeholder={`Min ₱100 · Max ${formatCurrency(balance)}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            variant="gold"
            fullWidth
            isLoading={isProcessing}
            disabled={numAmount < 100}
            onClick={handleWithdraw}
          >
            Withdraw {numAmount >= 100 ? formatCurrency(numAmount) : ""}
          </Button>
        </Card>
      )}

      {/* Transaction History */}
      <div>
        <h2 className="text-sm font-semibold text-gray-300 mb-2">
          Transaction History
        </h2>
        <div className="space-y-2">
          {MOCK_TX.map((tx) => (
            <Card key={tx.id} className="flex items-center gap-3">
              <div
                className={`text-xl ${tx.amount >= 0 ? "text-brand-green" : "text-brand-red"}`}
              >
                {tx.amount >= 0 ? "💰" : "↑"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {tx.label}
                </p>
                <p className="text-[10px] text-gray-500">{tx.date}</p>
              </div>
              <span
                className={`text-sm font-bold ${tx.amount >= 0 ? "text-brand-green" : "text-white"}`}
              >
                {tx.amount >= 0 ? "+" : ""}
                {formatCurrency(Math.abs(tx.amount))}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
