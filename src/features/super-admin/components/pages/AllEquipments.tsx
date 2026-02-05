"use client";
import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import KPIStatsCards from "@/features/admin/components/layout/KPICards";
import { Package, Building2 } from "lucide-react";
import StaffTableHeader, {
  type FilterState,
} from "@/features/super-admin/components/layouts/StaffTableHeader";
import Tabs from "@/features/super-admin/components/ui/Tabs";
import { useUniqueInventory } from "../../hooks/useSuperAdminUsers";
import { useFacilitiesInventory } from "../../hooks/useFacilitiesInventory";
import EquipmentList from "../layouts/EquipmentList";
import InfrastructureList from "../layouts/InfrastructureList";
import InventoryItemModal, {
  type InventoryFormData,
} from "@/features/admin/feature/InventoryItemModal";
import {
  useAddEquipment,
  useAddInfrastructure,
} from "@/features/admin/hooks/useAdminStaff";
import { toast } from "sonner";

export default function EquipmentPage() {
  // ========== TAB STATE ==========
  // Tracks which tab is currently active (Equipment or Infrastructure)
  const [activeTab, setActiveTab] = useState("equipment");

  // ========== MODAL STATE ==========
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isInfrastructureModalOpen, setIsInfrastructureModalOpen] =
    useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>("");

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

  // Fetch facilities for the dropdown
  const { data: facilitiesData, isLoading: isLoadingFacilities } =
    useFacilitiesInventory();

  // ========== QUERY CLIENT ==========
  const queryClient = useQueryClient();

  // ========== MUTATIONS ==========
  const addEquipmentMutation = useAddEquipment(selectedFacilityId);
  const addInfrastructureMutation = useAddInfrastructure(selectedFacilityId);

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

  // Handle adding new equipment
  const handleAddEquipment = useCallback(
    async (data: InventoryFormData) => {
      if (!data.facilityId) return;

      setSelectedFacilityId(data.facilityId);

      try {
        await addEquipmentMutation.mutateAsync({
          item_name: data.name,
          quantity: parseInt(data.quantity, 10),
        });

        toast.success(`${data.name} added successfully!`);
        // Refresh the inventory list
        await queryClient.invalidateQueries({ queryKey: ["unique-inventory"] });
        setIsEquipmentModalOpen(false);
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(
          err?.response?.data?.message ||
            "Failed to add equipment. Please try again.",
        );
      }
    },
    [addEquipmentMutation, queryClient],
  );

  // Handle adding new infrastructure
  const handleAddInfrastructure = useCallback(
    async (data: InventoryFormData) => {
      if (!data.facilityId) return;

      setSelectedFacilityId(data.facilityId);

      try {
        await addInfrastructureMutation.mutateAsync({
          item_name: data.name,
          quantity: parseInt(data.quantity, 10),
        });

        toast.success(`${data.name} added successfully!`);
        // Refresh the inventory list
        await queryClient.invalidateQueries({ queryKey: ["unique-inventory"] });
        setIsInfrastructureModalOpen(false);
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(
          err?.response?.data?.message ||
            "Failed to add infrastructure. Please try again.",
        );
      }
    },
    [addInfrastructureMutation, queryClient],
  );

  // Format facilities for the dropdown
  const facilityOptions =
    facilitiesData?.facilities?.map((f) => ({
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
            trend={{ value: "20%", isPositive: true }}
          />
          <KPIStatsCards
            title="Total Infrastructure Items"
            value={totalInfrastructure}
            subtitle="Unique across all facilities"
            icon={<Building2 size={24} />}
            trend={{ value: "2% Decrease", isPositive: false }}
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
              buttonLabel="Add New Equipment"
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
              <EquipmentList
                equipmentList={inventoryData?.equipment || []}
                searchQuery={filters.searchQuery}
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
              buttonLabel="Add New Infrastructure"
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
              <InfrastructureList
                infrastructureList={inventoryData?.infrastructure || []}
                searchQuery={filters.searchQuery}
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
        isSubmitting={addEquipmentMutation.isPending}
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
        isSubmitting={addInfrastructureMutation.isPending}
        type="infrastructure"
        showFacilitySelector
        facilities={facilityOptions}
        isLoadingFacilities={isLoadingFacilities}
      />
    </div>
  );
}
