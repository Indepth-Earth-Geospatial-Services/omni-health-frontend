"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, X, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { useStaffSchema } from '@/hooks/useAdminStaff';

interface AddStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (staffData: any) => void;
    facilityId: string;
}

// Field metadata for form generation
interface FieldConfig {
    name: string;
    label: string;
    type: 'text' | 'select' | 'date' | 'tel' | 'number' | 'textarea';
    placeholder?: string;
    required?: boolean;
    options?: string[];
    fullWidth?: boolean;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    facilityId
}) => {
    const { data: schema, isLoading: isLoadingSchema } = useStaffSchema(facilityId);

    // Define form fields configuration based on CreateStaffData
    const formFields: FieldConfig[] = [
        {
            name: 'full_name',
            label: 'Full Name',
            type: 'text',
            placeholder: 'Enter full name',
            required: true,
            fullWidth: true
        },
        {
            name: 'gender',
            label: 'Gender',
            type: 'select',
            options: ['M', 'F'],
            required: false
        },
        {
            name: 'rank_cadre',
            label: 'Rank/Cadre',
            type: 'text',
            placeholder: 'Enter rank',
            required: false
        },
        {
            name: 'grade_level',
            label: 'Grade Level',
            type: 'text',
            placeholder: 'Enter grade level',
            required: false
        },
        {
            name: 'qualifications',
            label: 'Qualification',
            type: 'text',
            placeholder: 'e.g., BSc Nursing, MSc Public Health (comma separated)',
            required: false
        },
        {
            name: 'phone_number',
            label: 'Phone Number',
            type: 'tel',
            placeholder: 'Enter phone number',
            required: false
        },
        {
            name: 'date_first_appointment',
            label: 'Date of First Appointment',
            type: 'date',
            required: false
        },
        {
            name: 'presentAppt',
            label: 'Date of Present Appointment',
            type: 'date',
            required: false
        },
        {
            name: 'date_of_birth',
            label: 'Date of Birth',
            type: 'date',
            required: false
        },
        {
            name: 'stateOrigin',
            label: 'State/LGA of Origin',
            type: 'text',
            placeholder: 'Enter state/LGA',
            required: false
        },
        {
            name: 'yearsInStation',
            label: 'Years in Present Station',
            type: 'number',
            placeholder: 'Enter years',
            required: false
        },
        {
            name: 'email',
            label: 'Email Address',
            type: 'text',
            placeholder: 'Enter email',
            required: false
        },
        {
            name: 'remark',
            label: 'Remark',
            type: 'textarea',
            placeholder: 'Enter any remarks (optional)',
            required: false,
            fullWidth: true
        }
    ];

    // Filter fields based on schema if available
    const availableFields = schema
        ? formFields.filter(field => {
            // Always include full_name and remark
            if (field.name === 'full_name' || field.name === 'remark') return true;
            // Check if field exists in schema
            return schema.hasOwnProperty(field.name) ||
                // Allow optional fields that might be processed by backend
                ['presentAppt', 'stateOrigin', 'yearsInStation'].includes(field.name);
        })
        : formFields;

    // Initialize form data directly - no useEffect needed
    const getInitialFormData = () => {
        const initialData: Record<string, any> = {};
        availableFields.forEach(field => {
            initialData[field.name] = '';
        });
        return initialData;
    };

    const [formData, setFormData] = useState<Record<string, any>>(getInitialFormData);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Remove empty fields and transform qualifications
        const cleanedData = Object.entries(formData).reduce((acc, [key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                // Convert qualifications string to object format
                if (key === 'qualifications' && typeof value === 'string' && value.trim()) {
                    // Split by comma and create an object with each qualification as a key
                    const qualArray = value.split(',').map(q => q.trim()).filter(Boolean);
                    acc[key] = qualArray.reduce((obj, qual) => {
                        obj[qual] = {};
                        return obj;
                    }, {} as Record<string, any>);
                } else {
                    acc[key] = value;
                }
            }
            return acc;
        }, {} as Record<string, any>);

        onSubmit?.(cleanedData);

        // Reset form to initial state
        setFormData(getInitialFormData());
        onClose();
    };

    const renderField = (field: FieldConfig) => {
        switch (field.type) {
            case 'select':
                return (
                    <Select
                        value={formData[field.name] || ''}
                        onValueChange={(value) => handleSelectChange(field.name, value)}
                    >
                        <SelectTrigger className="bg-gray-100">
                            <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'textarea':
                return (
                    <textarea
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-100 resize-none"
                    />
                );

            default:
                return (
                    <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        min={field.type === 'number' ? '0' : undefined}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-100"
                    />
                );
        }
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
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-white px-6 py-4 flex items-center justify-between rounded-t-2xl sticky top-0 z-10 border-b">
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

                {/* Loading State */}
                {isLoadingSchema ? (
                    <div className="p-12 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-sm text-slate-500">Loading form...</p>
                        </div>
                    </div>
                ) : (
                    /* Form */
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {availableFields.map((field) => (
                            <div
                                key={field.name}
                                className={field.fullWidth ? 'w-full' : ''}
                            >
                                {field.fullWidth ? (
                                    // Full width fields
                                    <div>
                                        <label
                                            htmlFor={field.name}
                                            className="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            {field.label}
                                            {field.required && <span className="text-red-500 ml-1">*</span>}
                                        </label>
                                        {renderField(field)}
                                    </div>
                                ) : null}
                            </div>
                        ))}

                        {/* Two column layout for non-full-width fields */}
                        <div className="grid grid-cols-2 gap-4">
                            {availableFields
                                .filter(field => !field.fullWidth)
                                .map((field) => (
                                    <div key={field.name}>
                                        <label
                                            htmlFor={field.name}
                                            className="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            {field.label}
                                            {field.required && <span className="text-red-500 ml-1">*</span>}
                                        </label>
                                        {renderField(field)}
                                    </div>
                                ))
                            }
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
                )}
            </div>
        </div>
    );
};

export default AddStaffModal;