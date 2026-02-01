"use client";

import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Bell,
  Lock,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";

export default function Settings() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(true);
  const [isSecurityOpen, setIsSecurityOpen] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(true);

  // Notification preferences state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [dailyReport, setDailyReport] = useState(true);
  const [appointmentAlerts, setAppointmentAlerts] = useState(true);
  const [capacityAlerts, setCapacityAlerts] = useState(false);

  // Security settings state
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [activeSessions, setActiveSessions] = useState(true);

  return (
    <>
      <div className="w-full">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Notifications Preferences Card */}
          <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
            {/* Card Header */}
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  <Bell size={20} className="text-slate-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-slate-900">
                    Notifications Preferences
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage how you receive updates
                  </p>
                </div>
              </div>
              {isNotificationsOpen ? (
                <ChevronUp size={20} className="text-slate-400" />
              ) : (
                <ChevronDown size={20} className="text-slate-400" />
              )}
            </button>

            {/* Card Content */}
            {isNotificationsOpen && (
              <div className="space-y-4 px-4 pt-2 pb-4">
                {/* Email Notifications */}
                <div className="flex items-center justify-between rounded-md bg-gray-50 px-2.5 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Email Notifications
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between rounded-md bg-gray-50 px-2.5 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Push Notifications
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Get instant browser alerts
                    </p>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>

                {/* Daily Report Reminder */}
                <div className="flex items-center justify-between rounded-md bg-gray-50 px-2.5 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Daily Report Reminder
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Daily summary notifications
                    </p>
                  </div>
                  <Switch
                    checked={dailyReport}
                    onCheckedChange={setDailyReport}
                  />
                </div>

                {/* Appointment Alerts */}
                <div className="flex items-center justify-between rounded-md bg-gray-50 px-2.5 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Appointment Alerts
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Alerts for new appointments
                    </p>
                  </div>
                  <Switch
                    checked={appointmentAlerts}
                    onCheckedChange={setAppointmentAlerts}
                  />
                </div>

                {/* Capacity Alerts */}
                <div className="flex items-center justify-between rounded-md bg-gray-50 px-2.5 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Capacity Alerts
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Alerts when nearing capacity
                    </p>
                  </div>
                  <Switch
                    checked={capacityAlerts}
                    onCheckedChange={setCapacityAlerts}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Security and Help */}
          <div className="space-y-6">
            {/* Security Card */}
            <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
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
                    <p className="text-xs text-slate-500">
                      Protect your account
                    </p>
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
                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between rounded-md bg-gray-50 px-2.5 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Two-Factor Authentication
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Add extra security layer
                      </p>
                    </div>
                    <Switch
                      checked={twoFactorAuth}
                      onCheckedChange={setTwoFactorAuth}
                    />
                  </div>

                  {/* Change Password */}
                  <div className="py-3">
                    <div className="flex items-center justify-between rounded-md bg-gray-50 px-2.5 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Password
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          Last changed 2 months ago
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-primary text-xs text-white"
                      >
                        Change
                      </Button>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="flex items-center justify-between rounded-md bg-gray-50 px-2.5 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Active Sessions
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Manage logged-in devices
                      </p>
                    </div>
                    <Switch
                      checked={activeSessions}
                      onCheckedChange={setActiveSessions}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Help & Support Card */}
            <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
              {/* Card Header */}
              <button
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
              </button>

              {/* Card Content */}
              {isHelpOpen && (
                <div className="px-6 pt-2 pb-6">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Documentation */}
                    <button className="group flex items-center justify-between rounded-lg border border-slate-200 bg-gray-50 p-4 transition-all hover:border-slate-300 hover:shadow-sm">
                      <div className="flex items-center gap-3">
                        <ExternalLink size={16} className="text-slate-600" />
                        <span className="text-sm font-medium text-slate-900">
                          Documentation
                        </span>
                      </div>
                    </button>

                    {/* Customer Support */}
                    <button className="group flex items-center justify-between rounded-lg border border-slate-200 bg-gray-50 p-4 transition-all hover:border-slate-300 hover:shadow-sm">
                      <div className="flex items-center gap-3">
                        <ExternalLink size={16} className="text-slate-600" />
                        <span className="text-sm font-medium text-slate-900">
                          Customer Support
                        </span>
                      </div>
                    </button>

                    {/* FAQ's */}
                    <button className="group flex items-center justify-between rounded-lg border border-slate-200 bg-gray-50 p-4 transition-all hover:border-slate-300 hover:shadow-sm">
                      <div className="flex items-center gap-3">
                        <ExternalLink size={16} className="text-slate-600" />
                        <span className="text-sm font-medium text-slate-900">
                          FAQ&apos;s
                        </span>
                      </div>
                    </button>

                    {/* Report amn issue */}
                    <button className="group flex items-center justify-between rounded-lg border border-slate-200 bg-gray-50 p-4 transition-all hover:border-slate-300 hover:shadow-sm">
                      <div className="flex items-center gap-3">
                        <ExternalLink size={16} className="text-slate-600" />
                        <span className="text-sm font-medium text-slate-900">
                          Report amn issue
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
