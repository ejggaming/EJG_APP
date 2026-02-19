import { useState } from "react";
import { Button, Input } from "../../components";
import { DataTable } from "../../components/bento";
import type { DataTableColumn } from "../../components/bento";
import { useAppStore } from "../../store/useAppStore";
import { formatCurrency } from "../../utils";
import toast from "react-hot-toast";
import { ShieldCheck, Gift } from "lucide-react";

const METHODS = [
  { id: "gcash", name: "GCash", icon: "📱" },
  { id: "maya", name: "Maya", icon: "💳" },
  { id: "bank", name: "Bank Transfer", icon: "🏦" },
];

/* ── Wallet Info (from /api/wallet) ── */
const WALLET_INFO = {
  currency: "PHP",
  bonus: 250,
  status: "ACTIVE" as const,
};

/* ── Transaction History (from combined commission + payout + withdrawal data) ── */
const MOCK_TX = [
  {
    id: "1",
    type: "commission",
    amount: 480,
    label: "11:00 AM MORNING Draw Commission",
    reference: "COM-20260219-001",
    date: "Feb 19, 2026",
    status: "PENDING" as const,
  },
  {
    id: "2",
    type: "commission",
    amount: 420,
    label: "4:00 PM AFTERNOON Draw Commission",
    reference: "COM-20260218-003",
    date: "Feb 18, 2026",
    status: "PAID" as const,
  },
  {
    id: "3",
    type: "withdraw",
    amount: -2000,
    label: "GCash Withdrawal",
    reference: "WD-20260217-001",
    date: "Feb 17, 2026",
    status: "PAID" as const,
  },
  {
    id: "4",
    type: "commission",
    amount: 615,
    label: "11:00 AM MORNING Draw Commission",
    reference: "COM-20260218-002",
    date: "Feb 18, 2026",
    status: "PAID" as const,
  },
  {
    id: "5",
    type: "commission",
    amount: 292.5,
    label: "4:00 PM AFTERNOON Draw Commission",
    reference: "COM-20260218-001",
    date: "Feb 18, 2026",
    status: "PAID" as const,
  },
  {
    id: "6",
    type: "bonus",
    amount: 250,
    label: "Referral Bonus — Carlos Mendoza",
    reference: "BNS-20260218-001",
    date: "Feb 18, 2026",
    status: "PAID" as const,
  },
  {
    id: "7",
    type: "withdraw",
    amount: -1500,
    label: "Maya Withdrawal",
    reference: "WD-20260215-001",
    date: "Feb 15, 2026",
    status: "PAID" as const,
  },
];

const txStatusColors: Record<string, string> = {
  PENDING: "bg-brand-gold/20 text-brand-gold",
  PAID: "bg-brand-green/20 text-brand-green",
  FAILED: "bg-brand-red/20 text-brand-red",
};

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
    <div className="space-y-6">
      {/* ── Balance Hero ── */}
      <div
        className="card-3d overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #78350f 0%, #92400e 30%, #b45309 60%, #78350f 100%)",
        }}
      >
        <div className="relative p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-white/60 text-xs uppercase tracking-widest">
                  ✦ Commission Wallet ✦
                </p>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    WALLET_INFO.status === "ACTIVE"
                      ? "bg-emerald-500/30 text-emerald-300"
                      : WALLET_INFO.status === "FROZEN"
                        ? "bg-red-500/30 text-red-300"
                        : "bg-gray-500/30 text-gray-300"
                  }`}
                >
                  {WALLET_INFO.status}
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold gold-shimmer mt-2">
                {formatCurrency(balance)}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <Gift size={12} className="text-amber-300" />
                  <span className="text-xs text-white/70">
                    Bonus: {formatCurrency(WALLET_INFO.bonus)}
                  </span>
                </div>
                <span className="text-[10px] text-white/40">
                  {WALLET_INFO.currency}
                </span>
              </div>
              <button
                onClick={() => setShowWithdraw(!showWithdraw)}
                disabled={WALLET_INFO.status !== "ACTIVE"}
                className="mt-3 px-5 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors border border-white/10 disabled:opacity-40"
              >
                {showWithdraw ? "Cancel" : "Withdraw Funds"}
              </button>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-[10px] text-white/50 uppercase tracking-widest">
                Available
              </p>
              <p className="text-2xl font-extrabold text-emerald-300">
                {formatCurrency(balance)}
              </p>
              <p className="text-xs text-white/40 mt-1">
                + {formatCurrency(WALLET_INFO.bonus)} bonus
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Form */}
      {showWithdraw && (
        <div className="card-3d p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Withdraw Commission
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`py-3 rounded-xl text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                  method === m.id
                    ? "bg-brand-gold text-white shadow-lg shadow-brand-gold/20"
                    : "bg-surface-elevated text-text-secondary hover:bg-surface-elevated/80"
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
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-brand-gold/5 border border-brand-gold/20">
            <ShieldCheck size={14} className="text-brand-gold shrink-0" />
            <p className="text-[10px] text-text-muted">
              OTP verification will be sent to your registered phone/email for
              withdrawal confirmation
            </p>
          </div>
          <Button
            variant="gold"
            fullWidth
            isLoading={isProcessing}
            disabled={numAmount < 100}
            onClick={handleWithdraw}
          >
            Withdraw {numAmount >= 100 ? formatCurrency(numAmount) : ""}
          </Button>
        </div>
      )}

      {/* Transaction History DataTable */}
      <DataTable
        title="Transaction History"
        columns={
          [
            {
              key: "type",
              label: "Type",
              sortable: true,
              render: (v: string) => (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                    v === "commission"
                      ? "bg-brand-green/20 text-brand-green"
                      : v === "bonus"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-brand-red/20 text-brand-red"
                  }`}
                >
                  {v}
                </span>
              ),
            },
            { key: "label", label: "Description", sortable: true },
            {
              key: "reference",
              label: "Reference",
              sortable: true,
              render: (v: string) => (
                <span className="font-mono text-xs text-text-muted">{v}</span>
              ),
            },
            { key: "date", label: "Date", sortable: true },
            {
              key: "status",
              label: "Status",
              sortable: true,
              render: (v: string) => (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${txStatusColors[v] ?? ""}`}
                >
                  {v}
                </span>
              ),
            },
            {
              key: "amount",
              label: "Amount",
              align: "right" as const,
              sortable: true,
              render: (v: number) => (
                <span
                  className={`font-bold ${v >= 0 ? "text-brand-green" : "text-brand-red"}`}
                >
                  {v >= 0 ? "+" : ""}
                  {formatCurrency(Math.abs(v))}
                </span>
              ),
            },
          ] satisfies DataTableColumn[]
        }
        data={MOCK_TX}
        pageSize={10}
        exportable
      />
    </div>
  );
}
