import { Link } from "react-router-dom";
import { Card, Badge, Button } from "../components";
import { useAppStore } from "../store/useAppStore";
import { formatCurrency } from "../utils";

const MOCK_DRAWS = [
  {
    id: "1",
    label: "11:00 AM Draw",
    time: "11:00 AM",
    status: "open" as const,
  },
  { id: "2", label: "4:00 PM Draw", time: "4:00 PM", status: "open" as const },
  {
    id: "3",
    label: "9:00 PM Draw",
    time: "9:00 PM",
    status: "upcoming" as const,
  },
];

const MOCK_RECENT_RESULTS = [
  {
    id: "1",
    draw: "11:00 AM",
    date: "Feb 19",
    numbers: [15, 32],
    prize: "₱50,000",
  },
  {
    id: "2",
    draw: "4:00 PM",
    date: "Feb 18",
    numbers: [7, 23],
    prize: "₱50,000",
  },
  {
    id: "3",
    draw: "9:00 PM",
    date: "Feb 18",
    numbers: [3, 29],
    prize: "₱50,000",
  },
];

export default function HomePage() {
  const user = useAppStore((s) => s.user);
  const balance = useAppStore((s) => s.balance);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  return (
    <div className="space-y-6">
      {/* Welcome & Balance Card */}
      {isAuthenticated ? (
        <Card className="bg-gradient-to-br from-brand-red to-brand-red-dark border-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
          <div className="relative">
            <p className="text-white/80 text-sm">Welcome back,</p>
            <h2 className="text-xl font-bold text-white">
              {user?.name || "Player"}
            </h2>
            <div className="mt-4">
              <p className="text-white/70 text-xs uppercase tracking-wider">
                Wallet Balance
              </p>
              <p className="text-3xl font-bold text-brand-gold-light">
                {formatCurrency(balance)}
              </p>
            </div>
            <div className="flex gap-2 mt-4">
              <Link to="/wallet/deposit">
                <Button variant="gold" size="sm">
                  Deposit
                </Button>
              </Link>
              <Link to="/bet">
                <Button variant="green" size="sm">
                  Place Bet
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="bg-gradient-to-br from-brand-red to-brand-red-dark border-0 text-center py-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
          <div className="relative">
            <h2 className="text-2xl font-bold text-white mb-2">
              Swerte Ka Ba Today?
            </h2>
            <p className="text-white/80 text-sm mb-4">
              Pick your lucky numbers and win up to ₱50,000!
            </p>
            <div className="flex justify-center gap-3">
              <Link to="/login">
                <Button variant="gold">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <p className="text-brand-gold text-xl font-bold">₱50K</p>
          <p className="text-gray-400 text-xs mt-1">Top Prize</p>
        </Card>
        <Card className="text-center">
          <p className="text-brand-green text-xl font-bold">₱5</p>
          <p className="text-gray-400 text-xs mt-1">Min Bet</p>
        </Card>
        <Card className="text-center">
          <p className="text-brand-blue text-xl font-bold">1-37</p>
          <p className="text-gray-400 text-xs mt-1">Numbers</p>
        </Card>
      </div>

      {/* Today's Draws */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-white">Today's Draws</h3>
          <Link
            to="/results"
            className="text-brand-gold text-sm hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="space-y-2">
          {MOCK_DRAWS.map((draw) => (
            <Card
              key={draw.id}
              hover
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-red/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-brand-red"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">
                    {draw.label}
                  </p>
                  <p className="text-gray-400 text-xs">Feb 19, 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={draw.status === "open" ? "green" : "gold"}>
                  {draw.status === "open" ? "Open" : "Upcoming"}
                </Badge>
                {draw.status === "open" && (
                  <Link to="/bet">
                    <Button size="sm" variant="primary">
                      Bet Now
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Results */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-white">Recent Results</h3>
          <Link
            to="/results"
            className="text-brand-gold text-sm hover:underline"
          >
            See All
          </Link>
        </div>
        <div className="space-y-2">
          {MOCK_RECENT_RESULTS.map((result) => (
            <Card key={result.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  {result.draw} Draw
                </p>
                <p className="text-xs text-gray-400">{result.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {result.numbers.map((num) => (
                    <span
                      key={num}
                      className="w-9 h-9 rounded-full bg-brand-red flex items-center justify-center text-white font-bold text-sm border-2 border-brand-gold"
                    >
                      {num}
                    </span>
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-brand-gold font-bold text-sm">
                    {result.prize}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* How to Play */}
      <section>
        <h3 className="font-bold text-white mb-3">How to Play</h3>
        <Card>
          <div className="space-y-3">
            {[
              {
                step: 1,
                title: "Pick 2 Numbers",
                desc: "Choose any 2 numbers from 1 to 37",
                color: "brand-red",
              },
              {
                step: 2,
                title: "Place Your Bet",
                desc: "Minimum bet is ₱5 per combination",
                color: "brand-gold",
              },
              {
                step: 3,
                title: "Wait for Draw",
                desc: "Draws at 11AM, 4PM, and 9PM daily",
                color: "brand-blue",
              },
              {
                step: 4,
                title: "Win Prizes!",
                desc: "Match both numbers to win up to ₱50,000",
                color: "brand-green",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full bg-${item.color}/20 flex items-center justify-center shrink-0`}
                >
                  <span className={`text-${item.color} font-bold text-sm`}>
                    {item.step}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
