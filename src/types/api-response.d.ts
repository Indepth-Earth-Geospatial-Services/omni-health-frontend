export interface Inventory {
  equipment: {
    refrigerators?: number;
    sphygmomanometers?: number;
    stethoscopes?: number;
  };
  infrastructure: {
    baby_cots?: number;
    delivery_beds?: number;
    inpatient_beds?: number;
    resuscitation_beds?: number;
  };
}
export interface Facility {
  address?: string;
  average_rating?: number;
  facility_lga?: string;

  avg_daily_patients?: number;
  contact_info?: {
    email?: string;
    phone?: string;
  };
  doctor_patient_ratio?: number;
  facility_category?: string;
  facility_id?: string;
  facility_name?: string;
  hfr_id?: string;
  image_urls?: string[];
  inventory?: Inventory;
  last_updated?: Date | string;
  lat?: number;
  lon?: number;
  road_distance_meters?: number;
  route_geometry?: {
    coordinates?: Array<Record<string, string>>;
  };
  specialists?: string[];
  services_list?: string[];

  total_reviews?: number;
  town?: string;
  travel_time_minutes?: number;
  working_hours?: {
    emergency: string;
    friday: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    saturday: string;
    sunday: string;
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
