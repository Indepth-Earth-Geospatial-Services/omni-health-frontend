import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
  type UseQueryOptions,
} from "@tanstack/react-query";

import {
  adminService,
  type StaffMember,
  type CreateStaffData,
  type GetStaffResponse,
  type AddEquipmentRequest,
  type AddInfrastructureRequest,
  type AddEquipmentResponse,
  type AddInfrastructureResponse,
} from "@/services/admin.service";

// Query keys for admin staff
export const adminStaffKeys = {
  all: ["adminStaff"] as const,
  list: (facilityId: string, page: number, limit: number = 10) =>
    [...adminStaffKeys.all, facilityId, page, limit] as const,
  detail: (facilityId: string, staffId: string) =>
    [...adminStaffKeys.all, facilityId, "detail", staffId] as const,
};

/**
 * Hook to fetch paginated staff list
 */
export const useAdminStaff = (
  facilityId: string,
  page: number = 1,
  limit: number = 10,
  options?: Omit<UseQueryOptions<GetStaffResponse>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: adminStaffKeys.list(facilityId, page, limit),
    queryFn: () =>
      adminService.getStaff({
        facilityId,
        page,
        limit,
      }),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!facilityId,
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
      return adminService.createStaff({ facilityId, data });
    },
    onSuccess: () => {
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
 * Hook to fetch staff schema dynamically by deriving it from actual staff data
 * Since there's no dedicated schema endpoint, we fetch staff and extract field names
 */
export const useStaffSchema = (facilityId: string) => {
  return useQuery<Record<string, any>, Error>({
    queryKey: ["staff-schema", facilityId],
    queryFn: async () => {
      // Fetch staff data to derive schema from actual records
      const response = await adminService.getStaff({
        facilityId,
        page: 1,
        limit: 1, // Only need one record to get the schema
      });

      // If we have staff data, derive schema from the first record
      if (response.staff && response.staff.length > 0) {
        const sampleStaff = response.staff[0];
        const schema: Record<string, any> = {};

        // Extract all keys from the staff object as schema fields
        Object.keys(sampleStaff).forEach((key) => {
          // Skip internal fields
          if (key === "staff_id" || key === "facility_id") return;

          const value = sampleStaff[key as keyof StaffMember];
          schema[key] = {
            type: typeof value === "object" ? "object" : typeof value,
            nullable: value === null || value === undefined,
          };
        });

        return schema;
      }

      // Return default schema if no staff data available
      return {
        full_name: { type: "string", nullable: false },
        gender: { type: "string", nullable: true },
        rank_cadre: { type: "string", nullable: true },
        grade_level: { type: "string", nullable: true },
        phone_number: { type: "string", nullable: true },
        email: { type: "string", nullable: true },
        date_first_appointment: { type: "string", nullable: true },
        date_of_birth: { type: "string", nullable: true },
        qualifications: { type: "object", nullable: true },
        is_active: { type: "boolean", nullable: true },
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!facilityId,
  });
};

// ==================== INVENTORY HOOKS ====================

export const AdminInventoryKeys = {
  all: ["admin-inventory"] as const,
  facility: (facilityId: string) =>
    [...AdminInventoryKeys.all, facilityId] as const,
};

/**
 * Fetch Facility Inventory (Equipment + Infrastructure)
 */
export const useFacilityInventory = (facilityId: string) => {
  return useQuery({
    queryKey: AdminInventoryKeys.facility(facilityId),
    queryFn: () => adminService.getFacilityInventory(facilityId),
    enabled: !!facilityId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook to add equipment to facility inventory
 */
export const useAddEquipment = (facilityId: string) => {
  const queryClient = useQueryClient();

  return useMutation<AddEquipmentResponse, Error, AddEquipmentRequest>({
    mutationFn: (data: AddEquipmentRequest) => {
      return adminService.addEquipment({ facilityId, data });
    },
    onSuccess: () => {
      // Invalidate inventory queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: AdminInventoryKeys.facility(facilityId),
      });
    },
    onError: (error) => {
      console.error("Failed to add equipment:", error);
    },
  });
};

/**
 * Hook to add infrastructure to facility inventory
 */
export const useAddInfrastructure = (facilityId: string) => {
  const queryClient = useQueryClient();

  return useMutation<AddInfrastructureResponse, Error, AddInfrastructureRequest>({
    mutationFn: (data: AddInfrastructureRequest) => {
      return adminService.addInfrastructure({ facilityId, data });
    },
    onSuccess: () => {
      // Invalidate inventory queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: AdminInventoryKeys.facility(facilityId),
      });
    },
    onError: (error) => {
      console.error("Failed to add infrastructure:", error);
    },
  });
};

/**
 * Hook to delete equipment from facility inventory
 */
export const useDeleteEquipment = (facilityId: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (itemName: string) => {
      return adminService.deleteEquipment({ facilityId, itemName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: AdminInventoryKeys.facility(facilityId),
      });
    },
    onError: (error) => {
      console.error("Failed to delete equipment:", error);
    },
  });
};

/**
 * Hook to delete infrastructure from facility inventory
 */
export const useDeleteInfrastructure = (facilityId: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (itemName: string) => {
      return adminService.deleteInfrastructure({ facilityId, itemName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: AdminInventoryKeys.facility(facilityId),
      });
    },
    onError: (error) => {
      console.error("Failed to delete infrastructure:", error);
    },
  });
};

/**
 * Hook to update equipment in facility inventory
 * NOTE: Backend endpoint to be implemented
 */
export const useUpdateEquipment = (facilityId: string) => {
  const queryClient = useQueryClient();

  return useMutation<AddEquipmentResponse, Error, AddEquipmentRequest>({
    mutationFn: (data: AddEquipmentRequest) => {
      return adminService.updateEquipment({ facilityId, data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: AdminInventoryKeys.facility(facilityId),
      });
    },
    onError: (error) => {
      console.error("Failed to update equipment:", error);
    },
  });
};

/**
 * Hook to update infrastructure in facility inventory
 * NOTE: Backend endpoint to be implemented
 */
export const useUpdateInfrastructure = (facilityId: string) => {
  const queryClient = useQueryClient();

  return useMutation<AddInfrastructureResponse, Error, AddInfrastructureRequest>({
    mutationFn: (data: AddInfrastructureRequest) => {
      return adminService.updateInfrastructure({ facilityId, data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: AdminInventoryKeys.facility(facilityId),
      });
    },
    onError: (error) => {
      console.error("Failed to update infrastructure:", error);
    },
  });
};

// Re-export types for convenience
export type { StaffMember, CreateStaffData };