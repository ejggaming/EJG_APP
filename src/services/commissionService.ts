import apiClient from "./apiClient";

interface ApiSuccess<T> {
  status: "success";
  message: string;
  data?: T;
  code: number;
  timestamp: string;
}

export interface Commission {
  id: string;
  agentId: string;
  drawId: string | null;
  type: "COLLECTION" | "WINNER_BONUS" | "CAPITALISTA" | "FIXED";
  rate: number;
  baseAmount: number;
  amount: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  draw?: {
    drawType: "MORNING" | "AFTERNOON" | "EVENING";
    drawDate: string;
    scheduledAt: string;
  } | null;
}

export interface CommissionSummary {
  totalEarned: number;
  pending: number;
  paid: number;
  thisMonth: number;
  count: number;
}

export const commissionService = {
  getMyCommissions: () =>
    apiClient.get<ApiSuccess<{ commissions: Commission[] }>>("/commission/me"),

  getCommissionSummary: () =>
    apiClient.get<ApiSuccess<CommissionSummary>>("/commission/summary"),
};
