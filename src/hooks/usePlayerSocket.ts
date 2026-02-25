import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "../store/useAppStore";
import { notificationKeys } from "./useNotification";

const rawBase = import.meta.env.VITE_API_BASE_URL || "";
// If it's a relative path (/api) we're behind a proxy — connect to the current origin
const SOCKET_URL = rawBase.startsWith("/")
  ? window.location.origin
  : rawBase.replace(/\/api$/, "") || "http://localhost:3001";

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

    socket.on(
      "draw:result",
      (payload: { drawId: string; combinationKey: string; number1: number; number2: number }) => {
        queryClient.invalidateQueries({ queryKey: ["bet", "draws"] });
        queryClient.invalidateQueries({ queryKey: ["bet", "results"] });
        toast(`Draw result: ${payload.number1} - ${payload.number2}`, {
          icon: "🎲",
          duration: 5000,
        });
      },
    );

    socket.on(
      "bet:won",
      (payload: { betId: string; winAmount: number }) => {
        queryClient.invalidateQueries({ queryKey: ["wallet", "me"] });
        queryClient.invalidateQueries({ queryKey: ["bet", "history"] });
        toast.success(
          `You won ₱${payload.winAmount.toLocaleString()}! Payout credited to your wallet.`,
          { duration: 8000 },
        );
      },
    );

    socket.on(
      "wallet:updated",
      (_payload: { newBalance: number }) => {
        queryClient.invalidateQueries({ queryKey: ["wallet", "me"] });
      },
    );

    socket.on(
      "kyc:status",
      (payload: { status: string }) => {
        queryClient.invalidateQueries({ queryKey: ["kyc", "me"] });
        const msg =
          payload.status === "APPROVED"
            ? "Your KYC has been approved!"
            : "Your KYC status has been updated.";
        toast(msg, { icon: "🆔", duration: 6000 });
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
