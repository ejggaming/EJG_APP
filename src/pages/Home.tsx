import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button } from "../components";
import { useAppStore } from "../store/useAppStore";
import { useThemeStore } from "../store/useThemeStore";
import { formatCurrency } from "../utils";
import {
  Target,
  Trophy,
  Coins,
  Clock,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";
import {
  useTodaysDrawsQuery,
  useDrawResultsQuery,
  useGameConfigQuery,
  drawTypeLabel,
} from "../hooks/useBet";
import appLogo from "../assets/logo.png";
import liraSingko from "../assets/kalye-singko.png";

// ── Slot rolling ball — cycles random numbers before landing on final value ──
function SlotBall({
  value,
  delay = 0,
  className = "",
}: {
  value: number | null | undefined;
  delay?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(() => Math.floor(Math.random() * 37) + 1);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (value == null) return;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const rolls = 16;
    for (let i = 0; i <= rolls; i++) {
      // Quadratic spacing — starts fast, slows to a stop
      const t = delay + Math.pow(i, 2) * 9;
      timeouts.push(
        setTimeout(() => {
          if (i === rolls) {
            setDisplay(value);
            setSettled(true);
          } else {
            setDisplay(Math.floor(Math.random() * 37) + 1);
          }
        }, t),
      );
    }
    return () => timeouts.forEach(clearTimeout);
  }, [value, delay]);

  return (
    <span
      className={`lottery-ball w-10 h-10 text-sm transition-all duration-75 ${
        settled ? "opacity-100 scale-100 lottery-ball-3d" : "opacity-55 scale-95"
      } ${className}`}
    >
      {display}
    </span>
  );
}


// ── Rolling balance — scrambles random amounts then settles on real value ──
function RollingBalance({ value }: { value: number }) {
  const [display, setDisplay] = useState(() => Math.round(Math.random() * value));
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const rolls = 20;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i <= rolls; i++) {
      const t = Math.pow(i, 2) * 7;
      timeouts.push(
        setTimeout(() => {
          if (i === rolls) {
            setDisplay(value);
            setSettled(true);
          } else {
            setDisplay(Math.round(Math.random() * value * 1.4 + value * 0.05));
          }
        }, t),
      );
    }
    return () => timeouts.forEach(clearTimeout);
  }, [value]);

  return (
    <p className={`text-[clamp(20px,6vw,28px)] font-extrabold gold-shimmer leading-tight text-right transition-all duration-75 ${settled ? "opacity-100" : "opacity-60"}`}>
      {formatCurrency(display)}
    </p>
  );
}

