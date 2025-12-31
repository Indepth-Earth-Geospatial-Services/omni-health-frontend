'use client';

import { SlidersHorizontal, MapPin } from 'lucide-react';
import { useState, useCallback, FormEvent, ChangeEvent } from 'react';
import { FacilityCard } from '@/components/ui/FacilityCard';
import { MOCK_FACILITIES } from '@/data/mockFacilities';
import { validateLocation, sanitizeInput } from '@/lib/validation';
import type { HealthcareFacility } from '@/types/facility';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [location, setLocation] = useState('');
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleLocationChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocation(value);
        setLocationError(null);
    }, []);

    const handleSearch = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const sanitized = sanitizeInput(location);

        if (!validateLocation(sanitized)) {
            setLocationError('Please enter a valid location (2-100 characters)');
            return;
        }

        setIsSearching(true);
        // TODO: Implement actual search API call
        setTimeout(() => {
            setIsSearching(false);
        }, 1000);
    }, [location]);

    const handleFacilityClick = useCallback((facility: HealthcareFacility) => {
        // TODO: Navigate to facility detail page or open modal
        console.log('Selected facility:', facility);
    }, []);

    return (
        <aside
            id="sidebar-menu"
            className={`absolute top-0 left-0 h-full w-auto md:w-110 bg-white z-40 transform pt-10 pl-6 md:pl-12 lg:pl-[70px] transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            aria-label="Facility search sidebar"
            aria-hidden={!isOpen}
        >
            {/* Sidebar Header */}
            <div className="p-6 bg-white ">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 text-heading">
                    Find Healthcare Facilities near you
                </h2>
                <p className="text-sm text-gray-700">
                    We need your location to find our nearest facility to you
                </p>
            </div>

            {/* Location Search Form */}
            <form onSubmit={handleSearch} className="px-6 pb-4">
                <label
                    htmlFor="location-input"
                    className="block text-lg font-medium font-sf-pro text-gray-800 mb-2 text-label"
                >
                    Your Location
                </label>
                <div className="relative mb-3">
                    <MapPin
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                        aria-hidden="true"
                    />
                    <input
                        id="location-input"
                        type="text"
                        placeholder="Enter your location"
                        value={location}
                        onChange={handleLocationChange}
                        className={`w-full border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all ${locationError
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-primary'
                            }`}
                        aria-invalid={!!locationError}
                        aria-describedby={locationError ? 'location-error' : undefined}
                        autoComplete="off"
                    />
                </div>
                {locationError && (
                    <p id="location-error" className="text-sm text-red-600 mb-3" role="alert">
                        {locationError}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={isSearching}
                    className="w-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 font-medium py-2.5 rounded-lg transition-colors text-interactive focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    {isSearching ? 'Searching...' : 'Search'}
                </button>
            </form>

            {/* Filter Section */}
            <div className="px-6 py-4 border-t border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm text-gray-600 text-label">
                        Healthcare Facilities in your LGA
                    </h3>
                    <button
                        className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors focus:outline-none"
                        aria-label="Open filter options"
                    >
                        <span className="text-sm">Filter</span>
                        <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                    </button>
                </div>
            </div>

            {/* Facilities List */}
            <div className="px-6 pb-6" role="list" aria-label="Healthcare facilities">
                {MOCK_FACILITIES.length > 0 ? (
                    MOCK_FACILITIES.map((facility) => (
                        <FacilityCard
                            key={facility.id}
                            facility={facility}
                            onClick={handleFacilityClick}
                        />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-secondary">
                            No facilities found. Try a different location.
                        </p>
                    </div>
                )}

                {/* View All Link */}
                {MOCK_FACILITIES.length > 0 && (
                    <button
                        className="text-primary hover:text-primary/80 font-medium text-sm py-2 transition-colors text-interactive focus:outline-none ml-4 mt-2"
                        onClick={() => console.log('View all facilities')}
                    >
                        View All Facilities
                    </button>
                )}
            </div>
        </aside>
    );
}