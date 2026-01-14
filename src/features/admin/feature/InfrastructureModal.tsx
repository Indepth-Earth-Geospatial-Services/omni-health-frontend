"use client";

import React, { useState } from 'react';
import { ArrowRight, X, } from 'lucide-react';
import { Button } from '../components/ui/button';

interface InfrastructureModalModal {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (equipmentData: InfrastructureFormData) => void;
}

interface InfrastructureFormData {
    name: string;
    quantity: string;

}

const InfrastructureModal: React.FC<InfrastructureModalModal> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<InfrastructureFormData>({
        name: '',
        quantity: '',
    });


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(formData);
        // Reset form
        setFormData({
            name: '',
            quantity: '',
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 "
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white  px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <div>
                        <h1 className='text-3xl text-slate-900 mb-4 mt-2 font-medium'>New Facility</h1>
                        <div>
                            <h2 className="text-xl font-medium text-slate-600">Facility Details</h2>
                            <p className="text-sm text-slate-500 mt-1">Provide details about the facility</p>
                        </div>
                    </div>
                    {/* <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-600" />
                    </button> */}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Full Name */}

                    {/* Designation and Date */}
                    <div className="grid grid-cols-1 gap-4 ">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                                Facility Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter full name"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-100"
                            />
                        </div>
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                                Quantity/Capacity
                            </label>
                            <input
                                type="text"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                placeholder="Enter Quantity"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex justify-end">
                        <Button
                            type="submit"
                            variant="default"
                            size="xl"
                            className="text-lg"
                        >
                            Add Facility
                            <ArrowRight size={18} />
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default InfrastructureModal;
