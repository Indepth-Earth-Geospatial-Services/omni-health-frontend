export interface WorkingHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  // Accommodating the typo in  API response
  wedsnesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
  emergency?: string;
  [key: string]: string | undefined;
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

  services_list: string[];
  specialists: string[];
  image_urls: string[];
  working_hours: WorkingHours;

  contact_info: {
    email: string;
    // The API returns a list; the profile form still writes a plain string.
    phone: string | string[];
  };

  average_rating: number;
  total_reviews: number;
  last_updated: string;

  road_distance_meters?: number;
  travel_time_minutes?: number;
  route_geometry?: {
    coordinates?: Array<Record<string, string>>;
  };
}

export interface FacilityArray {
  facilities: Array<Facility>;
  message: string;
  pagination: {
    total_records: number;
    current_page: number;
    total_pages: number;
    limit: number;
  };
}
export interface OneFacility {
  message: string;
  facility: Facility;
}
export type GetLGAFacilities = FacilityArray;
export type SearchFacilities = FacilityArray;
export type GetAllFacilities = FacilityArray;
export type GetFacility = OneFacility;
export type GetNearestFacility = OneFacility;
