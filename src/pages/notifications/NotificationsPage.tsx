import { useState } from "react";
import { Card, Button, Badge } from "../../components";
import {
  useNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "../../hooks/useNotification";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Wallet,
  ShieldCheck,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../utils";
import { NotificationsSkeleton } from "../../components/ChineseSkeleton";
import { Link } from "react-router-dom";
import type { Notification } from "../../services/notificationService";

const LIMIT = 15;

function typeIcon(type: string) {
  switch (type) {
    case "TRANSACTION":
      return <Wallet className="w-5 h-5 text-brand-gold" />;
    case "KYC_UPDATE":
      return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
    default:
      return <Info className="w-5 h-5 text-blue-400" />;
  }
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useNotificationsQuery({
    page,
    limit: LIMIT,
  });
  const markRead = useMarkAsReadMutation();
  const markAll = useMarkAllAsReadMutation();

  const notifications = data?.notifications ?? [];
  const pagination = data?.pagination;
  const hasUnread = notifications.some((n: Notification) => n.status !== "READ");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand-gold" />
          <h1 className="text-lg font-bold text-on-surface">Notifications</h1>
        </div>

        {hasUnread && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => markAll.mutate()}
            disabled={markAll.isPending}
            className="text-brand-gold text-xs gap-1"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <NotificationsSkeleton />
      ) : isError ? (
        <Card className="p-8 text-center">
          <p className="text-subtle">Failed to load notifications.</p>
        </Card>
      ) : notifications.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <BellOff className="w-12 h-12 mx-auto text-subtle/40" />
          <p className="text-subtle font-medium">No notifications yet</p>
          <p className="text-xs text-subtle/60">
            We'll let you know when something important happens.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((n: Notification) => {
            const isRead = n.status === "READ";

            return (
              <Card
                key={n.id}
                className={cn(
                  "p-4 transition-all duration-200",
                  !isRead &&
                    "border-l-3 border-l-brand-gold bg-brand-gold/5",
                )}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                      !isRead
                        ? "bg-brand-gold/15"
                        : "bg-surface-alt",
                    )}
                  >
                    {typeIcon(n.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm font-semibold truncate",
                          isRead ? "text-subtle" : "text-on-surface",
                        )}
                      >
                        {n.title}
                      </p>
                      <span className="text-[10px] text-subtle/60 whitespace-nowrap flex-shrink-0">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-xs mt-0.5 leading-relaxed",
                        isRead ? "text-subtle/60" : "text-subtle",
                      )}
                    >
                      {n.body}
                    </p>

                    {/* Status badge + mark-read */}
                    <div className="flex items-center justify-between mt-2">
                      <Badge
                        variant={
                          n.type === "TRANSACTION"
                            ? "gold"
                            : n.type === "KYC_UPDATE"
                              ? "green"
                              : "gray"
                        }
                        className="text-[10px] px-2 py-0.5"
                      >
                        {n.type.replace("_", " ")}
                      </Badge>

                      {!isRead && (
                        <button
                          onClick={() => markRead.mutate(n.id)}
                          disabled={markRead.isPending}
                          className="text-[10px] text-brand-gold/70 hover:text-brand-gold flex items-center gap-0.5 transition-colors cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 rounded-lg text-subtle hover:text-on-surface disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-subtle">
            {page} / {pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setPage((p) => Math.min(pagination.totalPages, p + 1))
            }
            disabled={page >= pagination.totalPages}
            className="p-2 rounded-lg text-subtle hover:text-on-surface disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Back link */}
      <div className="text-center pt-2">
        <Link
          to="/profile"
          className="text-xs text-brand-gold/60 hover:text-brand-gold transition-colors"
        >
          ← Back to Profile
        </Link>
      </div>
    </div>
  );
}
