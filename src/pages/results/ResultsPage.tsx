import { useState } from "react";
import { Card } from "../../components";
import { Trophy, Flame } from "lucide-react";

interface DrawResult {
  id: string;
  drawTime: string;
  date: string;
  winningNumbers: [number, number];
  prize: number;
  totalBets: number;
  winners: number;
}

const MOCK_RESULTS: DrawResult[] = [
  {
    id: "1",
    drawTime: "11:00 AM",
    date: "Feb 19, 2026",
    winningNumbers: [12, 35],
    prize: 50000,
    totalBets: 1245,
    winners: 3,
  },
  {
    id: "2",
    drawTime: "4:00 PM",
    date: "Feb 18, 2026",
    winningNumbers: [7, 23],
    prize: 75000,
    totalBets: 2100,
    winners: 5,
  },
  {
    id: "3",
    drawTime: "9:00 PM",
    date: "Feb 18, 2026",
    winningNumbers: [3, 28],
    prize: 60000,
    totalBets: 1800,
    winners: 2,
  },
  {
    id: "4",
    drawTime: "11:00 AM",
    date: "Feb 18, 2026",
    winningNumbers: [19, 31],
    prize: 45000,
    totalBets: 980,
    winners: 1,
  },
  {
    id: "5",
    drawTime: "4:00 PM",
    date: "Feb 17, 2026",
    winningNumbers: [1, 37],
    prize: 100000,
    totalBets: 3200,
    winners: 1,
  },
  {
    id: "6",
    drawTime: "9:00 PM",
    date: "Feb 17, 2026",
    winningNumbers: [15, 22],
    prize: 55000,
    totalBets: 1500,
    winners: 4,
  },
  {
    id: "7",
    drawTime: "11:00 AM",
    date: "Feb 17, 2026",
    winningNumbers: [9, 16],
    prize: 40000,
    totalBets: 870,
    winners: 2,
  },
];

const TABS = ["All", "11:00 AM", "4:00 PM", "9:00 PM"];

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredResults =
    activeTab === "All"
      ? MOCK_RESULTS
      : MOCK_RESULTS.filter((r) => r.drawTime === activeTab);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold text-white chinese-header">
          Draw Results
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          <Trophy className="w-3.5 h-3.5 inline mr-1" />
          Latest winning numbers
        </p>
      </div>

      {/* Filter Tabs — Chinese-styled */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
              activeTab === tab
                ? "bg-brand-red text-white border-brand-gold/40 shadow-[0_0_10px_rgba(220,38,38,0.2)]"
                : "bg-surface-card text-gray-500 border-brand-gold/10 hover:text-white hover:border-brand-gold/25"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Latest Result Highlight — Grand announcement */}
      {filteredResults.length > 0 && (
        <Card
          className="auspicious-bg overflow-hidden"
          ornate
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
            <span className="text-xs text-gray-500">
              {filteredResults[0].date} · {filteredResults[0].drawTime}
            </span>
          </div>
          <div className="flex items-center justify-center gap-6 py-5">
            {filteredResults[0].winningNumbers.map((num) => (
              <div
                key={num}
                className="lottery-ball lottery-ball-selected w-16 h-16 text-2xl"
              >
                {num}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2 border-t border-brand-gold/15 pt-3">
            <div>
              <p className="text-brand-gold font-extrabold">
                ₱{filteredResults[0].prize.toLocaleString()}
              </p>
              <p className="text-gray-600 text-[10px] uppercase tracking-wider">
                Prize Pool
              </p>
            </div>
            <div>
              <p className="text-white font-bold">
                {filteredResults[0].totalBets.toLocaleString()}
              </p>
              <p className="text-gray-600 text-[10px] uppercase tracking-wider">
                Total Bets
              </p>
            </div>
            <div>
              <p className="text-brand-green font-bold">
                {filteredResults[0].winners}
              </p>
              <p className="text-gray-600 text-[10px] uppercase tracking-wider">
                Winners
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Cloud Divider */}
      <div className="cloud-divider" />

      {/* Previous Results */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 mb-2 chinese-header">
          Previous Results
        </h2>
        <div className="space-y-2">
          {filteredResults.slice(1).map((result) => (
            <Card
              key={result.id}
              className="flex items-center gap-3 lantern-card"
            >
              <div className="flex gap-1.5">
                {result.winningNumbers.map((num) => (
                  <span key={num} className="lottery-ball w-10 h-10 text-sm">
                    {num}
                  </span>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">
                  {result.drawTime} Draw
                </p>
                <p className="text-xs text-gray-500">{result.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-brand-gold">
                  ₱{result.prize.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-600">
                  {result.winners} winner{result.winners > 1 ? "s" : ""}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
