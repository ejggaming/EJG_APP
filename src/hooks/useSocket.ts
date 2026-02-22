import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "../store/useAppStore";
import { adminKeys } from "./useAdmin";
import { notificationKeys } from "./useNotification";

const SOCKET_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, "") ||
  "http://localhost:3001";

/**
 * Hook that connects a Socket.IO client for the current authenticated user.
 * For admins it listens to real-time events (KYC submissions, deposit/withdraw
 * requests) and shows toast notifications + invalidates relevant queries.
 *
 * Call this once in AdminLayout (or App-level) so the connection lives for
 * the duration of the session.
 */
export function useAdminSocket() {
  const socketRef = useRef<Socket | null>(null);
  const user = useAppStore((s) => s.user);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true, // send cookies (httpOnly JWT)
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 Admin socket connected");
    });

    // ── Unified admin notification (from notifyAdmins helper) ──
    socket.on(
      "admin:notification",
      (payload: {
        title: string;
        body: string;
        type: string;
        metadata?: Record<string, unknown>;
      }) => {
        // Show toast
        toast(payload.title, {
          icon: payload.type === "KYC_UPDATE" ? "🆔" : "💰",
          duration: 5000,
        });

        // Increment sidebar pings
        const store = useAppStore.getState();
        if (payload.type === "TRANSACTION") {
          store.incrementFinancePing();
          queryClient.invalidateQueries({ queryKey: adminKeys.transactions() });
        } else if (payload.type === "KYC_UPDATE") {
          store.incrementKycPing();
          queryClient.invalidateQueries({ queryKey: ["kyc"] });
        }

        // Refresh notification badge count
        queryClient.invalidateQueries({
          queryKey: notificationKeys.unreadCount,
        });
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      },
    );

    socket.on("disconnect", () => {
      console.log("🔌 Admin socket disconnected");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, isAdmin, queryClient]);

  return socketRef;
}
