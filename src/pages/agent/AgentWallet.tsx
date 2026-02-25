import { useState } from "react";
import { Button, Input } from "../../components";
import { DataTable } from "../../components/bento";
import type { DataTableColumn } from "../../components/bento";
import { formatCurrency } from "../../utils";
import toast from "react-hot-toast";
import { ShieldCheck, Gift } from "lucide-react";
import { AgentWalletSkeleton } from "../../components/ChineseSkeleton";
import { useMyWalletQuery, useTransactionsQuery, useWithdrawMutation } from "../../hooks/useWallet";
import type { Transaction } from "../../services/walletService";

const METHODS = [
  { id: "GCASH", name: "GCash", icon: "📱" },
  { id: "MAYA", name: "Maya", icon: "💳" },
  { id: "BANK_TRANSFER", name: "Bank Transfer", icon: "🏦" },
];

const txTypeColors: Record<string, string> = {
  COMMISSION_PAYOUT: "bg-brand-green/20 text-brand-green",
  JUETENG_PAYOUT: "bg-brand-green/20 text-brand-green",
  DEPOSIT: "bg-blue-500/20 text-blue-400",
  WITHDRAWAL: "bg-brand-red/20 text-brand-red",
  JUETENG_BET: "bg-orange-500/20 text-orange-400",
  ADJUSTMENT: "bg-gray-500/20 text-gray-400",
};

const txTypeLabel: Record<string, string> = {
  COMMISSION_PAYOUT: "Commission",
  JUETENG_PAYOUT: "Winnings",
  DEPOSIT: "Deposit",
  WITHDRAWAL: "Withdrawal",
  JUETENG_BET: "Bet",
  ADJUSTMENT: "Adjustment",
};

const txStatusColors: Record<string, string> = {
  PENDING: "bg-brand-gold/20 text-brand-gold",
  COMPLETED: "bg-brand-green/20 text-brand-green",
  FAILED: "bg-brand-red/20 text-brand-red",
  REVERSED: "bg-orange-500/20 text-orange-400",
};

export default function AgentWallet() {
  const { data: walletData, isLoading: walletLoading } = useMyWalletQuery();
  const { data: txData, isLoading: txLoading } = useTransactionsQuery({ limit: 50 });
  const withdraw = useWithdrawMutation();

  const wallet = walletData?.wallet;
  const transactions = txData?.transactions ?? [];

  const [showWithdraw, setShowWithdraw] = useState(false);
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("");
  const [accountName, setAccountName] = useState("");

  const numAmount = parseFloat(amount) || 0;
  const balance = wallet?.balance ?? 0;

  const handleWithdraw = () => {
    if (!method) { toast.error("Select a method"); return; }
    if (numAmount < 100) { toast.error("Minimum ₱100"); return; }
    if (numAmount > balance) { toast.error("Insufficient balance"); return; }
    if (!account.trim()) { toast.error("Enter account number"); return; }
    if (!accountName.trim()) { toast.error("Enter account name"); return; }

    withdraw.mutate(
      { amount: numAmount, paymentMethod: method, accountNumber: account, accountName },
      {
        onSuccess: () => {
          setShowWithdraw(false);
          setAmount("");
          setAccount("");
          setAccountName("");
          setMethod("");
        },
      },
    );
  };

  if (walletLoading || txLoading) return <AgentWalletSkeleton />;

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
                    wallet?.status === "ACTIVE"
                      ? "bg-emerald-500/30 text-emerald-300"
                      : wallet?.status === "FROZEN"
                        ? "bg-red-500/30 text-red-300"
                        : "bg-gray-500/30 text-gray-300"
                  }`}
                >
                  {wallet?.status ?? "ACTIVE"}
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold gold-shimmer mt-2">
                {formatCurrency(balance)}
              </p>
              <div className="flex items-center gap-4 mt-2">
                {(wallet?.bonus ?? 0) > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Gift size={12} className="text-amber-300" />
                    <span className="text-xs text-white/70">
                      Bonus: {formatCurrency(wallet?.bonus ?? 0)}
                    </span>
                  </div>
                )}
                <span className="text-[10px] text-white/40">
                  {wallet?.currency ?? "PHP"}
                </span>
              </div>
              <button
                onClick={() => setShowWithdraw(!showWithdraw)}
                disabled={wallet?.status !== "ACTIVE"}
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
            label="Account Name"
            placeholder="Full name on account"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
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
            isLoading={withdraw.isPending}
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
                      txTypeColors[v] ?? "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {txTypeLabel[v] ?? v}
                  </span>
                ),
              },
              {
                key: "description",
                label: "Description",
                sortable: false,
                render: (v: string | null, row: Transaction) => (
                  <span className="text-sm text-text-secondary">
                    {v ?? row.type}
                  </span>
                ),
              },
              {
                key: "reference",
                label: "Reference",
                sortable: true,
                render: (v: string) => (
                  <span className="font-mono text-xs text-text-muted">{v}</span>
                ),
              },
              {
                key: "createdAt",
                label: "Date",
                sortable: true,
                render: (v: string) =>
                  new Date(v).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }),
              },
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
                render: (v: number, row: Transaction) => {
                  const isCredit = row.type === "COMMISSION_PAYOUT" || row.type === "JUETENG_PAYOUT" || row.type === "DEPOSIT";
                  return (
                    <span className={`font-bold ${isCredit ? "text-brand-green" : "text-brand-red"}`}>
                      {isCredit ? "+" : "-"}
                      {formatCurrency(Math.abs(v))}
                    </span>
                  );
                },
              },
            ] satisfies DataTableColumn[]
          }
          data={transactions}
          pageSize={10}
          exportable
        />
    </div>
  );
}
