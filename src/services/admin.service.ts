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

export type CreateStaffData = Record<string, any>;

// Inventory Types
export interface EquipmentInventory {
  [equipmentName: string]: number;
}

export interface InfrastructureInventory {
  [infrastructureName: string]: number;
}

export interface FacilityInventory {
  equipment: EquipmentInventory;
  infrastructure: InfrastructureInventory;
}

export interface GetFacilityInventoryResponse {
  facility_id: string;
  facility_name: string;
  inventory: FacilityInventory;
}

// Add Equipment/Infrastructure Request & Response Types
export interface AddEquipmentRequest {
  item_name: string;
  quantity: number;
}

export interface AddInfrastructureRequest {
  item_name: string;
  quantity: number;
}

export interface AddEquipmentResponse {
  facility_id: string;
  facility_name: string;
  item_name: string;
  quantity: number;
  updated_inventory: EquipmentInventory;
}

export interface AddInfrastructureResponse {
  facility_id: string;
  facility_name: string;
  item_name: string;
  quantity: number;
  updated_inventory: InfrastructureInventory;
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
    this.getFacilityInventory = this.getFacilityInventory.bind(this);
    this.addEquipment = this.addEquipment.bind(this);
    this.addInfrastructure = this.addInfrastructure.bind(this);
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
      },
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
    const response = await apiClient.post(
      `${this.ENDPOINTS.FACILITY}/${facilityId}/staff`,
      data,
    );
    return response.data;
  }

  /**
   * Update an existing staff member
   * PATCH /admin/staff/{staff_id}
   * Note: Using PATCH instead of PUT as the backend might expect partial updates
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
    // Try PATCH method first (common for partial updates)
    const response = await apiClient.patch(
      `${this.ENDPOINTS.STAFF}/${staffId}`,
      data,
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
    await apiClient.delete(`${this.ENDPOINTS.STAFF}/${staffId}`);
  }

  /**
   * Fetch Inventory (Equipment and Infrastructure)
   * GET /admin/facility/{facility_id}/inventory
   */
  async getFacilityInventory(
    facilityId: string,
  ): Promise<GetFacilityInventoryResponse> {
    const response = await apiClient.get(
      `${this.ENDPOINTS.FACILITY}/${facilityId}/inventory`,
    );
    return response.data;
  }

  /**
   * Add Equipment to Facility Inventory
   * POST /admin/facility/{facility_id}/inventory/equipment
   */
  async addEquipment({
    facilityId,
    data,
  }: {
    facilityId: string;
    data: AddEquipmentRequest;
  }): Promise<AddEquipmentResponse> {
    const response = await apiClient.post(
      `${this.ENDPOINTS.FACILITY}/${facilityId}/inventory/equipment`,
      data,
    );
    return response.data;
  }

  /**
   * Add Infrastructure to Facility Inventory
   * POST /admin/facility/{facility_id}/inventory/infrastructure
   */
  async addInfrastructure({
    facilityId,
    data,
  }: {
    facilityId: string;
    data: AddInfrastructureRequest;
  }): Promise<AddInfrastructureResponse> {
    const response = await apiClient.post(
      `${this.ENDPOINTS.FACILITY}/${facilityId}/inventory/infrastructure`,
      data,
    );
    return response.data;
  }

  /**
   * Delete Equipment from Facility Inventory
   * DELETE /admin/facility/{facility_id}/inventory/equipment/{item_name}
   */
  async deleteEquipment({
    facilityId,
    itemName,
  }: {
    facilityId: string;
    itemName: string;
  }): Promise<void> {
    const encodedItemName = encodeURIComponent(itemName);
    await apiClient.delete(
      `${this.ENDPOINTS.FACILITY}/${facilityId}/inventory/equipment/${encodedItemName}`,
    );
  }

  /**
   * Delete Infrastructure from Facility Inventory
   * DELETE /admin/facility/{facility_id}/inventory/infrastructure/{item_name}
   */
  async deleteInfrastructure({
    facilityId,
    itemName,
  }: {
    facilityId: string;
    itemName: string;
  }): Promise<void> {
    const encodedItemName = encodeURIComponent(itemName);
    await apiClient.delete(
      `${this.ENDPOINTS.FACILITY}/${facilityId}/inventory/infrastructure/${encodedItemName}`,
    );
  }

  /**
   * Update Equipment in Facility Inventory
   * POST /admin/facility/{facility_id}/inventory/equipment
   * Note: The same POST endpoint handles both add and update operations
   */
  async updateEquipment({
    facilityId,
    data,
  }: {
    facilityId: string;
    data: AddEquipmentRequest;
  }): Promise<AddEquipmentResponse> {
    const response = await apiClient.post(
      `${this.ENDPOINTS.FACILITY}/${facilityId}/inventory/equipment`,
      data,
    );
    return response.data;
  }

  /**
   * Update Infrastructure in Facility Inventory
   * POST /admin/facility/{facility_id}/inventory/infrastructure
   * Note: The same POST endpoint handles both add and update operations
   */
  async updateInfrastructure({
    facilityId,
    data,
  }: {
    facilityId: string;
    data: AddInfrastructureRequest;
  }): Promise<AddInfrastructureResponse> {
    const response = await apiClient.post(
      `${this.ENDPOINTS.FACILITY}/${facilityId}/inventory/infrastructure`,
      data,
    );
    return response.data;
  }
}

export const adminService = new AdminService();
