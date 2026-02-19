import apiClient from "./apiClient";

export interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "bet" | "win";
  amount: number;
  method?: string;
  label?: string;
  status: "pending" | "completed" | "failed";
  date: string;
  reference: string;
}

export interface DepositPayload {
  amount: number;
  method: string;
}

export interface WithdrawPayload {
  amount: number;
  method: string;
  accountNumber: string;
  accountName: string;
}

export const walletService = {
  getBalance: () => apiClient.get<{ balance: number }>("/wallet/balance"),

  getTransactions: (params?: {
    page?: number;
    limit?: number;
    type?: string;
  }) =>
    apiClient.get<{ data: Transaction[]; total: number }>(
      "/wallet/transactions",
      { params },
    ),

  deposit: (data: DepositPayload) =>
    apiClient.post<{ balance: number; transaction: Transaction }>(
      "/wallet/deposit",
      data,
    ),

  withdraw: (data: WithdrawPayload) =>
    apiClient.post<{ balance: number; transaction: Transaction }>(
      "/wallet/withdraw",
      data,
    ),
};
