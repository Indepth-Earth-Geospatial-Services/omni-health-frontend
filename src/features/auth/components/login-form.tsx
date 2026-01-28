"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { loginSchema, LoginFormData } from "../schemas/login.schema";
import { authService } from "@/services/auth.service";
import { useAuthStore, getRedirectPath } from "@/store/auth-store";
import { toast } from "sonner";
// import SocialLogin from "./social-login";

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

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [shouldShake, setShouldShake] = useState(false);

  // ✅ Show welcome message for verified users
  useEffect(() => {
    const verified = searchParams.get("verified");
    const email = searchParams.get("email");

    if (verified === "true" && email) {
      toast.success("Email verified!", {
        description: "You can now log in with your credentials.",
      });
    }
  }, [searchParams]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    setLoginError(null);

    try {
      // 1. Login and get token + user info from API
      const response = await authService.login(data.email, data.password);

      // DEBUG: Log API response
      console.log("=== LOGIN DEBUG ===");
      console.log("API Response:", response);
      console.log("Role from API:", response.role);
      console.log("Facility IDs:", response.facility_ids);

      // 2. Parse full_name into first_name and last_name
      const nameParts = response.full_name?.split(" ") || [];
      const firstName = nameParts[0] || null;
      const lastName = nameParts.slice(1).join(" ") || null;

      // 3. Decode JWT for user_id (if needed)
      const tokenPayload = parseJwt(response.access_token);

      // 4. Create user object from API response (NOT from JWT)
      const user = {
        user_id: tokenPayload.user_id || tokenPayload.sub || 0,
        email: response.email || data.email,
        first_name: firstName,
        last_name: lastName,
        role: response.role, // Use role from API response!
        is_active: true,
        created_at: new Date().toISOString(),
      };

      console.log("User object:", user);

      // 5. Store auth data with user info
      login(response.access_token, response.facility_ids || [], user);

      toast.success("Login successful!");

      // 6. Redirect based on role
      const redirectPath = getRedirectPath(response.facility_ids, user.role);
      console.log("Redirect path:", redirectPath);
      console.log("=== END LOGIN DEBUG ===");

      router.push(redirectPath);
    } catch (error: any) {
      // ✅ Better error handling with specific messages
      let errorMessage = "Invalid email or password";

      if (error?.response?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (error?.response?.status === 403) {
        errorMessage = "Please verify your email before logging in";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setLoginError(errorMessage);
      setShouldShake(true);

      // Show toast for specific errors
      if (errorMessage.includes("verify")) {
        toast.error("Email not verified", {
          description: "Please check your email and verify your account.",
        });
      }

      // Reset shake after animation completes
      setTimeout(() => setShouldShake(false), 400);
    } finally {
      setIsLoading(false);
    }
  }

  // ✅ Helper function to decode JWT token
  function parseJwt(token: string) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch {
      return {};
    }
  }

  // Clear login error when user starts typing
  const handleInputChange = (
    originalOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      if (loginError) {
        setLoginError(null);
      }
      originalOnChange(e);
    };
  };

  // Error input styles
  const errorInputClass = loginError
    ? "border-red-500 focus:ring-red-500/30 focus:border-red-500"
    : "border-slate-200 focus:ring-primary focus:border-primary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <motion.div
          variants={shakeVariants}
          animate={shouldShake ? "shake" : "idle"}
        >
          <FieldGroup className="gap-4">
            {/* Email Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel
                    className="text-sm font-medium text-gray-700"
                    htmlFor={field.name}
                  >
                    Email Address
                  </FieldLabel>
                  <div className="relative">
                    <Mail
                      className={`absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 ${
                        loginError ? "text-red-400" : "text-gray-400"
                      }`}
                    />
                    <Input
                      {...field}
                      onChange={handleInputChange(field.onChange)}
                      id={field.name}
                      type="email"
                      aria-invalid={fieldState.invalid || !!loginError}
                      placeholder="you@example.com"
                      className={`h-12 rounded-lg border bg-gray-100 pl-12 text-sm transition-all focus:ring-2 focus:outline-none ${errorInputClass}`}
                      disabled={isLoading}
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel
                      className="text-sm font-medium text-gray-700"
                      htmlFor={field.name}
                    >
                      Password
                    </FieldLabel>
                    <Link
                      href="/forgot-password"
                      className="text-primary text-xs font-medium hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock
                      className={`absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 ${
                        loginError ? "text-red-400" : "text-gray-400"
                      }`}
                    />
                    <Input
                      {...field}
                      onChange={handleInputChange(field.onChange)}
                      id={field.name}
                      type={showPassword ? "text" : "password"}
                      aria-invalid={fieldState.invalid || !!loginError}
                      placeholder="Enter your password"
                      className={`h-12 rounded-lg border bg-gray-100 pr-12 pl-12 text-sm transition-all focus:ring-2 focus:outline-none ${errorInputClass}`}
                      disabled={isLoading}
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

            {/* Login Error Message */}
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-red-500"
              >
                <AlertCircle className="h-4 w-4" />
                <span>{loginError}</span>
              </motion.div>
            )}
          </FieldGroup>
        </motion.div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 h-12 w-full rounded-full text-base font-semibold transition-all hover:scale-[1.02]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-sm text-gray-400">or continue with</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Social Login */}
      {/* <SocialLogin /> */}

      {/* Register Link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary font-semibold hover:underline"
        >
          Create account
        </Link>
      </p>
    </motion.div>
  );
}
