import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  walletService,
  type Wallet,
  type Transaction,
  type TransactionType,
  type DepositPayload,
  type WithdrawPayload,
} from "../services/walletService";
import { useAppStore } from "../store/useAppStore";
import toast from "react-hot-toast";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const walletKeys = {
  all: ["wallet"] as const,
  me: ["wallet", "me"] as const,
  transactions: (params?: Record<string, unknown>) =>
    ["wallet", "transactions", params ?? {}] as const,
};

// ─── My Wallet Query ──────────────────────────────────────────────────────────

export function useMyWalletQuery() {
  const setBalance = useAppStore((s) => s.setBalance);

  return useQuery({
    queryKey: walletKeys.me,
    queryFn: async () => {
      const res = await walletService.getMyWallet();
      const data = res.data.data!;
      // Sync balance to global store
      setBalance(data.wallet.balance);
      return data;
    },
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });
}

// ─── Transactions Query ───────────────────────────────────────────────────────

export function useTransactionsQuery(params?: {
  page?: number;
  limit?: number;
  type?: TransactionType;
}) {
  return useQuery({
    queryKey: walletKeys.transactions(params as Record<string, unknown>),
    queryFn: async () => {
      const res = await walletService.getTransactions(params);
      return res.data.data!;
    },
    staleTime: 15_000,
  });
}

// ─── Deposit Mutation ─────────────────────────────────────────────────────────

export function useDepositMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { transaction: Transaction },
    AxiosError<{ message: string }>,
    DepositPayload
  >({
    mutationFn: async (data) => {
      const res = await walletService.deposit(data);
      return res.data.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.me });
      queryClient.invalidateQueries({ queryKey: walletKeys.transactions() });
      toast.success("Deposit request submitted! Awaiting approval.");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? "Deposit request failed");
    },
  });
}

// ─── Withdraw Mutation ────────────────────────────────────────────────────────

export function useWithdrawMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { transaction: Transaction },
    AxiosError<{ message: string }>,
    WithdrawPayload
  >({
    mutationFn: async (data) => {
      const res = await walletService.withdraw(data);
      return res.data.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.me });
      queryClient.invalidateQueries({ queryKey: walletKeys.transactions() });
      toast.success("Withdrawal request submitted! Awaiting approval.");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? "Withdrawal request failed");
    },
  });
}

// ─── Admin: Approve Transaction ───────────────────────────────────────────────

export function useApproveTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { transaction: Transaction; wallet: Wallet },
    AxiosError<{ message: string }>,
    string
  >({
    mutationFn: async (id) => {
      const res = await walletService.approveTransaction(id);
      return res.data.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
      toast.success("Transaction approved");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? "Approval failed");
    },
  });
}

// ─── Admin: Reject Transaction ────────────────────────────────────────────────

export function useRejectTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { transaction: Transaction },
    AxiosError<{ message: string }>,
    { id: string; reason?: string }
  >({
    mutationFn: async ({ id, reason }) => {
      const res = await walletService.rejectTransaction(id, reason);
      return res.data.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
      toast.success("Transaction rejected");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? "Rejection failed");
    },
  });
}
