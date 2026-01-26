import { apiClient } from "@/lib/client";

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

export interface DeactivateUserRequest {
  user_id: number;
  reason?: string;
}

export interface DeactivateUserResponse {
  message: string;
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
    DEACTIVATE_USER: "/admin/deactivate-user",
  };

  constructor() {
    this.getUsers = this.getUsers.bind(this);
    this.assignManager = this.assignManager.bind(this);
    this.deactivateUser = this.deactivateUser.bind(this);
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
    data: AssignManagerRequest
  ): Promise<AssignManagerResponse> {
    try {
      const response = await apiClient.post(this.ENDPOINTS.ASSIGN_MANAGER, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deactivate a user
   * POST /api/v1/admin/deactivate-user
   * Requires Super Admin role
   */
  async deactivateUser(
    data: DeactivateUserRequest
  ): Promise<DeactivateUserResponse> {
    try {
      const response = await apiClient.post(this.ENDPOINTS.DEACTIVATE_USER, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const superAdminService = new SuperAdminService();
