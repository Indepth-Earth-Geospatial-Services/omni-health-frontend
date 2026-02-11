"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { authService } from "@/services/auth.service";
import {
  forgotPasswordSchema,
  otpSchema,
  resetPasswordSchema,
  ForgotPasswordFormData,
  OtpFormData,
  ResetPasswordFormData,
} from "../schemas/forgot-password.schema";

import { useOtpInput } from "../hooks/use-otp-input";
import { useResendCooldown } from "../hooks/use-resend-cooldown";

type Step = "email" | "otp" | "password" | "success";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Custom hooks
  const otpInput = useOtpInput({ length: 6 });
  const cooldown = useResendCooldown({ defaultCooldownTime: 60 });

  // Forms
  const emailForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const passwordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Step 1: Request OTP
  async function onEmailSubmit(data: ForgotPasswordFormData) {
    setIsLoading(true);
    try {
      const response = await authService.requestPasswordReset(data.email);
      setEmail(data.email);
      setCurrentStep("otp");
      cooldown.startCooldown(60);
      toast.success("OTP Sent!", {
        description: response.message || "Check your email for the verification code.",
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to send OTP";
      toast.error("Error", { description: errorMessage });
      emailForm.setError("email", { message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }

  // Step 2: Verify OTP
  async function onOtpSubmit() {
    const otpValue = otpInput.getOtp();
    if (otpValue.length !== 6) {
      otpForm.setError("otp", { message: "Please enter all 6 digits" });
      return;
    }

    setIsLoading(true);
    try {
      setOtp(otpValue);
      setCurrentStep("password");
      toast.success("OTP Verified!", {
        description: "Now set your new password.",
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        error?.message ||
        "Invalid OTP";
      toast.error("Error", { description: errorMessage });
      otpForm.setError("otp", { message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }

  // Step 3: Reset Password
  async function onPasswordSubmit(data: ResetPasswordFormData) {
    setIsLoading(true);
    try {
      await authService.resetPassword(email, otp, data.password);
      setCurrentStep("success");
      toast.success("Password Reset!", {
        description: "Your password has been changed successfully.",
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to reset password";
      toast.error("Error", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }

  // Resend OTP
  async function handleResendOtp() {
    if (cooldown.isOnCooldown) return;

    setIsLoading(true);
    try {
      await authService.requestPasswordReset(email);
      cooldown.startCooldown(60);
      otpInput.reset();
      otpForm.setValue("otp", "");
      toast.success("OTP Resent!", {
        description: "A new verification code has been sent to your email.",
      });
    } catch (error: any) {
      toast.error("Error", {
        description: error?.message || "Failed to resend OTP",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Go back to previous step
  const handleBack = () => {
    if (currentStep === "otp") {
      setCurrentStep("email");
      otpInput.reset();
    } else if (currentStep === "password") {
      setCurrentStep("otp");
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {currentStep === "email" && (
          <EmailStep
            form={emailForm}
            onSubmit={onEmailSubmit}
            isLoading={isLoading}
          />
        )}

        {currentStep === "otp" && (
          <OtpStep
            email={email}
            otpInput={otpInput}
            otpForm={otpForm}
            onSubmit={onOtpSubmit}
            onResend={handleResendOtp}
            onBack={handleBack}
            isLoading={isLoading}
            cooldown={cooldown}
          />
        )}

        {currentStep === "password" && (
          <PasswordStep
            form={passwordForm}
            onSubmit={onPasswordSubmit}
            onBack={handleBack}
            isLoading={isLoading}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            setShowPassword={setShowPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        )}

        {currentStep === "success" && (
          <SuccessStep onContinue={() => router.push("/login")} />
        )}
      </AnimatePresence>

      {/* Back to Login Footer */}
      {currentStep === "email" && (
        <div className="mt-8 flex justify-center">
          <Link
            href="/login"
            className="hover:text-primary flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to log in
          </Link>
        </div>
      )}
    </div>
  );
}

// ============ Step Components ============

interface EmailStepProps {
  form: ReturnType<typeof useForm<ForgotPasswordFormData>>;
  onSubmit: (data: ForgotPasswordFormData) => void;
  isLoading: boolean;
}

function EmailStep({ form, onSubmit, isLoading }: EmailStepProps) {
  return (
    <motion.div
      key="email"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Forgot Password?
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email address and we&apos;ll send you a verification code to reset your password.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="email" className="sr-only">
                  Email Address
                </FieldLabel>
                <div className="relative">
                  <Mail
                    className={`absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 ${
                      fieldState.invalid ? "text-red-400" : "text-gray-400"
                    }`}
                  />
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={`h-12 rounded-lg border bg-gray-50 pl-12 text-sm transition-all focus:ring-2 focus:outline-none ${
                      fieldState.invalid
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                        : "focus:border-primary focus:ring-primary border-slate-200"
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 h-12 w-full rounded-full text-base font-semibold transition-all hover:scale-[1.02]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Verification Code"
          )}
        </Button>
      </form>
    </motion.div>
  );
}

interface OtpStepProps {
  email: string;
  otpInput: ReturnType<typeof useOtpInput>;
  otpForm: ReturnType<typeof useForm<OtpFormData>>;
  onSubmit: () => void;
  onResend: () => void;
  onBack: () => void;
  isLoading: boolean;
  cooldown: ReturnType<typeof useResendCooldown>;
}

function OtpStep({ email, otpInput, otpForm, onSubmit, onResend, onBack, isLoading, cooldown }: OtpStepProps) {
  return (
    <motion.div
      key="otp"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <KeyRound className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Enter Verification Code
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          We sent a 6-digit code to <span className="font-medium text-gray-900">{email}</span>
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
        {/* OTP Input Grid */}
        <div className="flex justify-center gap-2">
          {otpInput.digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { otpInput.inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => otpInput.handleChange(index, e.target.value)}
              onKeyDown={(e) => otpInput.handleKeyDown(index, e)}
              onPaste={index === 0 ? (e) => { e.preventDefault(); otpInput.handlePaste(); } : undefined}
              className={`h-14 w-12 rounded-lg border-2 bg-gray-50 text-center text-xl font-bold transition-all focus:outline-none ${
                otpForm.formState.errors.otp
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-primary"
              }`}
              disabled={isLoading}
            />
          ))}
        </div>

        {otpForm.formState.errors.otp && (
          <p className="text-center text-sm text-red-500">
            {otpForm.formState.errors.otp.message}
          </p>
        )}

        {/* Resend OTP */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Didn&apos;t receive the code?{" "}
            {cooldown.isOnCooldown ? (
              <span className="text-gray-400">Resend in {cooldown.cooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={onResend}
                disabled={isLoading}
                className="font-medium text-primary hover:underline"
              >
                Resend Code
              </button>
            )}
          </p>
        </div>

        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 h-12 w-full rounded-full text-base font-semibold transition-all hover:scale-[1.02]"
          disabled={isLoading || !otpInput.isComplete}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Code"
          )}
        </Button>

        <button
          type="button"
          onClick={onBack}
          className="flex w-full items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Change email address
        </button>
      </form>
    </motion.div>
  );
}

interface PasswordStepProps {
  form: ReturnType<typeof useForm<ResetPasswordFormData>>;
  onSubmit: (data: ResetPasswordFormData) => void;
  onBack: () => void;
  isLoading: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
}

function PasswordStep({
  form,
  onSubmit,
  onBack,
  isLoading,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
}: PasswordStepProps) {
  const password = form.watch("password") || "";

  return (
    <motion.div
      key="password"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Create New Password
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Your new password must be different from previously used passwords.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FieldGroup>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="password">New Password</FieldLabel>
                <div className="relative">
                  <Lock
                    className={`absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 ${
                      fieldState.invalid ? "text-red-400" : "text-gray-400"
                    }`}
                  />
                  <Input
                    {...field}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className={`h-12 rounded-lg border bg-gray-50 pl-12 pr-12 text-sm transition-all focus:ring-2 focus:outline-none ${
                      fieldState.invalid
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                        : "focus:border-primary focus:ring-primary border-slate-200"
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                <div className="relative">
                  <Lock
                    className={`absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 ${
                      fieldState.invalid ? "text-red-400" : "text-gray-400"
                    }`}
                  />
                  <Input
                    {...field}
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className={`h-12 rounded-lg border bg-gray-50 pl-12 pr-12 text-sm transition-all focus:ring-2 focus:outline-none ${
                      fieldState.invalid
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                        : "focus:border-primary focus:ring-primary border-slate-200"
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Password requirements */}
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="mb-2 text-xs font-medium text-gray-600">Password must contain:</p>
          <ul className="space-y-1 text-xs text-gray-500">
            <li className={password.length >= 8 ? "text-green-600" : ""}>- At least 8 characters</li>
            <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>- One uppercase letter</li>
            <li className={/[a-z]/.test(password) ? "text-green-600" : ""}>- One lowercase letter</li>
            <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>- One number</li>
          </ul>
        </div>

        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 h-12 w-full rounded-full text-base font-semibold transition-all hover:scale-[1.02]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>

        <button
          type="button"
          onClick={onBack}
          className="flex w-full items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </form>
    </motion.div>
  );
}

interface SuccessStepProps {
  onContinue: () => void;
}

function SuccessStep({ onContinue }: SuccessStepProps) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Password Reset Successful!</h2>
      <p className="mt-2 text-sm text-gray-600">
        Your password has been changed successfully. You can now log in with your new password.
      </p>

      <Button
        onClick={onContinue}
        className="bg-primary hover:bg-primary/90 mt-8 h-12 w-full rounded-full text-base font-semibold"
      >
        Continue to Login
      </Button>
    </motion.div>
  );
}
