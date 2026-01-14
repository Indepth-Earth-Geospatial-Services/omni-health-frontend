import { useInfiniteQuery } from "@tanstack/react-query";
import { facilityService } from "../services/facility.service";
import { FilterQuery, SelectedFilters } from "@/types/search-filter";

export const searchKeys = {
  all: ["facilitySearch"] as const,
  search: (filters: any) =>
    [...searchKeys.all, JSON.stringify(filters)] as const,
};

export const useFacilitySearch = (
  filters: SelectedFilters = {},
  options = {},
) => {
  // Check if there are any active filters
  const hasFilters =
    (filters.facilityType && filters.facilityType.length > 0) ||
    (filters.performanceTier && filters.performanceTier.length > 0) ||
    (filters.serviceAvailability && filters.serviceAvailability.length > 0) ||
    (filters.lga && filters.lga.length > 0) ||
    (filters.name && filters.name.trim().length > 3);

  return useInfiniteQuery({
    queryKey: searchKeys.search(filters),
    queryFn: async ({ pageParam = 1 }) => {
      // Early return with empty response if no filters
      if (!hasFilters) {
        return {
          facilities: [],
          page: 1,
          limit: 10,
          totalPages: 0,
          totalCount: 0,
        };
      }
      // Convert filter format for API FIXME CHCK WITH BACKEND
      const apiFilters: FilterQuery = {
        category: filters.facilityType || [],
        performance_tier: filters.performanceTier || [],
        service: filters.serviceAvailability || [],
        lga_name: filters.lga,
        name: filters.name,
      };

      const response = await facilityService.searchFacilities({
        filters: apiFilters,
        page: pageParam,
        limit: 10,
      });

      return {
        facilities: response.facilities,
        page: response.pagination.current_page,
        limit: response.pagination.limit,
        totalPages: response.pagination.total_pages,
        totalCount: response.pagination.total_records,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    // enabled: hasFilters, // Only run query if there are filters
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    ...options,
  });
};
