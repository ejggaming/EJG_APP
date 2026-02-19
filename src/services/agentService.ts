import apiClient from "./apiClient";

/* -------------------------------------------------------
 * Agent Service – API calls for the Agent Portal
 * Replace mock implementations with real endpoints when available.
 * ------------------------------------------------------- */

// ---- Dashboard ----
export const getAgentDashboard = () =>
  apiClient.get("/agent/dashboard").then((r) => r.data);

// ---- Customers ----
export const getAgentCustomers = (params?: { search?: string }) =>
  apiClient.get("/agent/customers", { params }).then((r) => r.data);

export const addCustomer = (data: { name: string; mobile: string }) =>
  apiClient.post("/agent/customers", data).then((r) => r.data);

// ---- Collections / Assisted Betting ----
export const collectBet = (data: {
  customerId: string;
  drawId: string;
  numbers: number[];
  amount: number;
}) => apiClient.post("/agent/collect-bet", data).then((r) => r.data);

export const getAgentCollections = (params?: { range?: string }) =>
  apiClient.get("/agent/collections", { params }).then((r) => r.data);

// ---- Commissions ----
export const getAgentCommissions = (params?: { range?: string }) =>
  apiClient.get("/agent/commissions", { params }).then((r) => r.data);

// ---- Wallet ----
export const getAgentWallet = () =>
  apiClient.get("/agent/wallet").then((r) => r.data);

export const requestAgentWithdrawal = (data: {
  amount: number;
  method: string;
  accountName: string;
  accountNumber: string;
}) => apiClient.post("/agent/wallet/withdraw", data).then((r) => r.data);

export const getAgentTransactions = () =>
  apiClient.get("/agent/wallet/transactions").then((r) => r.data);
