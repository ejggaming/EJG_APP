import { useEffect, useState, useRef } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { cn } from "../../utils";
import { useAppStore } from "../../store/useAppStore";
import { useThemeStore } from "../../store/useThemeStore";
import { useLogoutMutation } from "../../hooks/useAuth";
import { useAdminSocket } from "../../hooks/useSocket";
import {
  useUnreadCountQuery,
  useNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from "../../hooks/useNotification";
import { Sun, Moon, Bell, Check, CheckCheck } from "lucide-react";

const sidebarSections = [
  {
    label: "Overview",
    items: [
      {
        path: "/admin",
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
    ],
  },
  {
    label: "Management",
    items: [
      {
        path: "/admin/users",
        label: "Users",
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ),
      },
      {
        path: "/admin/kyc",
        label: "KYC",
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
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        ),
      },
      {
        path: "/admin/agents",
        label: "Agents",
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
    ],
  },
  {
    label: "Operations",
    items: [
      {
        path: "/admin/draws",
        label: "Draw Management",
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
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        ),
      },
      {
        path: "/admin/finance",
        label: "Finance",
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
    ],
  },
  {
    label: "Reports",
    items: [
      {
        path: "/admin/reports",
        label: "Reports",
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
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        ),
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        path: "/admin/settings",
        label: "Settings",
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ),
      },
    ],
  },
];

export default function AdminLayout() {
  const location = useLocation();
  const { user } = useAppStore();
  const logoutMutation = useLogoutMutation();
  const { theme, toggleTheme } = useThemeStore();
  const pendingFinancePing = useAppStore((s) => s.pendingFinancePing);
  const clearFinancePing = useAppStore((s) => s.clearFinancePing);
  const pendingKycPing = useAppStore((s) => s.pendingKycPing);
  const clearKycPing = useAppStore((s) => s.clearKycPing);

  // Notification state
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { data: unreadCount = 0 } = useUnreadCountQuery();
  const { data: notifData } = useNotificationsQuery({ page: 1, limit: 20 });
  const markAllRead = useMarkAllAsReadMutation();
  const markRead = useMarkAsReadMutation();
  const notifications = notifData?.notifications ?? [];

  // Real-time admin notifications via Socket.IO
  useAdminSocket();

  // Clear pings when admin navigates to the relevant page
  useEffect(() => {
    if (
      location.pathname.startsWith("/admin/finance") &&
      pendingFinancePing > 0
    ) {
      clearFinancePing();
    }
    if (location.pathname.startsWith("/admin/kyc") && pendingKycPing > 0) {
      clearKycPing();
    }
  }, [
    location.pathname,
    pendingFinancePing,
    pendingKycPing,
    clearFinancePing,
    clearKycPing,
  ]);

  // Close notification panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navigate = useNavigate();

  const getNotifRoute = (type: string) => {
    switch (type) {
      case "TRANSACTION":
        return "/admin/finance";
      case "KYC_UPDATE":
        return "/admin/kyc";
      case "PAYOUT":
        return "/admin/finance";
      case "COMMISSION":
        return "/admin/finance";
      default:
        return "/admin";
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div
      className="min-h-screen flex pl-4 pr-4 py-3 gap-3"
      style={{ background: "var(--admin-outer-bg)" }}
    >
      {/* Sidebar — floating card */}
      <aside className="hidden md:flex md:w-60 shrink-0 flex-col bg-surface-card border border-border-subtle rounded-2xl sticky top-3 h-[calc(100vh-1.5rem)] z-30">
        {/* Logo + Notification Bell */}
        <div className="h-16 flex items-center gap-2 px-4 border-b border-border-subtle">
          <div className="w-9 h-9 rounded-full bg-brand-red flex items-center justify-center">
            <span className="text-white font-bold text-sm">J</span>
          </div>
          <div className="flex-1">
            <span className="font-bold text-sm">
              <span className="text-brand-red">Jueteng</span>
              <span className="text-brand-gold">PH</span>
            </span>
            <p className="text-[10px] text-brand-blue">Admin Panel</p>
          </div>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifPanel((v) => !v)}
              className="relative p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex items-center justify-center h-3.5 w-3.5 rounded-full bg-green-500 text-[8px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifPanel && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-surface-card border border-border-subtle rounded-xl shadow-2xl z-50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
                  <h3 className="text-sm font-semibold text-text-primary">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllRead.mutate()}
                      disabled={markAllRead.isPending}
                      className="flex items-center gap-1 text-[10px] text-brand-blue hover:text-brand-gold transition-colors cursor-pointer"
                    >
                      <CheckCheck className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-text-muted text-xs">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => {
                          if (n.status !== "READ") markRead.mutate(n.id);
                          setShowNotifPanel(false);
                          navigate(getNotifRoute(n.type));
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 border-b border-border-subtle/50 hover:bg-surface-elevated transition-colors flex gap-3 items-start cursor-pointer",
                          n.status !== "READ" && "bg-brand-blue/5",
                        )}
                      >
                        {/* Indicator dot */}
                        <div className="mt-1.5 shrink-0">
                          {n.status !== "READ" ? (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                            </span>
                          ) : (
                            <Check className="w-3 h-3 text-text-muted/40" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-text-primary truncate">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-text-muted line-clamp-2">
                            {n.body}
                          </p>
                          <p className="text-[10px] text-text-muted/60 mt-0.5">
                            {formatTimeAgo(n.createdAt)}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {sidebarSections.map((section) => (
            <div key={section.label} className="mb-4">
              <p className="px-4 text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                {section.label}
              </p>
              <div className="px-2 space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    item.path === "/admin"
                      ? location.pathname === "/admin"
                      : location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative",
                        isActive
                          ? "bg-brand-red/10 text-brand-red"
                          : "text-text-muted hover:bg-surface-elevated hover:text-text-primary",
                      )}
                    >
                      {item.icon}
                      {item.label}
                      {/* Ping badge for Finance */}
                      {item.path === "/admin/finance" &&
                        pendingFinancePing > 0 && (
                          <span className="ml-auto flex items-center gap-1">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75" />
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-red" />
                            </span>
                            <span className="text-[10px] font-bold text-brand-red">
                              {pendingFinancePing}
                            </span>
                          </span>
                        )}
                      {/* Ping badge for KYC */}
                      {item.path === "/admin/kyc" && pendingKycPing > 0 && (
                        <span className="ml-auto flex items-center gap-1">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-gold" />
                          </span>
                          <span className="text-[10px] font-bold text-brand-gold">
                            {pendingKycPing}
                          </span>
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Admin user / logout */}
        <div className="p-4 border-t border-border-subtle">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-xs">
              {user?.person?.firstName?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {[user?.person?.firstName, user?.person?.lastName]
                  .filter(Boolean)
                  .join(" ") || "Admin"}
              </p>
              <p className="text-[10px] text-text-muted uppercase">
                {user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
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
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
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
    </div>
  );
}
