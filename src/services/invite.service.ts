import axios from "axios";
import { handleApiError } from "@/lib/utils";
import config from "@/lib/config";

export type InvitedRole = "admin" | "super_admin";

/** GET /api/v1/invites/{token} — what the accept page needs to render. */
export interface InvitePreview {
  email: string;
  first_name: string;
  last_name: string;
  role: InvitedRole;
  expires_at: string;
}

export interface AcceptInviteUser {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: InvitedRole;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface AcceptInviteResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  assigned_lga_ids: number[];
  user: AcceptInviteUser;
}

/** The API rejects anything shorter. */
export const MIN_PASSWORD_LENGTH = 8;

/**
 * INVITE REDEMPTION SERVICE
 *
 * These two endpoints take no Authorization header — the token in the link is
 * the credential, and the person has no account yet. They use plain axios
 * rather than apiClient so no stored bearer token is attached and a failure
 * never trips the 401 refresh-and-logout interceptor.
 */
class InviteService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = config.API_BASE_URL;
    this.getInvite = this.getInvite.bind(this);
    this.acceptInvite = this.acceptInvite.bind(this);
  }

  /**
   * Validate the link before rendering a password field.
   * GET /api/v1/invites/{token}
   *
   * 404 means the token was never valid — the link is wrong.
   * 410 means it was already used, revoked, or has expired — they need a new
   * invite. The two deserve different copy.
   */
  async getInvite(token: string): Promise<InvitePreview> {
    try {
      const response = await axios.get<InvitePreview>(
        `${this.baseUrl}/invites/${encodeURIComponent(token)}`,
        { headers: { Accept: "application/json" } },
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Create the account. The invitee supplies only a password — name, email and
   * role all come from the invite.
   * POST /api/v1/invites/{token}/accept
   *
   * Returns tokens, so they land signed in: no separate login step and no email
   * verification, since receiving the link already proved they own the address.
   */
  async acceptInvite(
    token: string,
    password: string,
  ): Promise<AcceptInviteResponse> {
    try {
      const response = await axios.post<AcceptInviteResponse>(
        `${this.baseUrl}/invites/${encodeURIComponent(token)}/accept`,
        { password },
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

export const inviteService = new InviteService();
