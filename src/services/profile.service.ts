import axios from "axios";
import { apiClient } from "@/lib/client";
import { handleApiError } from "@/lib/utils";
import config from "@/lib/config";

/** Full profile of the signed-in account. GET /api/v1/me */
export interface MyProfile {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: "admin" | "super_admin" | "user";
  profile_image_url: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  assigned_lgas: string[];
  assigned_lga_ids: number[];
  facility_ids: string[];
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
}

export interface UpdateProfileResponse {
  message: string;
  profile: MyProfile;
}

export interface AvatarResponse {
  message: string;
  profile_image_url: string;
}

/** Rejected by the API above this, so it is worth catching client-side. */
export const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

/**
 * PROFILE SERVICE
 * Every endpoint here acts on the token holder — there is no user id
 * parameter, so one admin can never read or edit another's profile.
 */
class ProfileService {
  public ENDPOINTS = {
    ME: "/me",
    AVATAR: "/me/avatar",
  };

  constructor() {
    this.getMe = this.getMe.bind(this);
    this.updateMe = this.updateMe.bind(this);
    this.uploadAvatar = this.uploadAvatar.bind(this);
    this.deleteAvatar = this.deleteAvatar.bind(this);
  }

  /**
   * Read the full profile.
   * GET /api/v1/me
   *
   * `token` is only for bootstrapping a session that the auth store does not
   * hold yet — right after redeeming an invite. Everywhere else, omit it and
   * let apiClient attach the stored token.
   */
  async getMe(token?: string): Promise<MyProfile> {
    if (token) {
      try {
        const response = await axios.get<MyProfile>(
          `${config.API_BASE_URL}${this.ENDPOINTS.ME}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    }

    const response = await apiClient.get(this.ENDPOINTS.ME);
    return response.data;
  }

  /**
   * Update your own name. Send either field or both.
   * PATCH /api/v1/me
   *
   * Email and role are rejected with a 422 by design — email is the login
   * credential and role is the super admin's decision.
   */
  async updateMe(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const payload: UpdateProfileRequest = {};
    if (data.first_name !== undefined)
      payload.first_name = data.first_name.trim();
    if (data.last_name !== undefined) payload.last_name = data.last_name.trim();

    const response = await apiClient.patch(this.ENDPOINTS.ME, payload);
    return response.data;
  }

  /**
   * Set or replace the profile picture.
   * POST /api/v1/me/avatar — multipart, one field named "file".
   *
   * Uploading again destroys the previous image, so there is no delete-first
   * step.
   */
  async uploadAvatar(file: File): Promise<AvatarResponse> {
    const form = new FormData();
    form.append("file", file);

    // apiClient defaults every request to application/json. That default has
    // to be dropped here so the browser can set multipart/form-data along with
    // the boundary — setting the header by hand breaks the upload.
    const response = await apiClient.post(this.ENDPOINTS.AVATAR, form, {
      headers: { "Content-Type": undefined },
    });
    return response.data;
  }

  /**
   * Remove the profile picture.
   * DELETE /api/v1/me/avatar
   *
   * The CDN purge takes a few minutes and the browser may cache the old image
   * for longer, so clear it from local state rather than re-fetching the URL.
   */
  async deleteAvatar(): Promise<{ message: string }> {
    const response = await apiClient.delete(this.ENDPOINTS.AVATAR);
    return response.data;
  }
}

export const profileService = new ProfileService();
