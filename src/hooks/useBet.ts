import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { walletKeys } from "./useWallet";
import type { AxiosError } from "axios";
import {
  betService,
  type JuetengDraw,
  type JuetengBet,
} from "../services/betService";
import toast from "react-hot-toast";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const betKeys = {
  all: ["bet"] as const,
  config: () => ["bet", "config"] as const,
  draws: (params?: Record<string, string>) =>
    ["bet", "draws", params ?? {}] as const,
  results: (params?: Record<string, string>) =>
    ["bet", "results", params ?? {}] as const,
  history: (params?: Record<string, string>) =>
    ["bet", "history", params ?? {}] as const,
};

// ─── Game Config ──────────────────────────────────────────────────────────────

export function useGameConfigQuery() {
  return useQuery({
    queryKey: betKeys.config(),
    queryFn: async () => {
      const res = await betService.getGameConfig();
      const configs = res.data.data?.juetengConfigs ?? [];
      return configs[0] ?? null;
    },
    staleTime: 5 * 60_000, // config rarely changes — cache 5 min
  });
}

// ─── Today's Draws ────────────────────────────────────────────────────────────

/** Fetch today's JuetengDraw instances */
export function useTodaysDrawsQuery() {
  const today = new Date().toISOString().slice(0, 10); // "2026-02-20"

  return useQuery({
    queryKey: betKeys.draws({ today }),
    queryFn: async () => {
      const res = await betService.getDraws({
        filter: JSON.stringify([{ drawDate: today }]),
        sort: "scheduledAt",
        order: "asc",
      });
      return res.data.data?.juetengDraws ?? [];
    },
    staleTime: 15_000, // refresh frequently — draws change status
  });
}

// ─── Draw Results (settled/drawn draws) ───────────────────────────────────────

export function useDrawResultsQuery(params?: {
  drawType?: string;
  limit?: number;
  page?: number;
}) {
  const filterArr: Record<string, string>[] = [];
  // Show draws that have results (DRAWN or SETTLED)
  if (params?.drawType) {
    filterArr.push({ drawType: params.drawType });
  }

  const queryParams: Record<string, string> = {
    filter: JSON.stringify([
      ...filterArr,
      { status: { in: ["DRAWN", "SETTLED"] } },
    ]),
    sort: "drawnAt",
    order: "desc",
    pagination: "true",
  };
  if (params?.limit) queryParams.limit = String(params.limit);
  if (params?.page) queryParams.page = String(params.page);

  return useQuery({
    queryKey: betKeys.results(queryParams),
    queryFn: async () => {
      const res = await betService.getDraws(queryParams);
      return {
        draws: res.data.data?.juetengDraws ?? [],
        count: res.data.data?.count ?? 0,
        pagination: res.data.data?.pagination,
      };
    },
    staleTime: 30_000,
  });
}

// ─── Bet History (current user) ───────────────────────────────────────────────

export function useBetHistoryQuery(params?: {
  status?: string;
  limit?: number;
  page?: number;
}) {
  const filterArr: Record<string, string>[] = [];
  if (params?.status) filterArr.push({ status: params.status });

  const queryParams: Record<string, string> = {
    sort: "placedAt",
    order: "desc",
    fields:
      "id,drawId,number1,number2,combinationKey,amount,currency,status,isWinner,payoutAmount,reference,placedAt,settledAt,createdAt,draw.drawType,draw.drawDate",
  };
  if (filterArr.length > 0) queryParams.filter = JSON.stringify(filterArr);
  if (params?.limit) queryParams.limit = String(params.limit);
  if (params?.page) queryParams.page = String(params.page);

  return useQuery({
    queryKey: betKeys.history(queryParams),
    queryFn: async () => {
      const res = await betService.getBetHistory(queryParams);
      return {
        bets: res.data.data?.juetengBets ?? [],
        count: res.data.data?.count ?? 0,
        pagination: res.data.data?.pagination,
      };
    },
    staleTime: 15_000,
  });
}

