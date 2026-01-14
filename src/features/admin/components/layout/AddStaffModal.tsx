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
    selectSex: string;
    rank: string;
    gl: string;
    qualification: string;
    firstAppt: string;
    presentAppt: string;
    dob: string;
    stateOrigin: string;
    yearsInStation: string;
    mobileNumber: string;
    remark: string,
}

//    Name
// Sex	Rank	G/L	Qualification	Date of 1st App	Confirmation	Date of Present Appmt	Date of Birth	LGA of Origin	Years in Station	Phone Number	Remark	Actions

const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<StaffFormData>({
        fullName: '',
        selectSex: '',
        rank: '',
        gl: '',
        qualification: '',
        firstAppt: '',
        presentAppt: '',
        dob: '',
        stateOrigin: '',
        yearsInStation: '',
        mobileNumber: '',
        remark: '',
    });


    const selectSex = [
        'M',
        'F'
    ]

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
            selectSex: '',
            rank: '',
            gl: '',
            qualification: '',
            firstAppt: '',
            presentAppt: '',
            dob: '',
            stateOrigin: '',
            yearsInStation: '',
            mobileNumber: '',
            remark: '',
        });
        onClose();
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4">
                {/* Header */}
                <div className="bg-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
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

                    {/* Sex  */}
                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <label htmlFor="sex" className="block text-sm font-medium text-slate-700 mb-2">
                                Sex
                            </label>
                            <Select
                                value={formData.selectSex}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, selectSex: value }))}
                            >
                                <SelectTrigger className="bg-gray-100">
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectSex.map((sex) => (
                                        <SelectItem key={sex} value={sex}>
                                            {sex}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label htmlFor="rank" className="block text-sm font-medium text-slate-700 mb-2">
                                Rank
                            </label>
                            <input
                                type="text"
                                id="rank"
                                name="rank"
                                value={formData.rank}
                                onChange={handleInputChange}
                                placeholder="Enter Rank"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* Email Address and Address */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="gl" className="block text-sm font-medium text-slate-700 mb-2">
                                Enter Grade Level
                            </label>
                            <input
                                type="text"
                                id="gl"
                                name="gl"
                                value={formData.gl}
                                onChange={handleInputChange}
                                placeholder="Enter Grade Level"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="qualification" className="block text-sm font-medium text-slate-700 mb-2">
                                Qualification
                            </label>
                            <input
                                type="text"
                                id="qualification"
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleInputChange}
                                placeholder="Enter Qualification"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* Phone Number and Date */}
                    <div className="grid grid-cols-2 gap-4 ">
                        <div>
                            <label htmlFor="mobileNumber" className="block text-sm font-medium text-slate-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="mobileNumber"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleInputChange}
                                placeholder="Enter phone number"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-100"
                            />
                        </div>
                        <div>
                            <label htmlFor="firstAppt" className="block text-sm font-medium text-slate-700 mb-2">
                                Date for First Appointment
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="firstAppt"
                                    name="firstAppt"
                                    value={formData.firstAppt}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none bg-gray-100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Present Appointment and Date of Birth */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="presentAppt" className="block text-sm font-medium text-slate-700 mb-2">
                                Date of Present Appointment
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="presentAppt"
                                    name="presentAppt"
                                    value={formData.presentAppt}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none bg-gray-100"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="dob" className="block text-sm font-medium text-slate-700 mb-2">
                                Date of Birth
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="dob"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none bg-gray-100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* State of Origin and Years in Station */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="stateOrigin" className="block text-sm font-medium text-slate-700 mb-2">
                                State/LGA of Origin
                            </label>
                            <input
                                type="text"
                                id="stateOrigin"
                                name="stateOrigin"
                                value={formData.stateOrigin}
                                onChange={handleInputChange}
                                placeholder="Enter State/LGA of Origin"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-100"
                            />
                        </div>
                        <div>
                            <label htmlFor="yearsInStation" className="block text-sm font-medium text-slate-700 mb-2">
                                Years in Present Station
                            </label>
                            <input
                                type="number"
                                id="yearsInStation"
                                name="yearsInStation"
                                value={formData.yearsInStation}
                                onChange={handleInputChange}
                                placeholder="Enter years"
                                required
                                min="0"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* Remark */}
                    <div>
                        <label htmlFor="remark" className="block text-sm font-medium text-slate-700 mb-2">
                            Remark
                        </label>
                        <textarea
                            id="remark"
                            name="remark"
                            value={formData.remark}
                            onChange={(e) => setFormData(prev => ({ ...prev, remark: e.target.value }))}
                            placeholder="Enter any remarks (optional)"
                            rows={3}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-100 resize-none"
                        />
                    </div>

                    {/* Submit Button */}

                    <div className="pt-4 flex justify-end">
                        <Button
                            type="submit"
                            variant="default"
                            size="xl"
                            className="text-lg"
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
