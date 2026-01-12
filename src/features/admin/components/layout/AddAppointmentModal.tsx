"use client";

import React, { useState } from 'react';
import { X, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

interface AddAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (appointmentData: AppointmentFormData) => void;
}

interface AppointmentFormData {
    fullName: string;
    mobileNumber: string;
    emailAddress: string;
    reasonForAppointment: string;
    urgencyLevel: string;
    dateForAppointment: string;
    additionalNotes: string;
}

const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<AppointmentFormData>({
        fullName: '',
        mobileNumber: '',
        emailAddress: '',
        reasonForAppointment: '',
        urgencyLevel: '',
        dateForAppointment: '',
        additionalNotes: ''
    });

    const reasons = [
        'General Checkup',
        'Follow-up Visit',
        'Consultation',
        'Emergency',
        'Lab Tests',
        'Vaccination',
        'Surgery',
        'Physical Therapy',
        'Mental Health',
        'Dental Care'
    ];

    const urgencyLevels = [
        'High',
        'Medium',
        'Low'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(formData);
        // Reset form
        setFormData({
            fullName: '',
            mobileNumber: '',
            emailAddress: '',
            reasonForAppointment: '',
            urgencyLevel: '',
            dateForAppointment: '',
            additionalNotes: ''
        });
        onClose();
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
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">New Appointment</h2>
                        <p className="text-sm text-slate-500 mt-1">Provide details about the patient</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-600" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Patient Details Header */}
                    <div>
                        <h3 className="text-base font-semibold text-slate-800">Patient Details</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Provide details about the patient</p>
                    </div>

                    {/* Full Name and Mobile Number */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter full name"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-slate-300 bg-gray-100"
                            />
                        </div>
                        <div>
                            <label htmlFor="mobileNumber" className="block text-sm font-medium text-slate-700 mb-2">
                                Mobile Number
                            </label>
                            <input
                                type="tel"
                                id="mobileNumber"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleInputChange}
                                placeholder="Enter mobile number"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-slate-300 bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* Email Address and Reason */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="emailAddress" className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="emailAddress"
                                name="emailAddress"
                                value={formData.emailAddress}
                                onChange={handleInputChange}
                                placeholder="Enter email address"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-slate-300 bg-gray-100"
                            />
                        </div>
                        <div>
                            <label htmlFor="reasonForAppointment" className="block text-sm font-medium text-slate-700 mb-2">
                                Reason for Appointment
                            </label>
                            <Select
                                value={formData.reasonForAppointment}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, reasonForAppointment: value }))}
                            >
                                <SelectTrigger className='bg-gray-100'>
                                    <SelectValue placeholder="General Checkup" />
                                </SelectTrigger>
                                <SelectContent>
                                    {reasons.map((reason) => (
                                        <SelectItem key={reason} value={reason}>
                                            {reason}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Urgency Level and Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="urgencyLevel" className="block text-sm font-medium text-slate-700 mb-2">
                                Urgency Level
                            </label>
                            <Select
                                value={formData.urgencyLevel}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, urgencyLevel: value }))}
                            >
                                <SelectTrigger className='bg-gray-100'>
                                    <SelectValue placeholder="High" />
                                </SelectTrigger>
                                <SelectContent>
                                    {urgencyLevels.map((level) => (
                                        <SelectItem key={level} value={level}>
                                            {level}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="dateForAppointment" className="block text-sm font-medium text-slate-700 mb-2">
                                Date for Appointment
                            </label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                    type="date"
                                    id="dateForAppointment"
                                    name="dateForAppointment"
                                    value={formData.dateForAppointment}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none hover:border-slate-300 bg-gray-100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                        <label htmlFor="additionalNotes" className="block text-sm font-medium text-slate-700 mb-2">
                            Additional Notes
                        </label>
                        <textarea
                            id="additionalNotes"
                            name="additionalNotes"
                            value={formData.additionalNotes}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Add any additional notes here..."
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none hover:border-slate-300 bg-gray-100"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex justify-end">
                        <Button
                            type="submit"
                            variant="default"
                            size="default"
                            className="px-8"
                        >
                            Submit
                            <ArrowRight size={18} />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAppointmentModal;
