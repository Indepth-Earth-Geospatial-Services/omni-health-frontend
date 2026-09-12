import { Suspense } from "react";
import VerifyOtpPage from "@/features/auth/pages/verify-otp-page";

export const metadata = {
  title: "Verify Email - GeoHealth",
  description: "Verify your email address to complete registration",
};

function VerifyOtpFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
  );
}

export default function VerifyOtp() {
  return (
    <Suspense fallback={<VerifyOtpFallback />}>
      <VerifyOtpPage />
    </Suspense>
  );
}
