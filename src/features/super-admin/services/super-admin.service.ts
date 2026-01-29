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
    STAFF: "/admin/staff/all",
    CREATE_STAFF: "/admin/facility", // Base endpoint, facility_id will be appended
    SEARCH_STAFF: "/admin/staff", // Base endpoint for search
    DELETE_STAFF: "/admin/staff", // DELETE /admin/staff/{staff_id}
    EXPORT_STAFF: "/admin/export/staff", // Export staff to CSV or Excel
    FACILITIES_SEARCH: "/facilities/search",
  };

  constructor() {
    this.getUsers = this.getUsers.bind(this);
    this.assignManager = this.assignManager.bind(this);
    this.deactivateAccount = this.deactivateAccount.bind(this);
    this.createStaff = this.createStaff.bind(this);
    this.searchStaff = this.searchStaff.bind(this);
    this.deleteStaff = this.deleteStaff.bind(this);
    this.exportStaff = this.exportStaff.bind(this);
    this.searchFacilities = this.searchFacilities.bind(this);
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
   * Get all active users with pagination
   * GET /api/v1/admin/users
   * Requires Super Admin role
   */
  async getUsers({
    page = 1,
    limit = 20,
  }: {
    page?: number;
    limit?: number;
  } = {}): Promise<GetUsersResponse> {
    try {
      const response = await apiClient.get(this.ENDPOINTS.USERS, {
        params: { page, limit },
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
}

export const superAdminService = new SuperAdminService();
