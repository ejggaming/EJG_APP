import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  kycService,
  type KycRecord,
  type KycStatus,
} from "../services/kycService";
import { useAppStore } from "../store/useAppStore";
import { authKeys } from "./useAuth";
import toast from "react-hot-toast";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const kycKeys = {
  all: ["kyc"] as const,
  list: (params?: Record<string, string>) =>
    ["kyc", "list", params ?? {}] as const,
};

// ─── Submit KYC (Player) ──────────────────────────────────────────────────────

export function useSubmitKycMutation() {
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation<
    KycRecord,
    AxiosError<{ message: string }>,
    { idType: string; idFront: File; selfie?: File }
  >({
    mutationFn: async ({ idType, idFront, selfie }) => {
      const res = await kycService.submit({
        userId: user!.id,
        documentType: idType,
        documentFile: idFront,
        selfieFile: selfie,
      });
      return res.data.data!;
    },
    onSuccess: (kyc) => {
      if (user) {
        setUser({
          ...user,
          kyc: {
            status: kyc.status,
            submittedAt: kyc.submittedAt ?? new Date().toISOString(),
            reviewedAt: kyc.reviewedAt ?? null,
          },
        });
      }
      queryClient.invalidateQueries({ queryKey: authKeys.me });
      toast.success("KYC documents submitted for review!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? "Failed to submit KYC");
    },
  });
}

// ─── KYC List (Admin) ─────────────────────────────────────────────────────────

export function useKycListQuery(params?: Record<string, string>) {
  return useQuery({
    queryKey: kycKeys.list(params),
    queryFn: async () => {
      const res = await kycService.list(params);
      return res.data.data!;
    },
    staleTime: 30_000,
  });
}

// ─── Update KYC Status (Admin) ────────────────────────────────────────────────

export function useUpdateKycMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { kyc: KycRecord },
    AxiosError<{ message: string }>,
    { id: string; status: KycStatus; notes?: string }
  >({
    mutationFn: async ({ id, status, notes }) => {
      const res = await kycService.update(id, { status, notes });
      return res.data.data!;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: kycKeys.all });
      toast.success(status === "APPROVED" ? "KYC approved" : "KYC rejected");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? "Failed to update KYC status");
    },
  });
}
