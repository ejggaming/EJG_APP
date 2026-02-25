import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Badge } from "../../components";
import { formatCurrency } from "../../utils";
import {
  Clock,
  Trophy,
  XCircle,
  PartyPopper,
  Wallet,
  Zap,
  CalendarClock,
  History,
  Bot,
  Info,
} from "lucide-react";
import { BetHistorySkeleton } from "../../components/ChineseSkeleton";
import {
  useBetHistoryQuery,
  useGameConfigQuery,
  useScheduledDrawsQuery,
  useDrawSchedulesQuery,
  useTodaysDrawsQuery,
  drawTypeLabel,
} from "../../hooks/useBet";
import { useMyWalletQuery } from "../../hooks/useWallet";
import { useMyAutoBetsQuery } from "../../hooks/useAutoBet";
import type { JuetengBet, JuetengDraw, DrawSchedule } from "../../services/betService";
import type { AutoBetConfig } from "../../services/autoBetService";

type Tab = "active" | "future" | "past";

const statusBadge = {
  PENDING: { variant: "gold" as const, label: "Awaiting Draw", Icon: Clock },
  WON: { variant: "green" as const, label: "Won", Icon: Trophy },
  LOST: { variant: "red" as const, label: "Lost", Icon: XCircle },
  VOID: { variant: "red" as const, label: "Void", Icon: XCircle },
  REFUNDED: { variant: "gold" as const, label: "Refunded", Icon: Clock },
};

