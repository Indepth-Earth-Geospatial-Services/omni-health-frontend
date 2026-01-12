// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import FacilityListItem from "@/features/user/components/facility-list-item";
// import { useFacilitySearch } from "@/hooks/useFacilitySearch";
// import { cn } from "@/lib/utils";
// import { AnimatePresence, motion } from "framer-motion";
// import { Loader2, Search, X } from "lucide-react";
// import { useEffect, useMemo, useRef } from "react";
// import { useInView } from "react-intersection-observer";

// interface SearchResultsProps {
//   isOpen: boolean;
//   onClose: () => void;
//   searchQuery: string;
//   onSearchChange: (value: string) => void;
//   onViewDetails?: (facilityId: string) => void; // Add this prop
//   className?: string;
// }

// export function SearchResults({
//   isOpen,
//   onClose,
//   searchQuery,
//   onSearchChange,
//   onViewDetails,
//   className,
// }: SearchResultsProps) {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const { ref: loadMoreRef, inView } = useInView();

//   // Fetch search results
//   const {
//     data: searchData,
//     isLoading,
//     isError,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     error,
//   } = useFacilitySearch(searchQuery, {
//     enabled: isOpen && !!searchQuery.trim(),
//   });

//   // Auto-focus input when panel opens
//   useEffect(() => {
//     if (isOpen && inputRef.current) {
//       setTimeout(() => {
//         inputRef.current?.focus();
//       }, 100);
//     }
//   }, [isOpen]);

//   // Load more when scrolled to bottom
//   useEffect(() => {
//     if (inView && hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

//   // Flatten all facilities from all pages
//   const allFacilities = useMemo(() => {
//     if (!searchData?.pages) return [];
//     return searchData.pages.flatMap((page) =>
//       Object.values(page.facilities || []),
//     );
//   }, [searchData]);

//   const facilities = allFacilities;

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.2 }}
//           className={cn("fixed inset-0 z-50 bg-white", className)}
//         >
//           {/* Header with Search Bar */}
//           <div className="border-b border-[#E2E4E9] p-4">
//             <div className="relative">
//               <Input
//                 ref={inputRef}
//                 value={searchQuery}
//                 onChange={(e) => onSearchChange(e.target.value)}
//                 className="h-12 rounded-full border border-[#E2E4E9] bg-white px-12"
//                 placeholder="Search for facilities..."
//                 autoFocus
//               />
//               <div className="absolute top-1/2 left-4 -translate-y-1/2">
//                 <Search color="#868C98" size={22} />
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={onClose}
//                 className="absolute top-1/2 right-4 h-8 w-8 -translate-y-1/2"
//               >
//                 <X size={20} />
//               </Button>
//             </div>

//             {/* Search Status */}
//             <div className="mt-2 px-4">
//               {searchQuery && (
//                 <p className="text-sm text-gray-500">
//                   {isLoading ? (
//                     <span className="flex items-center gap-2">
//                       <Loader2 className="h-3 w-3 animate-spin" />
//                       Searching...
//                     </span>
//                   ) : isError ? (
//                     <span className="text-red-500">
//                       Error searching facilities
//                     </span>
//                   ) : facilities.length > 0 ? (
//                     <span>
//                       {facilities.length} results for "{searchQuery}"
//                     </span>
//                   ) : (
//                     <span>No results for "{searchQuery}"</span>
//                   )}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Search Results Container */}
//           <div className="h-[calc(100vh-120px)] overflow-y-auto p-4">
//             {isLoading && !facilities.length ? (
//               // Initial loading skeleton
//               <div className="space-y-3">
//                 {[...Array(3)].map((_, i) => (
//                   <div key={i} className="animate-pulse">
//                     <div className="h-20 rounded-lg bg-gray-200"></div>
//                   </div>
//                 ))}
//               </div>
//             ) : isError ? (
//               // Error state
//               <div className="flex h-64 flex-col items-center justify-center">
//                 <div className="rounded-full bg-red-100 p-3">
//                   <X className="h-8 w-8 text-red-500" />
//                 </div>
//                 <p className="mt-4 text-gray-600">
//                   Failed to load search results
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   {error?.message || "Please try again"}
//                 </p>
//               </div>
//             ) : facilities.length === 0 && searchQuery ? (
//               // No results
//               <div className="flex h-64 flex-col items-center justify-center">
//                 <div className="rounded-full bg-gray-100 p-3">
//                   <Search className="h-8 w-8 text-gray-400" />
//                 </div>
//                 <p className="mt-4 text-gray-600">No facilities found</p>
//                 <p className="text-sm text-gray-500">
//                   Try different search terms
//                 </p>
//               </div>
//             ) : !searchQuery ? (
//               // Empty search state
//               <div className="flex h-64 flex-col items-center justify-center">
//                 <div className="rounded-full bg-blue-100 p-3">
//                   <Search className="text-primary h-8 w-8" />
//                 </div>
//                 <p className="mt-4 text-gray-600">Start typing to search</p>
//                 <p className="text-sm text-gray-500">
//                   Search by facility name, service, or location
//                 </p>
//               </div>
//             ) : (
//               // Results list
//               <div className="space-y-3">
//                 {facilities.map((facility) => (
//                   <div
//                     key={facility.facility_id}
//                     className="rounded-lg border border-[#E2E4E9] bg-white"
//                   >
//                     <FacilityListItem
//                       facility={facility}
//                       onViewDetails={onViewDetails}
//                     />
//                   </div>
//                 ))}

