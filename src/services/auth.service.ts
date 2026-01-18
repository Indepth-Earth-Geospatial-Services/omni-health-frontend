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
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: "user" | "admin" | "super_admin";
}

// ✅ REMOVED: export interface RegisterResponse extends User {}
// Just use User type directly since the API returns the same structure

class AuthService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = "https://omni-health-backend.onrender.com";
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
            "Accept": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<User> { // ✅ CHANGED: Use User directly
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
            "Accept": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const authService = new AuthService();