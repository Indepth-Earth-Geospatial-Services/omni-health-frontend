"use client";

import { useState } from "react";
import { Search, X, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import SearchHeader from "./search-header";

interface SearchDrawerProps {
    onSearch?: (query: string) => void;
}

interface Facility {
    id: string;
    name: string;
    type: string;
    distance: string;
    rating: number;
    status: string;
    address: string;
}

const FACILITY_TYPES = [
    { id: "all", label: "All types" },
    { id: "hp", label: "Health Post (HP)" },
    { id: "hc", label: "Health Clinic (HC)" },
    { id: "mphc", label: "Model Primary Health Center (MPHC)" },
];

// Mock facility data
const MOCK_FACILITIES: Facility[] = [
    {
        id: "1",
        name: "Shammah Christian Hospital",
        type: "Hospital",
        distance: "0.8 km",
        rating: 4.9,
        status: "Open Now",
        address: "78 Queens Drive, Yaba"
    },
    {
        id: "2",
        name: "Port Harcourt Medical Center",
        type: "Health Clinic (HC)",
        distance: "1.2 km",
        rating: 4.7,
        status: "Open Now",
        address: "Rivers State"
    },
    {
        id: "3",
        name: "Central Health Post",
        type: "Health Post (HP)",
        distance: "2.1 km",
        rating: 4.5,
        status: "Open Now",
        address: "Port Harcourt"
    },
    {
        id: "4",
        name: "Elite Diagnostic Center",
        type: "Health Clinic (HC)",
        distance: "1.5 km",
        rating: 4.8,
        status: "Open Now",
        address: "Rivers State"
    },
    {
        id: "5",
        name: "Community Health Center",
        type: "Model Primary Health Center (MPHC)",
        distance: "2.5 km",
        rating: 4.3,
        status: "Open Now",
        address: "Port Harcourt"
    },
];

export default function SearchDrawer({
    onSearch = () => { },
}: SearchDrawerProps) {
    const [isOpenMobile, setIsOpenMobile] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [snap, setSnap] = useState<string | number | null>(0.4);

    // Filter facilities based on search query
    const filteredFacilities = searchQuery.trim()
        ? MOCK_FACILITIES.filter(
            facility =>
                facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                facility.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                facility.address.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 3)
        : [];

    const handleSearch = () => {
        if (searchQuery.trim()) {
            onSearch(searchQuery);
        }
    };

    const handleSelectFacility = (facility: Facility) => {
        setSearchQuery(facility.name);
        onSearch(facility.name);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleClear = () => {
        setSearchQuery("");
    };

    return (
        <>
            {/* DESKTOP VERSION - Top Search Bar Only */}
            <div className="fixed left-0 right-0 top-5 z-40 hidden px-5 sm:block">
                <div className="mx-auto max-w-2xl">
                    {/* Search Bar */}
                    <div className="rounded-full bg-white">
                        <div className="flex items-center gap-3 px-6 py-3">
                            <MapPin size={20} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Find health care facilities near you"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={handleClear}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE VERSION - Rounded Button at Right */}
            <div className="fixed right-10 top-5 z-40 sm:hidden">
                <Button
                    onClick={() => setIsOpenMobile(!isOpenMobile)}
                    className="rounded-full bg-white text-black hover:bg-white/90 shadow-md"
                    size="icon"
                >
                    {isOpenMobile ? <X size={24} /> : <Search size={24} />}
                </Button>
            </div>

            {/* MOBILE DRAWER - Using Radix UI Drawer */}
            <Drawer
                open={isOpenMobile}
                onOpenChange={setIsOpenMobile}
                snapPoints={[0.4, 0.7, 1]}
                activeSnapPoint={snap}
                setActiveSnapPoint={setSnap}
            >
                <DrawerContent className="flex h-full">
                    <div className="flex h-full flex-1 flex-col sm:hidden">
                        {/* Content */}
                        <div className="space-y-4 px-5 py-6">
                            {/* Title with Filter Button */}
                            <SearchHeader
                                title="Find Health care Facilities Near You"
                                showFilters={showFilters}
                                onToggleFilters={setShowFilters}
                                selectedFilter={selectedFilter}
                                onSelectFilter={setSelectedFilter}
                                facilityTypes={FACILITY_TYPES}
                            />

                            {/* Search Input */}
                            <div className="space-y-2">
                                <div className="rounded-3xl border border-gray-300 bg-white">
                                    <div className="flex items-center gap-3 px-4 py-3">
                                        <MapPin size={20} className="text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Enter your location"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
                                            autoFocus
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={handleClear}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Autocomplete Suggestions */}
                                {filteredFacilities.length > 0 && (
                                    <div className=" bg-white overflow-hidden">
                                        <div className="space-y-0">
                                            {filteredFacilities.map((facility) => (
                                                <button
                                                    key={facility.id}
                                                    onClick={() => handleSelectFacility(facility)}
                                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b last:border-b-0"
                                                >
                                                    {/* Facility Name */}
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <h3 className="text-sm font-semibold text-gray-900 flex-1">
                                                            {facility.name}
                                                        </h3>
                                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                                            {facility.status}
                                                        </span>
                                                    </div>

                                                    {/* Facility Type */}
                                                    <p className="text-xs text-gray-500 mb-2 ">
                                                        {facility.type}
                                                    </p>

                                                    {/* Details Row */}
                                                    <div className="flex items-center justify-between text-xs text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin size={14} className="text-primary" />
                                                            <span>{facility.distance}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                                            <span className="font-medium">{facility.rating}</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Search Button */}
                            <Button
                                onClick={handleSearch}
                                variant="default"
                                size="lg"
                                className="w-full rounded-3xl"
                            >
                                <Search size={18} />
                                Search
                            </Button>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}
