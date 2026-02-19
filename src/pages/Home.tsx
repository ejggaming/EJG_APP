import { Link } from "react-router-dom";
import { Card, Badge, Button } from "../components";
import { useAppStore } from "../store/useAppStore";
import { formatCurrency } from "../utils";
import {
  Flame,
  Wallet,
  Target,
  Trophy,
  Coins,
  CircleDot,
  Clock,
  Dices,
} from "lucide-react";

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
      {/* Welcome & Balance — Auspicious Hero Card */}
      {isAuthenticated ? (
        <div
          className="auspicious-bg chinese-frame rounded-xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #7f1d1d 0%, #991b1b 30%, #b91c1c 60%, #7f1d1d 100%)",
          }}
        >
          <div className="relative p-4">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-brand-red" />
              <p className="text-white/80 text-sm">Welcome back,</p>
            </div>
            <h2 className="text-xl font-bold text-white">
              {user?.name || "Player"}
            </h2>
            <div className="mt-4 bg-black/20 rounded-lg p-3">
              <p className="text-brand-gold-light/80 text-[10px] uppercase tracking-widest">
                ✦ Wallet Balance ✦
              </p>
              <p className="text-3xl font-extrabold gold-shimmer mt-1">
                {formatCurrency(balance)}
              </p>
            </div>
            <div className="flex gap-2 mt-4">
              <Link to="/wallet/deposit">
                <Button variant="gold" size="sm">
                  <Wallet className="w-3.5 h-3.5 inline mr-1" /> Deposit
                </Button>
              </Link>
              <Link to="/bet">
                <Button variant="green" size="sm">
                  <Target className="w-3.5 h-3.5 inline mr-1" /> Place Bet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="auspicious-bg chinese-frame rounded-xl overflow-hidden text-center"
          style={{
            background:
              "linear-gradient(135deg, #7f1d1d 0%, #991b1b 30%, #b91c1c 60%, #7f1d1d 100%)",
          }}
        >
          <div className="relative p-6">
            <p className="text-brand-gold text-3xl mb-2">
              <Flame className="w-8 h-8 inline text-brand-red" />
              <Dices className="w-8 h-8 inline text-brand-gold mx-2" />
              <Flame className="w-8 h-8 inline text-brand-red" />
            </p>
            <h2 className="text-2xl font-extrabold text-white mb-1">
              Swerte Ka Ba Today?
            </h2>
            <p className="text-white/80 text-sm mb-4">
              Pick your lucky numbers and win up to{" "}
              <span className="gold-shimmer font-bold">₱50,000!</span>
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
        </div>
      )}

      {/* Quick Stats — Fortune tokens */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center lantern-card">
          <Trophy className="w-4 h-4 text-brand-gold/60 mx-auto mb-1" />
          <p className="text-brand-gold text-xl font-extrabold">₱50K</p>
          <p className="text-gray-500 text-[10px] mt-0.5 uppercase tracking-wider">
            Top Prize
          </p>
        </Card>
        <Card className="text-center lantern-card">
          <Coins className="w-4 h-4 text-brand-green/60 mx-auto mb-1" />
          <p className="text-brand-green text-xl font-extrabold">₱5</p>
          <p className="text-gray-500 text-[10px] mt-0.5 uppercase tracking-wider">
            Min Bet
          </p>
        </Card>
        <Card className="text-center lantern-card">
          <CircleDot className="w-4 h-4 text-brand-red/60 mx-auto mb-1" />
          <p className="text-brand-red-light text-xl font-extrabold">1-37</p>
          <p className="text-gray-500 text-[10px] mt-0.5 uppercase tracking-wider">
            Numbers
          </p>
        </Card>
      </div>

      {/* Today's Draws  */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-white chinese-header">Today's Draws</h3>
          <Link
            to="/results"
            className="text-brand-gold text-sm hover:underline"
          >
            View All →
          </Link>
        </div>
        <div className="space-y-2">
          {MOCK_DRAWS.map((draw) => (
            <Card
              key={draw.id}
              hover
              className="flex items-center justify-between lantern-card"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{
                    background:
                      "radial-gradient(circle at 40% 35%, rgba(220,38,38,0.3) 0%, rgba(220,38,38,0.1) 100%)",
                    border: "1px solid rgba(220,38,38,0.3)",
                  }}
                >
                  <Clock className="w-5 h-5 text-brand-red/70" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">
                    {draw.label}
                  </p>
                  <p className="text-gray-500 text-xs">Feb 19, 2026</p>
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

      {/* Cloud Divider */}
      <div className="cloud-divider" />

      {/* Recent Results */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-white chinese-header">
            Recent Results
          </h3>
          <Link
            to="/results"
            className="text-brand-gold text-sm hover:underline"
          >
            See All →
          </Link>
        </div>
        <div className="space-y-2">
          {MOCK_RECENT_RESULTS.map((result) => (
            <Card
              key={result.id}
              className="flex items-center justify-between lantern-card"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  {result.draw} Draw
                </p>
                <p className="text-xs text-gray-500">{result.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {result.numbers.map((num) => (
                    <span key={num} className="lottery-ball w-9 h-9 text-sm">
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

      {/* How to Play — Scroll style */}
      <section>
        <h3 className="font-bold text-white mb-3 chinese-header">
          How to Play
        </h3>
        <Card ornate>
          <div className="space-y-3">
            {[
              {
                step: 1,
                title: "Pick 2 Numbers",
                desc: "Choose any 2 numbers from 1 to 37",
                Icon: Target,
              },
              {
                step: 2,
                title: "Place Your Bet",
                desc: "Minimum bet is ₱5 per combination",
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
                desc: "Match both numbers to win up to ₱50,000",
                Icon: Trophy,
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-red/15 border border-brand-gold/20 flex items-center justify-center shrink-0">
                  <item.Icon className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
