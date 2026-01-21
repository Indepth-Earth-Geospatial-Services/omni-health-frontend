"use client";

import { useState } from "react";
import { useAllFacilities } from "../hooks/useAllFacilities";
import { ExploreFacilitiesLoader } from "./explore-facilities-loader";
import ExploreMap from "./explore-map";
import FilterBar from "./filter-bar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ExploreFacilitiesError } from "./expore-facilities-error";
import Link from "next/link";

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
  if (isError)
    return (
      <ExploreFacilitiesError
        onFindNearby="/user"
        allFacilitiesLink="/facilities"
        onRetry={refetch}
      />
    );

  return (
    <div className="relative h-full w-full">
      <div className="absolute bottom-10 left-6 z-100">
        <Button
          asChild
          size="icon"
          className="shadow-primary/20 h-12 w-12 rounded-full shadow-xl transition-transform active:scale-95"
        >
          <Link href="/user">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </Button>
      </div>

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
