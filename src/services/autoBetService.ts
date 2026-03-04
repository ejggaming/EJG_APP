import apiClient from "./apiClient";

interface ApiSuccess<T> {
  status: "success";
  message: string;
  data?: T;
  code: number;
  timestamp: string;
}

export type AutoBetStatus = "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";
export type AutoBetExecutionStatus = "PLACED" | "FAILED" | "SKIPPED";

export interface AutoBetExecution {
  id: string;
  autoBetConfigId: string;
  drawId: string;
  betId?: string | null;
  transactionId?: string | null;
  status: AutoBetExecutionStatus;
  failReason?: string | null;
  executedAt: string;
}

export interface AutoBetConfig {
  id: string;
  userId: string;
  number1: number;
  number2: number;
  combinationKey: string;
  amountPerBet: number;
  durationDays: number;
  startDate: string;
  endDate: string;
  status: AutoBetStatus;
  betsPlaced: number;
  totalBets: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
  executions?: AutoBetExecution[];
  estimatedTotal?: number;
  daysAffordable?: number;
  balanceWarning?: string | null;
}

export interface CreateAutoBetPayload {
  number1: number;
  number2: number;
  amountPerBet: number;
  durationDays: number;
  startDate?: string;
}

export interface AutoBetListResponse {
  configs: AutoBetConfig[];
  count: number;
  pagination: { page: number; limit: number; totalPages: number; total: number };
}

export const autoBetService = {
  create: async (data: CreateAutoBetPayload): Promise<AutoBetConfig> => {
    const res = await apiClient.post<ApiSuccess<AutoBetConfig>>("/auto-bet", data);
    return res.data.data!;
  },

  getMyConfigs: async (params?: { page?: number; limit?: number; status?: string }): Promise<AutoBetListResponse> => {
    const res = await apiClient.get<ApiSuccess<AutoBetListResponse>>("/auto-bet/me", { params });
    return res.data.data!;
  },

  getById: async (id: string): Promise<AutoBetConfig> => {
    const res = await apiClient.get<ApiSuccess<AutoBetConfig>>(`/auto-bet/${id}`);
    return res.data.data!;
  },

  pause: async (id: string): Promise<AutoBetConfig> => {
    const res = await apiClient.patch<ApiSuccess<AutoBetConfig>>(`/auto-bet/${id}/pause`, {});
    return res.data.data!;
  },

  resume: async (id: string): Promise<AutoBetConfig> => {
    const res = await apiClient.patch<ApiSuccess<AutoBetConfig>>(`/auto-bet/${id}/resume`, {});
    return res.data.data!;
  },

  cancel: async (id: string): Promise<AutoBetConfig> => {
    const res = await apiClient.patch<ApiSuccess<AutoBetConfig>>(`/auto-bet/${id}/cancel`, {});
    return res.data.data!;
  },

  getAll: async (params?: { page?: number; limit?: number; status?: string; userId?: string }): Promise<AutoBetListResponse> => {
    const res = await apiClient.get<ApiSuccess<AutoBetListResponse>>("/auto-bet", { params });
    return res.data.data!;
  },
};
