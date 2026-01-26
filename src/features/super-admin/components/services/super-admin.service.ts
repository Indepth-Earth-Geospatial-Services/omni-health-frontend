import { apiClient } from "@/lib/client";
import { StaffMember } from "@/services/admin.service";

async function getStaff(facilityId: string): Promise<StaffMember[]> {
    const response = await apiClient.get(`/admin/staff/${facilityId}`);
    return response.data;
}

async function createStaff(facilityId: string, staffData: any): Promise<StaffMember> {
    const response = await apiClient.post(`/admin/facility/${facilityId}/staff`, staffData);
    return response.data;
}

async function updateStaff(staffId: string, staffData: any): Promise<StaffMember> {
    const response = await apiClient.patch(`/admin/staff/${staffId}`, staffData);
    return response.data;
}

async function deleteStaff(staffId: string): Promise<void> {
    await apiClient.delete(`/admin/staff/${staffId}`);
}

async function assignFacilityManager(userId: number, facilityId: string): Promise<any> {
    const response = await apiClient.post("/super-admin/assign-facility-manager", {
        user_id: userId,
        facility_id: facilityId,
    });
    return response.data;
}

// Placeholder for fetching all staff for super admin
async function getAllStaff(): Promise<StaffMember[]> {
    // This is a placeholder implementation.
    // Replace with the actual API call when the endpoint is available.
    console.warn("Using placeholder for getAllStaff. Replace with actual API call.");
    return [];
}

export const superAdminService = {
    getStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    assignFacilityManager,
    getAllStaff,
};
