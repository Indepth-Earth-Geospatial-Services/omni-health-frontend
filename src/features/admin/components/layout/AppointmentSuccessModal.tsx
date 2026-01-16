"use client";

import React from 'react';
import { X, Copy, Check } from 'lucide-react';

interface AppointmentSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId?: string;
    patientName?: string;
}

const AppointmentSuccessModal: React.FC<AppointmentSuccessModalProps> = ({
    isOpen,
    onClose,
    bookingId = 'REQ-MJKATY9O',
    patientName = 'Shammah Christian Center'
}) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(bookingId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-6 p-10">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
                >
                    <X size={20} className="text-slate-600" />
                </button>

                {/* Content */}
                <div className="p-8 text-center">
                    {/* Success Icon - Animated Circle with Checkmark */}
                    <div className="mb-6 flex justify-center">
                        <div className="relative">
                            {/* Outer Circle - Light Background */}
                            <div className="w-24 h-24 rounded-full bg-teal-50 flex items-center justify-center">
                                {/* Inner Circle - Primary Color */}
                                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                                    {/* Checkmark Circle */}
                                    <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center">
                                        <Check size={32} className="text-primary stroke-3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">
                        Request Submitted!
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-slate-500 mb-8">
                        Your specialist appointment request<br />
                        has been sent to <span className="font-medium text-slate-700"> <br />{patientName}</span>
                    </p>

                    {/* Booking ID Card */}
                    <div className="bg-gray-100 rounded-2xl p-5 mb-3">
                        <p className="text-xs text-slate-500 mb-2 text-left">Booking ID</p>
                        <div className="flex items-center gap-3">
                            <p className="text-lg font-bold text-gray-700 tracking-wide">
                                {bookingId}
                            </p>
                            <button
                                onClick={handleCopy}
                                className="p-2 hover:bg-white rounded-lg transition-colors"
                                title="Copy Booking ID"
                            >
                                {copied ? (
                                    <Check size={18} className="text-primary" />
                                ) : (
                                    <Copy size={18} className="text-slate-400" />
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-slate-400 mt-3 text-left">
                            Expected response within 24-48 hours
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentSuccessModal;
