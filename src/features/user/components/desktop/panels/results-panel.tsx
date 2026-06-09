"use client";

import { cn } from "@/lib/utils";
import FacilityListItem from "@/components/shared/molecules/facility-list-item";
import { useDrawerData } from "@/features/user/hooks/use-drawer-data";
import { useSearchFilterStore } from "@/store/search-filter-store";
import { Facility } from "@/types";
import { SearchBar } from "@/components/shared/atoms/search-bar";
import {
  LoadingView,
  LoadMoreTrigger,
  NoFacilitiesView,
} from "../../molecules/result-drawer-parts";
import FacilityListItemErrorCard from "../../facility-list-item-error-card";
import { ArrowUpDown } from "lucide-react";

interface ResultsPanelProps {
  className?: string;
  isGettingLocation: boolean;
  onViewDetails?: (facility: Facility) => void;
}

export function ResultsPanel({
  className,
  isGettingLocation,
  onViewDetails,
}: ResultsPanelProps) {
  const searchQuery = useSearchFilterStore((state) => state.searchQuery);
  const setSearchQuery = useSearchFilterStore((state) => state.setSearchQuery);

  const {
    nearestFacility,
    sortedFacilities,
    isLoading,
    showEmptyState,
    hasLocation,
    nearestError,
    lgaError,
    refetchNearest,
    refetchLGA,
    loadMoreRef,
    isFetchingNextPage,
    hasNextPage,
    activeFilter,
    setActiveFilter,
  } = useDrawerData(isGettingLocation);

  return (
    <aside
      className={cn(
        "flex h-dvh w-[380px] shrink-0 flex-col border-r border-[#E2E4E9] bg-white xl:w-[420px]",
        className,
      )}
    >
      {/* Header */}
      <div className="shrink-0 border-b border-[#E2E4E9] px-5 py-4">
        <h1 className="text-[17px] font-medium">
          Healthcare Facilities near you
        </h1>
        <p className="mt-0.5 text-[13px] text-[#868C98]">
          Medical Facilities within your LGA
        </p>
      </div>

      {/* Search + Sort */}
      <div className="shrink-0 space-y-2 border-b border-[#E2E4E9] px-5 py-3">
        <div className="relative">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search facilities..."
            className="[&_input]:h-10 [&_input]:px-10 [&_input]:text-[13px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setActiveFilter(
                activeFilter === "Distance" ? "Rating" : "Distance",
              )
            }
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] transition-colors",
              "border border-[#E2E4E9] hover:border-primary/30 hover:text-primary",
            )}
          >
            <ArrowUpDown size={12} />
            Sort: {activeFilter}
          </button>
        </div>
      </div>

      {/* Facility List */}
      <div className="scrollbar-hide flex-1 overflow-y-auto px-5 py-3">
        <div className="space-y-3">
          {/* Loading */}
          {isLoading && <LoadingView />}

          {/* Nearest facility error */}
          {!isLoading && nearestError && (
            <FacilityListItemErrorCard
              message={nearestError.message || "Failed to load"}
              onRetry={refetchNearest}
            />
          )}

          {/* Nearest facility */}
          {!isLoading && !nearestError && nearestFacility && (
            <FacilityListItem
              facility={nearestFacility}
              nearUser={true}
              onViewDetails={onViewDetails}
            />
          )}

          {/* LGA list error */}
          {!isLoading && lgaError && (
            <FacilityListItemErrorCard
              message={lgaError.message || "Failed to load"}
              onRetry={refetchLGA}
            />
          )}

          {/* Sorted facility list */}
          {!isLoading &&
            !lgaError &&
            sortedFacilities.map((facility, i) => (
              <FacilityListItem
                key={`${facility.facility_id}-${i}`}
                facility={facility}
                onViewDetails={onViewDetails}
              />
            ))}

          {/* Infinite scroll */}
          {!isLoading && !lgaError && (
            <LoadMoreTrigger
              innerRef={loadMoreRef}
              isFetching={isFetchingNextPage}
              hasMore={hasNextPage}
              hasItems={sortedFacilities.length > 0}
            />
          )}

          {/* Empty state */}
          {showEmptyState && <NoFacilitiesView hasLocation={hasLocation} />}
        </div>

        {/* Bottom padding */}
        <div className="h-8" />
      </div>
    </aside>
  );
}
