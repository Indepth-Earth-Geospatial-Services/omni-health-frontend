import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | OmniHealth",
  description: "Reset your account password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-10">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
