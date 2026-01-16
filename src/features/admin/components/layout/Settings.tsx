"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Bell, Lock, HelpCircle, ExternalLink } from "lucide-react";
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Notifications Preferences Card */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
                        {/* Card Header */}
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Bell size={20} className="text-slate-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-base font-bold text-slate-900">Notifications Preferences</h3>
                                    <p className="text-xs text-slate-500">Manage how you receive updates</p>
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
                            <div className="px-4 pb-4 pt-2 space-y-4">
                                {/* Email Notifications */}
                                <div className="flex items-center justify-between py-4 bg-gray-50 px-2.5 rounded-md">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Email Notifications</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Receive updates via email</p>
                                    </div>
                                    <Switch
                                        checked={emailNotifications}
                                        onCheckedChange={setEmailNotifications}
                                    />
                                </div>

                                {/* Push Notifications */}
                                <div className="flex items-center justify-between py-4 bg-gray-50 px-2.5 rounded-md">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Push Notifications</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Get instant browser alerts</p>
                                    </div>
                                    <Switch
                                        checked={pushNotifications}
                                        onCheckedChange={setPushNotifications}
                                    />
                                </div>

                                {/* Daily Report Reminder */}
                                <div className="flex items-center justify-between py-4 bg-gray-50 px-2.5 rounded-md">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Daily Report Reminder</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Daily summary notifications</p>
                                    </div>
                                    <Switch
                                        checked={dailyReport}
                                        onCheckedChange={setDailyReport}
                                    />
                                </div>

                                {/* Appointment Alerts */}
                                <div className="flex items-center justify-between py-4 bg-gray-50 px-2.5 rounded-md">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Appointment Alerts</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Alerts for new appointments</p>
                                    </div>
                                    <Switch
                                        checked={appointmentAlerts}
                                        onCheckedChange={setAppointmentAlerts}
                                    />
                                </div>

                                {/* Capacity Alerts */}
                                <div className="flex items-center justify-between py-4 bg-gray-50 px-2.5 rounded-md">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Capacity Alerts</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Alerts when nearing capacity</p>
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
                        <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
                            {/* Card Header */}
                            <button
                                onClick={() => setIsSecurityOpen(!isSecurityOpen)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                        <Lock size={20} className="text-slate-600" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-base font-bold text-slate-900">Security</h3>
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
                                <div className="px-4 pb-6 pt-2 space-y-2">
                                    {/* Two-Factor Authentication */}
                                    <div className="flex items-center justify-between py-4 px-2.5 bg-gray-50 rounded-md">
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">Two-Factor Authentication</p>
                                            <p className="text-xs text-slate-500 mt-0.5">Add extra security layer</p>
                                        </div>
                                        <Switch
                                            checked={twoFactorAuth}
                                            onCheckedChange={setTwoFactorAuth}
                                        />
                                    </div>

                                    {/* Change Password */}
                                    <div className="py-3">
                                        <div className="flex items-center justify-between py-4 px-2.5 bg-gray-50 rounded-md">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">Password</p>
                                                <p className="text-xs text-slate-500 mt-0.5">Last changed 2 months ago</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs bg-primary text-white"
                                            >
                                                Change
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Active Sessions */}
                                    <div className="flex items-center justify-between py-4 px-2.5 bg-gray-50 rounded-md">
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">Active Sessions</p>
                                            <p className="text-xs text-slate-500 mt-0.5">Manage logged-in devices</p>
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
                        <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
                            {/* Card Header */}
                            <button
                                onClick={() => setIsHelpOpen(!isHelpOpen)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                        <HelpCircle size={20} className="text-slate-600" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-base font-bold text-slate-900">Help & Support</h3>
                                        <p className="text-xs text-slate-500">Get assistance when you need it</p>
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
                                <div className="px-6 pb-6 pt-2">
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Documentation */}
                                        <button className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group">
                                            <div className="flex items-center gap-3">
                                                <ExternalLink size={16} className="text-slate-600" />
                                                <span className="text-sm font-medium text-slate-900">Documentation</span>
                                            </div>
                                        </button>

                                        {/* Customer Support */}
                                        <button className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group">
                                            <div className="flex items-center gap-3">
                                                <ExternalLink size={16} className="text-slate-600" />
                                                <span className="text-sm font-medium text-slate-900">Customer Support</span>
                                            </div>
                                        </button>

                                        {/* FAQ's */}
                                        <button className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group">
                                            <div className="flex items-center gap-3">
                                                <ExternalLink size={16} className="text-slate-600" />
                                                <span className="text-sm font-medium text-slate-900">FAQ&apos;s</span>
                                            </div>
                                        </button>

                                        {/* Report amn issue */}
                                        <button className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group">
                                            <div className="flex items-center gap-3">
                                                <ExternalLink size={16} className="text-slate-600" />
                                                <span className="text-sm font-medium text-slate-900">Report amn issue</span>
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