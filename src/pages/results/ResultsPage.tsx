import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "../../components";
import { DetailModal } from "../../components/DetailModal";
import { Trophy, Flame, CalendarDays, ChevronRight } from "lucide-react";
import { ResultsSkeleton } from "../../components/ChineseSkeleton";
import { useDrawResultsQuery, drawTypeLabel } from "../../hooks/useBet";
import { formatCurrency } from "../../utils";

const TABS = [
  { label: "All", value: undefined },
  { label: "11:00 AM", value: "MORNING" },
  { label: "4:00 PM", value: "AFTERNOON" },
] as const;

function buildModalSections(result: any) {
  return [
    {
      title: "Winning Numbers",
      fields: [
        { label: "Number 1", value: result.number1 },
        { label: "Number 2", value: result.number2 },
      ],
    },
    {
      title: "Draw Info",
      fields: [
        {
          label: "Draw Type",
          value: drawTypeLabel(result.drawType),
        },
        {
          label: "Status",
          value: result.status ?? "—",
        },
        {
          label: "Draw Date",
          value: result.drawDate
            ? new Date(result.drawDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "—",
          wide: true,
        },
      ],
    },
    {
      title: "Statistics",
      fields: [
        {
          label: "Total Payout",
          value: (
            <span className="text-brand-gold font-bold">
              {formatCurrency(result.totalPayout ?? 0)}
            </span>
          ),
        },
        {
          label: "Total Bets",
          value: result.totalBets?.toLocaleString() ?? "0",
        },
        {
          label: "Winners",
          value: (
            <span className="text-brand-green font-bold">
              {result._count?.payouts?.toLocaleString() ?? "0"}
            </span>
          ),
        },
        {
          label: "Draw ID",
          value: (
            <span className="text-[11px] font-mono text-text-muted break-all">
              {result.id}
            </span>
          ),
          wide: true,
        },
      ],
    },
  ];
}

export default function ResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dateParam = searchParams.get("date");
  const resultIdParam = searchParams.get("id");
  const [activeTab, setActiveTab] = useState<string>("All");

  const drawType = TABS.find((t) => t.label === activeTab)?.value;

  const { data, isLoading } = useDrawResultsQuery({
    drawType,
    limit: 50,
  });
  const allDraws = data?.draws ?? [];

  // Client-side date filter
  const results = dateParam
    ? allDraws.filter((d: any) => {
        const drawDate = d.drawDate ?? d.scheduledAt ?? d.drawnAt ?? "";
        return drawDate.startsWith(dateParam);
      })
    : allDraws;

  // Resolve selected result from URL param (deep link support)
  const selectedResult = resultIdParam
    ? allDraws.find((d: any) => d.id === resultIdParam) ?? null
    : null;

  const openResult = (result: any) => {
    const next = new URLSearchParams(searchParams);
    next.set("id", result.id);
    setSearchParams(next, { replace: false });
  };

  const closeResult = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("id");
    setSearchParams(next, { replace: false });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const next = new URLSearchParams(searchParams);
    if (val) next.set("date", val);
    else next.delete("date");
    next.delete("id");
    setSearchParams(next, { replace: true });
  };

  if (isLoading) return <ResultsSkeleton />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold text-text-primary chinese-header">
          Draw Results
        </h1>
        <p className="text-text-muted text-sm mt-1">
          <Trophy className="w-3.5 h-3.5 inline mr-1" />
          Latest winning numbers
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
              activeTab === tab.label
                ? "bg-brand-red text-white border-brand-gold/40 shadow-[0_0_10px_rgba(220,38,38,0.2)]"
                : "bg-surface-card text-text-muted border-brand-gold/10 hover:text-text-primary hover:border-brand-gold/25"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Date filter */}
      <div className="flex items-center gap-2">
        <CalendarDays className="w-4 h-4 text-brand-gold/60 shrink-0" />
        <input
          type="date"
          value={dateParam ?? ""}
          onChange={handleDateChange}
          className="flex-1 bg-surface-card border border-brand-gold/15 rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-brand-gold/40"
        />
        {dateParam && (
          <button
            onClick={() => setSearchParams({}, { replace: true })}
            className="text-xs text-text-muted hover:text-brand-red transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <Card bento className="text-center py-8 lantern-card">
          <p className="text-text-muted text-sm">No results available</p>
        </Card>
      ) : (
        <>
          {/* Latest Result Highlight — clickable → modal */}
          <button
            className="w-full text-left"
            onClick={() => openResult(results[0])}
          >
            <Card
              className="auspicious-bg overflow-hidden hover:border-brand-gold/30 transition-all"
              ornate
              bento
              delay={100}
              style={
                {
                  background:
                    "linear-gradient(135deg, rgba(139,0,0,0.15) 0%, rgba(217,119,6,0.08) 100%)",
                } as React.CSSProperties
              }
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="fortune-badge">
                  <Flame className="w-3 h-3 inline mr-1" />
                  Latest Draw
                </span>
                <span className="text-xs text-text-muted">
                  {new Date(results[0].drawDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  · {drawTypeLabel(results[0].drawType)}
                </span>
              </div>
              <div className="flex items-center justify-center gap-4 min-[380px]:gap-6 py-5">
                <div className="lottery-ball lottery-ball-selected w-14 h-14 text-xl min-[380px]:w-16 min-[380px]:h-16 min-[380px]:text-2xl">
                  {results[0].number1}
                </div>
                <div className="lottery-ball lottery-ball-selected w-14 h-14 text-xl min-[380px]:w-16 min-[380px]:h-16 min-[380px]:text-2xl">
                  {results[0].number2}
                </div>
              </div>
              <div className="grid grid-cols-2 min-[380px]:grid-cols-3 gap-2 text-center text-xs mt-2 border-t border-brand-gold/15 pt-3">
                <div>
                  <p className="text-brand-gold font-extrabold">
                    {formatCurrency(results[0].totalPayout ?? 0)}
                  </p>
                  <p className="text-text-muted text-[10px] uppercase tracking-wider">
                    Total Payout
                  </p>
                </div>
                <div>
                  <p className="text-text-primary font-bold">
                    {results[0].totalBets?.toLocaleString() ?? "—"}
                  </p>
                  <p className="text-text-muted text-[10px] uppercase tracking-wider">
                    Total Bets
                  </p>
                </div>
                <div>
                  <p className="text-brand-green font-bold">
                    {results[0]._count?.payouts?.toLocaleString() ?? "0"}
                  </p>
                  <p className="text-text-muted text-[10px] uppercase tracking-wider">
                    Winners
                  </p>
                </div>
              </div>
              <p className="text-center text-[10px] text-brand-gold/50 mt-2">
                Tap for full details
              </p>
            </Card>
          </button>

          {/* Cloud Divider */}
          <div className="cloud-divider" />

          {/* Previous Results — each opens modal */}
          <div>
            <h2 className="text-sm font-semibold text-text-secondary mb-2 chinese-header">
              Previous Results
            </h2>
            <div className="space-y-2">
              {results.slice(1).map((result, index) => (
                <button
                  key={result.id}
                  className="w-full text-left"
                  onClick={() => openResult(result)}
                >
                  <Card
                    bento
                    delay={200 + index * 80}
                    className="flex items-center gap-3 lantern-card hover:border-brand-gold/20 transition-all"
                  >
                    <div className="flex gap-1.5">
                      <span className="lottery-ball w-10 h-10 text-sm">
                        {result.number1}
                      </span>
                      <span className="lottery-ball w-10 h-10 text-sm">
                        {result.number2}
                      </span>
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
                    <ChevronRight className="w-4 h-4 text-brand-gold/30 shrink-0" />
                  </Card>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Result Detail Modal */}
      {selectedResult && (
        <DetailModal
          isOpen={true}
          onClose={closeResult}
          title={`${drawTypeLabel(selectedResult.drawType)} Draw · ${new Date(selectedResult.drawDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
          sections={buildModalSections(selectedResult)}
        />
      )}
    </div>
  );
}
