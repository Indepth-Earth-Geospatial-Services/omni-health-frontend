"use client";
import { useState, useCallback } from "react";
import KPIStatsCards from "@/features/admin/components/layout/KPICards";
import { Package, Building2 } from "lucide-react";
import StaffTableHeader, {
  type FilterState,
} from "@/features/super-admin/components/layouts/StaffTableHeader";
import Tabs from "@/features/super-admin/components/ui/Tabs";
import { useUniqueInventory } from "../../hooks/useSuperAdminUsers";
import { useFacilityOptions } from "../../hooks/useFacilityOptions";
import { useBatchAddInventoryItem } from "../../hooks/useFacilitiesByInventory";
import UniqueInventoryList from "../layouts/UniqueInventoryList";
import InventoryItemModal, {
  type InventoryFormData,
} from "@/features/admin/feature/InventoryItemModal";
import { toast } from "sonner";

export default function EquipmentPage() {
  // ========== TAB STATE ==========
  // Tracks which tab is currently active (Equipment or Infrastructure)
  const [activeTab, setActiveTab] = useState("equipment");

  // ========== MODAL STATE ==========
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isInfrastructureModalOpen, setIsInfrastructureModalOpen] =
    useState(false);

  // ========== FILTER STATE ==========
  // Manages search and filtering for equipment and infrastructure
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    selectedFacility: "all",
    selectedLGA: "all",
    selectedGender: "all",
    selectedStatus: "all",
  });

  // ========== DATA FETCHING ==========
  // Fetch unique equipment and infrastructure items
  const { data: inventoryData, isLoading: isLoadingInventory } =
    useUniqueInventory();

  // Fetch facilities for the dropdown — the lightweight analytics-backed list
  // (name + id only), not the full facility payload with inventory attached.
  const { data: facilitiesData, isLoading: isLoadingFacilities } =
    useFacilityOptions();

  // ========== MUTATIONS ==========
  // One hook for both tabs — facility (or facilities) is passed per call
  // rather than fixed, since a single item can be added to many at once.
  const batchAddMutation = useBatchAddInventoryItem();

  // ========== TAB CONFIGURATION ==========
  // Define available tabs (Equipment and Infrastructure only)
  const tabs = [
    { label: "Equipment", value: "equipment" },
    { label: "Infrastructure", value: "infrastructure" },
  ];

  // ========== KPI METRICS CALCULATION ==========
  // Calculate metrics for display in KPI cards
  const totalEquipment = inventoryData?.equipment?.length ?? 0;
  const totalInfrastructure = inventoryData?.infrastructure?.length ?? 0;

  // ========== EVENT HANDLERS ==========
  // Handle search query changes
  const handleSearch = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: value }));
  }, []);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  // Reports how many of the selected facilities the add actually succeeded
  // for, since a partial failure shouldn't read as a full success or a full
  // failure — some facilities really did get the item.
  const reportBatchResult = useCallback(
    (itemName: string, result: { succeeded: number; failed: number }) => {
      if (result.failed === 0) {
        toast.success(
          result.succeeded === 1
            ? `${itemName} added successfully!`
            : `${itemName} added to ${result.succeeded} facilities!`,
        );
      } else if (result.succeeded === 0) {
        toast.error(`Failed to add ${itemName}. Please try again.`);
      } else {
        toast.warning(
          `${itemName} added to ${result.succeeded} of ${result.succeeded + result.failed} facilities — the rest failed.`,
        );
      }
    },
    [],
  );

  // Handle adding new equipment — to one or several facilities at once
  const handleAddEquipment = useCallback(
    async (data: InventoryFormData) => {
      if (!data.facilityIds?.length) return;

      try {
        const result = await batchAddMutation.mutateAsync({
          facilityIds: data.facilityIds,
          itemName: data.name,
          quantity: parseInt(data.quantity, 10),
          type: "equipment",
        });
        reportBatchResult(data.name, result);
        setIsEquipmentModalOpen(false);
      } catch (error: unknown) {
        const err = error as { message?: string };
        toast.error(err?.message || "Failed to add equipment. Please try again.");
      }
    },
    [batchAddMutation, reportBatchResult],
  );

  // Handle adding new infrastructure — to one or several facilities at once
  const handleAddInfrastructure = useCallback(
    async (data: InventoryFormData) => {
      if (!data.facilityIds?.length) return;

      try {
        const result = await batchAddMutation.mutateAsync({
          facilityIds: data.facilityIds,
          itemName: data.name,
          quantity: parseInt(data.quantity, 10),
          type: "infrastructure",
        });
        reportBatchResult(data.name, result);
        setIsInfrastructureModalOpen(false);
      } catch (error: unknown) {
        const err = error as { message?: string };
        toast.error(
          err?.message || "Failed to add infrastructure. Please try again.",
        );
      }
    },
    [batchAddMutation, reportBatchResult],
  );

  // Format facilities for the dropdown
  const facilityOptions =
    facilitiesData?.map((f) => ({
      facility_id: f.facility_id,
      facility_name: f.facility_name,
    })) || [];

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <main className="flex min-h-screen flex-col">
        {/* KPI Stats Cards - Equipment and Infrastructure Counts */}
        <div className="mb-4 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <KPIStatsCards
            title="Total Equipment Items"
            value={totalEquipment}
            subtitle="Unique across all facilities"
            icon={<Package size={24} />}
            //trend={{ value: "20%", isPositive: true }}
          />
          <KPIStatsCards
            title="Total Infrastructure Items"
            value={totalInfrastructure}
            subtitle="Unique across all facilities"
            icon={<Building2 size={24} />}
            // trend={{ value: "2% Decrease", isPositive: false }}
          />
        </div>

        {/* Tabs - Equipment and Infrastructure */}
        <div className="mb-6">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Equipment Tab - Displays unique equipment items with facility dropdown */}
        {activeTab === "equipment" && (
          <>
            <StaffTableHeader
              title="Equipment Management"
              searchPlaceholder="Search equipment..."
              onSearch={handleSearch}
              buttonLabel="New Equipment"
              buttonClassName="shrink-0 text-sm sm:text-lg"
              onButtonClick={() => setIsEquipmentModalOpen(true)}
              showGenderFilter={false}
              showStatusFilter={false}
              showExport={false}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
            {isLoadingInventory ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
                <span className="ml-3 text-gray-600">Loading equipment...</span>
              </div>
            ) : (
              <UniqueInventoryList
                type="equipment"
                items={inventoryData?.equipment || []}
                searchQuery={filters.searchQuery}
                emptyMessage="No equipment items found"
              />
            )}
          </>
        )}

        {/* Infrastructure Tab - Displays unique infrastructure items with facility dropdown */}
        {activeTab === "infrastructure" && (
          <>
            <StaffTableHeader
              title="Infrastructure Management"
              searchPlaceholder="Search infrastructure..."
              onSearch={handleSearch}
              buttonLabel="New Infrastructure"
              buttonClassName="shrink-0 text-sm sm:text-lg"
              onButtonClick={() => setIsInfrastructureModalOpen(true)}
              showGenderFilter={false}
              showStatusFilter={false}
              showExport={false}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
            {isLoadingInventory ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
                <span className="ml-3 text-gray-600">
                  Loading infrastructure...
                </span>
              </div>
            ) : (
              <UniqueInventoryList
                type="infrastructure"
                items={inventoryData?.infrastructure || []}
                searchQuery={filters.searchQuery}
                emptyMessage="No infrastructure items found"
              />
            )}
          </>
        )}
      </main>

      {/* Add Equipment Modal */}
      <InventoryItemModal
        isOpen={isEquipmentModalOpen}
        onClose={() => setIsEquipmentModalOpen(false)}
        onSubmit={handleAddEquipment}
        isSubmitting={batchAddMutation.isPending}
        type="equipment"
        showFacilitySelector
        facilities={facilityOptions}
        isLoadingFacilities={isLoadingFacilities}
      />

      {/* Add Infrastructure Modal */}
      <InventoryItemModal
        isOpen={isInfrastructureModalOpen}
        onClose={() => setIsInfrastructureModalOpen(false)}
        onSubmit={handleAddInfrastructure}
        isSubmitting={batchAddMutation.isPending}
        type="infrastructure"
        showFacilitySelector
        facilities={facilityOptions}
        isLoadingFacilities={isLoadingFacilities}
      />
    </div>
  );
}
