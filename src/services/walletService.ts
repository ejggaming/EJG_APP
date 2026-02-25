import apiClient from "./apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TransactionType =
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "JUETENG_BET"
  | "JUETENG_PAYOUT"
  | "COMMISSION_PAYOUT"
  | "ADJUSTMENT";

export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "REVERSED";

export type WalletStatus = "ACTIVE" | "FROZEN" | "CLOSED";

export interface Transaction {
  id: string;
  userId: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  currency: string;
  status: TransactionStatus;
  reference: string;
  description?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  bonus: number;
  currency: string;
  status: WalletStatus;
  transactions?: Transaction[];
  createdAt: string;
  updatedAt: string;
}

export interface WalletStats {
  totalDeposits: number;
  totalWithdrawals: number;
  totalWinnings: number;
}

export interface DepositPayload {
  amount: number;
  paymentMethod: string;
  referenceNumber?: string;
}

export interface WithdrawPayload {
  amount: number;
  paymentMethod: string;
  accountNumber: string;
  accountName: string;
}

interface ApiSuccess<T> {
  status: "success";
  message: string;
  data?: T;
  code: number;
  timestamp: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const walletService = {
  /** Get current user's wallet with stats */
  getMyWallet: () =>
    apiClient.get<ApiSuccess<{ wallet: Wallet; stats: WalletStats }>>(
      "/wallet/me",
    ),

  /** Get paginated transaction history */
  getTransactions: (params?: {
    page?: number;
    limit?: number;
    type?: TransactionType;
  }) =>
    apiClient.get<
      ApiSuccess<{
        transactions: Transaction[];
        count: number;
        pagination?: unknown;
      }>
    >("/wallet/transactions", { params }),

  /** Request a deposit (pending admin approval) */
  deposit: (data: DepositPayload) =>
    apiClient.post<ApiSuccess<{ transaction: Transaction }>>(
      "/wallet/deposit",
      data,
    ),

  /** Request a withdrawal (pending admin approval) */
  withdraw: (data: WithdrawPayload) =>
    apiClient.post<ApiSuccess<{ transaction: Transaction }>>(
      "/wallet/withdraw",
      data,
    ),

  /** Admin: approve a pending transaction */
  approveTransaction: (id: string) =>
    apiClient.patch<ApiSuccess<{ transaction: Transaction; wallet: Wallet }>>(
      `/wallet/transaction/${id}/approve`,
    ),

  /** Admin: reject a pending transaction */
  rejectTransaction: (id: string, reason?: string) =>
    apiClient.patch<ApiSuccess<{ transaction: Transaction }>>(
      `/wallet/transaction/${id}/reject`,
      { reason },
    ),
};
