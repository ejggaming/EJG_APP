import { Outlet, useLocation, Link } from "react-router-dom";
import { cn } from "../../utils";
import {
  Home,
  Target,
  Trophy,
  Wallet,
  User,
  Bell,
  Flame,
  Sun,
  Moon,
} from "lucide-react";
import { useThemeStore } from "../../store/useThemeStore";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/bet", label: "Bet", icon: Target },
  { path: "/results", label: "Results", icon: Trophy },
  { path: "/wallet", label: "Wallet", icon: Wallet },
  { path: "/profile", label: "Profile", icon: User },
];

export default function MainLayout() {
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top Header — Chinese scroll-style */}
      <header
        className="sticky top-0 z-40 backdrop-blur-lg border-b border-brand-gold/20"
        style={{
          background: `linear-gradient(180deg, var(--color-header-from) 0%, var(--color-header-to) 100%)`,
        }}
      >
        {/* Gold trim line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-brand-red" />
            <span className="font-extrabold text-lg tracking-wide">
              <span className="text-brand-red">Jueteng</span>
              <span className="gold-shimmer">PH</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-brand-gold/70 hover:text-brand-gold hover:bg-brand-gold/10 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <Link
              to="/notifications"
              className="relative text-brand-gold/70 hover:text-brand-gold transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-red rounded-full text-[10px] flex items-center justify-center font-bold text-white border border-brand-gold/50">
                3
              </span>
            </Link>
          </div>
        </div>
        {/* Bottom gold trim */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4 pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation — Ornate Chinese tab bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t-2 border-brand-gold/25 backdrop-blur-lg"
        style={{
          background: `linear-gradient(0deg, var(--color-nav-from) 0%, var(--color-nav-to) 100%)`,
        }}
      >
        <div className="h-[1px] bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
        <div className="max-w-lg mx-auto flex items-center justify-around py-1.5">
          {navItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-brand-gold bg-brand-red/15 scale-105"
                    : "text-gray-500 hover:text-gray-300",
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5",
                    isActive && "drop-shadow-[0_0_6px_rgba(220,38,38,0.5)]",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-semibold tracking-wider",
                    isActive ? "text-brand-gold" : "text-gray-500",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
