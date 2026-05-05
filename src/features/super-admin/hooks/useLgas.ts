import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { superAdminService } from "../services/super-admin.service";
import { toast } from "sonner";

export const lgaKeys = {
  unassigned: ["lgas", "unassigned"] as const,
};

export function useUnassignedLgas(enabled = true) {
  return useQuery({
    queryKey: lgaKeys.unassigned,
    queryFn: () => superAdminService.getUnassignedLgas(),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useUnassignLga(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, lgaId }: { userId: number; lgaId: number }) =>
      superAdminService.unassignLga({ userId, lgaId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-users"] });
      queryClient.invalidateQueries({ queryKey: lgaKeys.unassigned });
      toast.success("LGA unassigned successfully. User may have been demoted if no assignments remain.");
      onSuccess?.();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.detail?.[0]?.msg ||
        err?.response?.data?.message ||
        "Failed to unassign LGA. Please try again.";
      toast.error(msg);
    },
  });
}
