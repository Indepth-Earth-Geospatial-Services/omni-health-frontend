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
  last_updated: Date;
  lat: number;
  lon: number;
  road_distance_meters: number;
  route_geometry: {
    coordinates: Array<Record<string, string>>;
  };
  specialists: string[];
  total_doctors: number;
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
