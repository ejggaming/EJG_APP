import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { walletKeys } from "./useWallet";
import type { AxiosError } from "axios";
import {
  betService,
  type JuetengDraw,
  type JuetengBet,
  type DrawSchedule,
  type GameConfig,
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
  const today = new Date().toISOString().slice(0, 10); // "2026-02-23"

  return useQuery({
    queryKey: betKeys.draws({ today }),
    queryFn: async () => {
      const res = await betService.getDraws({
        // Backend buildFilterConditions expects "key:value" format, not JSON
        filter: `drawDate:${today}`,
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
  // Backend uses "key:value,key:value" format; multiple values for same key = OR
  // "status:DRAWN,status:SETTLED" → OR[{ status: DRAWN }, { status: SETTLED }]
  const filterParts = ["status:DRAWN", "status:SETTLED"];
  if (params?.drawType) filterParts.unshift(`drawType:${params.drawType}`);

  const queryParams: Record<string, string> = {
    filter: filterParts.join(","),
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
  const queryParams: Record<string, string> = {
    sort: "placedAt",
    order: "desc",
    fields:
      "id,drawId,number1,number2,combinationKey,amount,currency,status,isWinner,payoutAmount,reference,placedAt,settledAt,createdAt,draw.drawType,draw.drawDate,draw.status,draw.scheduledAt",
  };
  if (params?.status) queryParams.filter = `status:${params.status}`;
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
export function drawTypeLabel(drawType: "MORNING" | "AFTERNOON" | "EVENING"): string {
  if (drawType === "MORNING") return "11:00 AM";
  if (drawType === "AFTERNOON") return "4:00 PM";
  return "9:00 PM";
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

// ─── Upcoming SCHEDULED draws (player-visible) ────────────────────────────────

export function useScheduledDrawsQuery() {
  return useQuery({
    queryKey: betKeys.draws({ status: "SCHEDULED" }),
    queryFn: async () => {
      const res = await betService.getDraws({
        filter: "status:SCHEDULED",
        sort: "scheduledAt",
        order: "asc",
        document: "true",
      });
      return res.data.data?.juetengDraws ?? [];
    },
    staleTime: 30_000,
  });
}

// ─── Admin: All Draws ─────────────────────────────────────────────────────────

export function useAdminDrawsQuery(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  const queryParams: Record<string, string> = {
    sort: "drawDate",
    order: "desc",
    document: "true",
    count: "true",
    pagination: "true",
  };
  if (params?.status) queryParams.filter = `status:${params.status}`;
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
    { scheduleId: string; drawDate: string; drawType: "MORNING" | "AFTERNOON" | "EVENING"; scheduledAt: string }
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

// ─── Admin: Draw Schedule CRUD ────────────────────────────────────────────────

export function useCreateDrawScheduleMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    DrawSchedule,
    AxiosError<{ message: string }>,
    { drawType: "MORNING" | "AFTERNOON" | "EVENING"; scheduledTime: string; cutoffMinutes?: number; isActive?: boolean }
  >({
    mutationFn: async (data) => {
      const res = await betService.createDrawSchedule(data);
      return res.data.data!.drawSchedule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drawSchedules"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? "Failed to create draw schedule");
    },
  });
}

export function useUpdateDrawScheduleMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    DrawSchedule,
    AxiosError<{ message: string }>,
    { id: string; data: Partial<Omit<DrawSchedule, "id">> }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await betService.updateDrawSchedule(id, data);
      return res.data.data!.drawSchedule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drawSchedules"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? "Failed to update draw schedule");
    },
  });
}

export function useDeleteDrawScheduleMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<{ message: string }>,
    string
  >({
    mutationFn: async (id) => {
      await betService.deleteDrawSchedule(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drawSchedules"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? "Failed to delete draw schedule");
    },
  });
}

// ─── Admin: Settle Draw ───────────────────────────────────────────────────────

export function useSettleDrawMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    JuetengDraw,
    AxiosError<{ message: string }>,
    string
  >({
    mutationFn: async (id) => {
      const res = await betService.settleDraw(id);
      return res.data.data!.draw;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "draws"] });
      queryClient.invalidateQueries({ queryKey: betKeys.draws() });
      queryClient.invalidateQueries({ queryKey: betKeys.results() });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? "Failed to settle draw");
    },
  });
}

// ─── Admin: Game Config Update ────────────────────────────────────────────────

export function useUpdateGameConfigMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    GameConfig,
    AxiosError<{ message: string }>,
    { id: string; data: Partial<Omit<GameConfig, "id">> }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await betService.updateGameConfig(id, data);
      return res.data.data!.juetengConfig;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: betKeys.config() });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? "Failed to save configuration");
    },
  });
}
