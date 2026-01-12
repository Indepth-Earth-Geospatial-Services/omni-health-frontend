"use client";

import React, { useState } from 'react';
import { ArrowRight, X, } from 'lucide-react';
import { Button } from '../ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

interface AddStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (staffData: StaffFormData) => void;
}

interface StaffFormData {
    fullName: string;
    staffId: string;
    mobileNumber: string;
    emailAddress: string;
    address: string;
    designation: string;
    dateOfAppointment: string;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<StaffFormData>({
        fullName: '',
        staffId: '',
        mobileNumber: '',
        emailAddress: '',
        address: '',
        designation: '',
        dateOfAppointment: ''
    });

    const designations = [
        'Doctor',
        'Nurse',
        'Lab Technician',
        'Pharmacist',
        'Radiologist',
        'Surgeon',
        'Cardiologist',
        'Pediatrician',
        'Neurologist',
        'Anesthesiologist',
        'Psychiatrist',
        'Dentist'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(formData);
        // Reset form
        setFormData({
            fullName: '',
            staffId: '',
            mobileNumber: '',
            emailAddress: '',
            address: '',
            designation: '',
            dateOfAppointment: ''
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
                <div className="sticky top-0 bg-white  px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">New Staff</h2>
                        <p className="text-sm text-slate-500 mt-1">Provide details about the staff</p>
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
                    {/* Full Name */}
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
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-100"
                        />
                    </div>

                    {/* Staff ID and Mobile Number */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="staffId" className="block text-sm font-medium text-slate-700 mb-2">
                                Staff ID
                            </label>
                            <input
                                type="text"
                                id="staffId"
                                name="staffId"
                                value={formData.staffId}
                                onChange={handleInputChange}
                                placeholder="Enter Staff ID"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-100"
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
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* Email Address and Address */}
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
                                placeholder="Enter email"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-100"
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
                                Address
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="General Checkup"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* Designation and Date */}
                    <div className="grid grid-cols-2 gap-4 ">
                        <div>
                            <label htmlFor="designation" className="block text-sm font-medium text-slate-700 mb-2">
                                Designation
                            </label>
                            <Select
                                value={formData.designation}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, designation: value }))}
                            >
                                <SelectTrigger className="bg-gray-100">
                                    <SelectValue placeholder="Select Designation" />
                                </SelectTrigger>
                                <SelectContent>
                                    {designations.map((designation) => (
                                        <SelectItem key={designation} value={designation}>
                                            {designation}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="dateOfAppointment" className="block text-sm font-medium text-slate-700 mb-2">
                                Date for Appointment
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="dateOfAppointment"
                                    name="dateOfAppointment"
                                    value={formData.dateOfAppointment}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none bg-gray-100"
                                />
                            </div>
                        </div>
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

export default AddStaffModal;
