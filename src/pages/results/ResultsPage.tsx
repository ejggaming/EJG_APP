import { useState } from "react";
import { Card, Badge } from "../../components";

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
        <h1 className="text-xl font-bold text-white">Draw Results</h1>
        <p className="text-gray-400 text-sm">Latest winning numbers</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "bg-brand-red text-white"
                : "bg-surface-elevated text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Latest Result Highlight */}
      {filteredResults.length > 0 && (
        <Card className="bg-gradient-to-br from-brand-red/20 to-brand-gold/10 border border-brand-gold/30">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="gold">Latest</Badge>
            <span className="text-xs text-gray-400">
              {filteredResults[0].date} · {filteredResults[0].drawTime}
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 py-4">
            {filteredResults[0].winningNumbers.map((num) => (
              <div
                key={num}
                className="w-16 h-16 rounded-full bg-brand-red text-white text-2xl font-bold flex items-center justify-center border-4 border-brand-gold shadow-lg shadow-brand-red/30"
              >
                {num}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2">
            <div>
              <p className="text-brand-gold font-bold">
                ₱{filteredResults[0].prize.toLocaleString()}
              </p>
              <p className="text-gray-500">Prize Pool</p>
            </div>
            <div>
              <p className="text-white font-bold">
                {filteredResults[0].totalBets.toLocaleString()}
              </p>
              <p className="text-gray-500">Total Bets</p>
            </div>
            <div>
              <p className="text-brand-green font-bold">
                {filteredResults[0].winners}
              </p>
              <p className="text-gray-500">Winners</p>
            </div>
          </div>
        </Card>
      )}

      {/* Previous Results */}
      <div>
        <h2 className="text-sm font-semibold text-gray-300 mb-2">
          Previous Results
        </h2>
        <div className="space-y-2">
          {filteredResults.slice(1).map((result) => (
            <Card key={result.id} className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {result.winningNumbers.map((num) => (
                  <span
                    key={num}
                    className="w-10 h-10 rounded-full bg-brand-red text-white text-sm font-bold flex items-center justify-center border-2 border-brand-gold"
                  >
                    {num}
                  </span>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">
                  {result.drawTime} Draw
                </p>
                <p className="text-xs text-gray-400">{result.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-brand-gold">
                  ₱{result.prize.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-500">
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