function fmtScheduled(s: string | Date) {
  return new Date(s).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtDateHeader(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Types for future slot projection ────────────────────────────────────────

type ScheduledSlot = {
  type: "scheduled";
  draw: JuetengDraw;
  config: AutoBetConfig;
  sortKey: number;
};
type PendingSlot = {
  type: "pending";
  scheduledAt: Date;
  drawType: "MORNING" | "AFTERNOON" | "EVENING";
  config: AutoBetConfig;
  sortKey: number;
};
type FutureSlot = ScheduledSlot | PendingSlot;

/**
 * Generate every draw slot within each AutoBetConfig's remaining date range.
 *
 * For each slot:
 *  - draw exists with status SCHEDULED  → type:"scheduled"  (show, draw is ready)
 *  - draw exists with any other status  → skip               (Active/Past tab handles it)
 *  - no draw created yet                → type:"pending"     (show, will fire when created)
 *
 * @param allKnownDraws  Union of scheduledDraws + today's draws (any status), used to
 *                       detect draws that already exist but are OPEN/SETTLED/etc.
 */
function buildFutureSlots(
  configs: AutoBetConfig[],
  allKnownDraws: JuetengDraw[],
  drawSchedules: DrawSchedule[],
): FutureSlot[] {
  const now = new Date();
  const slots: FutureSlot[] = [];
  const activeSchedules = drawSchedules.filter((s) => s.isActive);

  for (const config of configs) {
    const endDate = new Date(config.endDate);
    const fromDay = new Date(
      Math.max(new Date(config.startDate).getTime(), now.getTime()),
    );
    fromDay.setHours(0, 0, 0, 0);

    for (
      const day = new Date(fromDay);
      day <= endDate;
      day.setDate(day.getDate() + 1)
    ) {
      for (const sched of activeSchedules) {
        const [h, m] = sched.scheduledTime.split(":").map(Number);
        const slotAt = new Date(day);
        slotAt.setHours(h, m, 0, 0);

        if (slotAt <= now) continue; // already past — skip

        // Check if any draw record (in ANY status) exists for this date + drawType
        const existingDraw = allKnownDraws.find((draw) => {
          const at = new Date(draw.scheduledAt);
          return (
            draw.drawType === sched.drawType &&
            at.getFullYear() === day.getFullYear() &&
            at.getMonth() === day.getMonth() &&
            at.getDate() === day.getDate()
          );
        });

        if (existingDraw) {
          if (existingDraw.status === "SCHEDULED") {
            // Draw exists and is ready for bets → show as "Scheduled"
            slots.push({
              type: "scheduled",
              draw: existingDraw,
              config,
              sortKey: slotAt.getTime(),
            });
          }
          // else: draw is OPEN/CLOSED/DRAWN/SETTLED → skip (shown in Active/Past tab)
        } else {
          // No draw created yet → show as "pending creation"
          slots.push({
            type: "pending",
            scheduledAt: new Date(slotAt),
            drawType: sched.drawType as "MORNING" | "AFTERNOON" | "EVENING",
            config,
            sortKey: slotAt.getTime(),
          });
        }
      }
    }
  }

  return slots.sort((a, b) => a.sortKey - b.sortKey);
}

// ─── Regular BetCard ─────────────────────────────────────────────────────────

function BetCard({ bet, multiplier }: { bet: JuetengBet; multiplier: number }) {
  const badge = statusBadge[bet.status as keyof typeof statusBadge] ?? statusBadge.PENDING;
  const isAuto = !!bet.reference?.startsWith("AUTOBET-");
  const isLive = bet.draw?.status === "OPEN";
  const drawTime = bet.draw?.drawType ? drawTypeLabel(bet.draw.drawType) : "";
  const dateLabel = bet.draw?.scheduledAt
    ? fmtScheduled(bet.draw.scheduledAt)
    : bet.draw?.drawDate
      ? fmtDate(bet.draw.drawDate)
      : fmtDate(bet.placedAt ?? bet.createdAt);

  return (
    <Card bento className="lantern-card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-1">
            <span className="lottery-ball w-9 h-9 text-sm">{bet.number1}</span>
            <span className="lottery-ball w-9 h-9 text-sm">{bet.number2}</span>
          </div>
          {isLive ? (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-brand-green/15 text-brand-green border border-brand-green/30 animate-pulse">
              <Zap className="w-3 h-3" />
              LIVE
            </span>
          ) : (
            <Badge variant={badge.variant}>
              <badge.Icon className="w-3 h-3 inline mr-0.5" />
              {badge.label}
            </Badge>
          )}
          {isAuto && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/10 text-text-muted border border-white/10">
              <Bot className="w-3 h-3" />
              Auto
            </span>
          )}
        </div>
        <span className="text-brand-gold font-bold">{formatCurrency(bet.amount)}</span>
      </div>
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>{drawTime} Draw</span>
        <span>{dateLabel}</span>
      </div>
      {multiplier > 0 && (
        <div className="flex items-center justify-between text-xs mt-1.5 pt-1.5 border-t border-white/5">
          <span className="text-text-muted">
            <span className="text-brand-gold font-bold">{multiplier}×</span> multiplier
          </span>
          <span
            className={
              bet.status === "LOST" || bet.status === "VOID"
                ? "text-text-muted line-through"
                : bet.status === "WON"
                  ? "text-brand-green font-bold"
                  : "text-brand-gold font-bold"
            }
          >
            {formatCurrency(bet.amount * multiplier)}
          </span>
        </div>
      )}
      {bet.status === "WON" && (
        <div className="mt-2 win-glow rounded-xl p-2 text-center border border-brand-green/30 bg-brand-green/5">
          <p className="text-brand-green font-bold text-sm">
            <PartyPopper className="w-4 h-4 inline mr-1" />
            Won {formatCurrency(bet.payoutAmount ?? 0)}
          </p>
        </div>
      )}
      <p className="text-[10px] text-text-muted mt-1">{bet.reference}</p>
    </Card>
  );
}

// ─── Future Slot Card (scheduled OR pending) ─────────────────────────────────

function FutureSlotCard({
  slot,
  multiplier,
  onManage,
}: {
  slot: FutureSlot;
  multiplier: number;
  onManage: () => void;
}) {
  const { config } = slot;
  const isScheduled = slot.type === "scheduled";
  const drawType = isScheduled ? slot.draw.drawType : slot.drawType;
  const scheduledAt = isScheduled ? new Date(slot.draw.scheduledAt) : slot.scheduledAt;
  const drawTime = drawTypeLabel(drawType);

  return (
    <Card
      bento
      className={`lantern-card ${isScheduled ? "border border-dashed border-white/10" : "border border-dashed border-white/5 opacity-70"}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-1">
            <span className="lottery-ball w-9 h-9 text-sm">{config.number1}</span>
            <span className="lottery-ball w-9 h-9 text-sm">{config.number2}</span>
          </div>
          {isScheduled ? (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-brand-gold/10 text-brand-gold border border-brand-gold/25">
              <Clock className="w-3 h-3" />
              Scheduled
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/5 text-text-muted border border-white/10">
              <Clock className="w-3 h-3" />
              Awaiting Draw
            </span>
          )}
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/10 text-text-muted border border-white/10">
            <Bot className="w-3 h-3" />
            Auto
          </span>
        </div>
        <span className="text-brand-gold font-bold">
          {formatCurrency(config.amountPerBet)}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>{drawTime} Draw</span>
        <span>{fmtScheduled(scheduledAt)}</span>
      </div>

      {multiplier > 0 && (
        <div className="flex items-center justify-between text-xs mt-1.5 pt-1.5 border-t border-white/5">
          <span className="text-text-muted">
            <span className="text-brand-gold font-bold">{multiplier}×</span> multiplier
          </span>
          <span className="text-brand-gold font-bold">
            {formatCurrency(config.amountPerBet * multiplier)}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-white/5">
        <p className="text-[10px] text-text-muted">
          {isScheduled
            ? "Bet fires automatically when draw opens"
            : "Bet fires automatically once admin creates this draw"}
        </p>
        <button
          onClick={onManage}
          className="text-[10px] text-brand-gold hover:underline font-semibold shrink-0 ml-2"
        >
          Manage
        </button>
      </div>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BetHistoryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const navigate = useNavigate();

  const { data, isLoading } = useBetHistoryQuery({});
  const { data: walletData } = useMyWalletQuery();
  const { data: gameConfig } = useGameConfigQuery();
  const { data: scheduledDraws = [] } = useScheduledDrawsQuery();
  const { data: todayDraws = [] } = useTodaysDrawsQuery();
  const { data: drawSchedules = [] } = useDrawSchedulesQuery();
  const { data: autoBetData } = useMyAutoBetsQuery({});

  const multiplier = gameConfig?.payoutMultiplier ?? 0;
  const balance = walletData?.wallet?.balance ?? 0;
  const bets = data?.bets ?? [];

  // ACTIVE or PAUSED AutoBetConfigs with bets remaining
  const pendingAutoConfigs = (autoBetData?.configs ?? []).filter(
    (c) => (c.status === "ACTIVE" || c.status === "PAUSED") && c.betsPlaced < c.totalBets,
  );

  // Union of all known draws (today in any status + future SCHEDULED draws)
  // Used by buildFutureSlots to skip draws that are already OPEN/SETTLED/etc.
  const allKnownDraws = [
    ...todayDraws,
    ...scheduledDraws.filter((d) => !todayDraws.some((t) => t.id === d.id)),
  ];

  // All future draw slots (real + projected from draw schedule template)
  const futureSlots = buildFutureSlots(pendingAutoConfigs, allKnownDraws, drawSchedules);

  // Group future slots by date label for display
  const slotsByDate = futureSlots.reduce<Record<string, FutureSlot[]>>((acc, slot) => {
    const key = fmtDateHeader(new Date(slot.sortKey));
    if (!acc[key]) acc[key] = [];
    acc[key].push(slot);
    return acc;
  }, {});

  // Count how many slots are "pending creation" (no draw yet)
  const pendingCreationCount = futureSlots.filter((s) => s.type === "pending").length;

  // ── Categorise placed bets ─────────────────────────────────────────────────
  const activeBets = bets.filter((b) =>
    ["OPEN", "CLOSED", "DRAWN"].includes(b.draw?.status ?? ""),
  );
  const scheduledManualBets = bets.filter((b) => b.draw?.status === "SCHEDULED");
  const pastBets = bets.filter(
    (b) => !["OPEN", "CLOSED", "DRAWN", "SCHEDULED"].includes(b.draw?.status ?? ""),
  );

  const futureTotalCount = futureSlots.length + scheduledManualBets.length;

  // ── Summary stats ──────────────────────────────────────────────────────────
  const wonBets = pastBets.filter((b) => b.status === "WON").length;
  const totalWon = pastBets
    .filter((b) => b.status === "WON")
    .reduce((sum, b) => sum + (b.payoutAmount ?? 0), 0);
  const pendingPotential = [...activeBets, ...scheduledManualBets]
    .filter((b) => b.status === "PENDING")
    .reduce((sum, b) => sum + b.amount * multiplier, 0);

  const tabCounts: Record<Tab, number> = {
    active: activeBets.length,
    future: futureTotalCount,
    past: pastBets.length,
  };

  const tabs: { id: Tab; label: string; Icon: typeof Zap }[] = [
    { id: "active", label: "Active", Icon: Zap },
    { id: "future", label: "Future", Icon: CalendarClock },
    { id: "past", label: "Past", Icon: History },
  ];

  if (isLoading) return <BetHistorySkeleton />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold text-text-primary chinese-header">
          Bet History
        </h1>
        <p className="text-text-muted text-sm mt-1">Your bets across all draws</p>
      </div>

      {/* Balance */}
      <Card bento delay={50} className="lantern-card">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-brand-gold/15 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-brand-gold" />
          </div>
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">
              Current Balance
            </p>
            <p className="text-xl font-extrabold gold-shimmer">{formatCurrency(balance)}</p>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        <Card bento delay={100} className="text-center lantern-card">
          <p className="text-lg font-extrabold text-text-primary">{bets.length}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Total</p>
        </Card>
        <Card bento delay={200} className="text-center lantern-card">
          <p className="text-lg font-extrabold text-brand-green">{wonBets}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Won</p>
        </Card>
        <Card bento delay={300} className="text-center lantern-card">
          <p className="text-lg font-extrabold gold-shimmer">{formatCurrency(totalWon)}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Total Won</p>
        </Card>
      </div>

      {multiplier > 0 && pendingPotential > 0 && (
        <Card bento delay={350} className="text-center lantern-card">
          <p className="text-lg font-extrabold text-brand-gold">
            {formatCurrency(pendingPotential)}
          </p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">
            Pending Potential
          </p>
        </Card>
      )}

      <div className="cloud-divider" />

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === id
                ? "bg-brand-red text-white shadow"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            {tabCounts[id] > 0 && (
              <span
                className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  activeTab === id
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-text-muted"
                }`}
              >
                {tabCounts[id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── ACTIVE ──────────────────────────────────────────────────────────── */}
      {activeTab === "active" && (
        activeBets.length === 0 ? (
          <Card bento className="text-center py-8 lantern-card">
            <p className="text-text-muted text-sm">No active bets right now</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {activeBets.map((bet) => (
              <BetCard key={bet.id} bet={bet} multiplier={multiplier} />
            ))}
          </div>
        )
      )}

      {/* ── FUTURE ──────────────────────────────────────────────────────────── */}
      {activeTab === "future" && (
        <>
          {futureTotalCount === 0 ? (
            <Card bento className="text-center py-8 lantern-card">
              <p className="text-text-muted text-sm">No upcoming bets scheduled</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Info banner when some draws haven't been created yet */}
              {pendingCreationCount > 0 && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-brand-gold/5 border border-brand-gold/15">
                  <Info className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <p className="text-xs text-text-muted leading-relaxed">
                    <span className="text-brand-gold font-semibold">
                      {pendingCreationCount} draw{pendingCreationCount > 1 ? "s" : ""} not yet created.
                    </span>{" "}
                    Your auto bet will fire automatically once the admin creates and opens each draw.
                  </p>
                </div>
              )}

              {/* Auto bet slots grouped by date */}
              {Object.entries(slotsByDate).map(([dateLabel, slots]) => (
                <div key={dateLabel} className="space-y-2">
                  <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider px-1">
                    {dateLabel}
                  </p>
                  {slots.map((slot) => (
                    <FutureSlotCard
                      key={`${slot.type}-${slot.sortKey}-${slot.config.id}`}
                      slot={slot}
                      multiplier={multiplier}
                      onManage={() => navigate("/bet/auto")}
                    />
                  ))}
                </div>
              ))}

              {/* Manual bets pre-placed on scheduled draws */}
              {scheduledManualBets.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider px-1">
                    Manual Bets — Scheduled
                  </p>
                  {scheduledManualBets.map((bet) => (
                    <BetCard key={bet.id} bet={bet} multiplier={multiplier} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ── PAST ────────────────────────────────────────────────────────────── */}
      {activeTab === "past" && (
        pastBets.length === 0 ? (
          <Card bento className="text-center py-8 lantern-card">
            <p className="text-text-muted text-sm">No past bets yet</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {pastBets.map((bet) => (
              <BetCard key={bet.id} bet={bet} multiplier={multiplier} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
