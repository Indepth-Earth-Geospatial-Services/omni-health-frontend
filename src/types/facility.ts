export interface HealthcareFacility {
  id: string;
  name: string;
  address: string;
  fullAddress?: string;
  status: 'Open' | 'Closed';
  closingTime: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface FacilitySearchParams {
  location: string;
  radius?: number;
  status?: 'Open' | 'Closed' | 'All';
}
