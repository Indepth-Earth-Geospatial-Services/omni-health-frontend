"use client";

import { useState } from "react";
import {
  Loader2,
  Mail,
  MapPin,
  RefreshCw,
  Ban,
  Clock,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import {
  useInvites,
  useResendInvite,
  useRevokeInvite,
} from "../../hooks/useInvites";
import type { Invite, InviteStatus } from "../../services/super-admin.service";
import { formatDate } from "@/lib/utils";

const STATUS_FILTERS: { value: InviteStatus | "all"; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "expired", label: "Expired" },
  { value: "revoked", label: "Revoked" },
  { value: "all", label: "All" },
];

const STATUS_STYLES: Record<InviteStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  accepted: "border-green-200 bg-green-50 text-green-700",
  expired: "border-slate-200 bg-slate-100 text-slate-600",
  revoked: "border-red-200 bg-red-50 text-red-600",
};

function StatusBadge({ status }: { status: InviteStatus }) {
  const Icon =
    status === "accepted"
      ? CheckCircle2
      : status === "pending"
        ? Clock
        : status === "revoked"
          ? Ban
          : ShieldAlert;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${STATUS_STYLES[status]}`}
    >
      <Icon size={10} />
      {status}
    </span>
  );
}

function InviteRow({ invite }: { invite: Invite }) {
  const resend = useResendInvite();
  const revoke = useRevokeInvite();

  // Only a live invitation can be re-sent or withdrawn.
  const canResend = invite.status === "pending" || invite.status === "expired";
  const canRevoke = invite.status === "pending";
  const isBusy = resend.isPending || revoke.isPending;

  return (
    <div className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-slate-900">
            {invite.first_name} {invite.last_name}
          </p>
          <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold tracking-wide text-slate-600 uppercase">
            {invite.role.replace("_", " ")}
          </span>
          <StatusBadge status={invite.status} />
        </div>

        <p className="mt-0.5 truncate text-xs text-slate-500">{invite.email}</p>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
          <span>
            {invite.status === "accepted" && invite.accepted_at
              ? `Accepted ${formatDate(invite.accepted_at)}`
              : invite.status === "revoked" && invite.revoked_at
                ? `Revoked ${formatDate(invite.revoked_at)}`
                : `Expires ${formatDate(invite.expires_at)}`}
          </span>
          {invite.lga_ids.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={10} />
              {invite.lga_ids.length} LGA
              {invite.lga_ids.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {(canResend || canRevoke) && (
        <div className="flex shrink-0 items-center gap-2">
          {canResend && (
            <button
              type="button"
              onClick={() => resend.mutate(invite.id)}
              disabled={isBusy}
              title="Send a fresh link — the previous one stops working"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              {resend.isPending ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <RefreshCw size={12} />
              )}
              Resend
            </button>
          )}
          {canRevoke && (
            <button
              type="button"
              onClick={() => revoke.mutate(invite.id)}
              disabled={isBusy}
              title="Withdraw this invitation"
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              {revoke.isPending ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Ban size={12} />
              )}
              Revoke
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function InvitationsList() {
  const [status, setStatus] = useState<InviteStatus | "all">("pending");

  const { data, isLoading, isError } = useInvites(
    status === "all" ? {} : { status },
  );
  const invites = data?.invites ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            <Mail size={20} className="text-slate-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Invitations</h3>
            <p className="text-xs text-slate-500">
              Track and manage sent invitations
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatus(filter.value)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                status === filter.value
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-xs text-slate-400">
          <Loader2 size={14} className="animate-spin" />
          Loading invitations…
        </div>
      ) : isError ? (
        <p className="py-10 text-center text-xs text-red-500">
          Could not load invitations.
        </p>
      ) : invites.length === 0 ? (
        <p className="py-10 text-center text-xs text-slate-400">
          {status === "pending"
            ? "No invitations are waiting to be accepted."
            : `No ${status === "all" ? "" : status} invitations yet.`}
        </p>
      ) : (
        <div className="divide-y divide-slate-100 px-2 py-1">
          {invites.map((invite) => (
            <InviteRow key={invite.id} invite={invite} />
          ))}
        </div>
      )}
    </div>
  );
}
