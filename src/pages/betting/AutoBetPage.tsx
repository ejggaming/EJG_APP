import { useState } from "react";
import { Button, Card, NumberBall } from "../../components";
import { useAppStore } from "../../store/useAppStore";
import { formatCurrency } from "../../utils";
import toast from "react-hot-toast";
import {
  CalendarDays,
  CircleDot,
  Coins,
  Dices,
  Pause,
  Play,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useGameConfigQuery } from "../../hooks/useBet";
import { useMyWalletQuery } from "../../hooks/useWallet";
import {
  useMyAutoBetsQuery,
  useCreateAutoBetMutation,
  usePauseAutoBetMutation,
  useResumeAutoBetMutation,
  useCancelAutoBetMutation,
} from "../../hooks/useAutoBet";
import type { AutoBetConfig } from "../../services/autoBetService";

type AutoBetStatus = "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";

const STATUS_BADGE: Record<AutoBetStatus, string> = {
  ACTIVE: "bg-green-500/20 text-green-400 border border-green-500/30",
  PAUSED: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  COMPLETED: "bg-brand-gold/20 text-brand-gold border border-brand-gold/30",
  CANCELLED: "bg-red-500/20 text-red-400 border border-red-500/30",
};

export default function AutoBetPage() {
  const balance = useAppStore((s) => s.balance);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  // Form state
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [amountPerBet, setAmountPerBet] = useState(5);
  const [customAmount, setCustomAmount] = useState("");
  const [durationDays, setDurationDays] = useState(7);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Data
  const { data: gameConfig } = useGameConfigQuery();
  const { refetch: refetchWallet } = useMyWalletQuery();
  const { data: myConfigsData, isLoading } = useMyAutoBetsQuery();

  const createMutation = useCreateAutoBetMutation();
  const pauseMutation = usePauseAutoBetMutation();
  const resumeMutation = useResumeAutoBetMutation();
  const cancelMutation = useCancelAutoBetMutation();

  const maxNumber = gameConfig?.maxNumber ?? 37;
  const minBet = gameConfig?.minBet ?? 5;
  const maxBet = gameConfig?.maxBet ?? 1000;
  const NUMBERS = Array.from({ length: maxNumber }, (_, i) => i + 1);
  const QUICK_AMOUNTS = [5, 10, 20, 50, 100, 500].filter((a) => a >= minBet && a <= maxBet);

  // Auto-compute estimates
  const totalBets = durationDays * 3;
  const estimatedTotal = totalBets * amountPerBet;
  const daysAffordable = Math.floor(balance / (amountPerBet * 3));
  const canAffordAll = balance >= estimatedTotal;

  const handleNumberClick = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers((prev) => prev.filter((n) => n !== num));
    } else if (selectedNumbers.length < 2) {
      setSelectedNumbers((prev) => [...prev, num]);
    }
  };

  const handleQuickPick = () => {
    const pool = NUMBERS.filter((n) => !selectedNumbers.includes(n));
    const needed = 2 - selectedNumbers.length;
    const picks: number[] = [];
    for (let i = 0; i < needed; i++) {
      const idx = Math.floor(Math.random() * (pool.length - i));
      picks.push(pool.splice(idx, 1)[0]);
    }
    setSelectedNumbers((prev) => [...prev, ...picks]);
  };

  const handleCreate = async () => {
    if (selectedNumbers.length !== 2) {
      toast.error("Please pick exactly 2 numbers");
      return;
    }
    if (amountPerBet < minBet || amountPerBet > maxBet) {
      toast.error(`Amount must be between ₱${minBet} and ₱${maxBet}`);
      return;
    }
    if (durationDays < 1 || durationDays > 30) {
      toast.error("Duration must be between 1 and 30 days");
      return;
    }

    await createMutation.mutateAsync({
      number1: selectedNumbers[0],
      number2: selectedNumbers[1],
      amountPerBet,
      durationDays,
    });

    // Reset form
    setSelectedNumbers([]);
    setAmountPerBet(minBet);
    setDurationDays(7);
    setCustomAmount("");
    refetchWallet();
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-muted">
        <Sparkles className="w-8 h-8 mb-3 text-brand-gold" />
        <p>Please log in to use Auto Bet.</p>
      </div>
    );
  }

  const configs = myConfigsData?.configs ?? [];

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-extrabold gold-shimmer flex items-center gap-2">
          <CalendarDays className="w-5 h-5" /> Auto Bet
        </h1>
        <p className="text-text-muted text-sm mt-1">
          <CircleDot className="w-3.5 h-3.5 inline mr-1" />
          Set once, bet every draw automatically for multiple days
        </p>
      </div>

      {/* Balance Bar */}
      <Card bento className="flex items-center justify-between lantern-card">
        <div>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Available Balance</p>
          <p className="text-lg font-extrabold gold-shimmer">{formatCurrency(balance)}</p>
        </div>
        <span className="fortune-badge">
          <Sparkles className="w-3 h-3 inline mr-1" />
          {canAffordAll ? "Fully Funded" : `${daysAffordable}d affordable`}
        </span>
      </Card>

      {/* ── CREATE FORM ──────────────────────────────────────────────────────── */}
      <Card bento ornate className="space-y-5">
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
          ✦ Configure Auto Bet
        </h2>

        {/* Number Selection */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-text-secondary">
              <CircleDot className="w-3.5 h-3.5 inline mr-1" />
              Pick 2 Numbers{" "}
              <span className="text-brand-red">({selectedNumbers.length}/2)</span>
            </p>
            <Button size="sm" variant="secondary" onClick={handleQuickPick}>
              <Dices className="w-3.5 h-3.5 inline mr-1" /> Quick Pick
            </Button>
          </div>

          {/* Selected display */}
          <div className="flex gap-3 justify-center my-3">
            {[0, 1].map((i) => (
              <div
                key={i}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-black border-2 transition-all ${
                  selectedNumbers[i] != null
                    ? "border-brand-gold text-brand-gold bg-brand-gold/10 shadow-[0_0_18px_rgba(217,119,6,0.25)]"
                    : "border-brand-gold/20 text-text-muted bg-surface-card"
                }`}
              >
                {selectedNumbers[i] ?? "?"}
              </div>
            ))}
          </div>

          {/* Number grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {NUMBERS.map((num) => (
              <NumberBall
                key={num}
                number={num}
                selected={selectedNumbers.includes(num)}
                onClick={() => handleNumberClick(num)}
                disabled={selectedNumbers.length >= 2 && !selectedNumbers.includes(num)}
              />
            ))}
          </div>
        </section>

        {/* Amount */}
        <section>
          <p className="text-xs font-semibold text-text-secondary mb-2">
            <Coins className="w-3.5 h-3.5 inline mr-1" />
            Amount per Bet
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            {QUICK_AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => { setAmountPerBet(a); setCustomAmount(""); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  amountPerBet === a && !customAmount
                    ? "border-brand-gold bg-brand-gold/15 text-brand-gold"
                    : "border-brand-gold/20 text-text-muted hover:border-brand-gold/40"
                }`}
              >
                ₱{a}
              </button>
            ))}
          </div>
          <input
            type="number"
            placeholder={`Custom (₱${minBet}–₱${maxBet})`}
            value={customAmount}
            min={minBet}
            max={maxBet}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              const v = parseFloat(e.target.value);
              if (!isNaN(v)) setAmountPerBet(v);
            }}
            className="w-full bg-surface-card border border-brand-gold/20 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-brand-gold/60"
          />
        </section>

        {/* Duration */}
        <section>
          <p className="text-xs font-semibold text-text-secondary mb-2">
            <CalendarDays className="w-3.5 h-3.5 inline mr-1" />
            Duration (days)
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={30}
              value={durationDays}
              onChange={(e) => setDurationDays(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
              className="w-24 bg-surface-card border border-brand-gold/20 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-brand-gold/60 text-center"
            />
            <div className="flex flex-wrap gap-1.5">
              {[3, 5, 7, 14].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDurationDays(d)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    durationDays === d
                      ? "border-brand-gold bg-brand-gold/15 text-brand-gold"
                      : "border-brand-gold/20 text-text-muted hover:border-brand-gold/40"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-text-muted mt-1.5">
            You can afford <span className="text-brand-gold font-semibold">{daysAffordable} days</span> at this amount
          </p>
        </section>

        {/* Cost Summary */}
        <div className={`rounded-xl p-3 border text-sm space-y-1 ${canAffordAll ? "border-brand-gold/30 bg-brand-gold/5" : "border-yellow-500/30 bg-yellow-500/5"}`}>
          <div className="flex justify-between text-text-secondary">
            <span>Total bets</span>
            <span className="font-semibold">{totalBets} ({durationDays}d × 3 draws)</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>Estimated total</span>
            <span className="font-semibold gold-shimmer">{formatCurrency(estimatedTotal)}</span>
          </div>
          {!canAffordAll && (
            <p className="text-yellow-400 text-[11px] pt-1">
              ⚠ Balance insufficient for full duration. Config will pause if funds run out.
            </p>
          )}
        </div>

        <Button
          fullWidth
          disabled={selectedNumbers.length !== 2 || createMutation.isPending}
          onClick={handleCreate}
          className="mt-1"
        >
          {createMutation.isPending ? "Setting up…" : "Start Auto Bet"}
        </Button>
      </Card>

      {/* ── EXISTING CONFIGS ─────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">
          ✦ My Auto Bets {configs.length > 0 && <span className="text-brand-gold">({configs.length})</span>}
        </h2>

        {isLoading && (
          <p className="text-text-muted text-sm text-center py-6">Loading…</p>
        )}

        {!isLoading && configs.length === 0 && (
          <p className="text-text-muted text-sm text-center py-8 border border-brand-gold/10 rounded-xl">
            No auto bets configured yet
          </p>
        )}

        <div className="space-y-3">
          {configs.map((cfg) => (
            <AutoBetCard
              key={cfg.id}
              config={cfg}
              expanded={expandedId === cfg.id}
              onToggleExpand={() => setExpandedId(expandedId === cfg.id ? null : cfg.id)}
              onPause={() => pauseMutation.mutate(cfg.id)}
              onResume={() => resumeMutation.mutate(cfg.id)}
              onCancel={() => {
                if (window.confirm("Cancel this auto bet configuration?")) {
                  cancelMutation.mutate(cfg.id);
                }
              }}
              isPauseLoading={pauseMutation.isPending}
              isResumeLoading={resumeMutation.isPending}
              isCancelLoading={cancelMutation.isPending}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Auto Bet Config Card ───────────────────────────────────────────────────────

interface AutoBetCardProps {
  config: AutoBetConfig;
  expanded: boolean;
  onToggleExpand: () => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  isPauseLoading: boolean;
  isResumeLoading: boolean;
  isCancelLoading: boolean;
}

function AutoBetCard({
  config,
  expanded,
  onToggleExpand,
  onPause,
  onResume,
  onCancel,
  isPauseLoading,
  isResumeLoading,
  isCancelLoading,
}: AutoBetCardProps) {
  const progressPct = config.totalBets > 0 ? Math.round((config.betsPlaced / config.totalBets) * 100) : 0;
  const startDate = new Date(config.startDate).toLocaleDateString("en-PH", { month: "short", day: "numeric" });
  const endDate = new Date(config.endDate).toLocaleDateString("en-PH", { month: "short", day: "numeric" });

  return (
    <Card bento className="space-y-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-8 h-8 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-sm font-black text-brand-gold">
              {config.number1}
            </span>
            <span className="w-8 h-8 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-sm font-black text-brand-gold">
              {config.number2}
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-text-primary">{formatCurrency(config.amountPerBet)}/bet</p>
            <p className="text-[10px] text-text-muted">{config.durationDays}d · {startDate}–{endDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[config.status as AutoBetStatus]}`}>
            {config.status}
          </span>
          <button type="button" onClick={onToggleExpand} className="text-text-muted hover:text-brand-gold transition-colors">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-[10px] text-text-muted mb-1">
          <span>{config.betsPlaced}/{config.totalBets} bets placed</span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-surface-card overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-gold to-amber-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-[10px] text-text-muted mt-1">
          Total spent: <span className="text-brand-gold font-semibold">{formatCurrency(config.totalSpent)}</span>
        </p>
      </div>

      {/* Actions */}
      {(config.status === "ACTIVE" || config.status === "PAUSED") && (
        <div className="flex gap-2">
          {config.status === "ACTIVE" && (
            <Button size="sm" variant="secondary" onClick={onPause} disabled={isPauseLoading} className="flex-1">
              <Pause className="w-3 h-3 inline mr-1" /> Pause
            </Button>
          )}
          {config.status === "PAUSED" && (
            <Button size="sm" variant="secondary" onClick={onResume} disabled={isResumeLoading} className="flex-1">
              <Play className="w-3 h-3 inline mr-1" /> Resume
            </Button>
          )}
          <Button size="sm" variant="danger" onClick={onCancel} disabled={isCancelLoading} className="flex-1">
            <X className="w-3 h-3 inline mr-1" /> Cancel
          </Button>
        </div>
      )}

      {/* Execution history (expanded) */}
      {expanded && config.executions && config.executions.length > 0 && (
        <div className="border-t border-brand-gold/10 pt-3 space-y-1.5">
          <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Recent Executions</p>
          {config.executions.map((ex) => (
            <div key={ex.id} className="flex items-center justify-between text-[11px]">
              <span className="text-text-muted">{new Date(ex.executedAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
              <div className="flex items-center gap-2">
                {ex.failReason && <span className="text-red-400 text-[10px]">{ex.failReason}</span>}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  ex.status === "PLACED" ? "bg-green-500/20 text-green-400" :
                  ex.status === "FAILED" ? "bg-red-500/20 text-red-400" :
                  "bg-gray-500/20 text-gray-400"
                }`}>
                  {ex.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {expanded && (!config.executions || config.executions.length === 0) && (
        <div className="border-t border-brand-gold/10 pt-3 text-[11px] text-text-muted">
          No executions yet
        </div>
      )}
    </Card>
  );
}
