'use client';

import dynamic from 'next/dynamic';
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { useState } from "react";

// Dynamically import map to avoid SSR issues
const FacilityMap = dynamic(
  () => import('@/components/map/FacilityMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-600">Initializing map...</p>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header isMenuOpen={isSidebarOpen} setIsMenuOpen={setIsSidebarOpen} />

      <div className="h-[calc(100vh-73px)] flex relative">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Map container - adjusts width based on sidebar state */}
        <div
          className={`flex-1 h-full transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-110' : 'ml-0'
            }`}
        >
          <div className="w-full h-full">
            <FacilityMap
              onFacilitySelect={(facility) => {
                console.log('Selected facility:', facility);
                // TODO: Open facility detail modal or navigate to detail page
              }}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
