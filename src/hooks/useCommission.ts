import { useQuery } from "@tanstack/react-query";
import { commissionService } from "../services/commissionService";

export const commissionKeys = {
  myCommissions: ["commission", "me"] as const,
  summary: ["commission", "summary"] as const,
};

export function useMyCommissionsQuery() {
  return useQuery({
    queryKey: commissionKeys.myCommissions,
    queryFn: async () => {
      const res = await commissionService.getMyCommissions();
      return res.data.data?.commissions ?? [];
    },
    staleTime: 30_000,
  });
}

export function useCommissionSummaryQuery() {
  return useQuery({
    queryKey: commissionKeys.summary,
    queryFn: async () => {
      const res = await commissionService.getCommissionSummary();
      return res.data.data ?? { totalEarned: 0, pending: 0, paid: 0, thisMonth: 0, count: 0 };
    },
    staleTime: 30_000,
  });
}