// ── Guest promotional landing ──────────────────────────────────────────────────
function GuestPromo() {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const heroBg = isDark
    ? "linear-gradient(135deg, #1a0000 0%, #3d0505 35%, #6b0f0f 65%, #1a0000 100%)"
    : "linear-gradient(135deg, #7f1d1d 0%, #991b1b 35%, #b91c1c 65%, #7f1d1d 100%)";
  const heroShadow = isDark
    ? "0 20px 56px rgba(140,0,0,0.5), inset 0 1px 0 rgba(245,158,11,0.18)"
    : "0 12px 40px rgba(185,28,28,0.45), inset 0 1px 0 rgba(245,158,11,0.22)";
  const blendLeft = isDark ? "#1a0000" : "#7f1d1d";
  const blendMid = isDark ? "rgba(61,5,5,0.88)" : "rgba(153,27,27,0.88)";

  return (
    <div className="space-y-4">
      {/* ── Hero banner ── */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: heroBg,
          border: "1px solid rgba(245,158,11,0.28)",
          boxShadow: heroShadow,
          minHeight: 290,
        }}
      >
        {/* Fine grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(60deg, rgba(245,158,11,0.035) 0, rgba(245,158,11,0.035) 1px, transparent 0, transparent 50%)`,
            backgroundSize: "18px 18px",
          }}
        />

        {/* Radial glow behind character */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: 0,
            top: 0,
            bottom: 0,
            width: "60%",
            background: "radial-gradient(ellipse at 75% 40%, rgba(220,38,38,0.28) 0%, transparent 70%)",
          }}
        />

        {/* Character image — full-height, right side, bleeds to edge */}
        <div
          className="absolute right-0 bottom-0 top-0 pointer-events-none select-none"
          style={{ width: "52%", maxWidth: 210 }}
        >
          {/* Left-side gradient blend so character merges into background */}
          <div
            className="absolute inset-y-0 left-0 z-10"
            style={{
              width: "55%",
              background: `linear-gradient(to right, ${blendLeft} 0%, ${blendMid} 40%, transparent 100%)`,
            }}
          />
          <img
            src={liraSingko}
            alt="Lira Singko"
            className="w-full h-full"
            style={{
              objectFit: "cover",
              objectPosition: "top center",
              filter: "drop-shadow(-8px 0 24px rgba(220,38,38,0.5))",
            }}
          />
        </div>

        {/* Text + CTAs — strict 48% width so buttons never reach the character */}
        <div
          className="relative z-20 flex flex-col px-4 py-6"
          style={{ width: "48%", minHeight: 290, justifyContent: "center", gap: 16 }}
        >
          <div>
            <h2 className="text-[clamp(18px,5vw,24px)] font-extrabold text-white leading-tight mb-2">
              Swerte Ka Ba<br />
              <span className="gold-shimmer">Today?</span>
            </h2>
            <p className="text-[10px] text-white/45 uppercase tracking-widest">Prize Pool</p>
            <p className="text-[clamp(22px,6.5vw,30px)] font-extrabold gold-shimmer leading-tight">₱50,000</p>
          </div>

          <div className="flex flex-col gap-2">
            <Link to="/register" className="block">
              <Button variant="gold" size="sm" className="w-full font-bold text-xs">
                Sign Up
              </Button>
            </Link>
            <Link to="/login" className="block">
              <button
                className="w-full py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
                style={{
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "rgba(255,255,255,0.80)",
                  background: "rgba(255,255,255,0.08)",
                }}
              >
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const user = useAppStore((s) => s.user);
  const balance = useAppStore((s) => s.balance);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  // Theme-aware casino card palette
  // Both themes use a rich dark card — light = vivid casino red, dark = deep crimson
  const card = {
    bg: isDark
      ? "linear-gradient(135deg, #0d0000 0%, #4a0505 30%, #7a0e0e 60%, #0d0000 100%)"
      : "linear-gradient(135deg, #6b0f0f 0%, #991b1b 30%, #c0221e 55%, #7f1414 100%)",
    shadow: isDark
      ? "0 12px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(245,158,11,0.2)"
      : "0 12px 40px rgba(120,14,14,0.45), inset 0 1px 0 rgba(245,158,11,0.25)",
    border: isDark
      ? "1px solid rgba(245,158,11,0.18)"
      : "1px solid rgba(245,158,11,0.22)",
    stripe: "#f59e0b",
    brandColor: "rgba(245,158,11,0.85)",
    nameColor: "rgba(255,255,255,0.50)",
    balanceLabelColor: "rgba(255,255,255,0.45)",
    dotColor: "rgba(245,158,11,0.40)",
    cashOutColor: "rgba(255,255,255,0.75)",
    cashOutBorder: "rgba(255,255,255,0.25)",
    cashOutBg: "rgba(0,0,0,0.15)",
    heroHeading: "#ffffff",
    heroBody: "rgba(255,255,255,0.75)",
  };

  // Real API data
  const { data: todaysDraws = [] } = useTodaysDrawsQuery();
  const { data: resultsData } = useDrawResultsQuery({ limit: 3 });
  const { data: gameConfig } = useGameConfigQuery();

  const recentResults = resultsData?.draws ?? [];

  const minBet = gameConfig ? formatCurrency(gameConfig.minBet) : '';
  const maxNumber = gameConfig?.maxNumber ?? 37;

  return (
    <div className="space-y-6">
      {/* ── Casino Digital Card ── */}
      {isAuthenticated ? (
        <div
          onClick={() => navigate("/wallet")}
          className="relative rounded-2xl overflow-hidden cursor-pointer select-none"
          style={{
            background: card.bg,
            boxShadow: card.shadow,
            border: card.border,
            minHeight: 190,
          }}
        >
          {/* Subtle diagonal stripe texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.04,
              backgroundImage: `repeating-linear-gradient(45deg,${card.stripe} 0,${card.stripe} 1px,transparent 0,transparent 50%)`,
              backgroundSize: "12px 12px",
            }}
          />

          {/* Top row: brand + EMV chip */}
          <div className="relative flex items-center justify-between px-5 pt-4 pb-1">
            <div className="flex items-center gap-2">
              <img src={appLogo} alt="logo" className="h-6 w-auto" />
              <span
                style={{ letterSpacing: "0.22em", color: card.brandColor }}
                className="text-[11px] font-bold uppercase"
              >
                JuetengPH
              </span>
            </div>
            {/* EMV chip */}
            <svg width="40" height="30" viewBox="0 0 40 30">
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f0c040" />
                  <stop offset="50%" stopColor="#b8860b" />
                  <stop offset="100%" stopColor="#d4af37" />
                </linearGradient>
              </defs>
              <rect x="1" y="1" width="38" height="28" rx="4" fill="url(#cg)" stroke="#78350f" strokeWidth="1" />
              <rect x="14" y="1" width="12" height="28" fill="none" stroke="#78350f" strokeWidth="0.7" />
              <rect x="1" y="10" width="38" height="10" fill="none" stroke="#78350f" strokeWidth="0.7" />
              <rect x="14" y="10" width="12" height="10" rx="1" fill="#c9a227" opacity="0.45" />
            </svg>
          </div>

          {/* Decorative card dots */}
          <div className="relative flex flex-wrap items-center gap-3 px-5 py-2">
            {[0, 1, 2, 3].map((g) => (
              <div key={g} className="flex gap-1.5">
                {[0, 1, 2, 3].map((d) => (
                  <div
                    key={d}
                    className="rounded-full"
                    style={{ width: 6, height: 6, background: card.dotColor }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Name + Balance (right-aligned) */}
          <div className="relative px-5 pb-1">
            <p style={{ color: card.nameColor }} className="text-[10px] uppercase tracking-widest font-medium">
              {user?.person?.firstName} {user?.person?.lastName}
            </p>
            <div className="flex justify-end mt-2">
              <div className="text-right">
                <p style={{ color: card.balanceLabelColor }} className="text-[9px] uppercase tracking-widest">
                  Wallet Balance
                </p>
                <RollingBalance value={balance} />
              </div>
            </div>
          </div>

          {/* CTAs — stop card-click propagation */}
          <div
            className="relative flex flex-col min-[360px]:flex-row gap-2 px-5 pb-5 pt-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Link to="/wallet/deposit" className="w-full min-[360px]:flex-1">
              <button
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold text-black transition-all active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  boxShadow: "0 2px 12px rgba(245,158,11,0.4)",
                }}
              >
                <ArrowDownToLine className="w-3.5 h-3.5" /> Cash In
              </button>
            </Link>
            <Link to="/wallet/withdraw" className="w-full min-[360px]:flex-[0.75]">
              <button
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
                style={{
                  color: card.cashOutColor,
                  border: `1px solid ${card.cashOutBorder}`,
                  background: card.cashOutBg,
                }}
              >
                <ArrowUpFromLine className="w-3.5 h-3.5" /> Cash Out
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <GuestPromo />
      )}

      {/* Today's Draws  */}
      <section className="bento-section" style={{ animationDelay: "150ms" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-text-primary chinese-header">
            Today's Draws
          </h3>
          <Link to="/results" className="text-brand-gold text-xs hover:underline">
            View All
          </Link>
        </div>
        <div className="space-y-2">
          {todaysDraws.length === 0 ? (
            <Card className="text-center py-6 lantern-card">
              <p className="text-text-muted text-sm">No draws scheduled for today</p>
            </Card>
          ) : (
            // Sort: OPEN first, then SCHEDULED/DRAWN, then CLOSED at bottom
            [...todaysDraws]
              .sort((a, b) => {
                const order: Record<string, number> = { OPEN: 0, SCHEDULED: 1, DRAWN: 2, SETTLED: 3, CLOSED: 4, CANCELLED: 5 };
                return (order[a.status] ?? 6) - (order[b.status] ?? 6);
              })
              .map((draw, idx) => {
                const isOpen = draw.status === "OPEN";
                const isDrawn = draw.status === "DRAWN";
                const isScheduled = draw.status === "SCHEDULED";
                const isClosed = draw.status === "CLOSED";
                const drawTimeLabel = (() => {
                  const scheduled = new Date(draw.scheduledAt);
                  return Number.isNaN(scheduled.getTime())
                    ? drawTypeLabel(draw.drawType)
                    : scheduled.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
                })();
                const dateLabel = new Date(draw.drawDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
                const bettors = draw.totalBets ?? 0;

                return (
                  <Card key={draw.id} hover={isOpen} bento delay={200 + idx * 100} className="lantern-card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">

                        {/* Icon — J logo in themed circle, gold when drawn */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isOpen ? "clock-ring-pulse" : ""} ${isDrawn ? "coin-burst" : ""}`}
                          style={{
                            background: isDrawn
                              ? "radial-gradient(circle at 40% 35%, rgba(245,158,11,0.4) 0%, rgba(180,100,0,0.2) 100%)"
                              : isClosed
                              ? "radial-gradient(circle at 40% 35%, rgba(100,100,100,0.2) 0%, rgba(80,80,80,0.08) 100%)"
                              : "radial-gradient(circle at 40% 35%, rgba(220,38,38,0.3) 0%, rgba(220,38,38,0.1) 100%)",
                            border: isDrawn
                              ? "1px solid rgba(245,158,11,0.6)"
                              : isClosed
                              ? "1px solid rgba(150,150,150,0.25)"
                              : `1px solid ${isOpen ? "rgba(220,38,38,0.55)" : "rgba(220,38,38,0.3)"}`,
                          }}
                        >
                          <Coins
                            className="w-5 h-5"
                            style={{
                              color: isDrawn
                                ? "rgba(245,158,11,0.95)"
                                : isClosed
                                ? "rgba(150,150,150,0.4)"
                                : isOpen
                                ? "rgba(220,38,38,0.85)"
                                : "rgba(220,38,38,0.5)",
                            }}
                          />
                        </div>

                        <div>
                          <p className="font-semibold text-text-primary text-sm">
                            {`${drawTimeLabel} Draw`}
                          </p>
                          <p className="text-text-muted text-xs">
                            {dateLabel}
                            <span className="mx-1 opacity-40">•</span>
                            {bettors} {bettors === 1 ? "bettor" : "bettors"}
                          </p>
                        </div>
                      </div>

                      {/* Right side */}
                      {isOpen && (
                        <Link to="/bet">
                          <Button size="sm" variant="primary">Bet Now</Button>
                        </Link>
                      )}
                      {isDrawn && draw.number1 != null && draw.number2 != null && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <SlotBall value={draw.number1} delay={idx * 80} />
                          <SlotBall value={draw.number2} delay={idx * 80 + 80} />
                        </div>
                      )}
                      {(isClosed || isScheduled) && (
                        <span className="shrink-0 text-xs italic text-text-muted">
                          {isClosed ? "Betting Closed" : "Opening Soon"}
                        </span>
                      )}
                    </div>
                  </Card>
                );
              })
          )}
        </div>
      </section>

      {/* Cloud Divider */}
      <div className="cloud-divider" />

      {/* Recent Results */}
      <section className="bento-section" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-text-primary chinese-header">
            Recent Results
          </h3>
          <Link to="/results" className="text-brand-gold text-xs hover:underline">
            See All
          </Link>
        </div>
        <div className="space-y-2">
          {recentResults.length === 0 ? (
            <Card className="text-center py-6 lantern-card">
              <p className="text-text-muted text-sm">
                No results yet - stay tuned!
              </p>
            </Card>
          ) : (
            recentResults.map((result, idx) => (
              <Card
                key={result.id}
                bento
                delay={350 + idx * 100}
                className="flex items-center gap-3 lantern-card"
              >
                <div className="flex gap-1.5">
                  <SlotBall value={result.number1} delay={idx * 120} />
                  <SlotBall value={result.number2} delay={idx * 120 + 80} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">
                    {drawTypeLabel(result.drawType)} Draw
                  </p>
                  <p className="text-xs text-text-muted">
                    {new Date(result.drawDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brand-gold">
                    {formatCurrency(result.totalPayout ?? 0)}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {result.totalBets ?? 0} bet
                    {(result.totalBets ?? 0) !== 1 ? "s" : ""}
                  </p>
                  <p className="text-[10px] text-brand-green">
                    {result._count?.payouts ?? 0} winner
                    {(result._count?.payouts ?? 0) !== 1 ? "s" : ""}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>
      {/* How to Play - Scroll style */}
      <section className="bento-section" style={{ animationDelay: "450ms" }}>
        <h3 className="font-bold text-text-primary mb-3 chinese-header">
          How to Play
        </h3>
        <Card ornate bento delay={500}>
          <div className="space-y-3">
            {[
              {
                step: 1,
                title: "Pick 2 Numbers",
                desc: `Choose any 2 numbers from 1 to ${maxNumber}`,
                Icon: Target,
              },
              {
                step: 2,
                title: "Place Your Bet",
                desc: `Minimum bet is ${minBet} per combination`,
                Icon: Coins,
              },
              {
                step: 3,
                title: "Wait for Draw",
                desc: "Draws at 11AM, 4PM, and 9PM daily",
                Icon: Clock,
              },
              {
                step: 4,
                title: "Win Prizes!",
                desc: "Match both numbers to win up to PHP 50,000",
                Icon: Trophy,
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-red/15 border border-brand-gold/20 flex items-center justify-center shrink-0">
                  <item.Icon className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {item.title}
                  </p>
                  <p className="text-xs text-text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
