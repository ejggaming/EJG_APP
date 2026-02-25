import { useState } from "react";
import { Card } from "../../components";
import { Trophy, Flame } from "lucide-react";
import { ResultsSkeleton } from "../../components/ChineseSkeleton";
import { useDrawResultsQuery, drawTypeLabel } from "../../hooks/useBet";
import { formatCurrency } from "../../utils";

const TABS = [
  { label: "All", value: undefined },
  { label: "11:00 AM", value: "MORNING" },
  { label: "4:00 PM", value: "AFTERNOON" },
] as const;

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const drawType = TABS.find((t) => t.label === activeTab)?.value;
  const { data, isLoading } = useDrawResultsQuery({
    drawType,
    limit: 20,
  });
  const results = data?.draws ?? [];

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

      {results.length === 0 ? (
        <Card bento className="text-center py-8 lantern-card">
          <p className="text-text-muted text-sm">No results available</p>
        </Card>
      ) : (
        <>
          {/* Latest Result Highlight */}
          <Card
            className="auspicious-bg overflow-hidden"
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
            <div className="flex items-center justify-between mb-2">
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
            <div className="flex items-center justify-center gap-6 py-5">
              <div className="lottery-ball lottery-ball-selected w-16 h-16 text-2xl">
                {results[0].number1}
              </div>
              <div className="lottery-ball lottery-ball-selected w-16 h-16 text-2xl">
                {results[0].number2}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs mt-2 border-t border-brand-gold/15 pt-3">
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
            </div>
          </Card>

          {/* Cloud Divider */}
          <div className="cloud-divider" />

          {/* Previous Results */}
          <div>
            <h2 className="text-sm font-semibold text-text-secondary mb-2 chinese-header">
              Previous Results
            </h2>
            <div className="space-y-2">
              {results.slice(1).map((result, index) => (
                <Card
                  key={result.id}
                  bento
                  delay={200 + index * 80}
                  className="flex items-center gap-3 lantern-card"
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
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
