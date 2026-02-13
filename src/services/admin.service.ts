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
  confirmation_of_appointment?: string;
  date_of_present_appointment?: string;
  date_of_birth?: string;
  lga_of_origin?: string;
  years_in_present_station?: number | string;
  qualifications?: Record<string, unknown>;
  qualification_date?: string;
  remark?: string;
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

// Search Parameters Interface
export interface StaffSearchParams {
  facilityId: string;
  name?: string;
  rank_cadre?: string;
  grade_level?: string;
  gender?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
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

// --- Add these new interfaces ---
export interface UpdateFacilityProfileRequest {
  hfr_id?: string;
  facility_name?: string;
  facility_category?: string;
  lga_id?: number; // API expects lga_id (number) for LGA lookup
  town?: string; // Town name - maps to facility_lga display
  address?: string;
  contact_info?: {
    phone?: string;
    email?: string;
    [key: string]: any;
  };
  lat?: number;
  lon?: number;
}

export type ExportFormat = "excel" | "csv" | "pdf";

class AdminService {
  public ENDPOINTS = {
    STAFF: "/admin/staff",
    FACILITY: "/admin/facility",
    EXPORT_STAFF: "/admin/export/staff",
    PROFILE: "/admin/facility/profile",
  };

  constructor() {
    this.getStaff = this.getStaff.bind(this);
    this.searchStaff = this.searchStaff.bind(this); // Bind the new method
    this.createStaff = this.createStaff.bind(this);
    this.updateStaff = this.updateStaff.bind(this);
    this.deleteStaff = this.deleteStaff.bind(this);
    this.getFacilityInventory = this.getFacilityInventory.bind(this);
    this.addEquipment = this.addEquipment.bind(this);
    this.addInfrastructure = this.addInfrastructure.bind(this);
    this.exportStaff = this.exportStaff.bind(this);
    this.uploadFacilityImages = this.uploadFacilityImages.bind(this);
    this.deleteFacilityImage = this.deleteFacilityImage.bind(this);
    this.deleteEquipment = this.deleteEquipment.bind(this);
    this.deleteInfrastructure = this.deleteInfrastructure.bind(this);
    this.updateEquipment = this.updateEquipment.bind(this);
    this.updateInfrastructure = this.updateInfrastructure.bind(this);
    // this.updateFacilityProfile = this.updateFacilityProfile.bind(this)
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
   * Search staff members within a facility
   * GET /admin/staff/{facility_id}/search
   */
  async searchStaff({
    facilityId,
    name,
    rank_cadre,
    grade_level,
    gender,
    is_active,
    page = 1,
    limit = 10,
  }: StaffSearchParams): Promise<GetStaffResponse> {
    const response = await apiClient.get(
      `${this.ENDPOINTS.STAFF}/${facilityId}/search`,
      {
        params: {
          name: name || undefined, // Send undefined if empty to avoid sending empty strings
          rank_cadre: rank_cadre || undefined,
          grade_level: grade_level || undefined,
          gender: gender === "all" ? undefined : gender, // Handle "all" case
          is_active: is_active,
          page,
          limit,
        },
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

  /**
   * Export Staff List
   * GET /admin/export/staff/{facility_id}?format={format}
   */
  async exportStaff(
    facilityId: string,
    format: ExportFormat = "excel",
  ): Promise<Blob> {
    const response = await apiClient.get(
      `${this.ENDPOINTS.EXPORT_STAFF}/${facilityId}`,
      {
        params: { format },
        responseType: "blob",
      },
    );
    return response.data;
  }

  // Add to AdminService class in admin.service.ts

  /**
   * Upload Facility Images
   * POST /admin/facility/{facility_id}/images
   */
  async uploadFacilityImages({
    facilityId,
    files,
  }: {
    facilityId: string;
    files: File[];
  }): Promise<string> {
    // Returns "string" based on your schema example
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await apiClient.post(
      `${this.ENDPOINTS.FACILITY}/${facilityId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }

  /**
   * Delete Facility Image
   * DELETE /admin/facility/{facility_id}/images
   */
  async deleteFacilityImage({
    facilityId,
    imageUrl,
  }: {
    facilityId: string;
    imageUrl: string;
  }): Promise<void> {
    // We send the image_url in the body as JSON
    await apiClient.delete(`${this.ENDPOINTS.FACILITY}/${facilityId}/images`, {
      data: { image_url: imageUrl },
    });
  }

  /**
   * Update Facility Profile
   * PATCH /admin/facility/profile/{facility_id}
   */
  async updateFacilityProfile({
    facilityId,
    data,
  }: {
    facilityId: string;
    data: UpdateFacilityProfileRequest;
  }): Promise<any> {
    const response = await apiClient.patch(
      `${this.ENDPOINTS.FACILITY}/profile/${facilityId}`,
      data,
    );
    return response.data;
  }
}

export const adminService = new AdminService();
