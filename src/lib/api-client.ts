import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  ApiResponse,
  FacilityApiResponse,
  LocationDetectResponse,
  RoutingResponse,
} from '@/types/api';

// Use proxy in development to bypass CORS, direct URL in production
const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? '/api/proxy'
    : process.env.NEXT_PUBLIC_API_BASE_URL || 'https://omni-health-backend.onrender.com/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add authentication token if available
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async getAllFacilities(): Promise<FacilityApiResponse[]> {
    const response = await this.client.get<ApiResponse<FacilityApiResponse[]>>('/facilities');
    return response.data.data;
  }

  async getFacilitiesByLocation(lat: number, lng: number): Promise<FacilityApiResponse[]> {
    const response = await this.client.get<FacilityApiResponse[]>(
      `/facilities/detect-location?lat=${lat}&lon=${lng}`
    );
    // API returns array of facilities
    return response.data;
  }

  async getNearestFacility(lat: number, lng: number, radius = 5000): Promise<FacilityApiResponse> {
    const response = await this.client.get<FacilityApiResponse>(
      `/facilities/nearest?lat=${lat}&lon=${lng}&radius=${radius}`
    );
    // API returns single facility object
    return response.data;
  }

  async getFacilityById(facilityId: string): Promise<FacilityApiResponse> {
    const response = await this.client.get<ApiResponse<FacilityApiResponse>>(
      `/facilities/${facilityId}`
    );
    return response.data.data;
  }

  async getRouteBetweenPoints(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
  ): Promise<RoutingResponse> {
    const response = await this.client.post<ApiResponse<RoutingResponse>>(
      '/routing/between-points',
      {
        start: { latitude: startLat, longitude: startLng },
        end: { latitude: endLat, longitude: endLng },
      }
    );
    return response.data.data;
  }
}

export const apiClient = new ApiClient();
