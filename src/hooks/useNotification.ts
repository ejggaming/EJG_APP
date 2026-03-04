import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notificationService";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (params?: Record<string, unknown>) =>
    ["notifications", "list", params ?? {}] as const,
  unreadCount: ["notifications", "unread-count"] as const,
};

export function useNotificationsQuery(params?: {
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: notificationKeys.list(params as Record<string, unknown>),
    queryFn: () => notificationService.getAll(params),
    staleTime: 15_000,
  });
}

export function useUnreadCountQuery() {
  return useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: () => notificationService.getUnreadCount(),
    staleTime: 10_000,
    refetchInterval: 30_000, // poll every 30s as fallback
  });
}

export function useMarkAsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllAsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
