"use client";

import { useState } from "react";
import MapComponent from "@/features/home/components/map";
import FacilityDetailsDrawer from "../components/facility-details-drawer";
import SearchDrawer from "../components/search-drawer";
import SearchResultsDrawer from "../components/search-results-drawer";

interface MapCenter {
  latitude: number;
  longitude: number;
}

function HomePage() {
  const [mapCenter, setMapCenter] = useState<MapCenter | null>(null);
  const [showResults, setShowResults] = useState(false);

  const parseSearchQuery = (query: string) => {
    // Try to parse latitude, longitude from format "4.8156, 7.0498"
    const coordPattern = /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/;
    if (coordPattern.test(query)) {
      const [lat, lng] = query.split(",").map((coord) => parseFloat(coord.trim()));
      return { latitude: lat, longitude: lng };
    }

    // If it's a place/hospital name, you could add API call to geocode
    console.log("Searching for:", query);
    return null;
  };

  const handleSearch = (query: string) => {
    console.log("Search query:", query);

    const parsed = parseSearchQuery(query);
    if (parsed) {
      setMapCenter(parsed);
    }

    // Show results drawer when user searches
    setShowResults(true);
  };

  return (
    <main className="h-full max-h-dvh">
      <section className="fixed inset-0 h-full w-full">
        <MapComponent mapCenter={mapCenter} />
      </section>
      <section>
        <SearchDrawer onSearch={handleSearch} />
        <SearchResultsDrawer isOpen={showResults} onOpenChange={setShowResults} />
        {/* <ResultsDrawer /> */}
        <FacilityDetailsDrawer />
      </section>
    </main>
  );
}

export default HomePage;
