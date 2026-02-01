"use client";
import { useState, useMemo, useCallback } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { superAdminService } from "../../services/super-admin.service";
import type { Facility } from "../../services/super-admin.service";

/**
 * EquipmentList Component - Enhanced with Filtering & Pagination
 *
 * Displays a list of unique equipment items across all facilities
 * When user clicks an equipment item, it expands to show facilities with pagination
 *
 * Features:
 * - Expandable equipment rows with smooth animations
 * - Pagination for facility results (10 per page)
 * - Detailed facility information cards
 * - Loading and error states
 * - Search/filter support
 * - Clean, modern UI
 */

interface EquipmentListProps {
  equipmentList: string[];
  searchQuery?: string;
}

const EquipmentList: React.FC<EquipmentListProps> = ({
  equipmentList,
  searchQuery = "",
}) => {
  // ========== STATE MANAGEMENT ==========
  // Track which equipment items are expanded
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Store fetched facilities for each equipment with pagination
  const [facilitiesByEquipment, setFacilitiesByEquipment] = useState<
    Record<string, Facility[]>
  >({});

  // Track pagination state for each equipment
  const [paginationByEquipment, setPaginationByEquipment] = useState<
    Record<string, { page: number; limit: number; total: number }>
  >({});

  // Track loading state per equipment item
  const [loadingEquipment, setLoadingEquipment] = useState<Set<string>>(
    new Set(),
  );

  // ========== FILTERING ==========
  // Filter equipment based on search query
  const filteredEquipment = useMemo(() => {
    if (!searchQuery.trim()) return equipmentList;
    return equipmentList.filter((item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [equipmentList, searchQuery]);

  // ========== EVENT HANDLERS ==========
  /**
   * Toggle expansion of an equipment item
   * Fetches facilities on first expansion
   */
  const toggleExpand = async (equipmentName: string) => {
    const newExpanded = new Set(expandedItems);

    if (newExpanded.has(equipmentName)) {
      // Collapse
      newExpanded.delete(equipmentName);
    } else {
      // Expand - fetch facilities if not already cached
      newExpanded.add(equipmentName);
      if (!facilitiesByEquipment[equipmentName]) {
        await fetchFacilitiesWithEquipment(equipmentName, 1);
      }
    }

    setExpandedItems(newExpanded);
  };

  /**
   * Fetch facilities with specific equipment using pagination
   * Calls: GET /api/v1/facilities?inventory_item={name}&page={page}&limit={limit}
   */
  const fetchFacilitiesWithEquipment = useCallback(
    async (equipmentName: string, page: number = 1) => {
      setLoadingEquipment((prev) => new Set(prev).add(equipmentName));

      try {
        const response = await superAdminService.getFacilitiesByInventory({
          inventory_item: equipmentName,
          page,
          limit: 10,
        });

        if (response.facilities) {
          setFacilitiesByEquipment((prev) => ({
            ...prev,
            [equipmentName]: response.facilities,
          }));

          // Store pagination info
          setPaginationByEquipment((prev) => ({
            ...prev,
            [equipmentName]: {
              page,
              limit: 10,
              total: response.pagination.total_records,
            },
          }));
        }
      } catch (error) {
        console.error(
          `Failed to fetch facilities for ${equipmentName}:`,
          error,
        );
      } finally {
        setLoadingEquipment((prev) => {
          const newSet = new Set(prev);
          newSet.delete(equipmentName);
          return newSet;
        });
      }
    },
    [],
  );

  /**
   * Handle pagination for equipment
   */
  const handlePageChange = useCallback(
    (equipmentName: string, newPage: number) => {
      fetchFacilitiesWithEquipment(equipmentName, newPage);
    },
    [fetchFacilitiesWithEquipment],
  );

  // ========== RENDER ==========
  return (
    <div className="divide-gray-200 overflow-y-auto rounded-lg border border-gray-200 bg-white">
      {/* Header Section */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Equipment Items</h2>
        <p className="mt-1 text-sm text-gray-600">
          Total: {filteredEquipment.length} item
          {filteredEquipment.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Equipment List - Fixed Height with Scroll */}
      <div className="max-h-[calc(100vh-200px)] divide-y divide-gray-200 overflow-y-auto">
        {filteredEquipment.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No equipment items found</p>
          </div>
        ) : (
          filteredEquipment.map((equipment) => {
            const isExpanded = expandedItems.has(equipment);
            const facilities = facilitiesByEquipment[equipment] || [];
            const isLoading = loadingEquipment.has(equipment);
            const pagination = paginationByEquipment[equipment] || {
              page: 1,
              limit: 10,
              total: 0,
            };
            const totalPages = Math.ceil(pagination.total / pagination.limit);

            return (
              <div key={equipment} className="border-0">
                {/* Equipment Header Row - Clickable */}
                <button
                  onClick={() => toggleExpand(equipment)}
                  className="flex w-full items-center justify-between px-6 py-4 transition-colors duration-200 hover:bg-blue-50"
                >
                  <div className="flex items-center gap-3">
                    {/* Chevron Icon with rotation animation */}
                    <span
                      className={`transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown size={20} className="text-blue-600" />
                    </span>
                    {/* Equipment Name */}
                    <span className="text-left font-semibold text-gray-900">
                      {equipment}
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
                  <div className="border-t border-gray-200 bg-blue-50 px-6 py-4">
                    {isLoading ? (
                      // Loading State
                      <div className="flex items-center justify-center py-8">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                        <span className="ml-3 text-sm text-gray-600">
                          Loading facilities...
                        </span>
                      </div>
                    ) : facilities.length === 0 ? (
                      // Empty State
                      <p className="text-sm text-gray-600">
                        No facilities found with this equipment
                      </p>
                    ) : (
                      <>
                        {/* Facilities Grid */}
                        <div className="space-y-3">
                          {facilities.map((facility) => (
                            <div
                              key={facility.facility_id}
                              className="rounded-lg border border-blue-200 bg-white p-4 transition-shadow duration-200 hover:shadow-md"
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
                                      <span className="inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
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
                          <div className="mt-4 flex items-center justify-center gap-2 border-t border-blue-200 pt-4">
                            <button
                              onClick={() =>
                                handlePageChange(
                                  equipment,
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
                                  equipment,
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

export default EquipmentList;
