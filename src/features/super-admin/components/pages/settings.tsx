"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Lock } from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";
import { useAuthStore } from "@/features/auth/auth-store";
import ResetPasswordModal from "@/features/profile/pages/ResetPasswordModal";

export default function Settings() {
  const [isSecurityOpen, setIsSecurityOpen] = useState(true);
  // const [isHelpOpen, setIsHelpOpen] = useState(true);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  const { user } = useAuthStore();

  return (
    <>
      <div className="w-full space-y-6">
        {/* Facilities Section */}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <div className="h-58 max-h-92 overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
            {/* Card Header */}
            <button
              onClick={() => setIsSecurityOpen(!isSecurityOpen)}
              className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  <Lock size={20} className="text-slate-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-slate-900">
                    Security
                  </h3>
                  <p className="text-xs text-slate-500">Protect your account</p>
                </div>
              </div>
              {isSecurityOpen ? (
                <ChevronUp size={20} className="text-slate-400" />
              ) : (
                <ChevronDown size={20} className="text-slate-400" />
              )}
            </button>

            {/* Card Content */}
            {isSecurityOpen && (
              <div className="space-y-2 px-4 pt-2 pb-6">
                {/* Change Password */}
                <div className="py-3">
                  <div className="flex items-center justify-between rounded-md bg-gray-50 px-2.5 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Password
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Reset via email OTP
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-primary text-xs text-white"
                      onClick={() => setIsResetPasswordOpen(true)}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help & Support Card */}
          {/* <div className="h-58 max-h-92 overflow-hidden rounded-2xl border-2 border-slate-200 bg-white"> */}
          {/* Card Header */}
          {/* <button
              onClick={() => setIsHelpOpen(!isHelpOpen)}
              className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  <HelpCircle size={20} className="text-slate-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-slate-900">
                    Help & Support
                  </h3>
                  <p className="text-xs text-slate-500">
                    Get assistance when you need it
                  </p>
                </div>
              </div>
              {isHelpOpen ? (
                <ChevronUp size={20} className="text-slate-400" />
              ) : (
                <ChevronDown size={20} className="text-slate-400" />
              )}
            </button> */}

          {/* Card Content */}
          {/* {isHelpOpen && (
              <div className="px-6 pt-2 pb-6">
                <div className="grid grid-cols-2 gap-3">
                  {/* Documentation */}
          {/* <button className="group flex items-center justify-between rounded-lg border border-slate-200 bg-gray-50 p-4 transition-all hover:border-slate-300 hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <ExternalLink size={16} className="text-slate-600" />
                      <span className="text-sm font-medium text-slate-900">
                        Documentation
                      </span>
                    </div>
                  </button> */}

          {/* Customer Support */}
          {/* <button className="group flex items-center justify-between rounded-lg border border-slate-200 bg-gray-50 p-4 transition-all hover:border-slate-300 hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <ExternalLink size={16} className="text-slate-600" />
                      <span className="text-sm font-medium text-slate-900">
                        Customer Support
                      </span>
                    </div>
                  </button> */}

          {/* FAQ's */}
          {/* <button className="group flex items-center justify-between rounded-lg border border-slate-200 bg-gray-50 p-4 transition-all hover:border-slate-300 hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <ExternalLink size={16} className="text-slate-600" />
                      <span className="text-sm font-medium text-slate-900">
                        FAQ&apos;s
                      </span>
                    </div>
                  </button> */}

          {/* Report amn issue */}
          {/* <button className="group flex items-center justify-between rounded-lg border border-slate-200 bg-gray-50 p-4 transition-all hover:border-slate-300 hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <ExternalLink size={16} className="text-slate-600" />
                      <span className="text-sm font-medium text-slate-900">
                        Report an issue
                      </span>
                    </div>
                  </button> */}
        </div>
      </div>
      {/* )}
          </div> */}
      {/* </div> */}
      {/* </div> */}

      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        userEmail={user?.email ?? ""}
      />
    </>
  );
}
