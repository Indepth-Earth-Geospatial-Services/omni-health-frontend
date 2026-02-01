"use client";
import { useState, useMemo, useCallback } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { superAdminService } from "../../services/super-admin.service";
import type { Facility } from "../../services/super-admin.service";

/**
 * InfrastructureList Component - Enhanced with Filtering & Pagination
 *
 * Displays a list of unique infrastructure items across all facilities
 * When user clicks an infrastructure item, it expands to show facilities with pagination
 *
 * Features:
 * - Expandable infrastructure rows with smooth animations
 * - Pagination for facility results (10 per page)
 * - Detailed facility information cards
 * - Loading and error states
 * - Search/filter support
 * - Clean, modern UI (same pattern as EquipmentList)
 */

interface InfrastructureListProps {
  infrastructureList: string[];
  searchQuery?: string;
}

const InfrastructureList: React.FC<InfrastructureListProps> = ({
  infrastructureList,
  searchQuery = "",
}) => {
  // ========== STATE MANAGEMENT ==========
  // Track which infrastructure items are expanded
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Store fetched facilities for each infrastructure with pagination
  const [facilitiesByInfrastructure, setFacilitiesByInfrastructure] = useState<
    Record<string, Facility[]>
  >({});

  // Track pagination state for each infrastructure
  const [paginationByInfrastructure, setPaginationByInfrastructure] = useState<
    Record<string, { page: number; limit: number; total: number }>
  >({});

  // Track loading state per infrastructure item
  const [loadingInfrastructure, setLoadingInfrastructure] = useState<
    Set<string>
  >(new Set());

  // ========== HELPERS ==========
  // Format infrastructure name: replace underscores with spaces and capitalize
  const formatName = (name: string) =>
    name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  // ========== FILTERING ==========
  // Filter infrastructure based on search query
  const filteredInfrastructure = useMemo(() => {
    if (!searchQuery.trim()) return infrastructureList;
    return infrastructureList.filter((item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [infrastructureList, searchQuery]);

  // ========== EVENT HANDLERS ==========
  /**
   * Toggle expansion of an infrastructure item
   * Fetches facilities on first expansion
   */
  const toggleExpand = async (infrastructureName: string) => {
    const newExpanded = new Set(expandedItems);

    if (newExpanded.has(infrastructureName)) {
      // Collapse
      newExpanded.delete(infrastructureName);
    } else {
      // Expand - fetch facilities if not already cached
      newExpanded.add(infrastructureName);
      if (!facilitiesByInfrastructure[infrastructureName]) {
        await fetchFacilitiesWithInfrastructure(infrastructureName, 1);
      }
    }

    setExpandedItems(newExpanded);
  };

  /**
   * Fetch facilities with specific infrastructure using pagination
   * Calls: GET /api/v1/facilities?inventory_item={name}&page={page}&limit={limit}
   */
  const fetchFacilitiesWithInfrastructure = useCallback(
    async (infrastructureName: string, page: number = 1) => {
      setLoadingInfrastructure((prev) => new Set(prev).add(infrastructureName));

      try {
        const response = await superAdminService.getFacilitiesByInventory({
          inventory_item: infrastructureName,
          page,
          limit: 10,
        });

        if (response.facilities) {
          setFacilitiesByInfrastructure((prev) => ({
            ...prev,
            [infrastructureName]: response.facilities,
          }));

          // Store pagination info
          setPaginationByInfrastructure((prev) => ({
            ...prev,
            [infrastructureName]: {
              page,
              limit: 10,
              total: response.pagination.total_records,
            },
          }));
        }
      } catch (error) {
        console.error(
          `Failed to fetch facilities for ${infrastructureName}:`,
          error,
        );
      } finally {
        setLoadingInfrastructure((prev) => {
          const newSet = new Set(prev);
          newSet.delete(infrastructureName);
          return newSet;
        });
      }
    },
    [],
  );

  /**
   * Handle pagination for infrastructure
   */
  const handlePageChange = useCallback(
    (infrastructureName: string, newPage: number) => {
      fetchFacilitiesWithInfrastructure(infrastructureName, newPage);
    },
    [fetchFacilitiesWithInfrastructure],
  );

  // ========== RENDER ==========
  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* Header Section */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Infrastructure Items
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Total: {filteredInfrastructure.length} item
          {filteredInfrastructure.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Infrastructure List - Fixed Height with Scroll */}
      <div className="max-h-[calc(100vh-400px)] divide-y divide-gray-200 overflow-y-auto">
        {filteredInfrastructure.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No infrastructure items found</p>
          </div>
        ) : (
          filteredInfrastructure.map((infrastructure) => {
            const isExpanded = expandedItems.has(infrastructure);
            const facilities = facilitiesByInfrastructure[infrastructure] || [];
            const isLoading = loadingInfrastructure.has(infrastructure);
            const pagination = paginationByInfrastructure[infrastructure] || {
              page: 1,
              limit: 10,
              total: 0,
            };
            const totalPages = Math.ceil(pagination.total / pagination.limit);

            return (
              <div key={infrastructure} className="border-0">
                {/* Infrastructure Header Row - Clickable */}
                <button
                  onClick={() => toggleExpand(infrastructure)}
                  className="flex w-full items-center justify-between px-6 py-4 transition-colors duration-200 hover:bg-green-50"
                >
                  <div className="flex items-center gap-3">
                    {/* Chevron Icon with rotation animation */}
                    <span
                      className={`transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown size={20} className="text-green-600" />
                    </span>
                    {/* Infrastructure Name */}
                    <span className="text-left font-semibold text-gray-900">
                      {formatName(infrastructure)}
                    </span>
                  </div>
                  {/* Facility Count Badge */}
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                    {pagination.total} facilit
                    {pagination.total !== 1 ? "ies" : "y"}
                  </span>
                </button>

                {/* Expanded Content - Facilities with Pagination */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-green-50 px-6 py-4">
                    {isLoading ? (
                      // Loading State
                      <div className="flex items-center justify-center py-8">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-green-600" />
                        <span className="ml-3 text-sm text-gray-600">
                          Loading facilities...
                        </span>
                      </div>
                    ) : facilities.length === 0 ? (
                      // Empty State
                      <p className="text-sm text-gray-600">
                        No facilities found with this infrastructure
                      </p>
                    ) : (
                      <>
                        {/* Facilities Grid */}
                        <div className="space-y-3">
                          {facilities.map((facility) => (
                            <div
                              key={facility.facility_id}
                              className="rounded-lg border border-green-200 bg-white p-4 transition-shadow duration-200 hover:shadow-md"
                            >
                              <div className="flex items-start justify-between">
                                {/* Facility Info */}
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">
                                    {facility.facility_name}
                                  </h4>
                                  <div className="mt-2 space-y-2">
                                    {/* Category Badge */}
                                    <div className="inline-block">
                                      <span className="inline-block rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                        {facility.facility_category}
                                      </span>
                                    </div>
                                    {/* Location Info */}
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <MapPin
                                        size={16}
                                        className="flex-shrink-0 text-gray-400"
                                      />
                                      <span>
                                        {facility.town}, {facility.facility_lga}
                                      </span>
                                    </div>
                                    {/* Address */}
                                    <div className="text-sm text-gray-600">
                                      <span className="font-medium text-gray-700">
                                        Address:{" "}
                                      </span>
                                      {facility.address}
                                    </div>
                                  </div>
                                </div>
                                {/* Rating Card */}
                                <div className="ml-4 flex-shrink-0 text-right">
                                  <div className="mb-1 text-xs text-gray-500">
                                    Rating
                                  </div>
                                  <div className="text-lg font-semibold text-yellow-600">
                                    {facility.average_rating.toFixed(1)} ⭐
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                          <div className="mt-4 flex items-center justify-center gap-2 border-t border-green-200 pt-4">
                            <button
                              onClick={() =>
                                handlePageChange(
                                  infrastructure,
                                  Math.max(1, pagination.page - 1),
                                )
                              }
                              disabled={pagination.page === 1}
                              className="rounded border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              ← Previous
                            </button>
                            <div className="text-sm font-medium text-gray-600">
                              Page {pagination.page} of {totalPages}
                            </div>
                            <button
                              onClick={() =>
                                handlePageChange(
                                  infrastructure,
                                  Math.min(totalPages, pagination.page + 1),
                                )
                              }
                              disabled={pagination.page === totalPages}
                              className="rounded border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Next →
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InfrastructureList;
