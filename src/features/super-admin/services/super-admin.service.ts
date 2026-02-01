import { apiClient } from "@/lib/client";
import type { StaffMember, StaffPagination } from "@/services/admin.service";

// User API Response Types
export interface ManagedFacility {
  facility_id: string;
  facility_name: string;
}

export interface User {
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  managed_facilities: ManagedFacility[];
  created_at: string;
  is_active: boolean;
  is_suspended?: boolean;
}

export interface UserPagination {
  total_records: number;
  current_page: number;
  total_pages: number;
  limit: number;
}

export interface GetUsersResponse {
  users: User[];
  message: string;
  pagination: UserPagination;
}

export interface AssignManagerRequest {
  user_id: number;
  facility_id: string;
}

export interface AssignManagerResponse {
  message: string;
  assignment_id?: string;
}

export interface DeactivateUserResponse {
  message: string;
}

export interface GetAllStaffResponse {
  staff: StaffMember[];
  message: string;
  pagination: StaffPagination;
}

export interface CreateStaffRequest {
  full_name: string;
  gender?: string;
  rank_cadre?: string;
  grade_level?: string;
  phone_number?: string;
  email: string;
  date_first_appointment?: string;
  date_of_birth?: string;
  qualifications?: Record<string, any>;
}

export interface CreateStaffResponse {
  full_name: string;
  gender?: string;
  rank_cadre?: string;
  grade_level?: string;
  phone_number?: string;
  email: string;
  date_first_appointment?: string;
  date_of_birth?: string;
  qualifications?: Record<string, any>;
  staff_id: string;
  facility_id: string;
  is_active: boolean;
}

export interface SearchStaffParams {
  facility_id: string;
  name?: string;
  rank_cadre?: string;
  grade_level?: string;
  gender?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export interface SearchStaffResponse {
  message: string;
  pagination: StaffPagination;
  staff: StaffMember[];
}

export interface ExportStaffParams {
  format: "CSV" | "EXCEL";
  lga_ids?: number[];
  facility_ids?: string[];
}

export interface ExportUsersParams {
  format: "CSV" | "EXCEL";
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  name?: string;
  is_active?: boolean;
}

// Search facility interface
// Add these new interfaces for Facility Search
export interface SearchFacilityParams {
  name?: string;
  category?: string;
  lga_name?: string;
  specialist?: string;
  inventory_item?: string;
  service?: string;
  page?: number;
  limit?: number;
}

// Unique Equipment and Infrastructure Response Type
export interface UniqueEquipmentItem {
  equipment: string[];
  infrastructure: string[];
}

export interface GetUniqueEquipmentParams {
  // No parameters required
}

export interface FacilityInventory {
  equipment: Record<string, any>;
  infrastructure: Record<string, any>;
}

export interface Facility {
  facility_id: string;
  hfr_id: string;
  facility_name: string;
  facility_category: string;
  facility_lga: string;
  town: string;
  address: string;
  lat: number;
  lon: number;
  avg_daily_patients: number;
  doctor_patient_ratio: number;
  inventory: FacilityInventory;
  services_list: string[];
  specialists: string[];
  image_urls: string[];
  working_hours: Record<string, any>;
  contact_info: Record<string, any>;
  average_rating: number;
  total_reviews: number;
  last_updated: string;
}

export interface SearchFacilityResponse {
  message: string;
  pagination: {
    total_records: number;
    current_page: number;
    total_pages: number;
    limit: number;
  };
  facilities: Facility[];
}

// Search facilities by inventory item (equipment or infrastructure)
export interface SearchFacilitiesByInventoryParams {
  inventory_item: string;
  page?: number;
  limit?: number;
}

export interface SearchFacilitiesByInventoryResponse {
  message: string;
  pagination: {
    total_records: number;
    current_page: number;
    total_pages: number;
    limit: number;
  };
  facilities: Facility[];
}

export interface AnalyticsOverviewResponse {
  total_facilities: number;
  total_users: number;
  total_reviews: number;
  active_appointments: number;
}

/**
 * SUPER ADMIN SERVICE CLASS
 * Contains methods for super admin operations such as:
 * get all users
 */

class SuperAdminService {
  public ENDPOINTS = {
    USERS: "/admin/users",
    ASSIGN_MANAGER: "/admin/assign-manager",
    DEACTIVATE_ACCOUNT: "/deactivate-account",
    SUSPEND_USER: "/admin/users", // PATCH /admin/users/{user_id}/suspend
    UNSUSPEND_USER: "/admin/users", // PATCH /admin/users/{user_id}/unsuspend
    STAFF: "/admin/staff/all",
    CREATE_STAFF: "/admin/facility", // Base endpoint, facility_id will be appended
    SEARCH_STAFF: "/admin/staff", // Base endpoint for search
    DELETE_STAFF: "/admin/staff", // DELETE /admin/staff/{staff_id}
    EXPORT_STAFF: "/admin/export/staff", // Export staff to CSV or Excel
    EXPORT_USERS: "/admin/export/users", // Export users to CSV or Excel
    FACILITIES_SEARCH: "/facilities/search",
    FACILITIES_BY_INVENTORY: "/facilities", // GET /facilities?inventory_item={name}&page={page}&limit={limit}
    UNIQUE_INVENTORY: "/admin/inventory/unique", // Get all unique equipment and infrastructure items
    ANALYTICS_OVERVIEW: "/admin/analytics/overview", // GET analytics KPIs and charts data
  };

