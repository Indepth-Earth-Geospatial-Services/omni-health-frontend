import { apiClient } from "../lib/client";
import { Facility } from "../types/apiResponse";

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
  }): Promise<Facility> {
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
  }: {
    latitude: number;
    longitude: number;
  }): Promise<Record<number, Facility>> {
    const response = await apiClient.get(
      this.ENDPOINTS.FACILITIES_AROUND_USER_LGA,
      {
        params: {
          lat: latitude,
          lon: longitude,
        },
      },
    );

    return response.data;
  }
  async getFacility(id: string): Promise<Facility> {
    const response = await apiClient.get(`${this.ENDPOINTS.HOME}/${id}`);
    return response.data;
  }
}

export const facilityService = new FacilityService();
