import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { superAdminService } from "../services/super-admin.service";
import { ApiError } from "@/lib/utils";
import type { LgaListItem } from "../services/super-admin.service";
import { toast } from "sonner";

export const lgaKeys = {
  all: ["lgas", "all"] as const,
  unassigned: ["lgas", "unassigned"] as const,
};

/**
 * Every LGA with its real lga_id and facility count — the ids /facilities
 * and /admin/inventory/summary take. Rarely changes, so cached for long.
 *
 * Not yet deployed everywhere (production answers 404), so a 404 is not
 * retried and callers fall back to the built-in LGA names.
 */
export function useLgaList() {
  return useQuery<LgaListItem[]>({
    queryKey: lgaKeys.all,
    queryFn: async () =>
      (await superAdminService.getLgas()).sort((a, b) =>
        a.lga_name.localeCompare(b.lga_name),
      ),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    retry: (count, error) =>
      !(error instanceof ApiError && error.statusCode === 404) && count < 1,
  });
}

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
      toast.success(
        "LGA unassigned successfully. User may have been demoted if no assignments remain.",
      );
      onSuccess?.();
    },
    onError: (err: unknown) => {
      // apiClient's interceptor already normalizes failures into an
      // ApiError — `.message` is the readable backend detail, not a raw
      // axios `err.response.data` shape.
      const msg =
        err instanceof ApiError && err.message
          ? err.message
          : "Failed to unassign LGA. Please try again.";
      toast.error(msg);
    },
  });
}
