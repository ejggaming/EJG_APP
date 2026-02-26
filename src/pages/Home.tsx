import { Link } from "react-router-dom";
import { Card, Button } from "../components";
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
import {
  useTodaysDrawsQuery,
  useDrawResultsQuery,
  useGameConfigQuery,
  drawTypeLabel,
} from "../hooks/useBet";

export default function HomePage() {
  const user = useAppStore((s) => s.user);
  const balance = useAppStore((s) => s.balance);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  // Real API data
  const { data: todaysDraws = [] } = useTodaysDrawsQuery();
  const { data: resultsData } = useDrawResultsQuery({ limit: 3 });
  const { data: gameConfig } = useGameConfigQuery();

  const recentResults = resultsData?.draws ?? [];

  const topPrize = gameConfig
    ? formatCurrency(gameConfig.maxBet * gameConfig.payoutMultiplier)
    : '';
  const minBet = gameConfig ? formatCurrency(gameConfig.minBet) : '';
  const maxNumber = gameConfig?.maxNumber ?? 37;

  return (
    <div className="space-y-6">
      {/* Welcome & Balance - Auspicious Hero Card */}
      {isAuthenticated ? (
        <div
          className="auspicious-bg chinese-frame rounded-2xl overflow-hidden bento-card"
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
              {user?.person?.firstName || "Player"}
            </h2>
            <div className="mt-4 bg-black/20 rounded-lg p-3">
              <p className="text-brand-gold-light/80 text-[10px] uppercase tracking-widest">
                * Wallet Balance *
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
          className="auspicious-bg chinese-frame rounded-2xl overflow-hidden text-center bento-card"
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
              <span className="gold-shimmer font-bold">PHP 50,000!</span>
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
      {/* Quick Stats - Bento Fortune tokens */}
      <div className="grid grid-cols-3 gap-3">
        <Card bento delay={100} className="text-center lantern-card">
          <Trophy className="w-5 h-5 text-brand-gold/60 mx-auto mb-1.5" />
          <p className="text-brand-gold text-xl font-extrabold">{topPrize}</p>
          <p className="text-text-muted text-[10px] mt-0.5 uppercase tracking-wider">
            Top Prize
          </p>
        </Card>
        <Card bento delay={200} className="text-center lantern-card">
          <Coins className="w-5 h-5 text-brand-green/60 mx-auto mb-1.5" />
          <p className="text-brand-green text-xl font-extrabold">{minBet}</p>
          <p className="text-text-muted text-[10px] mt-0.5 uppercase tracking-wider">
            Min Bet
          </p>
        </Card>
        <Card bento delay={300} className="text-center lantern-card">
          <CircleDot className="w-5 h-5 text-brand-red/60 mx-auto mb-1.5" />
          <p className="text-brand-red-light text-xl font-extrabold">
            1-{maxNumber}
          </p>
          <p className="text-text-muted text-[10px] mt-0.5 uppercase tracking-wider">
            Numbers
          </p>
        </Card>
      </div>

      {/* Today's Draws  */}
      <section className="bento-section" style={{ animationDelay: "150ms" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-text-primary chinese-header">
            Today's Draws
          </h3>
          <Link
            to="/results"
            className="text-brand-gold text-sm hover:underline"
          >
            View All -&gt;
          </Link>
        </div>
        <div className="space-y-2">
          {todaysDraws.length === 0 ? (
            <Card className="text-center py-6 lantern-card">
              <p className="text-text-muted text-sm">
                No draws scheduled for today
              </p>
            </Card>
          ) : (
            todaysDraws.map((draw, idx) => {
              const isOpen = draw.status === "OPEN";
              const drawTimeLabel = (() => {
                const scheduled = new Date(draw.scheduledAt);
                return Number.isNaN(scheduled.getTime())
                  ? drawTypeLabel(draw.drawType)
                  : scheduled.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    });
              })();
              return (
                <Card
                  key={draw.id}
                  hover
                  bento
                  delay={200 + idx * 100}
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
                      <p className="font-semibold text-text-primary text-sm">
                        {`${drawTimeLabel} Draw`}
                      </p>
                      <p className="text-text-muted text-xs">
                        {new Date(draw.drawDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="flex items-center">
                      <Link to="/bet">
                        <Button size="sm" variant="primary">
                          Bet Now
                        </Button>
                      </Link>
                    </div>
                  )}
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
          <Link
            to="/results"
            className="text-brand-gold text-sm hover:underline"
          >
            See All -&gt;
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
                className="flex items-center justify-between lantern-card"
              >
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {drawTypeLabel(result.drawType)} Draw
                  </p>
                  <p className="text-xs text-text-muted">
                    {new Date(result.drawDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {[result.number1, result.number2]
                      .filter((n): n is number => n != null)
                      .map((num) => (
                        <span
                          key={num}
                          className="lottery-ball w-9 h-9 text-sm"
                        >
                          {num}
                        </span>
                      ))}
                  </div>
                  <div className="text-right">
                    <p className="text-brand-gold font-bold text-sm">
                      {formatCurrency(result.totalPayout)}
                    </p>
                  </div>
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
