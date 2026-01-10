export interface Facility {
  address: string;
  average_rating: number;
  avg_daily_patients: number;
  contact_info: {
    email: string;
    phone: string;
  };
  doctor_patient_ratio: number;
  facility_category: string;
  facility_id: string;
  facility_name: string;
  hfr_id: string;
  image_urls: string[];
  inventory: {
    baby_cots: number;
    delivery_beds: number;
    inpatient_beds: number;
    refrigerators: number;
    resuscitation_beds: number;
    sphygmomanometers: number;
    stethoscopes: number;
  };
  last_updated: Date;
  lat: number;
  lon: number;
  road_distance_meters: number;
  route_geometry: {
    coordinates: Array<Record<string, string>>;
  };
  specialists: string[];
  services_list: string[];

  total_reviews: number;
  town: string;
  travel_time_minutes: number;
  working_hours: {
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
export interface GetLGAFacilities {
  facilities: Array<Facility>;
  message: string;
  pagination: {
    total_records: number;
    current_page: number;
    total_pages: number;
    limit: number;
  };
}
export interface GetNearestFacility {
  message: string;
  facility: Facility;
}
