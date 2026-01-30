import { useQuery } from "@tanstack/react-query";
import { facilityService } from "@/services/facility.service";
import { FilterQuery } from "@/types/search-filter";

interface UseFacilitiesParams {
  page?: number;
  limit?: number;
  filters?: FilterQuery;
  enabled?: boolean;
  searchQuery?: string; // ✅ Added for convenience
}

export function useFacilities({
  page = 1,
  limit = 10,
  filters = {},
  enabled = true,
  searchQuery,
}: UseFacilitiesParams = {}) {
  // ✅ Merge searchQuery into filters
  const combinedFilters: FilterQuery = {
    ...filters,
    ...(searchQuery ? { name: searchQuery } : {}),
  };

  return useQuery({
    queryKey: ["facilities", page, limit, combinedFilters],
    queryFn: () =>
      facilityService.getAllFacilities({
        page,
        limit,
        filters: combinedFilters,
      }),
    enabled,
    staleTime: 1 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
