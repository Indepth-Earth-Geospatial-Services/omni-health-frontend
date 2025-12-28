"use client";

import { useState } from "react";
import { MapPin, Clock, MapIcon } from "lucide-react";
import Link from "next/link";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import Image from "next/image";
import SearchHeader from "./search-header";

interface SearchResultsDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    results?: FacilityResult[];
}

interface FacilityResult {
    id: string;
    name: string;
    address: string;
    type: string;
    localGovernment: string;
    distance: string;
    openingTime: string;
    closingTime: string;
    image: string;
    rating?: number;
}

const FACILITY_TYPES = [
    { id: "all", label: "All types" },
    { id: "hp", label: "Health Post (HP)" },
    { id: "hc", label: "Health Clinic (HC)" },
    { id: "mphc", label: "Model Primary Health Center (MPHC)" },
];

const MOCK_RESULTS: FacilityResult[] = [
    {
        id: "1",
        name: "Shammah Christian Hospital",
        address: "78 Queens Drive, Yaba",
        type: "Health Post",
        localGovernment: "Palga",
        distance: " 0.8 km",
        openingTime: "7:00 AM",
        closingTime: "6:00 PM",
        image: "/img/facilities/shammah.jpg",
        rating: 4.9,
    },

    {
        id: "2",
        name: "Port Harcourt Medical Center",
        address: "123 Hospital Road, Port Harcourt",
        type: "Model Primary Health Center",
        localGovernment: "Port Harcourt City",
        distance: " 1.2 km",
        openingTime: "8:00 AM",
        closingTime: "8:00 PM",
        image: "https://images.unsplash.com/photo-1576091160550-112173f7f869",
        rating: 4.7,
    },
    {
        id: "3",
        name: "Central Health Post",
        address: "456 Health Lane, Port Harcourt",
        type: "Health Post",
        localGovernment: "Obio-Akpor",
        distance: " 2.1 km",
        openingTime: "6:00 AM",
        closingTime: "10:00 PM",
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2651601",
        rating: 4.5,
    },
    {
        id: "4",
        name: "Elite Diagnostic Center",
        address: "789 Wellness Ave, Port Harcourt",
        type: "Health Clinic",
        localGovernment: "Rivers State",
        distance: " 1.5 km",
        openingTime: "7:30 AM",
        closingTime: "7:00 PM",
        image: "https://images.unsplash.com/photo-1631217314831-c6227db76b6e",
        rating: 4.8,
    },
    {
        id: "5",
        name: "Community Health Center",
        address: "321 Care Street, Port Harcourt",
        type: "Model Primary Health Center",
        localGovernment: "Aba",
        distance: " 2.5 km",
        openingTime: "7:00 AM",
        closingTime: "5:00 PM",
        image: "https://images.unsplash.com/photo-1612349317150-e3c3d66e6317",
        rating: 4.3,
    },
];

export default function SearchResultsDrawer({
    isOpen,
    onOpenChange,
    results = MOCK_RESULTS,
}: SearchResultsDrawerProps) {
    const [snap, setSnap] = useState<string | number | null>(0.7);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTab, setSelectedTab] = useState<"distance" | "rating">("distance");

    // Sort results based on selected tab
    const sortedResults = [...results].sort((a, b) => {
        if (selectedTab === "distance") {
            const distA = parseFloat(a.distance);
            const distB = parseFloat(b.distance);
            return distA - distB;
        } else {
            return (b.rating || 0) - (a.rating || 0);
        }
    });

    return (
        <Drawer
            open={isOpen}
            onOpenChange={onOpenChange}
            snapPoints={[0.7, 0.9, 1]}
            activeSnapPoint={snap}
            setActiveSnapPoint={setSnap}
        >
            <DrawerContent className="flex h-full">
                <div className="flex h-full flex-1 flex-col">
                    {/* Header */}
                    <div className="px-5 py-5">
                        <SearchHeader
                            title="Medical Facilities"
                            showFilters={showFilters}
                            onToggleFilters={setShowFilters}
                            selectedFilter="all"
                            onSelectFilter={() => { }}
                            facilityTypes={FACILITY_TYPES}
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 px-5 py-4 ">
                        <button
                            onClick={() => setSelectedTab("distance")}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all",
                                selectedTab === "distance"
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 border border-gray-900 text-gray-700 hover:bg-gray-200"
                            )}
                        >
                            <MapPin size={18} />
                            Distance
                        </button>
                        <button
                            onClick={() => setSelectedTab("rating")}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all",
                                selectedTab === "rating"
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-900"
                            )}
                        >
                            <MapIcon size={18} />
                            Ratings
                        </button>
                    </div>

                    {/* Heading */}
                    <div className="px-5 py-4">
                        <h2 className="text-base font-semibold text-gray-500">
                            Medical Facilities Within your LGA
                        </h2>
                    </div>

                    {/* Results List - Scrollable Only */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="space-y-3 px-5 py-4">
                            {sortedResults.map((facility) => (
                                <button
                                    key={facility.id}
                                    className="w-full rounded-lg border overflow-hidden hover:border-primary bg-white border-gray-200"
                                >
                                    <div className="flex gap-3 p-3">
                                        {/* Left Column - Image */}
                                        <div className="shrink-0">
                                            <div className="relative w-30 h-28 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                                                <Image
                                                    src={facility.image}
                                                    alt={facility.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>

                                        {/* Right Column - Info */}
                                        <div className="flex-1 text-left">
                                            {/* Name */}
                                            <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                                {facility.name}
                                            </h3>

                                            {/* Address */}
                                            <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                                                {facility.address}
                                            </p>

                                            {/* Type */}
                                            <p className="text-xs text-primary mb-1.5">
                                                <span className="font-medium">{facility.type}</span>
                                            </p>

                                            {/* Distance and Time Row */}
                                            <div className="flex items-center  gap-3 text-xs text-gray-600 mb-1 border-b border-gray-200 pb-2">
                                                {/* Local Government */}
                                                <p className="text-xs text-gray-500">
                                                    {facility.localGovernment}
                                                </p>
                                                <div className="">
                                                    Distance:
                                                    <span>{facility.distance}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <div className="flex gap-1 items-center">
                                                    <Clock size={14} />
                                                    <span>{facility.openingTime} - {facility.closingTime}</span>
                                                </div>
                                                <Link href="/" className="text-primary font-medium hover:underline">View Details</Link>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
