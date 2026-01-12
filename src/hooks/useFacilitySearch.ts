// import { useInfiniteQuery } from "@tanstack/react-query";
// import { facilityService } from "../services/facility.service";

// export const searchKeys = {
//   all: ["facilitySearch"] as const,
//   search: (query: string) => [...searchKeys.all, query] as const,
// };

// export const useFacilitySearch = (query: string, options = {}) => {
//   return useInfiniteQuery({
//     queryKey: searchKeys.search(query),
//     queryFn: async ({ pageParam = 1 }) => {
//       if (!query.trim()) {
//         return {
//           facilities: [],
//           pagination: {
//             current_page: 1,
//             total_pages: 0,
//             total_records: 0,
//             limit: 10,
//           },
//         };
//       }

//       const response = await facilityService.searchFacilities({
//         name: query,
//         page: pageParam,
//         limit: 10,
//       });

//       return {
//         facilities: response.facilities,
//         pagination: response.pagination,
//       };
//     },
//     initialPageParam: 1,
//     getNextPageParam: (lastPage) => {
//       if (lastPage.pagination.current_page < lastPage.pagination.total_pages) {
//         return lastPage.pagination.current_page + 1;
//       }
//       return undefined;
//     },
//     enabled: !!query.trim(), // Only run when there's a query
//     staleTime: 2 * 60 * 1000, // 2 minutes
//     gcTime: 5 * 60 * 1000, // 5 minutes
//     ...options,
//   });
// };

// hooks/useFacilitySearch.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { facilityService } from "../services/facility.service";

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
      const apiFilters = {
        facility_type: filters.facilityType || [],
        performance_tier: filters.performanceTier || [],
        services: filters.serviceAvailability || [],
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
