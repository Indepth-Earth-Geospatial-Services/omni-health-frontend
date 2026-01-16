import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  adminService,
  type StaffMember,
  type CreateStaffData,
} from "@/services/admin.service";

// Query keys for admin staff
export const adminStaffKeys = {
  all: ["adminStaff"] as const,
  list: (facilityId: string, page: number) =>
    [...adminStaffKeys.all, facilityId, page] as const,
  detail: (facilityId: string, staffId: string) =>
    [...adminStaffKeys.all, facilityId, "detail", staffId] as const,
};

/**
 * Hook to fetch paginated staff list
 * Uses keepPreviousData to maintain smooth pagination UX
 */
export const useAdminStaff = (
  facilityId: string,
  page: number = 1,
  limit: number = 10,
  options = {}
) => {
  return useQuery({
    queryKey: adminStaffKeys.list(facilityId, page),
    queryFn: () =>
      adminService.getStaff({
        facilityId,
        page,
        limit,
      }),
    placeholderData: keepPreviousData, // Keep previous data while fetching new page
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    enabled: !!facilityId, // Only fetch if facilityId is provided
    retry: 2,
    ...options,
  });
};

/**
 * Hook to create a new staff member
 */
export const useCreateStaff = (facilityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStaffData) => {
      // console.log("FACILITYID",facilityId)
      // console.log("data",data)

      return adminService.createStaff({ facilityId, data })
    },
    onSuccess: () => {
      // Invalidate all staff queries to refetch with new data
      queryClient.invalidateQueries({
        queryKey: adminStaffKeys.all,
      });
    },
  });
};

/**
 * Hook to update an existing staff member
 */
export const useUpdateStaff = (facilityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      staffId,
      data,
    }: {
      staffId: string;
      data: Partial<CreateStaffData>;
    }) => adminService.updateStaff({ facilityId, staffId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminStaffKeys.all,
      });
    },
  });
};

/**
 * Hook to delete a staff member
 */
export const useDeleteStaff = (facilityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staffId: string) =>
      adminService.deleteStaff({ facilityId, staffId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminStaffKeys.all,
      });
    },
  });
};

/**
 * Hook to invalidate staff cache manually
 */
export const useInvalidateStaffCache = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: adminStaffKeys.all,
      }),
    invalidatePage: (facilityId: string, page: number) =>
      queryClient.invalidateQueries({
        queryKey: adminStaffKeys.list(facilityId, page),
      }),
  };
};

/**
 * Hook to fetch staff schema dynamically
 * This will return only the fields available in the backend schema
 */
export const useStaffSchema = (facilityId: string) => {
  return useQuery<Record<string, any>, Error>({
    queryKey: ["staff-schema", facilityId],
    queryFn: async () => {
      const response = await adminService.getStaffSchema(facilityId);
      return response;
    },
    staleTime: 5 * 60 * 1000, // cache schema for 5 minutes
    refetchOnWindowFocus: false,
  });
};


// Re-export types for convenience
export type { StaffMember, CreateStaffData };
