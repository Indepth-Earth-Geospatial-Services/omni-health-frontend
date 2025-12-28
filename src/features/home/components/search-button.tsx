"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchQuery {
    hospitalName: string;
    latitude: string;
    longitude: string;
}

interface SearchButtonProps {
    onSearch?: (query: SearchQuery) => void;
}

export default function SearchButton({
    onSearch = () => { },
}: SearchButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<SearchQuery>({
        hospitalName: "",
        latitude: "",
        longitude: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearch = () => {
        if (formData.hospitalName.trim() || formData.latitude.trim() || formData.longitude.trim()) {
            onSearch(formData);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleReset = () => {
        setFormData({
            hospitalName: "",
            latitude: "",
            longitude: "",
        });
    };

    return (
        <>
            {/* Search Button - Always visible on top right */}
            <div className="fixed right-5 top-5 z-50">
                <Button
                    size="icon"
                    className="rounded-full bg-white text-black hover:bg-white/90 shadow-md"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Search size={24} />}
                </Button>
            </div>

            {/* Overlay when search is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Search Panel */}
            <div
                className={cn(
                    "fixed right-0 top-0 h-dvh w-80 overflow-y-auto overflow-x-hidden bg-white shadow-lg transition-transform duration-300 ease-in-out z-40",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Search Content */}
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="border-b border-gray-100 px-5 py-8">
                        <h1 className="text-xl font-bold text-primary">Search Facilities</h1>
                    </div>

                    {/* Search Inputs */}
                    <div className="flex-1 overflow-y-auto px-5 py-6">
                        <div className="space-y-4">
                            {/* Hospital Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Hospital Name
                                </label>
                                <input
                                    type="text"
                                    name="hospitalName"
                                    placeholder="e.g., Shammah Hospital"
                                    value={formData.hospitalName}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm placeholder-gray-400 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    autoFocus
                                />
                            </div>

                            {/* Latitude */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Latitude
                                </label>
                                <input
                                    type="number"
                                    name="latitude"
                                    placeholder="e.g., 4.8156"
                                    value={formData.latitude}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    step="0.0001"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm placeholder-gray-400 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            {/* Longitude */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Longitude
                                </label>
                                <input
                                    type="number"
                                    name="longitude"
                                    placeholder="e.g., 7.0498"
                                    value={formData.longitude}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    step="0.0001"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm placeholder-gray-400 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            {/* Search Button */}
                            <Button
                                onClick={handleSearch}
                                className="mt-6 w-full bg-primary text-white hover:bg-primary/90"
                            >
                                <Search size={18} />
                                Search on Map
                            </Button>

                            {/* Reset Button */}
                            <Button
                                onClick={handleReset}
                                variant="outline"
                                className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Reset
                            </Button>

                            {/* Quick Search Examples */}
                            <div className="mt-8">
                                <h3 className="mb-3 text-sm font-medium text-gray-700">
                                    Quick Examples
                                </h3>
                                <div className="space-y-2 text-xs">
                                    <div className="rounded-lg bg-gray-50 p-3">
                                        <p className="font-medium text-gray-900">Port Harcourt Center</p>
                                        <p className="text-gray-600">Lat: 4.8156 | Lng: 7.0498</p>
                                        <button
                                            onClick={() => {
                                                setFormData({
                                                    hospitalName: "",
                                                    latitude: "4.8156",
                                                    longitude: "7.0498",
                                                });
                                            }}
                                            className="mt-2 text-primary hover:underline"
                                        >
                                            Use coordinates
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
