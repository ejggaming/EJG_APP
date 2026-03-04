import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, NumberBall, Modal } from "../../components";
import { useAppStore } from "../../store/useAppStore";
import { useThemeStore } from "../../store/useThemeStore";
import { formatCurrency } from "../../utils";
import toast from "react-hot-toast";
import {
  Target,
  CircleDot,
  Coins,
  Dices,
  X,
  Check,
  Loader2,
  CalendarDays,
  ArrowDownToLine,
  History,
  Receipt,
  ChevronDown,
  Wallet,
} from "lucide-react";
import AutoBetPage from "./AutoBetPage";
import BetHistoryPage from "./BetHistory";
import {
  useTodaysDrawsQuery,
  useGameConfigQuery,
  usePlaceBetMutation,
  drawLabel,
  drawTypeLabel,
} from "../../hooks/useBet";
import { useMyWalletQuery } from "../../hooks/useWallet";

export default function BetPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const balance = useAppStore((s) => s.balance);
  const betSlip = useAppStore((s) => s.betSlip);
  const addToBetSlip = useAppStore((s) => s.addToBetSlip);
  const removeFromBetSlip = useAppStore((s) => s.removeFromBetSlip);
  const clearBetSlip = useAppStore((s) => s.clearBetSlip);
  const pendingBet = useAppStore((s) => s.pendingBet);
  const setPendingBet = useAppStore((s) => s.setPendingBet);

  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [amount, setAmount] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedDraw, setSelectedDraw] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rollingNums, setRollingNums] = useState<[number, number]>([1, 1]);
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tabFromUrl: "manual" | "auto" | "myBets" =
    tabParam === "auto" ? "auto" : tabParam === "me" ? "myBets" : "manual";
  const [activeTab, setActiveTab] = useState<"manual" | "auto" | "myBets">(tabFromUrl);

  // Sync activeTab when URL param changes (deep link / back-forward)
  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabParam]);

  const handleTabChange = (tab: "manual" | "auto" | "myBets") => {
    setActiveTab(tab);
    const param = tab === "auto" ? "auto" : tab === "myBets" ? "me" : "all";
    setSearchParams({ tab: param }, { replace: true });
  };

  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const machine = {
    bg: isDark
      ? "linear-gradient(160deg, #160800 0%, #2d1200 50%, #160800 100%)"
      : "#ffffff",
    border: isDark ? "2px solid rgba(245,158,11,0.22)" : "2px solid rgba(220,38,38,0.18)",
    shadow: isDark
      ? "0 8px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(245,158,11,0.12)"
      : "0 4px 20px rgba(0,0,0,0.08)",
    viewportBg: isDark ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.04)",
    viewportBorder: isDark ? "1px solid rgba(245,158,11,0.12)" : "1px solid rgba(220,38,38,0.12)",
    viewportShadow: isDark
      ? "inset 0 4px 18px rgba(0,0,0,0.85), inset 0 -1px 4px rgba(245,158,11,0.04)"
      : "inset 0 2px 8px rgba(0,0,0,0.06)",
    headerBorder: isDark ? "rgba(245,158,11,0.18)" : "rgba(220,38,38,0.12)",
    ballLabel: isDark ? "rgba(245,158,11,0.45)" : "rgba(180,30,30,0.6)",
    separator: isDark ? "rgba(245,158,11,0.6)" : "rgba(180,30,30,0.5)",
    labelColor: isDark ? "rgba(245,158,11,0.85)" : "rgba(180,30,30,0.85)",
    counterColor: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)",
  };

  const { data: todaysDraws = [] } = useTodaysDrawsQuery();
  const { data: gameConfig } = useGameConfigQuery();
  const placeBet = usePlaceBetMutation();
  const { refetch: refetchWallet } = useMyWalletQuery();

  const maxNumber = gameConfig?.maxNumber ?? 37;
  const minBet = gameConfig?.minBet ?? 5;
  const maxBet = gameConfig?.maxBet ?? 1000;
  const NUMBERS = Array.from({ length: maxNumber }, (_, i) => i + 1);
  const QUICK_AMOUNTS = [5, 10, 20, 50, 100, 500].filter(
    (a) => a >= minBet && a <= maxBet,
  );

  const openDraws = todaysDraws.filter((d) => d.status === "OPEN");

  const effectiveDraw =
    selectedDraw && openDraws.find((d) => d.id === selectedDraw)
      ? selectedDraw
      : openDraws[0]?.id ?? "";

  // Restore pending bet after login redirect
  useEffect(() => {
    if (pendingBet && isAuthenticated && openDraws.length > 0) {
      setSelectedNumbers(pendingBet.numbers);
      setAmount(pendingBet.amount);
      const matchingDraw = openDraws.find((d) => d.id === pendingBet.drawId);
      if (matchingDraw) setSelectedDraw(matchingDraw.id);
      const draw = matchingDraw ?? openDraws[0];
      if (draw) {
        addToBetSlip({
          id: `${Date.now()}-${Math.random()}`,
          numbers: pendingBet.numbers,
          amount: pendingBet.amount,
          drawId: draw.id,
          drawLabel: drawLabel(draw),
        });
        toast.success(`Added ${pendingBet.numbers[0]}-${pendingBet.numbers[1]} to bet slip`);
      }
      setPendingBet(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, openDraws.length]);

  const handleNumberClick = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers((prev) => prev.filter((n) => n !== num));
    } else if (selectedNumbers.length < 2) {
      setSelectedNumbers((prev) => [...prev, num]);
    }
  };

  const handleQuickPick = () => {
    if (isDrawing) return;
    const nums: number[] = [];
    while (nums.length < 2) {
      const rand = Math.floor(Math.random() * maxNumber) + 1;
      if (!nums.includes(rand)) nums.push(rand);
    }
    const finalNums = nums.sort((a, b) => a - b) as [number, number];
    setIsDrawing(true);
    setSelectedNumbers([]);
    const startTime = Date.now();
    const fastEnd = 1000;
    const totalEnd = 1700;
    const tick = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= totalEnd) {
        setSelectedNumbers(finalNums);
        setIsDrawing(false);
        return;
      }
      if (elapsed < fastEnd) {
        setRollingNums([
          Math.floor(Math.random() * maxNumber) + 1,
          Math.floor(Math.random() * maxNumber) + 1,
        ]);
        setTimeout(tick, 60 + (elapsed / fastEnd) * 50);
      } else {
        setRollingNums([finalNums[0], Math.floor(Math.random() * maxNumber) + 1]);
        setTimeout(tick, 110 + ((elapsed - fastEnd) / (totalEnd - fastEnd)) * 180);
      }
    };
    tick();
  };

  const handleAmountSelect = (amt: number) => {
    setAmount(amt);
    setCustomAmount("");
  };

  const handleCustomAmount = (val: string) => {
    setCustomAmount(val);
    const parsed = parseInt(val);
    if (!isNaN(parsed) && parsed >= minBet) setAmount(parsed);
  };

  const handleAddToBetSlip = () => {
    if (selectedNumbers.length !== 2) {
      toast.error("Select exactly 2 numbers");
      return;
    }
    if (amount < minBet) {
      toast.error(`Minimum bet is ₱${minBet}`);
      return;
    }
    if (!effectiveDraw) {
      toast.error("No open draw available");
      return;
    }
    if (!isAuthenticated) {
      const draw = openDraws.find((d) => d.id === effectiveDraw)!;
      setPendingBet({
        numbers: [selectedNumbers[0], selectedNumbers[1]],
        amount,
        drawId: draw.id,
        drawLabel: drawLabel(draw),
      });
      toast("Please login to place your bet", { icon: "🔒" });
      navigate("/login");
      return;
    }
    const draw = openDraws.find((d) => d.id === effectiveDraw)!;
    addToBetSlip({
      id: `${Date.now()}-${Math.random()}`,
      numbers: [selectedNumbers[0], selectedNumbers[1]],
      amount,
      drawId: draw.id,
      drawLabel: drawLabel(draw),
    });
    toast.success(`Added ${selectedNumbers[0]}-${selectedNumbers[1]} to bet slip`);
    setSelectedNumbers([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalBet = betSlip.reduce((sum, b) => sum + b.amount, 0);

  const handleConfirmAll = async () => {
    if (betSlip.length === 0) return;
    if (totalBet > balance) {
      toast.error("Insufficient balance");
      return;
    }
    try {
      for (const bet of betSlip) {
        await placeBet.mutateAsync({
          drawId: bet.drawId,
          number1: bet.numbers[0],
          number2: bet.numbers[1],
          amount: bet.amount,
        });
      }
      clearBetSlip();
      setShowConfirm(false);
      refetchWallet();
      toast.success("Bets placed! Good luck! 🎉");
      handleTabChange("myBets");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("Failed to place bets");
    }
  };

  return (
    <div className="space-y-4">

      {/* ── Page Header (always at top) ── */}
      <div>
        <h1 className="text-xl font-extrabold text-text-primary chinese-header">
          Place Your Bet
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Pick 2 numbers from 1–{maxNumber}, min ₱{minBet}
        </p>
      </div>

      {/* ── SECTION 1: Sticky Balance + Bet Slip ── */}
      <div className="sticky top-14.75 z-30 -mx-4 px-4 pt-2 pb-3 border-b border-brand-gold/10"
        style={{ background: isDark ? "rgba(var(--color-surface-rgb, 10,2,2),0.97)" : "rgba(255,250,245,0.97)", backdropFilter: "blur(12px)" }}
      >
        {/* Modern Balance Card */}
        <div
          className="relative rounded-2xl px-4 py-3 mb-2 overflow-hidden"
          style={{
            background: isDark
              ? "linear-gradient(135deg, #0d0000 0%, #4a0808 45%, #1a0000 100%)"
              : "linear-gradient(135deg, #7f1d1d 0%, #c0221e 55%, #7f1414 100%)",
            border: "1px solid rgba(245,158,11,0.22)",
            boxShadow: isDark
              ? "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(245,158,11,0.12)"
              : "0 4px 20px rgba(120,14,14,0.35), inset 0 1px 0 rgba(245,158,11,0.18)",
          }}
        >
          {/* Diagonal stripe texture */}
          <div
            style={{
              position: "absolute", inset: 0, opacity: 0.05,
              backgroundImage: "repeating-linear-gradient(45deg, #f59e0b 0, #f59e0b 1px, transparent 0, transparent 50%)",
              backgroundSize: "10px 10px",
            }}
          />
          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(245,158,11,0.18)", border: "1px solid rgba(245,158,11,0.35)" }}
              >
                <Wallet className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] font-semibold"
                  style={{ color: "rgba(255,255,255,0.5)" }}>
                  Available Balance
                </p>
                <p className="text-xl font-extrabold gold-shimmer leading-tight">
                  {formatCurrency(balance)}
                </p>
              </div>
            </div>
            <Link to="/wallet/deposit" onClick={(e) => e.stopPropagation()}>
              <button
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-black transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  boxShadow: "0 2px 10px rgba(245,158,11,0.45)",
                }}
              >
                <ArrowDownToLine className="w-3.5 h-3.5" /> Cash In
              </button>
            </Link>
          </div>
        </div>

        {/* Bet Slip */}
        {betSlip.length === 0 ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-card border border-dashed border-brand-gold/20">
            <Receipt className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <span className="text-xs text-text-muted italic">Bet slip is empty — pick numbers below</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Scrollable bet chips */}
            <div className="flex-1 flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
              {betSlip.map((bet) => (
                <div
                  key={bet.id}
                  className="flex items-center gap-1 px-2 py-1 bg-surface-card rounded-lg border border-brand-gold/20 shrink-0"
                >
                  <span className="lottery-ball w-6 h-6 text-[10px]">{bet.numbers[0]}</span>
                  <span className="lottery-ball w-6 h-6 text-[10px]">{bet.numbers[1]}</span>
                  <span className="text-[10px] text-brand-gold font-bold ml-0.5">
                    {formatCurrency(bet.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromBetSlip(bet.id)}
                    className="ml-0.5 text-text-muted hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            {/* Confirm all button */}
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={totalBet > balance}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-50"
              style={{
                background: totalBet > balance
                  ? "#374151"
                  : "linear-gradient(135deg, #16a34a, #15803d)",
                boxShadow: totalBet > balance ? "none" : "0 2px 8px rgba(22,163,74,0.3)",
              }}
            >
              <Check className="w-3.5 h-3.5" />
              {formatCurrency(totalBet)}
            </button>
          </div>
        )}
      </div>

      {/* ── Tab Switcher ── */}
      <div className="flex bg-surface-card border border-brand-gold/15 rounded-xl p-1 gap-1">
        <button
          type="button"
          onClick={() => handleTabChange("manual")}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "manual" ? "bg-brand-red text-white shadow" : "text-text-muted"
          }`}
        >
          <Target className="w-3.5 h-3.5" /> Manual
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("auto")}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "auto" ? "bg-brand-red text-white shadow" : "text-text-muted"
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" /> Auto
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("myBets")}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "myBets" ? "bg-brand-red text-white shadow" : "text-text-muted"
          }`}
        >
          <History className="w-3.5 h-3.5" /> My Bets
        </button>
      </div>

      {/* ── MANUAL TAB ── */}
      {activeTab === "manual" && (
        <>
          {/* Select Draw — single-row dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-text-secondary whitespace-nowrap shrink-0">
              ✦ Select Draw
            </span>
            <div className="relative flex-1">
              <select
                value={effectiveDraw}
                onChange={(e) => setSelectedDraw(e.target.value)}
                disabled={openDraws.length === 0}
                className="w-full appearance-none rounded-xl border-2 border-brand-gold/20 bg-surface-card pl-3 pr-8 py-2 text-text-primary text-sm focus:border-brand-gold focus:outline-none cursor-pointer disabled:opacity-50"
              >
                {openDraws.length === 0 ? (
                  <option value="">No open draws right now</option>
                ) : (
                  openDraws.map((draw) => (
                    <option key={draw.id} value={draw.id}>
                      {drawTypeLabel(draw.drawType)} Draw — Open
                    </option>
                  ))
                )}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            </div>
          </div>

          {/* Section 3b: Pick 2 Numbers */}
          <section>
            <h3 className="text-sm font-semibold text-text-secondary mb-2">
              Pick 2 Numbers
            </h3>

            {/* Lucky Draw Machine */}
            <div
              className="relative rounded-2xl overflow-hidden select-none mb-3"
              style={{
                background: machine.bg,
                border: machine.border,
                boxShadow: machine.shadow,
              }}
            >
              {/* Corner rivets */}
              {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos) => (
                <div
                  key={pos}
                  className={`absolute ${pos} w-2 h-2 rounded-full`}
                  style={{
                    background: "radial-gradient(circle, #b8860b, #5a3e00)",
                    border: "1px solid rgba(245,158,11,0.3)",
                  }}
                />
              ))}

              {/* Machine header */}
              <div
                className="flex items-center justify-between px-5 pt-3 pb-2 border-b"
                style={{ borderColor: machine.headerBorder }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: isDrawing ? "#ef4444" : "#22c55e",
                      boxShadow: isDrawing ? "0 0 8px #ef4444" : "0 0 8px #22c55e",
                      transition: "all 0.3s ease",
                    }}
                  />
                  <span
                    className="text-[10px] uppercase tracking-[0.25em] font-bold"
                    style={{ color: machine.labelColor }}
                  >
                    Lucky Draw Machine
                  </span>
                </div>
                <span className="text-[10px] font-mono" style={{ color: machine.counterColor }}>
                  <CircleDot className="w-3 h-3 inline mr-1" />
                  {selectedNumbers.length}/2
                </span>
              </div>

              {/* Ball viewport */}
              <div
                className="mx-4 my-3 rounded-xl py-5 relative"
                style={{
                  background: machine.viewportBg,
                  border: machine.viewportBorder,
                  boxShadow: machine.viewportShadow,
                }}
              >
                <div
                  className="absolute top-0 left-10 right-10 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
                  }}
                />
                <div className="flex items-center justify-center gap-8">
                  {/* Ball 1 */}
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-extrabold ${
                        isDrawing
                          ? "lottery-ball"
                          : selectedNumbers[0]
                          ? "lottery-ball lottery-ball-selected"
                          : "bg-surface-elevated border-2 border-dashed border-brand-gold/30 text-text-muted"
                      }`}
                      style={{ filter: isDrawing ? "blur(0.7px)" : "none", transition: "filter 0.2s" }}
                    >
                      {isDrawing ? rollingNums[0] : selectedNumbers[0] || "?"}
                    </div>
                    <span
                      className="text-[9px] uppercase tracking-wider font-bold"
                      style={{ color: machine.ballLabel }}
                    >
                      Ball 1
                    </span>
                  </div>

                  <span className="text-2xl font-extrabold pb-5" style={{ color: machine.separator }}>
                    ×
                  </span>

                  {/* Ball 2 */}
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-extrabold ${
                        isDrawing
                          ? "lottery-ball"
                          : selectedNumbers[1]
                          ? "lottery-ball lottery-ball-selected"
                          : "bg-surface-elevated border-2 border-dashed border-brand-gold/30 text-text-muted"
                      }`}
                      style={{ filter: isDrawing ? "blur(0.7px)" : "none", transition: "filter 0.2s" }}
                    >
                      {isDrawing ? rollingNums[1] : selectedNumbers[1] || "?"}
                    </div>
                    <span
                      className="text-[9px] uppercase tracking-wider font-bold"
                      style={{ color: machine.ballLabel }}
                    >
                      Ball 2
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Draw button */}
              <div className="px-4 pb-4">
                <button
                  onClick={handleQuickPick}
                  disabled={isDrawing}
                  className="w-full py-3.5 rounded-xl font-bold text-sm tracking-[0.18em] uppercase flex items-center justify-center gap-2 cursor-pointer"
                  style={{
                    background: isDrawing
                      ? "linear-gradient(180deg, #4a0808 0%, #300505 100%)"
                      : "linear-gradient(180deg, #ef4444 0%, #b91c1c 60%, #991b1b 100%)",
                    boxShadow: isDrawing
                      ? "inset 0 3px 10px rgba(0,0,0,0.6)"
                      : "0 5px 0 #7f1d1d, 0 8px 24px rgba(220,38,38,0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
                    color: isDrawing ? "rgba(255,255,255,0.35)" : "#fff",
                    transform: isDrawing ? "translateY(4px)" : "translateY(0)",
                    border: "1px solid rgba(0,0,0,0.3)",
                    transition: "transform 0.1s, box-shadow 0.1s, background 0.2s",
                  }}
                >
                  {isDrawing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Drawing Numbers...
                    </>
                  ) : (
                    <>
                      <Dices className="w-4 h-4" /> Quick Draw!
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Manual pick */}
            <p className="text-[10px] uppercase tracking-wider text-text-muted text-center mb-2">
              — or pick manually —
            </p>
            <div className="grid grid-cols-6 min-[375px]:grid-cols-7 gap-1">
              {NUMBERS.map((num) => (
                <NumberBall
                  key={num}
                  number={num}
                  selected={selectedNumbers.includes(num)}
                  disabled={selectedNumbers.length >= 2 && !selectedNumbers.includes(num)}
                  onClick={() => handleNumberClick(num)}
                />
              ))}
            </div>
          </section>

          {/* Section 3c: Add Bet Amount */}
          <section>
            <h3 className="text-sm font-semibold text-text-secondary mb-2">
              <Coins className="w-3.5 h-3.5 inline mr-1" />
              Add Bet Amount
            </h3>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleAmountSelect(amt)}
                  className={`rounded-xl py-2.5 border-2 font-bold text-sm transition-all cursor-pointer ${
                    amount === amt && !customAmount
                      ? "border-brand-green bg-brand-green/10 text-brand-green shadow-[0_0_10px_rgba(22,163,74,0.15)]"
                      : "border-brand-gold/15 bg-surface-card text-text-muted hover:border-brand-gold/30"
                  }`}
                >
                  ₱{amt}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold font-bold">₱</span>
              <input
                type="number"
                placeholder={`Custom amount (min ₱${minBet})`}
                value={customAmount}
                onChange={(e) => handleCustomAmount(e.target.value)}
                min={minBet}
                className="w-full rounded-xl border-2 border-brand-gold/20 bg-surface-card pl-8 pr-4 py-2.5 text-text-primary placeholder-text-muted focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 focus:outline-none"
              />
            </div>
          </section>

          {/* Add to Bet Slip */}
          <Button
            fullWidth
            size="lg"
            variant="primary"
            onClick={handleAddToBetSlip}
            disabled={selectedNumbers.length !== 2 || amount < minBet || !effectiveDraw}
          >
            <Target className="w-4 h-4 inline mr-1" /> Add to Bet Slip —{" "}
            {formatCurrency(amount)}
          </Button>
        </>
      )}

      {/* ── AUTO TAB ── */}
      {activeTab === "auto" && <AutoBetPage />}

      {/* ── MY BETS TAB ── */}
      {activeTab === "myBets" && <BetHistoryPage hideBalance />}

      {/* ── Confirm Modal ── */}
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Your Bets">
        <div className="space-y-3">
          {betSlip.map((bet) => (
            <div
              key={bet.id}
              className="flex items-center justify-between bg-surface-elevated rounded-xl p-3 border border-brand-gold/10"
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {bet.numbers.map((num) => (
                    <span key={num} className="lottery-ball w-7 h-7 text-xs">
                      {num}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-text-muted">{bet.drawLabel}</span>
              </div>
              <span className="text-brand-gold font-bold text-sm">{formatCurrency(bet.amount)}</span>
            </div>
          ))}

          <div className="border-t border-brand-gold/20 pt-3 flex items-center justify-between">
            <span className="text-text-primary font-semibold">Total</span>
            <span className="font-extrabold text-xl gold-shimmer">{formatCurrency(totalBet)}</span>
          </div>

          <p className="text-xs text-text-muted text-center">
            By confirming, the amount will be deducted from your wallet. Bets cannot be cancelled
            after placement.
          </p>

          <div className="flex gap-2 pt-2">
            <Button fullWidth variant="secondary" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              fullWidth
              variant="green"
              isLoading={placeBet.isPending}
              onClick={handleConfirmAll}
            >
              <Check className="w-4 h-4 inline mr-1" /> Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