// ─── Place Bet Mutation ───────────────────────────────────────────────────────

export function usePlaceBetMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    JuetengBet,
    AxiosError<{ message: string }>,
    { drawId: string; number1: number; number2: number; amount: number }
  >({
    mutationFn: async (data) => {
      const res = await betService.placeBet(data);
      return res.data.data as JuetengBet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: betKeys.history() });
      queryClient.invalidateQueries({ queryKey: betKeys.draws() });
      queryClient.invalidateQueries({ queryKey: walletKeys.me });
      queryClient.invalidateQueries({ queryKey: walletKeys.transactions() });
      toast.success("Bet placed successfully! Good luck! 🎊");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? "Failed to place bet");
    },
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format draw type to readable label */
export function drawTypeLabel(drawType: "MORNING" | "AFTERNOON"): string {
  return drawType === "MORNING" ? "11:00 AM" : "4:00 PM";
}

/** Format draw to full label */
export function drawLabel(draw: JuetengDraw): string {
  return `${drawTypeLabel(draw.drawType)} Draw`;
}

/** Map backend draw status to simple UI status */
export function drawUIStatus(
  status: JuetengDraw["status"],
): "open" | "closed" | "upcoming" | "settled" {
  switch (status) {
    case "OPEN":
      return "open";
    case "SCHEDULED":
      return "upcoming";
    case "DRAWN":
    case "SETTLED":
      return "settled";
    default:
      return "closed";
  }
}

// ─── Admin: All Draws ─────────────────────────────────────────────────────────

export function useAdminDrawsQuery(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  const filterArr: Record<string, unknown>[] = [];
  if (params?.status) filterArr.push({ status: params.status });

  const queryParams: Record<string, string> = {
    sort: "drawDate",
    order: "desc",
    document: "true",
    count: "true",
    pagination: "true",
  };
  if (filterArr.length > 0)
    queryParams.filter = JSON.stringify(filterArr);
  if (params?.limit) queryParams.limit = String(params.limit);
  if (params?.page) queryParams.page = String(params.page);

  return useQuery({
    queryKey: ["admin", "draws", params ?? {}],
    queryFn: async () => {
      const res = await betService.getDraws(queryParams);
      return {
        draws: res.data.data?.juetengDraws ?? [],
        count: res.data.data?.count ?? 0,
        pagination: res.data.data?.pagination,
      };
    },
    staleTime: 10_000,
  });
}

// ─── Draw Schedules ───────────────────────────────────────────────────────────

export function useDrawSchedulesQuery() {
  return useQuery({
    queryKey: ["drawSchedules"],
    queryFn: async () => {
      const res = await betService.getDrawSchedules();
      return res.data.data?.drawSchedules ?? [];
    },
    staleTime: 5 * 60_000,
  });
}

// ─── Admin: Create Draw ───────────────────────────────────────────────────────

export function useCreateDrawMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    JuetengDraw,
    AxiosError<{ message: string }>,
    { scheduleId: string; drawDate: string; drawType: "MORNING" | "AFTERNOON"; scheduledAt: string }
  >({
    mutationFn: async (data) => {
      const res = await betService.createDraw(data);
      return res.data.data!.juetengDraw;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "draws"] });
      queryClient.invalidateQueries({ queryKey: betKeys.draws() });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? "Failed to create draw");
    },
  });
}

// ─── Admin: Update Draw (encode result, change status, etc.) ──────────────────

export function useUpdateDrawMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    JuetengDraw,
    AxiosError<{ message: string }>,
    { id: string; data: Partial<JuetengDraw> }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await betService.updateDraw(id, data);
      return res.data.data!.juetengDraw;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "draws"] });
      queryClient.invalidateQueries({ queryKey: betKeys.draws() });
      queryClient.invalidateQueries({ queryKey: betKeys.results() });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? "Failed to update draw");
    },
  });
}
