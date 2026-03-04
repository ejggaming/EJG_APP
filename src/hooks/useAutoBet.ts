import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { autoBetService, type CreateAutoBetPayload } from "../services/autoBetService";
import { walletKeys } from "./useWallet";
import toast from "react-hot-toast";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const autoBetKeys = {
  all: ["autoBet"] as const,
  mine: (params?: Record<string, unknown>) => ["autoBet", "me", params ?? {}] as const,
  detail: (id: string) => ["autoBet", id] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useMyAutoBetsQuery(params?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: autoBetKeys.mine(params),
    queryFn: () => autoBetService.getMyConfigs(params),
    staleTime: 30_000,
  });
}

export function useAutoBetByIdQuery(id: string) {
  return useQuery({
    queryKey: autoBetKeys.detail(id),
    queryFn: () => autoBetService.getById(id),
    enabled: !!id,
    staleTime: 30_000,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateAutoBetMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAutoBetPayload) => autoBetService.create(data),
    onSuccess: (result) => {
      toast.success("Auto bet configured successfully!");
      if (result.balanceWarning) {
        toast(result.balanceWarning, { icon: "⚠️", duration: 6000 });
      }
      qc.invalidateQueries({ queryKey: autoBetKeys.all });
      qc.invalidateQueries({ queryKey: walletKeys.all });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message ?? "Failed to create auto bet");
    },
  });
}

export function usePauseAutoBetMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => autoBetService.pause(id),
    onSuccess: (_result, id) => {
      toast.success("Auto bet paused");
      qc.invalidateQueries({ queryKey: autoBetKeys.detail(id) });
      qc.invalidateQueries({ queryKey: autoBetKeys.mine() });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message ?? "Failed to pause auto bet");
    },
  });
}

export function useResumeAutoBetMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => autoBetService.resume(id),
    onSuccess: (_result, id) => {
      toast.success("Auto bet resumed");
      qc.invalidateQueries({ queryKey: autoBetKeys.detail(id) });
      qc.invalidateQueries({ queryKey: autoBetKeys.mine() });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message ?? "Failed to resume auto bet");
    },
  });
}

export function useCancelAutoBetMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => autoBetService.cancel(id),
    onSuccess: () => {
      toast.success("Auto bet cancelled");
      qc.invalidateQueries({ queryKey: autoBetKeys.all });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message ?? "Failed to cancel auto bet");
    },
  });
}
