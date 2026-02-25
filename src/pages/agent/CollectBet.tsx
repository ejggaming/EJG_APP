import { useState } from "react";
import { Button, Input, Modal } from "../../components";
import { DataTable } from "../../components/bento";
import type { DataTableColumn } from "../../components/bento";
import { useAppStore } from "../../store/useAppStore";
import type { BetSlipItem } from "../../store/useAppStore";
import { formatCurrency } from "../../utils";
import toast from "react-hot-toast";
import {
  Shuffle,
  Plus,
  Trash2,
  Receipt,
  Clock,
  CheckCircle,
  XCircle,
  Copy,
} from "lucide-react";

/* ── Game Config (from JuetengConfig API) ── */
const GAME_CONFIG = {
  maxNumber: 37,
  allowRepeat: true,
  payoutMultiplier: 500,
  minBet: 1,
  maxBet: 1000,
  cobradorRate: 0.15,
  currency: "PHP",
};

/* ── Draw Schedules (from DrawSchedule + JuetengDraw APIs) ── */
const DRAW_SCHEDULES = [
  {
    id: "d1",
    label: "11:00 AM",
    drawType: "MORNING" as const,
    status: "OPEN" as string,
    scheduledAt: "2026-02-19T11:00:00",
    totalBets: 87,
    totalStake: 4350,
  },
  {
    id: "d2",
    label: "4:00 PM",
    drawType: "AFTERNOON" as const,
    status: "SCHEDULED" as string,
    scheduledAt: "2026-02-19T16:00:00",
    totalBets: 0,
    totalStake: 0,
  },
];

/* ── Customers (from Agent's bettor list) ── */
const CUSTOMERS = [
  {
    id: "1",
    name: "Maria Santos",
    mobile: "09171234567",
    kycStatus: "APPROVED" as const,
  },
  {
    id: "2",
    name: "Pedro Reyes",
    mobile: "09189876543",
    kycStatus: "APPROVED" as const,
  },
  {
    id: "3",
    name: "Anna Cruz",
    mobile: "09201234567",
    kycStatus: "APPROVED" as const,
  },
  {
    id: "4",
    name: "Jose Garcia",
    mobile: "09221111222",
    kycStatus: "PENDING" as const,
  },
];

const BET_AMOUNTS = [5, 10, 20, 50, 100, 500];

const drawStatusColors: Record<string, { bg: string; text: string }> = {
  OPEN: { bg: "bg-brand-green/20", text: "text-brand-green" },
  SCHEDULED: { bg: "bg-brand-gold/20", text: "text-brand-gold" },
  CLOSED: { bg: "bg-brand-red/20", text: "text-brand-red" },
  DRAWN: { bg: "bg-purple-500/20", text: "text-purple-400" },
  SETTLED: { bg: "bg-gray-500/20", text: "text-gray-400" },
};

/* ── Recent Bets (from JuetengBet API) ── */
const MOCK_RECENT_BETS = [
  {
    id: "1",
    reference: "20260219-MRN-00012",
    customer: "Maria Santos",
    numbers: "12 - 35",
    combinationKey: "12-35",
    amount: 50,
    draw: "11:00 AM",
    status: "PENDING" as const,
    time: "10:12 AM",
  },
  {
    id: "2",
    reference: "20260219-MRN-00011",
    customer: "Pedro Reyes",
    numbers: "7 - 23",
    combinationKey: "7-23",
    amount: 100,
    draw: "11:00 AM",
    status: "PENDING" as const,
    time: "10:08 AM",
  },
  {
    id: "3",
    reference: "20260218-AFT-00045",
    customer: "Anna Cruz",
    numbers: "19 - 31",
    combinationKey: "19-31",
    amount: 20,
    draw: "4:00 PM",
    status: "WON" as const,
    time: "3:30 PM",
  },
  {
    id: "4",
    reference: "20260218-MRN-00044",
    customer: "Jose Garcia",
    numbers: "3 - 28",
    combinationKey: "3-28",
    amount: 50,
    draw: "11:00 AM",
    status: "LOST" as const,
    time: "9:40 AM",
  },
  {
    id: "5",
    reference: "20260218-MRN-00043",
    customer: "Maria Santos",
    numbers: "15 - 22",
    combinationKey: "15-22",
    amount: 100,
    draw: "11:00 AM",
    status: "LOST" as const,
    time: "9:20 AM",
  },
];

