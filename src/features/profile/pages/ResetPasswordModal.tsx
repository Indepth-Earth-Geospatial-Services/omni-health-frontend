"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Send,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";
import { authService } from "@/services/auth.service";
import { useOtpInput } from "@/features/auth/hooks/use-otp-input";
import { useResendCooldown } from "@/features/auth/hooks/use-resend-cooldown";
import { OtpInputField } from "@/features/auth/components/OtpInputField";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

type Step = "request" | "otp" | "password" | "success";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function maskEmail(email: string): string {
  return email.replace(/(.{2})(.*)(@.*)/, "$1***$3");
}

function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password))
    return "Must contain at least one uppercase letter";
  if (!/[0-9]/.test(password)) return "Must contain at least one number";
  return null;
}

// ─── Step Indicator ──────────────────────────────────────────────────────────

const STEPS: { key: Step; label: string }[] = [
  { key: "request", label: "Request" },
  { key: "otp", label: "Verify" },
  { key: "password", label: "Reset" },
];

function StepIndicator({ current }: { current: Step }) {
  const index = STEPS.findIndex((s) => s.key === current);
  if (current === "success") return null;

  return (
    <div className="flex items-center justify-center gap-2 px-6 py-4">
      {STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                i < index
                  ? "bg-green-500 text-white"
                  : i === index
                    ? "bg-primary shadow-primary/30 text-white shadow-md"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {i < index ? <CheckCircle2 size={14} /> : i + 1}
            </div>
            <span
              className={`text-[10px] font-medium ${
                i === index
                  ? "text-primary"
                  : i < index
                    ? "text-green-500"
                    : "text-slate-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`mb-4 h-0.5 w-8 rounded-full transition-all duration-500 ${
                i < index ? "bg-green-400" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1: Request OTP ─────────────────────────────────────────────────────

interface RequestStepProps {
  email: string;
  isLoading: boolean;
  onSend: () => void;
}

function RequestStep({ email, isLoading, onSend }: RequestStepProps) {
  return (
    <motion.div
      key="request"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 px-6 pb-6"
    >
      {/* Icon */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-2xl">
          <Lock size={32} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
          <p className="mt-1 text-sm text-slate-500">
            We'll send a verification code to your email to confirm it's you.
          </p>
        </div>
      </div>

      {/* Email display */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
        <div className="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
          <Mail size={16} className="text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-500">Verification will be sent to</p>
          <p className="truncate text-sm font-semibold text-slate-800">
            {email}
          </p>
        </div>
      </div>

      <Button
        onClick={onSend}
        disabled={isLoading}
        className="bg-primary hover:bg-primary/90 h-11 w-full rounded-xl font-semibold"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="mr-2 animate-spin" />
            Sending OTP...
          </>
        ) : (
          <>
            <Send size={16} className="mr-2" />
            Send OTP Code
          </>
        )}
      </Button>
    </motion.div>
  );
}

// ─── Step 2: Enter OTP ───────────────────────────────────────────────────────

interface OtpStepProps {
  email: string;
  otpInput: ReturnType<typeof useOtpInput>;
  cooldown: ReturnType<typeof useResendCooldown>;
  error: string | null;
  isLoading: boolean;
  isResending: boolean;
  onVerify: () => void;
  onResend: () => void;
  onOtpChange: (index: number, value: string) => void;
}

function OtpStep({
  email,
  otpInput,
  cooldown,
  error,
  isLoading,
  isResending,
  onVerify,
  onResend,
  onOtpChange,
}: OtpStepProps) {
  return (
    <motion.div
      key="otp"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      className="space-y-5 px-6 pb-6"
    >
      {/* Icon + heading */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
          <ShieldCheck size={28} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Enter OTP Code</h3>
          <p className="mt-1 text-sm text-slate-500">
            6-digit code sent to{" "}
            <span className="font-medium text-slate-700">
              {maskEmail(email)}
            </span>
          </p>
        </div>
      </div>

      {/* OTP input */}
      <OtpInputField
        digits={otpInput.digits}
        inputRefs={otpInput.inputRefs}
        onChange={onOtpChange}
        onKeyDown={otpInput.handleKeyDown}
        onPaste={otpInput.handlePaste}
        disabled={isLoading}
        error={!!error}
      />

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-center gap-2 text-sm text-red-500"
          >
            <AlertCircle size={14} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verify button */}
      <Button
        onClick={onVerify}
        disabled={isLoading || !otpInput.isComplete}
        className="bg-primary hover:bg-primary/90 h-11 w-full rounded-xl font-semibold"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="mr-2 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify & Continue"
        )}
      </Button>

      {/* Resend */}
      <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">Didn't receive the code?</p>
          {cooldown.isOnCooldown ? (
            <span className="text-xs font-medium text-slate-400">
              Resend in {cooldown.cooldown}s
            </span>
          ) : (
            <button
              onClick={onResend}
              disabled={isResending}
              className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {isResending ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Send size={12} />
              )}
              Resend
            </button>
          )}
        </div>
        {cooldown.isOnCooldown && (
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="bg-primary h-full rounded-full"
              initial={{ width: "100%" }}
              animate={{ width: `${(cooldown.cooldown / 60) * 100}%` }}
              transition={{ duration: 0.5, ease: "linear" }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Step 3: New Password ────────────────────────────────────────────────────

interface PasswordStepProps {
  newPassword: string;
  confirmPassword: string;
  showNew: boolean;
  showConfirm: boolean;
  error: string | null;
  isLoading: boolean;
  onNewPasswordChange: (v: string) => void;
  onConfirmPasswordChange: (v: string) => void;
  onToggleNew: () => void;
  onToggleConfirm: () => void;
  onSubmit: () => void;
}

function PasswordStep({
  newPassword,
  confirmPassword,
  showNew,
  showConfirm,
  error,
  isLoading,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onToggleNew,
  onToggleConfirm,
  onSubmit,
}: PasswordStepProps) {
  const strength = getPasswordStrength(newPassword);

  return (
    <motion.div
      key="password"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      className="space-y-5 px-6 pb-6"
    >
      {/* Icon + heading */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
          <KeyRound size={28} className="text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Set New Password</h3>
          <p className="mt-1 text-sm text-slate-500">
            Choose a strong password to secure your account.
          </p>
        </div>
      </div>

      {/* New Password */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
          New Password
        </label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => onNewPasswordChange(e.target.value)}
            placeholder="Enter new password"
            className="focus:border-primary focus:ring-primary/20 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-4 text-sm text-slate-800 transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:outline-none"
          />
          <button
            type="button"
            onClick={onToggleNew}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
          >
            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Strength meter */}
        {newPassword.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-1.5 pt-1"
          >
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    strength.score >= level
                      ? level <= 1
                        ? "bg-red-400"
                        : level <= 2
                          ? "bg-orange-400"
                          : level <= 3
                            ? "bg-yellow-400"
                            : "bg-green-500"
                      : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
            <p className={`text-xs font-medium ${strength.color}`}>
              {strength.label}
            </p>
          </motion.div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            placeholder="Confirm new password"
            className={`h-11 w-full rounded-xl border bg-slate-50 pr-10 pl-4 text-sm text-slate-800 transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:outline-none ${
              confirmPassword && confirmPassword !== newPassword
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : confirmPassword && confirmPassword === newPassword
                  ? "border-green-300 focus:border-green-400 focus:ring-green-100"
                  : "focus:border-primary focus:ring-primary/20 border-slate-200"
            }`}
          />
          <button
            type="button"
            onClick={onToggleConfirm}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          {confirmPassword && confirmPassword === newPassword && (
            <CheckCircle2
              size={14}
              className="absolute top-1/2 right-9 -translate-y-1/2 text-green-500"
            />
          )}
        </div>
      </div>

      {/* Requirements */}
      <div className="space-y-1.5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
        <p className="text-xs font-semibold text-slate-500">Requirements</p>
        {[
          { label: "At least 8 characters", met: newPassword.length >= 8 },
          { label: "One uppercase letter", met: /[A-Z]/.test(newPassword) },
          { label: "One number", met: /[0-9]/.test(newPassword) },
        ].map((req) => (
          <div key={req.label} className="flex items-center gap-2">
            <div
              className={`flex h-4 w-4 items-center justify-center rounded-full transition-all ${
                req.met ? "bg-green-500" : "bg-slate-200"
              }`}
            >
              {req.met && <CheckCircle2 size={10} className="text-white" />}
            </div>
            <span
              className={`text-xs transition-colors ${
                req.met ? "font-medium text-green-600" : "text-slate-400"
              }`}
            >
              {req.label}
            </span>
          </div>
        ))}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-600"
          >
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={onSubmit}
        disabled={
          isLoading ||
          !newPassword ||
          !confirmPassword ||
          newPassword !== confirmPassword ||
          !!validatePassword(newPassword)
        }
        className="bg-primary hover:bg-primary/90 h-11 w-full rounded-xl font-semibold"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="mr-2 animate-spin" />
            Resetting Password...
          </>
        ) : (
          <>
            <Lock size={16} className="mr-2" />
            Reset Password
          </>
        )}
      </Button>
    </motion.div>
  );
}

// ─── Success State ───────────────────────────────────────────────────────────

function SuccessStep({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="flex flex-col items-center gap-4 px-6 pt-2 pb-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
      >
        <CheckCircle2 size={40} className="text-green-500" />
      </motion.div>

      <div>
        <h3 className="text-xl font-bold text-slate-900">Password Changed!</h3>
        <p className="mt-2 text-sm text-slate-500">
          Your password has been reset successfully. Your account is now secured
          with the new password.
        </p>
      </div>

      <div className="w-full rounded-xl border border-green-100 bg-green-50 px-4 py-3">
        <p className="text-xs text-green-700">
          For your security, you may want to log out and back in on other
          devices.
        </p>
      </div>

      <Button
        onClick={onClose}
        className="bg-primary hover:bg-primary/90 h-11 w-full rounded-xl font-semibold"
      >
        Done
      </Button>
    </motion.div>
  );
}

// ─── Password Strength Util ──────────────────────────────────────────────────

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const map: Record<number, { label: string; color: string }> = {
    0: { label: "Too weak", color: "text-red-400" },
    1: { label: "Weak", color: "text-red-500" },
    2: { label: "Fair", color: "text-orange-500" },
    3: { label: "Good", color: "text-yellow-600" },
    4: { label: "Strong", color: "text-green-600" },
  };

  return { score, ...map[score] };
}

// ─── Main Modal ──────────────────────────────────────────────────────────────

export default function ResetPasswordModal({
  isOpen,
  onClose,
  userEmail,
}: ResetPasswordModalProps) {
  const [step, setStep] = useState<Step>("request");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const otpInput = useOtpInput({ length: 6 });
  const cooldown = useResendCooldown({ defaultCooldownTime: 60 });

  // Reset modal state when it closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("request");
        setOtp("");
        setOtpError(null);
        setPasswordError(null);
        setNewPassword("");
        setConfirmPassword("");
        setShowNew(false);
        setShowConfirm(false);
        otpInput.reset();
        cooldown.resetCooldown();
      }, 300);
    }
  }, [isOpen]);

  // ── Step 1: Request OTP ──
  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      await authService.requestPasswordReset(userEmail);
      toast.success("OTP sent!", {
        description: `Check your inbox at ${maskEmail(userEmail)}`,
      });
      cooldown.startCooldown(60);
      setStep("otp");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2: Collect OTP locally and advance ──
  // OTP correctness is validated by the backend at /reset-password (Step 3).
  const handleVerifyOtp = useCallback(() => {
    const code = otpInput.getOtp();
    if (code.length !== 6) {
      setOtpError("Please enter all 6 digits");
      return;
    }
    setOtp(code);
    setStep("password");
  }, [otpInput]);

  const handleResendOtp = async () => {
    if (cooldown.isOnCooldown) return;
    setIsResending(true);
    setOtpError(null);
    try {
      await authService.requestPasswordReset(userEmail);
      toast.success("New OTP sent to your email");
      cooldown.startCooldown(60);
      otpInput.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (otpError) setOtpError(null);
    otpInput.handleChange(index, value);
  };

  // ── Step 3: Reset Password ──
  const handleResetPassword = async () => {
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setPasswordError(null);

    try {
      await authService.resetPassword(userEmail, otp, newPassword);
      setStep("success");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to reset password";
      setPasswordError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={step !== "success" ? onClose : undefined}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="from-primary to-primary/80 relative flex items-center justify-between bg-gradient-to-r px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
              <Lock size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Reset Password</h2>
              <p className="text-xs text-white/70">
                {step === "request" && "Verify your identity"}
                {step === "otp" && "Enter verification code"}
                {step === "password" && "Choose a new password"}
                {step === "success" && "Password updated"}
              </p>
            </div>
          </div>
          {step !== "success" && (
            <button
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white disabled:opacity-50"
            >
              <X size={18} />
            </button>
          )}
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 h-16 w-16 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-1/2 h-10 w-10 translate-y-1/2 rounded-full bg-white/10" />
        </div>

        {/* Step Indicator */}
        <StepIndicator current={step} />

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === "request" && (
            <RequestStep
              key="request"
              email={userEmail}
              isLoading={isLoading}
              onSend={handleSendOtp}
            />
          )}

          {step === "otp" && (
            <OtpStep
              key="otp"
              email={userEmail}
              otpInput={otpInput}
              cooldown={cooldown}
              error={otpError}
              isLoading={isLoading}
              isResending={isResending}
              onVerify={handleVerifyOtp}
              onResend={handleResendOtp}
              onOtpChange={handleOtpChange}
            />
          )}

          {step === "password" && (
            <PasswordStep
              key="password"
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              showNew={showNew}
              showConfirm={showConfirm}
              error={passwordError}
              isLoading={isLoading}
              onNewPasswordChange={(v) => {
                setNewPassword(v);
                if (passwordError) setPasswordError(null);
              }}
              onConfirmPasswordChange={(v) => {
                setConfirmPassword(v);
                if (passwordError) setPasswordError(null);
              }}
              onToggleNew={() => setShowNew((p) => !p)}
              onToggleConfirm={() => setShowConfirm((p) => !p)}
              onSubmit={handleResetPassword}
            />
          )}

          {step === "success" && (
            <SuccessStep key="success" onClose={onClose} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
