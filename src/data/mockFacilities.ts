import type { HealthcareFacility } from '@/types/facility';

/**
 * Mock facility data - Replace with API call in production
 * TODO: Move to API endpoint /api/facilities
 */
export const MOCK_FACILITIES: HealthcareFacility[] = [
  {
    id: '1',
    name: 'Akuloma Healthcare Centre',
    address: "650 5th Ave.",
    fullAddress: 'Akuloma PH, UG13, RS',
    status: 'Closed',
    closingTime: '11:00 am',
  },
  {
    id: '2',
    name: 'Amadi MPHC',
    address: '600 5th Ave',
    fullAddress: 'Amadi-Ama, PH, 10013, RS',
    status: 'Closed',
    closingTime: '11:00 am',
  },
  {
    id: '3',
    name: 'Okujagu HP',
    address: '650 5th Ave',
    fullAddress: 'Okujagu, PH, 10019, RS',
    status: 'Closed',
    closingTime: '11:00 am',
  },
] as const;
