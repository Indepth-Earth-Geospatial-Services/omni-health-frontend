import { apiClient } from "@/lib/client";

// Staff API Response Types
export interface StaffMember {
  staff_id: string;
  facility_id: string;
  full_name: string;
  gender?: string;
  rank_cadre?: string;
  grade_level?: string;
  phone_number?: string;
  email?: string;
  date_first_appointment?: string;
  date_of_birth?: string;
  qualifications?: Record<string, unknown>;
  is_active?: boolean;
}

export interface StaffPagination {
  total_records: number;
  current_page: number;
  total_pages: number;
  limit: number;
}

export interface GetStaffResponse {
  staff: StaffMember[];
  message: string;
  pagination: StaffPagination;
}

export interface CreateStaffData {
  full_name: string;
  gender?: string;
  rank_cadre?: string;
  grade_level?: string;
  qualifications?: Record<string, any>; // Changed from string to object
  date_first_appointment?: string;
  date_of_birth?: string;
  phone_number?: string;
  email?: string;
  // Optional fields not in backend schema but kept for form
  presentAppt?: string;
  stateOrigin?: string;
  yearsInStation?: string;
  facility?: string;
  lga?: string;
  status?: string;
  remark?: string;
}

class AdminService {
  public ENDPOINTS = {
    STAFF: "/admin/staff",
    FACILITY: "/admin/facility",
  };

  constructor() {
    this.getStaff = this.getStaff.bind(this);
    this.createStaff = this.createStaff.bind(this);
    this.updateStaff = this.updateStaff.bind(this);
    this.deleteStaff = this.deleteStaff.bind(this);
    this.getStaffSchema = this.getStaffSchema.bind(this);
  }

  /**
   * Get paginated staff list for a facility
   * GET /admin/staff/{facility_id}
   */
  async getStaff({
    facilityId,
    page = 1,
    limit = 10,
  }: {
    facilityId: string;
    page?: number;
    limit?: number;
  }): Promise<GetStaffResponse> {
    const skip = (page - 1) * limit;
    const response = await apiClient.get(
      `${this.ENDPOINTS.STAFF}/${facilityId}`,
      {
        params: { skip, limit },
      }
    );
    return response.data;
  }

  /**
   * Create a new staff member
   * POST /admin/facility/{facility_id}/staff
   */
  async createStaff({
    facilityId,
    data,
  }: {
    facilityId: string;
    data: CreateStaffData;
  }): Promise<StaffMember> {
    // Include facility_id in the request body
    const requestData = {
      ...data,
      facility_id: facilityId,
    };
    // console.log(`${this.ENDPOINTS.FACILITY}/${facilityId}/staff`)
    const response = await apiClient.post(
      `${this.ENDPOINTS.FACILITY}/${facilityId}/staff`,
      requestData
    );

    console.log(response.data)
    return response.data;
  }

  /**
   * Update an existing staff member
   * PUT /admin/staff/{staff_id}
   */
  async updateStaff({
    facilityId,
    staffId,
    data,
  }: {
    facilityId: string;
    staffId: string;
    data: Partial<CreateStaffData>;
  }): Promise<StaffMember> {
    const response = await apiClient.put(
      `${this.ENDPOINTS.STAFF}/${staffId}`,
      data
    );
    return response.data;
  }

  /**
   * Delete a staff member
   * DELETE /admin/staff/{staff_id}
   */
  async deleteStaff({
    facilityId,
    staffId,
  }: {
    facilityId: string;
    staffId: string;
  }): Promise<void> {
    await apiClient.delete(
      `${this.ENDPOINTS.STAFF}/${staffId}`
    );
  }

  /**
   * Fetch staff schema for a facility
   * Assuming: GET /admin/staff/{facility_id}/schema
   */
  async getStaffSchema(facilityId: string): Promise<Record<string, any>> {
    const response = await apiClient.get(
      `${this.ENDPOINTS.STAFF}/${facilityId}/schema`
    );
    return response.data;
  }
}

export const adminService = new AdminService();