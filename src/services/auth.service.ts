import axios from "axios";
import { handleApiError } from "@/lib/utils";
import type { User } from "@/store/auth-store";

// Types for API requests/responses
export interface LoginRequest {
  username: string; // email is used as username
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  token_type: string;
  facility_ids: string[];
  full_name: string;
  email: string;
  role: "user" | "admin" | "super_admin";
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: "user" | "admin" | "super_admin";
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
  email: string;
  is_verified: boolean;
}

export interface ResendOtpResponse {
  message: string;
  email: string;
  expires_in_minutes: number;
}

// ✅ REMOVED: export interface RegisterResponse extends User {}
// Just use User type directly since the API returns the same structure

class AuthService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = "/api/v1";
  }

  /**
   * Login with email and password
   * Uses OAuth2 form-urlencoded format as required by the API
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);
      formData.append("grant_type", "password");
      formData.append("scope", "");

      const response = await axios.post<LoginResponse>(
        `${this.baseUrl}/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
        },
      );

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<User> {
    // ✅ CHANGED: Use User directly
    try {
      const response = await axios.post<User>( // ✅ CHANGED: Use User directly
        `${this.baseUrl}/register`,
        {
          email: data.email,
          password: data.password,
          first_name: data.first_name,
          last_name: data.last_name,
          role: data.role || "user",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Verify email using OTP code
   */
  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    try {
      const response = await axios.post<VerifyOtpResponse>(
        `${this.baseUrl}/verify-otp`,
        {
          email: data.email,
          otp: data.otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Resend OTP verification code
   * Uses query parameter as required by the API
   */
  async resendOtp(email: string): Promise<ResendOtpResponse> {
    try {
      const response = await axios.post<ResendOtpResponse>(
        `${this.baseUrl}/resend-otp`,
        null,
        {
          params: { email },
          headers: {
            Accept: "application/json",
          },
        },
      );

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    try {
      const response = await axios.post<{ message: string }>(
        `${this.baseUrl}/forgot-password`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Verify password reset OTP
   * POST /verify-password-reset-otp
   */
  async verifyPasswordResetOtp(
    email: string,
    otp: string,
  ): Promise<{ message: string; email: string }> {
    try {
      const response = await axios.post<{ message: string; email: string }>(
        `${this.baseUrl}/verify-password-reset-otp`,
        { email, otp },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Reset password with OTP
   * POST /reset-password
   */
  async resetPassword(
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<{ message: string; success: boolean }> {
    try {
      const response = await axios.post<{ message: string; success: boolean }>(
        `${this.baseUrl}/reset-password`,
        {
          email,
          otp,
          new_password: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const authService = new AuthService();
