import { FilterQuery } from "@/types/search-filter";
import {
  GetAllFacilities,
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
    this.getAllFacilities = this.getAllFacilities.bind(this);
    this.searchFacilities = this.searchFacilities.bind(this);
  }

  private addFilterParams(params: any, filters: FilterQuery): void {
    if (filters.name && filters.name.length > 0) {
      params.name = filters.name;
    }
    if (filters.category && filters.category.length > 0) {
      params.category = filters.category.join(",");
    }
    if (filters.performance_tier && filters.performance_tier.length > 0) {
      params.performance_tier = filters.performance_tier.join(",");
    }
    if (filters.service && filters.service.length > 0) {
      params.service = filters.service.join(",");
    }
    if (filters.lga_name && filters.lga_name.length > 0) {
      params.lga_name = filters.lga_name.join(",");
    }
  }

  async getAllFacilities({
    limit = 10,
    page = 1,
    filters = {},
  }: {
    limit?: number;
    page?: number;
    filters?: FilterQuery;
  } = {}): Promise<GetAllFacilities> {
    const params: any = {
      limit,
      page,
    };

    this.addFilterParams(params, filters);

    const response = await apiClient.get(this.ENDPOINTS.HOME, { params });
    return response.data;
  }

  async searchFacilities({
    filters = {},
    limit = 10,
    page = 1,
  }: {
    filters?: FilterQuery;
    limit?: number;
    page?: number;
  }): Promise<SearchFacilities> {
    const params: any = {
      limit,
      page,
    };

    this.addFilterParams(params, filters);
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
    console.log(response.data);
    return response.data;
  }

  async getFacility(id: string): Promise<GetFacility> {
    const response = await apiClient.get(`${this.ENDPOINTS.HOME}/${id}`);
    return response.data;
  }
}

export const facilityService = new FacilityService();
