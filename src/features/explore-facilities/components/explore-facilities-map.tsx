"use client";

import { useState } from "react";
import { useAllFacilities } from "../hooks/useAllFacilities";
import { ExploreFacilitiesLoader } from "./explore-facilities-loader";
import ExploreMap from "./explore-map";
import FilterBar from "./filter-bar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ExploreFacilitiesError } from "./expore-facilities-error";

function ExploreFacilitiesMap() {
  const [selectedLga, setSelectedLga] = useState<string | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();

  const {
    isError,
    refetch,
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

  if (isLoading) return <ExploreFacilitiesLoader />;
  if (true)
    return (
      <ExploreFacilitiesError
        onFindNearby="/user"
        allFacilitiesLink="/facilities"
        onRetry={refetch}
      />
    );

  return (
    <div className="relative h-full w-full">
      <Button className="fixed bottom-0 z-100">
        <ArrowLeft />
      </Button>
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
