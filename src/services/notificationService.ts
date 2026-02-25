import apiClient from "./apiClient";

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  channel: string;
  status: string;
  metadata: Record<string, unknown> | null;
  sentAt: string | null;
  readAt: string | null;
  createdAt: string;
}

interface ApiSuccess<T> {
  status: "success";
  message: string;
  data?: T;
  code: number;
  timestamp: string;
}

export const notificationService = {
  getAll: async (params?: { page?: number; limit?: number }) => {
    const res = await apiClient.get<
      ApiSuccess<{
        notifications: Notification[];
        count: number;
        pagination: {
          page: number;
          limit: number;
          totalPages: number;
          total: number;
        };
      }>
    >("/notification", {
      params: { ...params, document: true, count: true, pagination: true },
    });
    return res.data.data!;
  },

  getUnreadCount: async () => {
    const res = await apiClient.get<ApiSuccess<{ unreadCount: number }>>(
      "/notification/unread-count",
    );
    return res.data.data!.unreadCount;
  },

  markAsRead: async (id: string) => {
    const res = await apiClient.patch<ApiSuccess<Notification>>(
      `/notification/${id}/read`,
    );
    return res.data.data!;
  },

  markAllAsRead: async () => {
    const res = await apiClient.patch<ApiSuccess<{ count: number }>>(
      "/notification/read-all",
    );
    return res.data.data!;
  },
};
