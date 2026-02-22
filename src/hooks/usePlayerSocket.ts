import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "../store/useAppStore";
import { notificationKeys } from "./useNotification";

const SOCKET_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, "") ||
  "http://localhost:3001";

/**
 * Socket hook for non-admin (player / agent) users.
 * Listens for personal `notification` events emitted by `notifyUser()` from the backend.
 * Shows a toast and invalidates notification queries so the bell badge updates.
 *
 * Mount this once in MainLayout.
 */
export function usePlayerSocket() {
  const socketRef = useRef<Socket | null>(null);
  const user = useAppStore((s) => s.user);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  useEffect(() => {
    // Only connect for authenticated non-admin users
    if (!isAuthenticated || isAdmin) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 Player socket connected");
    });

    socket.on(
      "notification",
      (payload: {
        title: string;
        body: string;
        type: string;
        metadata?: Record<string, unknown>;
      }) => {
        // Determine icon
        const icon =
          payload.type === "KYC_UPDATE"
            ? "✅"
            : payload.type === "TRANSACTION"
              ? "💰"
              : "🔔";

        toast(payload.body || payload.title, {
          icon,
          duration: 6000,
        });

        // Refresh notification counts & list
        queryClient.invalidateQueries({
          queryKey: notificationKeys.unreadCount,
        });
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      },
    );

    socket.on("disconnect", () => {
      console.log("🔌 Player socket disconnected");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, isAdmin, queryClient]);
}
