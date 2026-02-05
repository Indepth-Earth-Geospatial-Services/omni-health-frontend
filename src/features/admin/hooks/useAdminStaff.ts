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
  type StaffSearchParams,
  type UpdateFacilityProfileRequest,
} from "@/services/admin.service";

import { FACILITY_KEYS } from "@/constants";
import { toast } from "sonner";

// Query keys for admin staff
export const adminStaffKeys = {
  all: ["adminStaff"] as const,
  list: (facilityId: string, params: Omit<StaffSearchParams, "facilityId">) =>
    [...adminStaffKeys.all, facilityId, params] as const,
  detail: (facilityId: string, staffId: string) =>
    [...adminStaffKeys.all, facilityId, "detail", staffId] as const,
};

// --- STAFF HOOKS (Unchanged) ---

export const useAdminStaff = (
  facilityId: string,
  params: Omit<StaffSearchParams, "facilityId"> = { page: 1, limit: 10 },
  options?: Omit<UseQueryOptions<GetStaffResponse>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: adminStaffKeys.list(facilityId, params),
    queryFn: () => adminService.searchStaff({ facilityId, ...params }),
    placeholderData: keepPreviousData,
    staleTime: 1 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!facilityId,
    retry: 2,
    ...options,
  });
};

export const useCreateStaff = (facilityId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStaffData) =>
      adminService.createStaff({ facilityId, data }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminStaffKeys.all }),
  });
};

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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminStaffKeys.all }),
  });
};

export const useDeleteStaff = (facilityId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (staffId: string) =>
      adminService.deleteStaff({ facilityId, staffId }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminStaffKeys.all }),
  });
};

export const useInvalidateStaffCache = () => {
  const queryClient = useQueryClient();
  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: adminStaffKeys.all }),
    invalidatePage: (
      facilityId: string,
      params: Omit<StaffSearchParams, "facilityId">,
    ) =>
      queryClient.invalidateQueries({
        queryKey: adminStaffKeys.list(facilityId, params),
      }),
  };
};

export const useStaffSchema = (facilityId: string) => {
  return useQuery<Record<string, any>, Error>({
    queryKey: ["staff-schema", facilityId],
    queryFn: async () => {
      const response = await adminService.searchStaff({
        facilityId,
        page: 1,
        limit: 1,
      });
      if (response.staff && response.staff.length > 0) {
        const sampleStaff = response.staff[0];
        const schema: Record<string, any> = {};
        Object.keys(sampleStaff).forEach((key) => {
          if (key === "staff_id" || key === "facility_id") return;
          const value = sampleStaff[key as keyof StaffMember];
          schema[key] = {
            type: typeof value === "object" ? "object" : typeof value,
            nullable: value === null || value === undefined,
          };
        });
        return schema;
      }
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
    staleTime: 1 * 60 * 1000,
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

export const useFacilityInventory = (facilityId: string) => {
  return useQuery({
    queryKey: AdminInventoryKeys.facility(facilityId),
    queryFn: () => adminService.getFacilityInventory(facilityId),
    enabled: !!facilityId,
    staleTime: 1 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
};

// ... (Add/Delete/Update Equipment hooks remain unchanged) ...
export const useAddEquipment = (facilityId: string) => {
  const queryClient = useQueryClient();
  return useMutation<AddEquipmentResponse, Error, AddEquipmentRequest>({
    mutationFn: (data: AddEquipmentRequest) =>
      adminService.addEquipment({ facilityId, data }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: AdminInventoryKeys.facility(facilityId),
      }),
    onError: (error) => console.error("Failed to add equipment:", error),
  });
};

export const useAddInfrastructure = (facilityId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    AddInfrastructureResponse,
    Error,
    AddInfrastructureRequest
  >({
    mutationFn: (data: AddInfrastructureRequest) =>
      adminService.addInfrastructure({ facilityId, data }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: AdminInventoryKeys.facility(facilityId),
      }),
    onError: (error) => console.error("Failed to add infrastructure:", error),
  });
};

export const useDeleteEquipment = (facilityId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (itemName: string) =>
      adminService.deleteEquipment({ facilityId, itemName }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: AdminInventoryKeys.facility(facilityId),
      }),
    onError: (error) => console.error("Failed to delete equipment:", error),
  });
};

export const useDeleteInfrastructure = (facilityId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (itemName: string) =>
      adminService.deleteInfrastructure({ facilityId, itemName }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: AdminInventoryKeys.facility(facilityId),
      }),
    onError: (error) =>
      console.error("Failed to delete infrastructure:", error),
  });
};

