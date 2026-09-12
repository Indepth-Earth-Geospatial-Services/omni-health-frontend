import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { superAdminService } from "../services/super-admin.service";
import type {
  CreateInviteRequest,
  CreateInviteResponse,
  GetInvitesParams,
} from "../services/super-admin.service";
import { lgaKeys } from "./useLgas";
import { ApiError } from "@/lib/utils";

export const inviteKeys = {
  all: ["invites"] as const,
  list: (params: GetInvitesParams) => ["invites", "list", params] as const,
};

/**
 * The 409 returned when an LGA is already covered carries the conflicting
 * names rather than a message: `{ detail: { unavailable_lgas: [...] } }`.
 * Nothing is created in that case — the whole invite is rejected.
 */
export function getUnavailableLgas(error: unknown): string[] | null {
  if (!(error instanceof ApiError) || error.statusCode !== 409) return null;
  const detail = error.details;
  if (
    detail &&
    typeof detail === "object" &&
    Array.isArray((detail as { unavailable_lgas?: unknown }).unavailable_lgas)
  ) {
    return (detail as { unavailable_lgas: string[] }).unavailable_lgas;
  }
  return null;
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

/** Warn when the invite row was created but the email never went out. */
function toastInviteResult(res: CreateInviteResponse, sentCopy: string) {
  if (res.email_sent) {
    toast.success(sentCopy);
  } else {
    toast.warning(
      `Invite created, but the email to ${res.invite.email} could not be sent. Use Resend to try again.`,
      { duration: 8000 },
    );
  }
}

export function useInvites(params: GetInvitesParams = {}, enabled = true) {
  return useQuery({
    queryKey: inviteKeys.list(params),
    queryFn: () => superAdminService.getInvites(params),
    staleTime: 60 * 1000,
    enabled,
  });
}

export function useCreateInvite(onSuccess?: (res: CreateInviteResponse) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInviteRequest) =>
      superAdminService.createInvite(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: inviteKeys.all });
      // A pending admin invite reserves its LGAs, so free coverage shifts.
      queryClient.invalidateQueries({ queryKey: lgaKeys.unassigned });
      toastInviteResult(res, `Invitation sent to ${res.invite.email}.`);
      onSuccess?.(res);
    },
    // Errors surface in the modal, which can render the LGA conflict in detail.
  });
}

export function useResendInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: number) => superAdminService.resendInvite(inviteId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: inviteKeys.all });
      toastInviteResult(
        res,
        `A new link was sent to ${res.invite.email}. The previous one no longer works.`,
      );
    },
    onError: (error) => {
      toast.error(
        errorMessage(error, "Could not resend the invitation. Please try again."),
      );
    },
  });
}

export function useRevokeInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: number) => superAdminService.revokeInvite(inviteId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: inviteKeys.all });
      queryClient.invalidateQueries({ queryKey: lgaKeys.unassigned });
      toast.success(res.message ?? "Invitation revoked.");
    },
    onError: (error) => {
      toast.error(
        errorMessage(error, "Could not revoke the invitation. Please try again."),
      );
    },
  });
}
