import {
  GetFacility,
  GetLGAFacilities,
  GetNearestFacility,
  SearchFacilities,
} from "../features/user/types/apiResponse";
import { apiClient } from "../lib/client";

class FacilityService {
  private ENDPOINTS = {
    HOME: "/facilities",
    // expects query params such as lat and lon of the user
    FACILITIES_AROUND_USER_LGA: "/facilities/detect-location",
    // expects query params such as lat and lon of the user
    NEAREST_FACILITY: "/facilities/nearest",
    SEARCH: "/facilities/search",
  };
  constructor() {
    this.getNearestFacility = this.getNearestFacility.bind(this);
    this.getFacility = this.getFacility.bind(this);
    this.getLGAFacilities = this.getLGAFacilities.bind(this);
  }
  // async searchFacilities({
  //   name,
  //   limit = 10,
  //   page = 1,
  // }: {
  //   name: string;
  //   limit?: number;
  //   page?: number;
  // }): Promise<GetLGAFacilities> {
  //   const response = await apiClient.get(this.ENDPOINTS.SEARCH, {
  //     params: {
  //       name, // The search query parameter
  //       limit,
  //       page,
  //     },
  //   });

  //   return response.data;
  // }

  async searchFacilities({
    name,
    filters = {},
    limit = 10,
    page = 1,
  }: {
    name: string;
    filters?: {
      facility_type?: string[];
      performance_tier?: string[];
      services?: string[];
    };
    limit?: number;
    page?: number;
  }): Promise<SearchFacilities> {
    const params: any = {
      name,
      limit,
      page,
    };

    // Add filter parameters if they exist
    if (filters.facility_type && filters.facility_type.length > 0) {
      params.facility_type = filters.facility_type.join(',');
    }
    if (filters.performance_tier && filters.performance_tier.length > 0) {
      params.performance_tier = filters.performance_tier.join(',');
    }
    if (filters.services && filters.services.length > 0) {
      params.services = filters.services.join(',');
    }

    const response = await apiClient.get(this.ENDPOINTS.SEARCH, {
      params,
    });

    return response.data;
  }


  async getNearestFacility({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }): Promise<GetNearestFacility> {
    const response = await apiClient.get(this.ENDPOINTS.NEAREST_FACILITY, {
      params: {
        lat: latitude,
        lon: longitude,
      },
    });

    return response.data;
  }

  async getLGAFacilities({
    latitude,
    longitude,
    limit = 10,
    page = 1,
  }: {
    latitude: number;
    longitude: number;
    limit?: number;
    page?: number;
  }): Promise<GetLGAFacilities> {
    const response = await apiClient.get(
      this.ENDPOINTS.FACILITIES_AROUND_USER_LGA,
      {
        params: {
          lat: latitude,
          lon: longitude,
          limit,
          page,
        },
      },
    );

    return response.data;
  }
  async getFacility(id: string): Promise<GetFacility> {
    const response = await apiClient.get(`${this.ENDPOINTS.HOME}/${id}`);
    return response.data;
  }
}

export const facilityService = new FacilityService();
