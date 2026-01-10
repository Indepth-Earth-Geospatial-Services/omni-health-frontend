import { apiClient } from "../lib/client";
import {
  Facility,
  GetLGAFacilities,
  GetNearestFacility,
} from "../types/apiResponse";

class FacilityService {
  private ENDPOINTS = {
    HOME: "/facilities",
    // expects query params such as lat and lon of the user
    FACILITIES_AROUND_USER_LGA: "/facilities/detect-location",
    // expects query params such as lat and lon of the user
    NEAREST_FACILITY: "/facilities/nearest",
  };
  constructor() {
    this.getNearestFacility = this.getNearestFacility.bind(this);
    this.getFacility = this.getFacility.bind(this);
    this.getLGAFacilities = this.getLGAFacilities.bind(this);
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
  async getFacility(id: string): Promise<GetNearestFacility> {
    const response = await apiClient.get(`${this.ENDPOINTS.HOME}/${id}`);
    return response.data;
  }
}

export const facilityService = new FacilityService();
