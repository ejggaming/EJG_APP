import { Outlet, useLocation, Link } from "react-router-dom";
import { cn } from "../../utils";
import { useAppStore } from "../../store/useAppStore";
import { useThemeStore } from "../../store/useThemeStore";
import { formatCurrency } from "../../utils";
import { Sun, Moon } from "lucide-react";

const navItems = [
  {
    path: "/agent",
    label: "Dashboard",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
  },
  {
    path: "/agent/customers",
    label: "Customers",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    path: "/agent/collect-bet",
    label: "Collect Bet",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    path: "/agent/commissions",
    label: "Commissions",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
        />
      </svg>
    ),
  },
  {
    path: "/agent/wallet",
    label: "Wallet",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
  },
];

export default function AgentLayout() {
  const location = useLocation();
  const { user, balance, logout } = useAppStore();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div
      className="min-h-screen flex pl-4 pr-4 py-3 gap-3"
      style={{ background: "var(--admin-outer-bg)" }}
    >
      {/* Sidebar — floating card (matches admin) */}
      <aside className="hidden md:flex md:w-60 shrink-0 flex-col bg-surface-card border border-border-subtle rounded-2xl sticky top-3 h-[calc(100vh-1.5rem)] z-30">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-4 border-b border-border-subtle">
          <div className="w-9 h-9 rounded-full bg-brand-gold flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div>
            <span className="font-bold text-sm">
              <span className="text-brand-red">Jueteng</span>
              <span className="text-brand-gold">PH</span>
            </span>
            <p className="text-[10px] text-brand-gold">Agent Portal</p>
          </div>
        </div>

        {/* Agent Info */}
        <div className="px-4 py-3 border-b border-border-subtle">
          <p className="text-sm font-medium text-text-primary truncate">
            {user?.name ?? "Agent"}
          </p>
          <p className="text-xs text-text-muted">{user?.mobile}</p>
          <p className="text-sm font-bold text-brand-gold mt-1">
            {formatCurrency(balance)}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.path === "/agent"
                ? location.pathname === "/agent"
                : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-gold/10 text-brand-gold"
                    : "text-text-muted hover:bg-surface-elevated hover:text-text-primary",
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout + Theme toggle */}
        <div className="p-4 border-t border-border-subtle">
          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-brand-red-light transition-colors w-full"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-brand-gold transition-colors w-full mt-2 cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>

      {/* Main content — floating card, fixed viewport height with inner scroll */}
      <main className="flex-1 min-w-0 h-[calc(100vh-1.5rem)]">
        <div className="bg-surface-card rounded-2xl border border-border-subtle p-4 md:p-6 h-full overflow-y-auto custom-scrollbar">
          <Outlet />
        </div>
      </main>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-card/90 backdrop-blur-lg border-t border-border-subtle">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive =
              item.path === "/agent"
                ? location.pathname === "/agent"
                : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-2 py-1",
                  isActive ? "text-brand-gold" : "text-text-muted",
                )}
              >
                {item.icon}
                <span className="text-[9px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
