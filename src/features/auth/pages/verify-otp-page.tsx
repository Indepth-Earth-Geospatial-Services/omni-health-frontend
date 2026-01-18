"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Shield,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Send,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

// Circular Progress Timer Component
function CircularTimer({
  countdown,
  total,
}: {
  countdown: number;
  total: number;
}) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const progress = (countdown / total) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="h-12 w-12 -rotate-90 transform">
        {/* Background circle */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <motion.circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          className="text-primary"
          initial={{ strokeDasharray: circumference, strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 0.5, ease: "linear" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <span className="absolute text-xs font-semibold text-gray-700">
        {countdown}s
      </span>
    </div>
  );
}

// Shake animation variants
const shakeVariants = {
  shake: {
    x: [0, -10, 10, -10, 10, -5, 5, 0],
    transition: { duration: 0.4 },
  },
  idle: {
    x: 0,
  },
};

// Success animation variants
const successVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 15,
    },
  },
};

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldShake, setShouldShake] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    // Clear error when user starts typing
    if (error) setError(null);

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (value && index === 5) {
      const fullOtp = newOtp.join("");
      if (fullOtp.length === 6) {
        handleSubmit(fullOtp);
      }
    }
  };

  // Handle key down for backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handlePaste();
    }
  };

  // Handle paste
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const digits = text.replace(/\D/g, "").slice(0, 6);
      if (digits.length > 0) {
        const newOtp = [...otp];
        for (let i = 0; i < digits.length; i++) {
          newOtp[i] = digits[i];
        }
        setOtp(newOtp);

        // Focus appropriate input
        if (digits.length < 6) {
          inputRefs.current[digits.length]?.focus();
        } else {
          inputRefs.current[5]?.focus();
          handleSubmit(digits);
        }
      }
    } catch {
      // Clipboard access denied
    }
  };

  // Submit OTP
  const handleSubmit = useCallback(
    async (otpValue?: string) => {
      const code = otpValue || otp.join("");

      if (code.length !== 6) {
        setError("Please enter all 6 digits");
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 400);
        return;
      }

      if (!email) {
        setError("Email not found. Please try registering again.");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await authService.verifyOtp({ email, otp: code });

        setIsSuccess(true);
        toast.success("Email verified successfully!", {
          description: "You can now log in to your account.",
        });

        // ✅ ADDED: Small delay to ensure backend syncs
        setTimeout(() => {
          router.push(`/login?verified=true&email=${encodeURIComponent(email)}`);
        }, 2500);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Invalid verification code";
        setError(errorMessage);
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 400);

        // Clear OTP on error
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } finally {
        setIsLoading(false);
      }
    },
    [email, otp, router]
  );

  // Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;

    setIsResending(true);
    setError(null);

    /** Resent countdown with 30 seconds timmer  */
    try {
      const response = await authService.resendOtp(email);
      toast.success("Verification code sent!", {
        description: `Code expires in ${response.expires_in_minutes} minutes`,
      });
      setResendCooldown(30); // 30 second cooldown
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to resend code";
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  // Mask email for display
  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, "$1***$3")
    : "your email";

  return (
    <div className="relative flex min-h-screen">
      {/* Left Side - Decorative */}
      <div className="relative hidden w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-blue-50 lg:block xl:w-3/5">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="bg-primary/10 absolute -left-20 -top-20 h-96 w-96 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-200/20 blur-3xl" />

          {/* Animated circles */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="bg-primary/20 absolute left-1/4 top-1/4 h-32 w-32 rounded-full blur-2xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-1/4 bottom-1/4 h-40 w-40 rounded-full bg-blue-300/30 blur-2xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-12 pl-16 xl:pl-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/" className="group flex items-center gap-2 sm:gap-2.5">
              <div className="flex h-18 items-center gap-4 px-4">
                <Image
                  src="/img/image.png"
                  alt="Healthcare facility background"
                  priority
                  width={60}
                  height={60}
                  quality={75}
                />
                <h1 className="text-primary text-sm font-bold tracking-tight drop-shadow-lg transition-transform group-hover:scale-105 sm:text-base md:text-xl">
                  RSPHCMB
                </h1>
              </div>
            </Link>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-lg"
          >
            <div className="bg-primary/10 mb-6 inline-flex items-center justify-center rounded-2xl p-4">
              <Shield className="text-primary h-12 w-12" />
            </div>
            <h2 className="mb-4 text-4xl font-bold leading-tight text-gray-900 xl:text-5xl">
              Secure Your <span className="text-primary">Account</span>
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              We take your security seriously. Email verification helps protect
              your account and ensures you receive important updates about your
              healthcare journey.
            </p>

            {/* Security Features */}
            <div className="space-y-4">
              {[
                "Protects your personal health data",
                "Ensures secure appointment bookings",
                "Enables password recovery options",
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="text-primary h-5 w-5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="max-w-md rounded-2xl bg-white/60 p-6 backdrop-blur-sm"
          >
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">
                Didn&apos;t receive the code?
              </span>{" "}
              Check your spam folder or click the resend button. The code will
              expire in 10 minutes.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - OTP Form */}
      <div className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-1/2 xl:w-2/5">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 text-center lg:hidden"
          >
            <Link href="/" className="group flex items-center gap-2 sm:gap-2.5">
              <div className="flex h-18 items-center gap-4 px-4">
                <Image
                  src="/img/image.png"
                  alt="Healthcare facility background"
                  priority
                  width={40}
                  height={40}
                  quality={75}
                />
                <h1 className="text-primary text-sm font-bold tracking-tight drop-shadow-lg transition-transform group-hover:scale-105 sm:text-base md:text-xl">
                  RSPHCMB
                </h1>
              </div>
            </Link>
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to registration
            </Link>
          </motion.div>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              /* Success State */
              <motion.div
                key="success"
                initial="initial"
                animate="animate"
                variants={successVariants}
                className="text-center"
              >
                <div className="mb-6 inline-flex items-center justify-center rounded-full bg-green-100 p-6">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  Email Verified!
                </h2>
                <p className="mb-6 text-gray-600">
                  Your account has been verified successfully. Redirecting to
                  login...
                </p>
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Redirecting...</span>
                </div>
              </motion.div>
            ) : (
              /* OTP Form */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Email Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="mb-6 flex justify-center"
                >
                  <div className="bg-primary/10 rounded-2xl p-4">
                    <Mail className="text-primary h-10 w-10" />
                  </div>
                </motion.div>

                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8 text-center"
                >
                  <h2 className="mb-2 text-2xl font-bold text-gray-900">
                    Verify your email
                  </h2>
                  <p className="text-gray-600">
                    We&apos;ve sent a 6-digit code to{" "}
                    <span className="font-medium text-gray-800">{maskedEmail}</span>
                  </p>
                </motion.div>

                {/* OTP Input */}
                <motion.div
                  variants={shakeVariants}
                  animate={shouldShake ? "shake" : "idle"}
                  className="mb-6"
                >
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {otp.map((digit, index) => (
                      <motion.input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={(e) => {
                          e.preventDefault();
                          handlePaste();
                        }}
                        disabled={isLoading}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className={`h-14 w-12 rounded-xl border-2 bg-gray-50 text-center text-2xl font-bold transition-all focus:outline-none focus:ring-2 sm:h-16 sm:w-14 ${error
                          ? "border-red-300 text-red-500 focus:border-red-500 focus:ring-red-200"
                          : digit
                            ? "border-primary text-primary focus:border-primary focus:ring-primary/20"
                            : "border-gray-200 text-gray-900 focus:border-primary focus:ring-primary/20"
                          } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 flex items-center justify-center gap-2 text-sm text-red-500"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Verify Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    onClick={() => handleSubmit()}
                    className="bg-primary hover:bg-primary/90 h-12 w-full rounded-full text-base font-semibold transition-all hover:scale-[1.02]"
                    disabled={isLoading || otp.join("").length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Email"
                    )}
                  </Button>
                </motion.div>

                {/* Resend Code - Modern UI */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-8"
                >
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">
                          Didn&apos;t receive the code?
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {resendCooldown > 0
                            ? "Please wait before requesting a new code"
                            : "Click to send a new verification code"}
                        </p>
                      </div>

                      {resendCooldown > 0 ? (
                        <CircularTimer countdown={resendCooldown} total={30} />
                      ) : (
                        <motion.button
                          onClick={handleResend}
                          disabled={isResending}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${isResending
                            ? "cursor-not-allowed bg-gray-100 text-gray-400"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                            }`}
                        >
                          {isResending ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              Resend
                            </>
                          )}
                        </motion.button>
                      )}
                    </div>

                    {/* Progress bar alternative (shows when countdown is active) */}
                    {resendCooldown > 0 && (
                      <div className="mt-3">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                          <motion.div
                            className="bg-primary h-full rounded-full"
                            initial={{ width: "100%" }}
                            animate={{ width: `${(resendCooldown / 30) * 100}%` }}
                            transition={{ duration: 0.5, ease: "linear" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Help Text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 text-center text-xs text-gray-500"
                >
                  By verifying your email, you confirm that you have access to
                  this email address and agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
