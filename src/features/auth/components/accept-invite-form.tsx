"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Loader2,
  AlertCircle,
  MailX,
  ShieldCheck,
  Mail,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  acceptInviteSchema,
  AcceptInviteFormData,
} from "../schemas/accept-invite.schema";
import { inviteService, type InvitePreview } from "@/services/invite.service";
import { profileService } from "@/services/profile.service";
import { useAuthStore, type User } from "@/features/auth/auth-store";
import { getRoleDashboard } from "@/lib/auth-constants";
import { ApiError, formatDate } from "@/lib/utils";
import { toast } from "sonner";

type LinkState =
  | { status: "loading" }
  | { status: "ready"; invite: InvitePreview }
  /** 410 — the link was real but can no longer be used. */
  | { status: "gone"; message: string }
  /** 404 or anything else — the link never worked. */
  | { status: "invalid"; message: string };

function formatRole(role: string) {
  return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Blocked states ────────────────────────────────────────────────────────────
function LinkProblem({
  tone,
  title,
  message,
}: {
  tone: "gone" | "invalid";
  title: string;
  message: string;
}) {
  const isGone = tone === "gone";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-8 text-center"
    >
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
          isGone ? "bg-amber-50" : "bg-red-50"
        }`}
      >
        <MailX
          className={`h-7 w-7 ${isGone ? "text-amber-500" : "text-red-500"}`}
        />
      </div>
      <h3 className="mt-4 text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{message}</p>
      <p className="mt-4 text-xs text-gray-500">
        {isGone
          ? "Ask a super admin to send you a fresh invitation."
          : "Check that you opened the most recent link from your email in full."}
      </p>
      <Link
        href="/login"
        className="text-primary mt-6 inline-block text-sm font-medium hover:underline"
      >
        Go to sign in
      </Link>
    </motion.div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────
export default function AcceptInviteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const login = useAuthStore((state) => state.login);

  const [linkState, setLinkState] = useState<LinkState>({ status: "loading" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<AcceptInviteFormData>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Validate the link before showing a password field, so nobody types a
  // password into a form that was never going to work.
  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    (async () => {
      try {
        const invite = await inviteService.getInvite(token);
        if (!cancelled) setLinkState({ status: "ready", invite });
      } catch (error) {
        if (cancelled) return;

        const status = error instanceof ApiError ? error.statusCode : undefined;
        const detail =
          error instanceof Error && error.message ? error.message : "";

        // A 410 means the link was real but is spent — that needs different
        // copy from a 404, where the link was never valid at all.
        if (status === 410) {
          setLinkState({
            status: "gone",
            message:
              detail || "This invitation has already been used or has expired.",
          });
        } else {
          setLinkState({
            status: "invalid",
            message: detail || "This invitation link is not valid.",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function onSubmit(data: AcceptInviteFormData) {
    if (!token) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await inviteService.acceptInvite(token, data.password);

      const user: User = {
        user_id: result.user.user_id,
        email: result.user.email,
        first_name: result.user.first_name,
        last_name: result.user.last_name,
        role: result.user.role,
        is_active: result.user.is_active,
        created_at: result.user.created_at,
      };

      // The accept response carries no facility ids, and an admin's dashboard
      // needs them. Fetch the full profile with the brand-new token before
      // seeding the store so the session starts complete.
      let facilityIds: string[] = [];
      let assignedLgas: string[] = result.assigned_lga_ids.map(String);

      try {
        const profile = await profileService.getMe(result.access_token);
        facilityIds = profile.facility_ids ?? [];
        assignedLgas = profile.assigned_lga_ids?.map(String) ?? assignedLgas;
        if (profile.profile_image_url) {
          user.image = profile.profile_image_url;
        }
      } catch {
        // Non-fatal: the account exists and the token is good. The dashboard
        // can still load, and /me is re-read on the next page that needs it.
      }

      login(result.access_token, facilityIds, user, assignedLgas);

      toast.success("Welcome aboard!", {
        description: "Your account is ready — you are now signed in.",
      });

      router.push(getRoleDashboard(user.role));
    } catch (error) {
      const status = error instanceof ApiError ? error.statusCode : undefined;
      const detail =
        error instanceof Error && error.message ? error.message : "";

      if (status === 410) {
        // Single use — someone already redeemed it, or it expired mid-form.
        setLinkState({
          status: "gone",
          message: detail || "This invitation link has already been used.",
        });
        return;
      }
      if (status === 409) {
        setSubmitError(
          "An account with this email already exists. Try signing in instead.",
        );
      } else {
        setSubmitError(
          detail || "Could not create your account. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // Nothing to validate — they reached the page without a token in the URL.
  if (!token) {
    return (
      <LinkProblem
        tone="invalid"
        title="Invitation link not recognised"
        message="This link is missing its invitation token."
      />
    );
  }

  if (linkState.status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-sm text-gray-500">Checking your invitation…</p>
      </div>
    );
  }

  if (linkState.status === "gone") {
    return (
      <LinkProblem
        tone="gone"
        title="This invitation is no longer valid"
        message={linkState.message}
      />
    );
  }

  if (linkState.status === "invalid") {
    return (
      <LinkProblem
        tone="invalid"
        title="Invitation link not recognised"
        message={linkState.message}
      />
    );
  }

  const { invite } = linkState;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Who this invite is for — everything but the password is already set */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <div className="from-primary to-primary/70 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-sm font-bold text-white">
            {`${invite.first_name[0] ?? ""}${invite.last_name[0] ?? ""}`.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {invite.first_name} {invite.last_name}
            </p>
            <p className="flex items-center gap-1.5 truncate text-xs text-slate-500">
              <Mail size={11} />
              {invite.email}
            </p>
          </div>
          <span className="text-primary bg-primary/10 inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase">
            <ShieldCheck size={11} />
            {formatRole(invite.role)}
          </span>
        </div>
        <p className="mt-3 border-t border-slate-200 pt-3 text-xs text-slate-500">
          This link expires {formatDate(invite.expires_at)}.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FieldGroup className="gap-4">
          {/* Password */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel
                  className="text-sm font-medium text-gray-700"
                  htmlFor={field.name}
                >
                  Create Password
                </FieldLabel>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    {...field}
                    id={field.name}
                    type={showPassword ? "text" : "password"}
                    aria-invalid={fieldState.invalid}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    className="h-12 rounded-lg border border-slate-200 bg-gray-100 pr-12 pl-12 text-sm transition-all focus:ring-2 focus:outline-none"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Confirm password */}
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel
                  className="text-sm font-medium text-gray-700"
                  htmlFor={field.name}
                >
                  Confirm Password
                </FieldLabel>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    {...field}
                    id={field.name}
                    type={showConfirm ? "text" : "password"}
                    aria-invalid={fieldState.invalid}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className="h-12 rounded-lg border border-slate-200 bg-gray-100 pr-12 pl-12 text-sm transition-all focus:ring-2 focus:outline-none"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showConfirm ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-red-500"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{submitError}</span>
            </motion.div>
          )}
        </FieldGroup>

        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 h-12 w-full rounded-full text-base font-semibold transition-all hover:scale-[1.02]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating your account…
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </motion.div>
  );
}
