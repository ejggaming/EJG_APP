import { useState } from "react";
import { Card, Button, Badge, Modal } from "../../components";
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
  Trophy,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CalendarDays,
  Clock,
} from "lucide-react";
import { cn } from "../../utils";
import { NotificationsSkeleton } from "../../components/ChineseSkeleton";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Notification } from "../../services/notificationService";

const LIMIT = 15;

function typeIcon(type: string) {
  switch (type) {
    case "TRANSACTION":
      return <Wallet className="w-5 h-5 text-brand-gold" />;
    case "KYC_UPDATE":
      return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
    case "DRAW_RESULT":
    case "BET_RESULT":
      return <Trophy className="w-5 h-5 text-brand-gold" />;
    default:
      return <Info className="w-5 h-5 text-blue-400" />;
  }
}

function typeBadgeVariant(type: string): "gold" | "green" | "gray" | "red" {
  switch (type) {
    case "TRANSACTION": return "gold";
    case "KYC_UPDATE": return "green";
    case "DRAW_RESULT":
    case "BET_RESULT": return "gold";
    default: return "gray";
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

/** Build a deep-link URL based on notification type + metadata */
function resolveActionUrl(n: Notification, profileId: string): string | null {
  const meta = n.metadata ?? {};
  switch (n.type) {
    case "DRAW_RESULT":
    case "BET_RESULT":
      if (meta.drawId) return `/results?id=${meta.drawId}`;
      if (meta.betId) return `/bet/${meta.betId}`;
      return "/results";
    case "TRANSACTION":
      if (meta.transactionId) return `/wallet/${meta.transactionId}`;
      return "/wallet";
    case "KYC_UPDATE":
      return `/profile/${profileId}/kyc`;
    default:
      return null;
  }
}

// ─── Notification Detail Modal ────────────────────────────────────────────────
function NotificationModal({
  notification,
  profileId,
  onClose,
}: {
  notification: Notification;
  profileId: string;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const actionUrl = resolveActionUrl(notification, profileId);
  const meta = notification.metadata ?? {};

  const handleView = () => {
    onClose();
    if (actionUrl) navigate(actionUrl);
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={notification.title}
      className="max-w-sm"
    >
      <div className="space-y-4">
        {/* Icon + type */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center shrink-0">
            {typeIcon(notification.type)}
          </div>
          <Badge variant={typeBadgeVariant(notification.type)} className="text-[10px]">
            {notification.type.replace(/_/g, " ")}
          </Badge>
        </div>

        {/* Body */}
        <p className="text-sm text-text-primary leading-relaxed">
          {notification.body}
        </p>

        {/* Meta rows */}
        <div className="space-y-1.5 bg-surface-elevated rounded-xl p-3">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <CalendarDays className="w-3.5 h-3.5 shrink-0" />
            <span>{new Date(notification.createdAt).toLocaleString()}</span>
          </div>
          {notification.readAt && (
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Check className="w-3.5 h-3.5 shrink-0 text-brand-green" />
              <span>Read {timeAgo(notification.readAt)}</span>
            </div>
          )}
          {notification.channel && (
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="uppercase tracking-wide">{notification.channel}</span>
            </div>
          )}
          {/* Metadata fields */}
          {Object.entries(meta).map(([k, v]) =>
            v != null ? (
              <div key={k} className="flex items-center gap-2 text-xs text-text-muted">
                <span className="uppercase tracking-wide text-[10px] min-w-15 shrink-0">
                  {k.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <span className="font-mono truncate text-text-primary/70">
                  {String(v)}
                </span>
              </div>
            ) : null
          )}
        </div>

        {/* Action */}
        {actionUrl && (
          <Button variant="gold" fullWidth onClick={handleView} className="flex items-center justify-center gap-2">
            <ExternalLink className="w-4 h-4" />
            View {notification.type === "TRANSACTION" ? "Transaction" : notification.type === "KYC_UPDATE" ? "KYC Status" : "Draw Result"}
          </Button>
        )}
      </div>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const { id: profileId = "me" } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Notification | null>(null);

  const { data, isLoading, isError } = useNotificationsQuery({ page, limit: LIMIT });
  const markRead = useMarkAsReadMutation();
  const markAll = useMarkAllAsReadMutation();

  const notifications = data?.notifications ?? [];
  const pagination = data?.pagination;
  const hasUnread = notifications.some((n: Notification) => n.status !== "READ");

  const handleOpen = (n: Notification) => {
    setSelected(n);
    if (n.status !== "READ") markRead.mutate(n.id);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
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
            className="inline-flex items-center justify-center gap-1 text-brand-gold text-xs w-full min-[360px]:w-auto"
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
              <button
                key={n.id}
                className="w-full text-left"
                onClick={() => handleOpen(n)}
              >
                <Card
                  className={cn(
                    "p-4 transition-all duration-200 hover:border-brand-gold/20",
                    !isRead && "border-l-[3px] border-l-brand-gold bg-brand-gold/5",
                  )}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div
                      className={cn(
                        "shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                        !isRead ? "bg-brand-gold/15" : "bg-surface-alt",
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
                        <span className="text-[10px] text-subtle/60 whitespace-nowrap shrink-0">
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-xs mt-0.5 leading-relaxed line-clamp-2",
                          isRead ? "text-subtle/60" : "text-subtle",
                        )}
                      >
                        {n.body}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <Badge
                          variant={typeBadgeVariant(n.type)}
                          className="text-[10px] px-2 py-0.5"
                        >
                          {n.type.replace(/_/g, " ")}
                        </Badge>
                        <span className="text-[10px] text-brand-gold/50 flex items-center gap-0.5">
                          Tap to view <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </button>
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
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
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
          to={`/profile/${profileId}`}
          className="text-xs text-brand-gold/60 hover:text-brand-gold transition-colors"
        >
          ← Back to Profile
        </Link>
      </div>

      {/* Notification Detail Modal */}
      {selected && (
        <NotificationModal
          notification={selected}
          profileId={profileId}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
