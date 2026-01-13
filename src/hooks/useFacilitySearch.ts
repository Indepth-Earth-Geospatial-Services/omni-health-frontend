import { useInfiniteQuery } from "@tanstack/react-query";
import { facilityService } from "../services/facility.service";
import { FilterQuery } from "@/types/search-filter";

export const searchKeys = {
  all: ["facilitySearch"] as const,
  search: (query: string, filters: Record<string, string[]>) =>
    [...searchKeys.all, query, JSON.stringify(filters)] as const,
};

export const useFacilitySearch = (
  query: string,
  filters: Record<string, string[]> = {},
  options = {},
) => {
  return useInfiniteQuery({
    queryKey: searchKeys.search(query, filters),
    queryFn: async ({ pageParam = 1 }) => {
      if (!query.trim()) {
        return {
          facilities: [],
          pagination: {
            current_page: 1,
            total_pages: 0,
            total_records: 0,
            limit: 10,
          },
        };
      }

      // Convert filter format for API FIXME CHCK WITH BACKEND
      const apiFilters: FilterQuery = {
        category: filters.facilityType || [],
        performance_tier: filters.performanceTier || [],
        service: filters.serviceAvailability || [],
        lga_name: filters.lga,
      };

      const response = await facilityService.searchFacilities({
        name: query,
        filters: apiFilters,
        page: pageParam,
        limit: 10,
      });

      return {
        facilities: response.facilities,
        pagination: response.pagination,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.current_page < lastPage.pagination.total_pages) {
        return lastPage.pagination.current_page + 1;
      }
      return undefined;
    },
    enabled: !!query.trim(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    ...options,
  });
};