export const useUpdateEquipment = (facilityId: string) => {
  const queryClient = useQueryClient();
  return useMutation<AddEquipmentResponse, Error, AddEquipmentRequest>({
    mutationFn: (data: AddEquipmentRequest) =>
      adminService.updateEquipment({ facilityId, data }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: AdminInventoryKeys.facility(facilityId),
      }),
    onError: (error) => console.error("Failed to update equipment:", error),
  });
};

export const useUpdateInfrastructure = (facilityId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    AddInfrastructureResponse,
    Error,
    AddInfrastructureRequest
  >({
    mutationFn: (data: AddInfrastructureRequest) =>
      adminService.updateInfrastructure({ facilityId, data }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: AdminInventoryKeys.facility(facilityId),
      }),
    onError: (error) =>
      console.error("Failed to update infrastructure:", error),
  });
};

// ==================== IMAGE UPLOAD HOOKS (UPDATED) ====================

/**
 * Hook to upload facility images
 */
export const useUploadFacilityImages = (facilityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files: File[]) => {
      return adminService.uploadFacilityImages({ facilityId, files });
    },
    onSuccess: () => {
      // 1. Invalidate Inventory (if images are part of inventory)
      queryClient.invalidateQueries({
        queryKey: ["admin-inventory", facilityId],
      });

      // 2. CRITICAL FIX: Invalidate Facility Details
      // This forces the "useFacility" hook (used in ProfileModal) to refetch data from the server
      // Note: Ensure this key matches exactly what you use in your useFacility hook
      queryClient.invalidateQueries({ queryKey: ["facility", facilityId] });
      queryClient.invalidateQueries({ queryKey: ["facilities"] }); // Fallback if using a list
    },
  });
};

/**
 * Hook to delete a facility image
 */
export const useDeleteFacilityImage = (facilityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageUrl: string) => {
      return adminService.deleteFacilityImage({ facilityId, imageUrl });
    },
    onSuccess: () => {
      // 1. Invalidate Inventory
      queryClient.invalidateQueries({
        queryKey: AdminInventoryKeys.facility(facilityId),
      });

      // 2. CRITICAL FIX: Invalidate Facility Details
      queryClient.invalidateQueries({ queryKey: ["facility", facilityId] });
      queryClient.invalidateQueries({ queryKey: ["facilities"] });

      toast.success("Image removed successfully");
    },
    onError: (error) => {
      console.error("Failed to delete image:", error);
      toast.error("Failed to delete image");
    },
  });
};

/**
 * Hook to Update Facility Profile
 */

export const useUpdateFacilityProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      facilityId,
      data,
    }: {
      facilityId: string;
      data: UpdateFacilityProfileRequest;
    }) => adminService.updateFacilityProfile({ facilityId, data }),
    onSuccess: (_, variables) => {
      // Invalidate the specific facility query to refetch fresh data
      // Use FACILITY_KEYS to match the query key used in useFacility hook
      queryClient.invalidateQueries({
        queryKey: FACILITY_KEYS.facility(variables.facilityId),
      });
      // Also invalidate all facilities list
      queryClient.invalidateQueries({ queryKey: FACILITY_KEYS.allFacilities() });

      toast.success("Facility profile updated successfully");
    },
    onError: (error: any) => {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });
};

export type { StaffMember, CreateStaffData };