  constructor() {
    this.getUsers = this.getUsers.bind(this);
    this.assignManager = this.assignManager.bind(this);
    this.deactivateAccount = this.deactivateAccount.bind(this);
    this.createStaff = this.createStaff.bind(this);
    this.searchStaff = this.searchStaff.bind(this);
    this.deleteStaff = this.deleteStaff.bind(this);
    this.exportStaff = this.exportStaff.bind(this);
    this.exportUsers = this.exportUsers.bind(this);
    this.searchFacilities = this.searchFacilities.bind(this);
    this.getFacilitiesByInventory = this.getFacilitiesByInventory.bind(this);
    this.getUniqueInventory = this.getUniqueInventory.bind(this);
    this.suspendUser = this.suspendUser.bind(this);
    this.unsuspendUser = this.unsuspendUser.bind(this);
    this.getAnalyticsOverview = this.getAnalyticsOverview.bind(this);
  }

  /**
   * Get all staff members across all facilities with pagination
   * GET /super-admin/staff
   * Only Super Admins can access this endpoint
   */
  async getAllStaff({
    page = 1,
    limit = 10,
  }: {
    page?: number;
    limit?: number;
  }): Promise<GetAllStaffResponse> {
    const response = await apiClient.get(this.ENDPOINTS.STAFF, {
      params: { page, limit },
    });
    return response.data;
  }