const betStatusColors: Record<string, string> = {
  PENDING: "bg-brand-gold/20 text-brand-gold",
  WON: "bg-brand-green/20 text-brand-green",
  LOST: "bg-gray-500/20 text-gray-400",
  VOID: "bg-brand-red/20 text-brand-red",
  REFUNDED: "bg-blue-500/20 text-blue-400",
};

/* ── Helper: generate reference number ── */
function generateReference(drawType: string): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const prefix = drawType === "MORNING" ? "MRN" : "AFT";
  const seq = String(Math.floor(Math.random() * 99999)).padStart(5, "0");
  return `${date}-${prefix}-${seq}`;
}

/* ── Helper: build combination key (sorted min-max) ── */
function buildCombinationKey(n1: number, n2: number): string {
  return [n1, n2].sort((a, b) => a - b).join("-");
}

export default function CollectBet() {
  const {
    balance,
    setBalance,
    betSlip,
    addToBetSlip,
    removeFromBetSlip,
    clearBetSlip,
  } = useAppStore();
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedDraw, setSelectedDraw] = useState(DRAW_SCHEDULES[0].id);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<{
    references: string[];
    customer: string;
    draw: string;
    items: { numbers: string; amount: number; reference: string }[];
    totalAmount: number;
    totalCommission: number;
  } | null>(null);

  const betAmount = parseFloat(amount || customAmount) || 0;
  const selectedDrawData = DRAW_SCHEDULES.find((d) => d.id === selectedDraw);
  const drawLabel = selectedDrawData?.label ?? "";
  const drawType = selectedDrawData?.drawType ?? "MORNING";
  const customerName =
    CUSTOMERS.find((c) => c.id === selectedCustomer)?.name ?? "";
  const customerData = CUSTOMERS.find((c) => c.id === selectedCustomer);

  const toggleNumber = (n: number) => {
    if (numbers.includes(n)) {
      setNumbers(numbers.filter((x) => x !== n));
    } else if (numbers.length < 2) {
      setNumbers([...numbers, n]);
    }
  };

  /* ── Quick Pick: random 2 numbers ── */
  const handleQuickPick = () => {
    const picked = new Set<number>();
    while (picked.size < 2) {
      picked.add(Math.floor(Math.random() * GAME_CONFIG.maxNumber) + 1);
    }
    setNumbers(Array.from(picked));
  };

  const resetForm = () => {
    setNumbers([]);
    setAmount("");
    setCustomAmount("");
  };

  /* ── Add to Bet Slip ── */
  const handleAddToSlip = () => {
    if (numbers.length !== 2 || betAmount < GAME_CONFIG.minBet) return;
    const item: BetSlipItem = {
      id: crypto.randomUUID(),
      numbers: [numbers[0], numbers[1]],
      amount: betAmount,
      drawId: selectedDraw,
      drawLabel: `${drawLabel} ${drawType}`,
    };
    addToBetSlip(item);
    resetForm();
    toast.success("Added to bet slip");
  };

  /* ── Submit all bets (slip or single) ── */
  const handleConfirm = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));

    const items =
      betSlip.length > 0
        ? betSlip.map((b) => ({
            numbers: `${b.numbers[0]} - ${b.numbers[1]}`,
            amount: b.amount,
            reference: generateReference(drawType),
          }))
        : [
            {
              numbers: `${numbers[0]} - ${numbers[1]}`,
              amount: betAmount,
              reference: generateReference(drawType),
            },
          ];

    const totalAmount = items.reduce((a, i) => a + i.amount, 0);
    const totalCommission = totalAmount * GAME_CONFIG.cobradorRate;

    setBalance(balance + totalCommission);

    setLastReceipt({
      references: items.map((i) => i.reference),
      customer: customerName,
      draw: `${drawLabel} ${drawType}`,
      items,
      totalAmount,
      totalCommission,
    });

    clearBetSlip();
    setIsSubmitting(false);
    setShowConfirm(false);
    resetForm();
    setShowReceipt(true);
    toast.success(
      `${items.length} bet${items.length > 1 ? "s" : ""} collected! Commission: ${formatCurrency(totalCommission)}`,
    );
  };

  const slipTotal = betSlip.reduce((a, b) => a + b.amount, 0);
  const canAddToSlip =
    selectedCustomer &&
    numbers.length === 2 &&
    betAmount >= GAME_CONFIG.minBet &&
    betAmount <= GAME_CONFIG.maxBet &&
    selectedDraw &&
    selectedDrawData?.status === "OPEN";
  const canSubmitDirect =
    canAddToSlip || (betSlip.length > 0 && selectedCustomer);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Collect Bet</h1>
          <p className="text-text-muted mt-1">
            Place bets on behalf of customer · {GAME_CONFIG.payoutMultiplier}×
            payout
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-text-muted uppercase tracking-wider">
            Bet Limits
          </p>
          <p className="text-sm font-medium text-text-primary">
            ₱{GAME_CONFIG.minBet} – ₱{GAME_CONFIG.maxBet}
          </p>
        </div>
      </div>

      {/* ── Customer & Draw Selection ── */}
      <div className="card-3d p-5 space-y-4">
        {/* Customer */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Customer
          </label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="w-full bg-surface-elevated border border-border-default rounded-lg px-3 py-2.5 text-text-primary text-sm focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none"
          >
            <option value="">Select customer</option>
            {CUSTOMERS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.mobile})
              </option>
            ))}
          </select>
          {customerData && customerData.kycStatus !== "APPROVED" && (
            <p className="text-xs text-brand-gold mt-1 flex items-center gap-1">
              <Clock size={12} />
              KYC {customerData.kycStatus.toLowerCase()} — bet may require
              verification
            </p>
          )}
        </div>

        {/* Draw Schedule */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Draw Schedule
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DRAW_SCHEDULES.map((draw) => {
              const sc =
                drawStatusColors[draw.status] ?? drawStatusColors.SCHEDULED;
              return (
                <button
                  key={draw.id}
                  onClick={() => setSelectedDraw(draw.id)}
                  disabled={
                    draw.status === "CLOSED" || draw.status === "SETTLED"
                  }
                  className={`py-3 px-4 rounded-xl text-left transition-all ${
                    selectedDraw === draw.id
                      ? "bg-brand-gold text-white shadow-lg shadow-brand-gold/20"
                      : "bg-surface-elevated text-text-secondary hover:bg-surface-elevated/80"
                  } disabled:opacity-40`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{draw.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        selectedDraw === draw.id
                          ? "bg-white/20 text-white"
                          : `${sc.bg} ${sc.text}`
                      }`}
                    >
                      {draw.status}
                    </span>
                  </div>
                  <p
                    className={`text-[10px] mt-0.5 ${selectedDraw === draw.id ? "text-white/70" : "text-text-muted"}`}
                  >
                    {draw.drawType} · {draw.totalBets} bets ·{" "}
                    {formatCurrency(draw.totalStake)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Number Grid ── */}
      <div className="card-3d p-5">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-text-primary">
            Pick 2 Numbers ({numbers.length}/2)
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickPick}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-gold/10 text-brand-gold text-xs font-medium hover:bg-brand-gold/20 transition-colors"
            >
              <Shuffle size={12} />
              Quick Pick
            </button>
            {numbers.length > 0 && (
              <button
                onClick={() => setNumbers([])}
                className="text-xs text-brand-red hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Selected numbers preview */}
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
            <span className="text-xs text-text-muted ml-2">
              Key: {buildCombinationKey(numbers[0], numbers[1])}
            </span>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: GAME_CONFIG.maxNumber }, (_, i) => i + 1).map(
            (n) => (
              <button
                key={n}
                onClick={() => toggleNumber(n)}
                className={`w-full aspect-square rounded-full text-sm font-bold transition-all ${
                  numbers.includes(n)
                    ? "bg-brand-red text-white border-2 border-brand-gold scale-110"
                    : "bg-surface-elevated text-text-secondary hover:bg-surface-elevated/80 border border-border-default"
                }`}
              >
                {n}
              </button>
            ),
          )}
        </div>

        {/* Payout info */}
        {numbers.length === 2 && betAmount >= GAME_CONFIG.minBet && (
          <div className="mt-3 p-2.5 rounded-lg bg-brand-green/5 border border-brand-green/20 text-center">
            <p className="text-xs text-text-muted">
              Potential Payout:{" "}
              <span className="text-brand-green font-bold text-sm">
                {formatCurrency(betAmount * GAME_CONFIG.payoutMultiplier)}
              </span>{" "}
              <span className="text-text-muted">
                ({GAME_CONFIG.payoutMultiplier}× stake)
              </span>
            </p>
          </div>
        )}
      </div>

      {/* ── Bet Amount ── */}
      <div className="card-3d p-5">
        <label className="block text-sm font-semibold text-text-primary mb-3">
          Bet Amount{" "}
          <span className="text-text-muted font-normal text-xs">
            (₱{GAME_CONFIG.minBet} – ₱{GAME_CONFIG.maxBet})
          </span>
        </label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {BET_AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => {
                setAmount(String(a));
                setCustomAmount("");
              }}
              className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                betAmount === a
                  ? "bg-brand-gold text-white shadow-lg shadow-brand-gold/20"
                  : "bg-surface-elevated text-text-secondary hover:bg-surface-elevated/80"
              }`}
            >
              ₱{a}
            </button>
          ))}
        </div>
        <Input
          label=""
          type="number"
          placeholder={`Custom (₱${GAME_CONFIG.minBet} – ₱${GAME_CONFIG.maxBet})`}
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
            setAmount("");
          }}
        />
        {betAmount > GAME_CONFIG.maxBet && (
          <p className="text-xs text-brand-red mt-1">
            Exceeds max bet of {formatCurrency(GAME_CONFIG.maxBet)}
          </p>
        )}
      </div>

      {/* ── Action Buttons: Add to Slip / Direct Submit ── */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          fullWidth
          size="lg"
          disabled={!canAddToSlip}
          onClick={handleAddToSlip}
        >
          <Plus size={16} className="mr-1" />
          Add to Slip
        </Button>
        <Button
          variant="gold"
          fullWidth
          size="lg"
          disabled={!canSubmitDirect}
          onClick={() => setShowConfirm(true)}
        >
          {betSlip.length > 0
            ? `Submit ${betSlip.length} Bet${betSlip.length > 1 ? "s" : ""}`
            : `Collect — ${betAmount >= GAME_CONFIG.minBet ? formatCurrency(betAmount) : "₱0.00"}`}
        </Button>
      </div>

      {/* ── Bet Slip ── */}
      {betSlip.length > 0 && (
        <div className="card-3d p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Receipt size={16} className="text-brand-gold" />
              Bet Slip ({betSlip.length})
            </h3>
            <button
              onClick={clearBetSlip}
              className="text-xs text-brand-red hover:underline flex items-center gap-1"
            >
              <Trash2 size={12} />
              Clear All
            </button>
          </div>
          <div className="space-y-2">
            {betSlip.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-surface-elevated"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-mono font-bold text-brand-red">
                      {item.numbers[0]} - {item.numbers[1]}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      Key:{" "}
                      {buildCombinationKey(item.numbers[0], item.numbers[1])}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-brand-gold">
                    {formatCurrency(item.amount)}
                  </span>
                  <button
                    onClick={() => removeFromBetSlip(item.id)}
                    className="text-brand-red/60 hover:text-brand-red transition-colors"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border-default flex justify-between text-sm">
            <span className="text-text-muted">Total Stake</span>
            <span className="font-bold text-brand-gold">
              {formatCurrency(slipTotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">
              Commission ({(GAME_CONFIG.cobradorRate * 100).toFixed(0)}%)
            </span>
            <span className="font-bold text-brand-green">
              {formatCurrency(slipTotal * GAME_CONFIG.cobradorRate)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Potential Payout (per bet)</span>
            <span className="font-medium text-text-primary">
              {GAME_CONFIG.payoutMultiplier}× stake
            </span>
          </div>
        </div>
      )}

      {/* ── Recent Bets ── */}
      <DataTable
        title="Recent Bets"
        columns={
          [
            {
              key: "reference",
              label: "Reference",
              sortable: true,
              render: (v: string) => (
                <span className="font-mono text-xs text-text-primary">{v}</span>
              ),
            },
            { key: "customer", label: "Customer", sortable: true },
            {
              key: "numbers",
              label: "Numbers",
              sortable: false,
              searchable: false,
              render: (v: string) => (
                <span className="font-mono font-bold text-brand-red">{v}</span>
              ),
            },
            {
              key: "amount",
              label: "Stake",
              align: "right" as const,
              sortable: true,
              render: (v: number) => (
                <span className="font-semibold text-brand-gold">
                  {formatCurrency(v)}
                </span>
              ),
            },
            { key: "draw", label: "Draw", sortable: true },
            {
              key: "status",
              label: "Status",
              sortable: true,
              render: (v: string) => (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${betStatusColors[v] ?? ""}`}
                >
                  {v}
                </span>
              ),
            },
            { key: "time", label: "Time", sortable: true },
          ] satisfies DataTableColumn[]
        }
        data={MOCK_RECENT_BETS}
        pageSize={5}
        exportable
      />

      {/* ── Confirmation Modal ── */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Bet Collection"
      >
        <div className="space-y-3">
          <div className="card-3d p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Customer</span>
                <span className="text-text-primary font-medium">
                  {customerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Draw</span>
                <span className="text-text-primary">
                  {drawLabel} ({drawType})
                </span>
              </div>
              <hr className="border-border-default" />

              {/* Show slip items or single bet */}
              {betSlip.length > 0 ? (
                <>
                  {betSlip.map((item, idx) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-text-muted">
                        #{idx + 1} — {item.numbers[0]} - {item.numbers[1]}
                      </span>
                      <span className="text-brand-gold font-semibold">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                  <hr className="border-border-default" />
                  <div className="flex justify-between">
                    <span className="text-text-muted">
                      Total ({betSlip.length} bets)
                    </span>
                    <span className="text-brand-gold font-bold">
                      {formatCurrency(slipTotal)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Numbers</span>
                    <span className="text-text-primary font-bold">
                      {numbers.join(" - ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Bet Amount</span>
                    <span className="text-brand-gold font-bold">
                      {formatCurrency(betAmount)}
                    </span>
                  </div>
                </>
              )}

              <div className="flex justify-between">
                <span className="text-text-muted">Potential Payout</span>
                <span className="text-text-primary font-medium">
                  {GAME_CONFIG.payoutMultiplier}× per bet
                </span>
              </div>
              <hr className="border-border-default" />
              <div className="flex justify-between">
                <span className="text-text-muted">
                  Your Commission ({(GAME_CONFIG.cobradorRate * 100).toFixed(0)}
                  %)
                </span>
                <span className="text-brand-green font-bold">
                  {formatCurrency(
                    (betSlip.length > 0 ? slipTotal : betAmount) *
                      GAME_CONFIG.cobradorRate,
                  )}
                </span>
              </div>
            </div>
          </div>
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

      {/* ── Bet Receipt Modal ── */}
      <Modal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        title="Bet Receipt"
      >
        {lastReceipt && (
          <div className="space-y-3">
            <div className="text-center py-2">
              <CheckCircle
                size={40}
                className="text-brand-green mx-auto mb-2"
              />
              <p className="text-lg font-bold text-text-primary">
                Bet{lastReceipt.items.length > 1 ? "s" : ""} Collected!
              </p>
            </div>
            <div className="card-3d p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Customer</span>
                <span className="text-text-primary font-medium">
                  {lastReceipt.customer}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Draw</span>
                <span className="text-text-primary">{lastReceipt.draw}</span>
              </div>
              <hr className="border-border-default" />

              {lastReceipt.items.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-brand-red">
                      {item.numbers}
                    </span>
                    <span className="text-brand-gold font-semibold">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-text-muted font-mono">
                      Ref: {item.reference}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.reference);
                        toast.success("Reference copied!");
                      }}
                      className="text-text-muted hover:text-brand-gold transition-colors"
                    >
                      <Copy size={10} />
                    </button>
                  </div>
                </div>
              ))}

              <hr className="border-border-default" />
              <div className="flex justify-between font-bold">
                <span className="text-text-muted">Total</span>
                <span className="text-brand-gold">
                  {formatCurrency(lastReceipt.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Your Commission</span>
                <span className="text-brand-green font-bold">
                  +{formatCurrency(lastReceipt.totalCommission)}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-text-muted text-center">
              {new Date().toLocaleString("en-PH", {
                dateStyle: "medium",
                timeStyle: "short",
              })}{" "}
              · {GAME_CONFIG.currency}
            </p>

            <Button
              variant="gold"
              fullWidth
              onClick={() => setShowReceipt(false)}
            >
              Done
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
