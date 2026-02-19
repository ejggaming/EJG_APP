import apiClient from "./apiClient";

export interface PlaceBetPayload {
  numbers: [number, number];
  amount: number;
  drawScheduleId: string;
}

export interface BetResponse {
  id: string;
  numbers: [number, number];
  amount: number;
  drawScheduleId: string;
  drawScheduleLabel: string;
  status: "pending" | "won" | "lost";
  reference: string;
  createdAt: string;
}

export interface DrawSchedule {
  id: string;
  label: string;
  drawTime: string;
  status: "open" | "closed" | "upcoming";
}

export interface DrawResult {
  id: string;
  drawScheduleId: string;
  drawTime: string;
  date: string;
  winningNumbers: [number, number];
  prize: number;
  totalBets: number;
  winners: number;
}

export const betService = {
  placeBet: (data: PlaceBetPayload) =>
    apiClient.post<BetResponse>("/bets", data),

  placeBulkBets: (bets: PlaceBetPayload[]) =>
    apiClient.post<BetResponse[]>("/bets/bulk", { bets }),

  getBetHistory: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) =>
    apiClient.get<{ data: BetResponse[]; total: number }>("/bets/history", {
      params,
    }),

  getBetById: (id: string) => apiClient.get<BetResponse>(`/bets/${id}`),

  getDrawSchedules: () => apiClient.get<DrawSchedule[]>("/draws/schedules"),

  getDrawResults: (params?: {
    page?: number;
    limit?: number;
    drawTime?: string;
  }) =>
    apiClient.get<{ data: DrawResult[]; total: number }>("/draws/results", {
      params,
    }),

  getLatestResult: () => apiClient.get<DrawResult>("/draws/results/latest"),
};