  /**
   * Get all active users with pagination and optional filters
   * GET /api/v1/admin/users
   * Requires Super Admin role
   */
  async getUsers(params: GetUsersParams = {}): Promise<GetUsersResponse> {
    try {
      const { page = 1, limit = 20, name, is_active } = params;

      // Build clean params object
      const cleanParams: Record<string, string | number | boolean> = {
        page,
        limit,
      };
      if (name && name.trim()) {
        cleanParams.name = name.trim();
      }
      if (is_active !== undefined) {
        cleanParams.is_active = is_active;
      }

      const response = await apiClient.get(this.ENDPOINTS.USERS, {
        params: cleanParams,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Export users to CSV or Excel
   * GET /api/v1/admin/export/users
   * Requires Super Admin role
   */
  async exportUsers(params: ExportUsersParams): Promise<Blob> {
    try {
      const response = await apiClient.get(this.ENDPOINTS.EXPORT_USERS, {
        params: { format: params.format },
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Assign a user to a facility and promote to admin
   * POST /api/v1/admin/assign-manager
   * Requires Super Admin role
   */
  async assignManager(
    data: AssignManagerRequest,
  ): Promise<AssignManagerResponse> {
    try {
      const response = await apiClient.post(
        this.ENDPOINTS.ASSIGN_MANAGER,
        data,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deactivate a user account
   * POST /api/v1/deactivate-account?password_confirmation=xxx
   * Requires authentication
   */
  async deactivateAccount(
    passwordConfirmation: string,
  ): Promise<DeactivateUserResponse> {
    try {
      const response = await apiClient.post(
        this.ENDPOINTS.DEACTIVATE_ACCOUNT,
        null,
        {
          params: { password_confirmation: passwordConfirmation },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new staff member for a specific facility
   * POST /api/v1/admin/facility/{facility_id}/staff
   * Requires Super Admin role
   */
  async createStaff(
    facilityId: string,
    data: CreateStaffRequest,
  ): Promise<CreateStaffResponse> {
    try {
      const response = await apiClient.post(
        `${this.ENDPOINTS.CREATE_STAFF}/${facilityId}/staff`,
        data,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search and filter staff members within a specific facility
   * GET /api/v1/admin/staff/{facility_id}/search
   * Requires Super Admin role
   */
  async searchStaff(params: SearchStaffParams): Promise<SearchStaffResponse> {
    try {
      const { facility_id, ...queryParams } = params;

      // Remove undefined/null values from query params
      const cleanParams = Object.entries(queryParams).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, any>,
      );

      const response = await apiClient.get(
        `${this.ENDPOINTS.SEARCH_STAFF}/${facility_id}/search`,
        {
          params: cleanParams,
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a staff member by staff_id
   * DELETE /api/v1/admin/staff/{staff_id}
   * Requires Super Admin role
   * Returns 204 No Content on success
   */
  async deleteStaff(staffId: string): Promise<void> {
    await apiClient.delete(`${this.ENDPOINTS.DELETE_STAFF}/${staffId}`);
  }

  /**
   * Export staff records to CSV or Excel
   * GET /api/v1/admin/export/staff
   * Requires Super Admin role
   * Supports filtering by multiple LGA IDs or Facility IDs
   * If no filters are provided, exports all staff records
   */
  async exportStaff(params: ExportStaffParams): Promise<Blob> {
    try {
      const response = await apiClient.get(this.ENDPOINTS.EXPORT_STAFF, {
        params: {
          format: params.format,
          lga_ids: params.lga_ids,
          facility_ids: params.facility_ids,
        },
        responseType: "blob",
        paramsSerializer: {
          indexes: null, // This sends multiple values as ?lga_ids=1&lga_ids=2
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async searchFacilities(
    params: SearchFacilityParams,
  ): Promise<SearchFacilityResponse> {
    try {
      // Clean undefined/empty params
      const cleanParams = Object.entries(params).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, any>,
      );

      const response = await apiClient.get(this.ENDPOINTS.FACILITIES_SEARCH, {
        params: cleanParams,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all unique equipment and infrastructure items across all facilities
   * GET /api/v1/admin/inventory/unique
   * Only Super Admins can access this endpoint
   * Returns an object with equipment and infrastructure arrays
   */
  async getUniqueInventory(): Promise<UniqueEquipmentItem> {
    try {
      const response = await apiClient.get(this.ENDPOINTS.UNIQUE_INVENTORY);
      return response.data;
    } catch (error) {
      console.error("Error fetching unique inventory:", error);
      throw error;
    }
  }

  /**
   * Search facilities by inventory item (equipment or infrastructure)
   * GET /api/v1/facilities?inventory_item={name}&page={page}&limit={limit}
   * Returns facilities that contain the specified equipment or infrastructure
   */
  async getFacilitiesByInventory(
    params: SearchFacilitiesByInventoryParams,
  ): Promise<SearchFacilitiesByInventoryResponse> {
    try {
      const { inventory_item, page = 1, limit = 10 } = params;

      const response = await apiClient.get(
        this.ENDPOINTS.FACILITIES_BY_INVENTORY,
        {
          params: {
            inventory_item,
            page,
            limit,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching facilities by inventory:", error);
      throw error;
    }
  }

  /**
   * Suspend a user account
   * POST /api/v1/admin/users/{user_id}/suspend
   * @param userId - The ID of the user to suspend
   * @param reason - The reason for suspending the user
   */
  async suspendUser(userId: string, reason: string): Promise<any> {
    try {
      const response = await apiClient.post(
        `${this.ENDPOINTS.SUSPEND_USER}/${userId}/suspend`,
        { reason },
      );
      return response.data;
    } catch (error) {
      console.error("Error suspending user:", error);
      throw error;
    }
  }

  /**
   * Unsuspend a user account
   * POST /api/v1/admin/users/{user_id}/unsuspend
   * @param userId - The ID of the user to unsuspend
   */
  async unsuspendUser(userId: string): Promise<any> {
    try {
      const response = await apiClient.post(
        `${this.ENDPOINTS.UNSUSPEND_USER}/${userId}/unsuspend`,
      );
      return response.data;
    } catch (error) {
      console.error("Error unsuspending user:", error);
      throw error;
    }
  }

  /**
   * Get analytics overview with KPIs
   * GET /api/v1/admin/analytics/overview
   * Returns: total_facilities, total_users, total_reviews, active_appointments
   */
  async getAnalyticsOverview(): Promise<AnalyticsOverviewResponse> {
    try {
      const response = await apiClient.get(this.ENDPOINTS.ANALYTICS_OVERVIEW);
      return response.data;
    } catch (error) {
      console.error("Error fetching analytics overview:", error);
      throw error;
    }
  }
}

export const superAdminService = new SuperAdminService();
