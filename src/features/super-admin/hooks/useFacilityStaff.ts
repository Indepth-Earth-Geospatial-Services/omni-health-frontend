"use client";

import { useQuery } from "@tanstack/react-query";
import { superAdminService } from "@/features/super-admin/services/super-admin.service";

export function useFacilityStaff(facilityId: string) {
  return useQuery({
    queryKey: ["facility-staff", facilityId],
    queryFn: () => superAdminService.getStaffByFacility(facilityId),
    enabled: !!facilityId,
    staleTime: 5 * 60 * 1000,
  });
}
