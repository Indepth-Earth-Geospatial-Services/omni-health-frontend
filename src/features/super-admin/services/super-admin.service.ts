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
  };

  constructor() {
    this.getUsers = this.getUsers.bind(this);
    this.assignManager = this.assignManager.bind(this);
    this.deactivateAccount = this.deactivateAccount.bind(this);
    this.createStaff = this.createStaff.bind(this);
    this.searchStaff = this.searchStaff.bind(this);
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
}

export const superAdminService = new SuperAdminService();
