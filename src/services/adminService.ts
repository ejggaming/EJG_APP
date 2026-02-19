import apiClient from "./apiClient";

/* -------------------------------------------------------
 * Admin Service – API calls for the Admin Dashboard
 * Replace mock implementations with real endpoints when available.
 * ------------------------------------------------------- */

// ---- Dashboard ----
export const getAdminDashboard = () =>
  apiClient.get("/admin/dashboard").then((r) => r.data);

// ---- User Management ----
export const getUsers = (params?: { search?: string; filter?: string }) =>
  apiClient.get("/admin/users", { params }).then((r) => r.data);

export const approveKyc = (userId: string) =>
  apiClient.patch(`/admin/users/${userId}/kyc/approve`).then((r) => r.data);

export const rejectKyc = (userId: string) =>
  apiClient.patch(`/admin/users/${userId}/kyc/reject`).then((r) => r.data);

export const suspendUser = (userId: string) =>
  apiClient.patch(`/admin/users/${userId}/suspend`).then((r) => r.data);

export const activateUser = (userId: string) =>
  apiClient.patch(`/admin/users/${userId}/activate`).then((r) => r.data);

// ---- Agent Management ----
export const getAgents = (params?: { search?: string }) =>
  apiClient.get("/admin/agents", { params }).then((r) => r.data);

export const setAgentCommission = (agentId: string, rate: number) =>
  apiClient
    .patch(`/admin/agents/${agentId}/commission`, { rate })
    .then((r) => r.data);

export const suspendAgent = (agentId: string) =>
  apiClient.patch(`/admin/agents/${agentId}/suspend`).then((r) => r.data);

export const activateAgent = (agentId: string) =>
  apiClient.patch(`/admin/agents/${agentId}/activate`).then((r) => r.data);

// ---- Draw Management ----
export const getDraws = () => apiClient.get("/admin/draws").then((r) => r.data);

export const lockBets = (drawId: string) =>
  apiClient.patch(`/admin/draws/${drawId}/lock`).then((r) => r.data);

export const encodeResult = (drawId: string, numbers: number[]) =>
  apiClient
    .post(`/admin/draws/${drawId}/result`, { numbers })
    .then((r) => r.data);

export const publishResult = (drawId: string) =>
  apiClient.patch(`/admin/draws/${drawId}/publish`).then((r) => r.data);

// ---- Finance ----
export const getPendingWithdrawals = () =>
  apiClient.get("/admin/finance/withdrawals/pending").then((r) => r.data);

export const approveWithdrawal = (withdrawalId: string) =>
  apiClient
    .patch(`/admin/finance/withdrawals/${withdrawalId}/approve`)
    .then((r) => r.data);

export const rejectWithdrawal = (withdrawalId: string) =>
  apiClient
    .patch(`/admin/finance/withdrawals/${withdrawalId}/reject`)
    .then((r) => r.data);

export const getTransactions = (params?: { type?: string }) =>
  apiClient.get("/admin/finance/transactions", { params }).then((r) => r.data);

// ---- Reports ----
export const getRevenueReport = (range: string) =>
  apiClient
    .get("/admin/reports/revenue", { params: { range } })
    .then((r) => r.data);

export const getRegionalReport = () =>
  apiClient.get("/admin/reports/regional").then((r) => r.data);

export const getTopAgentsReport = () =>
  apiClient.get("/admin/reports/top-agents").then((r) => r.data);

// ---- Settings ----
export const getSystemSettings = () =>
  apiClient.get("/admin/settings").then((r) => r.data);

export const updateGameConfig = (data: {
  numberRange: number;
  payoutMultiplier: number;
  minBet: number;
  maxBet: number;
}) => apiClient.patch("/admin/settings/game", data).then((r) => r.data);

export const updateDrawTimes = (
  data: { label: string; time: string; enabled: boolean }[],
) =>
  apiClient
    .patch("/admin/settings/draw-times", { drawTimes: data })
    .then((r) => r.data);

export const updateFinancialSettings = (data: {
  commissionRate: number;
  governmentShare: number;
}) => apiClient.patch("/admin/settings/financial", data).then((r) => r.data);

export const toggleMaintenanceMode = (enabled: boolean) =>
  apiClient
    .patch("/admin/settings/maintenance", { enabled })
    .then((r) => r.data);
