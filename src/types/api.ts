export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface FacilityApiResponse {
  facility_id: string;
  hfr_id: string;
  facility_name: string;
  facility_category: string;
  town: string;
  address: string;
  lat: number;
  lon: number;
  total_doctors: number;
  avg_daily_patients: number;
  doctor_patient_ratio: number;
  specialists: string[];
  image_urls: string[];
  working_hours: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
    emergency?: string;
  };
  contact_info: {
    email: string;
    phone: string;
  };
  average_rating: number;
  total_reviews: number;
  last_updated: string;
  road_distance_meters?: number;
  travel_time_minutes?: number;
  route_geometry?: {
    type: string;
    coordinates: number[][];
  };
}

export interface LocationDetectResponse {
  latitude: number;
  longitude: number;
  lga: string;
  state: string;
  facilities: FacilityApiResponse[];
}

export interface RoutingResponse {
  distance: number;
  duration: number;
  geometry: {
    type: string;
    coordinates: number[][];
  };
}

export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}
