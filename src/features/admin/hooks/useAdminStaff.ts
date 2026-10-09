import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
  type QueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

import {
  adminService,
  type StaffMember,
  type CreateStaffData,
  type GetStaffResponse,
  type GetFacilityInventoryResponse,
  type InventoryType,
  type InventoryWriteRequest,
  type InventoryWriteResponse,
  type StaffSearchParams,
  type UpdateFacilityProfileRequest,
} from "@/services/admin.service";

import { FACILITY_KEYS } from "@/constants";
import { inventoryCatalogueKeys } from "@/features/super-admin/hooks/useInventoryCatalogue";
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

/**
 * Bulk-imports staff from a spreadsheet for a given facility. Used by both the
 * admin and super-admin "Add Staff" modals, so it invalidates both features'
 * staff list query keys.
 */
export const useBulkImportStaff = (facilityId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) =>
      adminService.bulkImportStaff({ facilityId, file }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminStaffKeys.all });
      queryClient.invalidateQueries({ queryKey: ["all-staff"] });
    },
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
        qualifications: { type: "object", nullable: true },
        date_first_appointment: { type: "string", nullable: true },
        date_confirmation: { type: "string", nullable: true },
        date_present_appointment: { type: "string", nullable: true },
        date_of_birth: { type: "string", nullable: true },
        lga_origin: { type: "string", nullable: true },
        years_in_present_station: { type: "string", nullable: true },
        phone_number: { type: "string", nullable: true },
        email: { type: "string", nullable: true },
        is_active: { type: "boolean", nullable: true },
        remark: { type: "string", nullable: true },
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

export const useFacilityInventory = (
  facilityId: string,
  options: {
    /**
     * Keep showing the previous facility's data while a newly chosen one
     * loads — for the KPI row, where numbers dimming beats a blank "—". Leave
     * off for tables, which must never show one facility's rows under
     * another's name.
     */
    keepPrevious?: boolean;
  } = {},
) => {
  return useQuery({
    queryKey: AdminInventoryKeys.facility(facilityId),
    queryFn: () => adminService.getFacilityInventory(facilityId),
    enabled: !!facilityId,
    // Writes update this cache directly (see below), so a longer window only
    // spares re-downloading on revisit; it never hides your own changes.
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    placeholderData: options.keepPrevious ? keepPreviousData : undefined,
  });
};

type FacilityInventoryCache = GetFacilityInventoryResponse | undefined;

/**
 * Write a confirmed count straight into the facility's cached inventory, so
 * the table and KPIs change the moment the server accepts the write rather
 * than after a re-download.
 */
const applyWrite = (
  queryClient: QueryClient,
  facilityId: string,
  res: InventoryWriteResponse,
) =>
  queryClient.setQueryData<FacilityInventoryCache>(
    AdminInventoryKeys.facility(facilityId),
    (old) =>
      old && {
        ...old,
        inventory: {
          ...old.inventory,
          [res.type]: {
            ...old.inventory[res.type],
            [res.item_name]: res.count,
          },
        },
      },
  );

const applyDelete = (
  queryClient: QueryClient,
  facilityId: string,
  type: InventoryType,
  itemName: string,
) =>
  queryClient.setQueryData<FacilityInventoryCache>(
    AdminInventoryKeys.facility(facilityId),
    (old) => {
      if (!old) return old;
      const rest = { ...old.inventory[type] };
      delete rest[itemName];
      return { ...old, inventory: { ...old.inventory, [type]: rest } };
    },
  );

/**
 * After any inventory write, mark everything derived from it stale: this
 * facility (reconciling the direct update above), the cross-facility totals,
 * and the per-item facility lists. When a write added a brand-new name to
 * the catalogue, the catalogue too — the backend's own instruction for
 * item_created.
 */
export const refreshInventoryQueries = (
  queryClient: QueryClient,
  {
    facilityId,
    catalogueChanged = false,
  }: {
    facilityId?: string;
    catalogueChanged?: boolean;
  } = {},
) => {
  queryClient.invalidateQueries({
    queryKey: facilityId
      ? AdminInventoryKeys.facility(facilityId)
      : AdminInventoryKeys.all,
  });
  queryClient.invalidateQueries({ queryKey: inventoryCatalogueKeys.summary });
  queryClient.invalidateQueries({
    queryKey: inventoryCatalogueKeys.facilitiesByItem,
  });
  if (catalogueChanged) {
    queryClient.invalidateQueries({ queryKey: inventoryCatalogueKeys.unique });
    queryClient.invalidateQueries({
      queryKey: inventoryCatalogueKeys.catalogue,
    });
  }
};

/** Add and update are the same upsert endpoint; one hook body for all four. */
const useInventoryWrite = (
  facilityId: string,
  write: (args: {
    facilityId: string;
    data: InventoryWriteRequest;
  }) => Promise<InventoryWriteResponse>,
  label: string,
) => {
  const queryClient = useQueryClient();
  return useMutation<InventoryWriteResponse, Error, InventoryWriteRequest>({
    mutationFn: (data) => write({ facilityId, data }),
    onSuccess: (res) => {
      applyWrite(queryClient, facilityId, res);
      refreshInventoryQueries(queryClient, {
        facilityId,
        catalogueChanged: !!res.item_created,
      });
    },
    onError: (error) => console.error(`Failed to ${label}:`, error),
  });
};

const useInventoryDelete = (facilityId: string, type: InventoryType) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (itemName) =>
      type === "equipment"
        ? adminService.deleteEquipment({ facilityId, itemName })
        : adminService.deleteInfrastructure({ facilityId, itemName }),
    onSuccess: (_res, itemName) => {
      applyDelete(queryClient, facilityId, type, itemName);
      refreshInventoryQueries(queryClient, { facilityId });
    },
    onError: (error) => console.error(`Failed to delete ${type}:`, error),
  });
};

export const useAddEquipment = (facilityId: string) =>
  useInventoryWrite(facilityId, adminService.addEquipment, "add equipment");

export const useAddInfrastructure = (facilityId: string) =>
  useInventoryWrite(
    facilityId,
    adminService.addInfrastructure,
    "add infrastructure",
  );

export const useUpdateEquipment = (facilityId: string) =>
  useInventoryWrite(
    facilityId,
    adminService.updateEquipment,
    "update equipment",
  );

export const useUpdateInfrastructure = (facilityId: string) =>
  useInventoryWrite(
    facilityId,
    adminService.updateInfrastructure,
    "update infrastructure",
  );

export const useDeleteEquipment = (facilityId: string) =>
  useInventoryDelete(facilityId, "equipment");

export const useDeleteInfrastructure = (facilityId: string) =>
  useInventoryDelete(facilityId, "infrastructure");

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
      queryClient.invalidateQueries({
        queryKey: FACILITY_KEYS.allFacilities(),
      });

      toast.success("Facility profile updated successfully");
    },
    onError: (error: any) => {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });
};

export type { StaffMember, CreateStaffData };
