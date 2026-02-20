import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  userName: string | null;
  phoneNumber: string | null;
  role: string;
  status: string;
  avatar: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin: string | null;
  createdAt: string;
  person: {
    firstName: string;
    lastName: string;
    middleName: string;
  } | null;
  wallet: {
    id: string;
    balance: number;
    status: string;
  } | null;
  kyc: {
    id: string;
    status: string;
    submittedAt: string;
  } | null;
}

export interface AdminTransaction {
  id: string;
  userId: string;
  walletId: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  currency: string;
  status: string;
  reference: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  userName: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

interface ApiSuccess<T> {
  status: "success";
  message: string;
  data?: T;
  code: number;
  timestamp: string;
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const adminKeys = {
  users: (params?: Record<string, unknown>) =>
    ["admin", "users", params ?? {}] as const,
  transactions: (params?: Record<string, unknown>) =>
    ["admin", "transactions", params ?? {}] as const,
};

// ─── All Users (Admin) ───────────────────────────────────────────────────────

export function useAllUsersQuery(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
}) {
  return useQuery({
    queryKey: adminKeys.users(params as Record<string, unknown>),
    queryFn: async () => {
      const res = await apiClient.get<
        ApiSuccess<{
          users: AdminUser[];
          count: number;
          pagination: Pagination;
        }>
      >("/auth/users", { params });
      return res.data.data!;
    },
    staleTime: 30_000,
  });
}

// ─── All Transactions (Admin) ─────────────────────────────────────────────────

export function useAdminTransactionsQuery(params?: {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: adminKeys.transactions(params as Record<string, unknown>),
    queryFn: async () => {
      const res = await apiClient.get<
        ApiSuccess<{
          transactions: AdminTransaction[];
          count: number;
          pagination: Pagination;
        }>
      >("/wallet/admin/transactions", { params });
      return res.data.data!;
    },
    staleTime: 15_000,
  });
}