//                 {/* Load More Trigger */}
//                 {hasNextPage && (
//                   <div
//                     ref={loadMoreRef}
//                     className="flex items-center justify-center py-4"
//                   >
//                     {isFetchingNextPage ? (
//                       <div className="flex items-center gap-2 text-gray-500">
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         Loading more...
//                       </div>
//                     ) : (
//                       <Button
//                         variant="outline"
//                         onClick={() => fetchNextPage()}
//                         className="w-full"
//                       >
//                         Load More
//                       </Button>
//                     )}
//                   </div>
//                 )}

//                 {/* No more results */}
//                 {!hasNextPage && facilities.length > 0 && (
//                   <div className="py-4 text-center text-sm text-gray-500">
//                     No more results
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }
// components/search/SearchResults.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FacilityListItem from "@/features/user/components/facility-list-item";
import { useFacilitySearch } from "@/hooks/useFacilitySearch";
import { cn } from "@/lib/utils";
import { useSearchFilterStore } from "@/store/search-filter-store";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Filter, Loader2, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Badge } from "../ui/badge";

interface SearchResultsProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onViewDetails?: (facilityId: string) => void;
  includeFilter?: boolean;
  className?: string;
}

export function SearchResults({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  onViewDetails,
  includeFilter = false,
  className,
}: SearchResultsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { ref: loadMoreRef, inView } = useInView();

  // Get filter state and actions
  const { selectedFilters, setIsFilterOpen, toggleFilter } =
    useSearchFilterStore();

  // Calculate selected filter count for badge
  const selectedFilterCount = Object.values(selectedFilters).reduce(
    (acc, curr) => acc + curr.length,
    0,
  );

  // Fetch search results with filters
  const {
    data: searchData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useFacilitySearch(searchQuery, selectedFilters, {
    enabled: isOpen && !!searchQuery.trim(),
  });

  // Auto-focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Load more when scrolled to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all facilities from all pages
  const allFacilities = useMemo(() => {
    if (!searchData?.pages) return [];
    return searchData.pages.flatMap((page) =>
      Object.values(page.facilities || []),
    );
  }, [searchData]);

  const facilities = allFacilities;

  // Handle remove filter
  const handleRemoveFilter = (category: string, value: string) => {
    toggleFilter(category, value);
  };

  // Get filter display name
  const getFilterLabel = (category: string, value: string): string => {
    // Map categories to display names
    const categoryMap: Record<string, string> = {
      facilityType: "Facility Type",
      performanceTier: "Performance Tier",
      serviceAvailability: "Service",
    };

    // Map values to display names (you might want to make this more comprehensive)
    const valueMap: Record<string, string> = {
      hospital: "Hospital",
      clinic: "Clinic",
      pharmacy: "Pharmacy",
      teaching_hospital: "Teaching Hospital",
      healthcare_center: "Healthcare Center",
      high: "High Performance",
      moderate: "Moderate",
      average: "Average",
    };

    const catName = categoryMap[category] || category;
    const valName = valueMap[value] || value;

    return `${catName}: ${valName}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={cn("fixed inset-0 z-50 flex flex-col bg-white", className)}
        >
          {/* Header */}
          <div className="shrink-0 border-b border-[#E2E4E9] p-4">
            <div className="flex items-center gap-2">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-10 w-10 shrink-0"
              >
                <ArrowLeft size={20} />
              </Button>

              {/* Search Input */}
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="h-12 rounded-full border border-[#E2E4E9] bg-white pr-10 pl-4"
                  placeholder="Search for facilities..."
                  autoFocus
                />

                {/* Clear Button (only when there's text) */}
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onSearchChange("")}
                    className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>

              {/* Filter Button */}
              {includeFilter && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFilterOpen(true)}
                  className="relative h-10 w-10 shrink-0"
                >
                  <Filter size={20} />
                  {selectedFilterCount > 0 && (
                    <span className="bg-primary absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
                      {selectedFilterCount}
                    </span>
                  )}
                </Button>
              )}
            </div>

            {/* Search Status & Active Filters */}
            <div className="mt-3">
              {/* Active Filters Display */}
              {selectedFilterCount > 0 && (
                <div className="mb-2 flex flex-wrap gap-1">
                  {Object.entries(selectedFilters).map(([category, values]) =>
                    values.map((value) => (
                      <Badge
                        key={`${category}-${value}`}
                        variant="secondary"
                        className="bg-primary/10 text-primary px-2 py-1 text-xs"
                      >
                        {getFilterLabel(category, value)}
                        <button
                          onClick={() => handleRemoveFilter(category, value)}
                          className="hover:text-primary/70 ml-1"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    )),
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Clear all filters logic would go here
                    }}
                    className="text-xs text-gray-500"
                  >
                    Clear all
                  </Button>
                </div>
              )}

              {/* Search Status */}
              {searchQuery && (
                <p className="text-sm text-gray-500">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Searching...
                    </span>
                  ) : isError ? (
                    <span className="text-red-500">
                      Error searching facilities
                    </span>
                  ) : facilities.length > 0 ? (
                    <span>
                      {facilities.length} results for "{searchQuery}"
                    </span>
                  ) : (
                    <span>No results for "{searchQuery}"</span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Results Container */}
          <div className="flex-1 overflow-y-auto">
            {isLoading && !facilities.length ? (
              // Initial loading skeleton
              <div className="space-y-3 p-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 rounded-lg bg-gray-200"></div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              // Error state
              <div className="flex h-full flex-col items-center justify-center p-4">
                <div className="rounded-full bg-red-100 p-3">
                  <X className="h-8 w-8 text-red-500" />
                </div>
                <p className="mt-4 text-gray-600">
                  Failed to load search results
                </p>
                <p className="text-sm text-gray-500">
                  {error?.message || "Please try again"}
                </p>
              </div>
            ) : facilities.length === 0 && searchQuery ? (
              // No results
              <div className="flex h-full flex-col items-center justify-center p-4">
                <div className="rounded-full bg-gray-100 p-3">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <p className="mt-4 text-gray-600">No facilities found</p>
                <p className="text-sm text-gray-500">
                  Try different search terms
                </p>
              </div>
            ) : !searchQuery ? (
              // Empty search state
              <div className="flex h-full flex-col items-center justify-center p-4">
                <div className="rounded-full bg-blue-50 p-3">
                  <Search className="text-primary h-8 w-8" />
                </div>
                <p className="mt-4 text-gray-600">Start typing to search</p>
                <p className="text-sm text-gray-500">
                  Search by facility name, service, or location
                </p>
              </div>
            ) : (
              // Results list
              <div className="space-y-3 p-4">
                {facilities.map((facility) => (
                  <div
                    key={facility.facility_id}
                    className="rounded-lg border border-[#E2E4E9] bg-white"
                  >
                    <FacilityListItem
                      facility={facility}
                      onViewDetails={() =>
                        onViewDetails(facility.facility_id || "")
                      }
                    />
                  </div>
                ))}

                {/* Load More Trigger */}
                {hasNextPage && (
                  <div
                    ref={loadMoreRef}
                    className="flex items-center justify-center py-4"
                  >
                    {isFetchingNextPage ? (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading more...
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => fetchNextPage()}
                        className="w-full"
                      >
                        Load More
                      </Button>
                    )}
                  </div>
                )}

                {/* No more results */}
                {!hasNextPage && facilities.length > 0 && (
                  <div className="py-4 text-center text-sm text-gray-500">
                    No more results
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
