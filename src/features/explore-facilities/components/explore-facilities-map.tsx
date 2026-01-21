"use client";

import { useAllFacilities } from "../hooks/useAllFacilities";
import { Skeleton } from "@/components/ui/skeleton";
import ExploreMap from "./explore-map";
import FilterBar from "./filter-bar";
import { useState } from "react";

function ExploreFacilitiesMap() {
  const [selectedLga, setSelectedLga] = useState<string | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const {
    facilities,
    isLoading,
    lgaCounts,
    categoryCounts,
    totalLgaCount,
    totalCategoryCount,
  } = useAllFacilities({
    selectedLga,
    selectedCategory,
  });

  if (isLoading) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <div className="relative w-full h-full">
      <FilterBar
        lgaCounts={lgaCounts}
        categoryCounts={categoryCounts}
        totalLgaCount={totalLgaCount}
        totalCategoryCount={totalCategoryCount}
        onLgaChange={setSelectedLga}
        onCategoryChange={setSelectedCategory}
      />
      <ExploreMap allFacilities={facilities} />
    </div>
  );
}

export default ExploreFacilitiesMap;
