"use client";

import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  Building2,
  Check,
  Hospital,
  Loader2,
  Package,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { MultiSelectDropdown } from "@/features/super-admin/components/ui/MultiSelectDropdown";
import { SearchableSelect } from "@/features/super-admin/components/ui/SearchableSelect";
import { useMultiSelect } from "@/features/super-admin/hooks/use-multi-select";
import {
  useInventoryCatalogue,
  type CatalogueItem,
} from "@/features/super-admin/hooks/useInventoryCatalogue";
import type { InventoryType } from "@/services/admin.service";
import {
  ConditionCountFields,
  parseConditionDraft,
  type ConditionDraft,
} from "./ConditionCountFields";

interface FacilityOption {
  facility_id: string;
  facility_name: string;
}

interface InventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: InventoryFormData) => void;
  isSubmitting?: boolean;
  type: InventoryType;
  /** Catalogue keys already recorded at this facility — left out of the picker. */
  excludeKeys?: string[];
  // Optional facility selection for super-admin — lets the same item be added
  // to several facilities at once instead of one modal round-trip each.
  showFacilitySelector?: boolean;
  facilities?: FacilityOption[];
  isLoadingFacilities?: boolean;
}

export interface InventoryFormData {
  /** Catalogue key. */
  name: string;
  displayName: string;
  functional: number;
  notFunctional: number;
  facilityIds?: string[];
}

const typeConfig = {
  equipment: {
    title: "New Equipment",
    description: "Pick an item from the catalogue and record its condition",
    nameLabel: "Equipment",
    buttonText: "Add Equipment",
    icon: Package,
  },
  infrastructure: {
    title: "New Infrastructure",
    description: "Pick an item from the catalogue and record its condition",
    nameLabel: "Infrastructure",
    buttonText: "Add Infrastructure",
    icon: Hospital,
  },
};

const EMPTY_DRAFT: ConditionDraft = { functional: "", notFunctional: "" };

/**
 * Mounted only while open, so every opening starts from an empty form rather
 * than whatever the last one left behind.
 */
const InventoryItemModal: React.FC<InventoryItemModalProps> = (props) =>
  props.isOpen ? <InventoryItemForm {...props} /> : null;

const InventoryItemForm: React.FC<InventoryItemModalProps> = ({
  onClose,
  onSubmit,
  isSubmitting = false,
  type,
  excludeKeys,
  showFacilitySelector = false,
  facilities = [],
  isLoadingFacilities = false,
}) => {
  const [itemKey, setItemKey] = useState<string | null>(null);
  const [counts, setCounts] = useState<ConditionDraft>(EMPTY_DRAFT);
  const [error, setError] = useState("");

  const catalogue = useInventoryCatalogue();

  const options = useMemo(() => {
    const excluded = new Set(excludeKeys);
    return (catalogue.data?.items ?? []).filter(
      (item) => item.type === type && !excluded.has(item.item_name),
    );
  }, [catalogue.data, type, excludeKeys]);

  const facilitySelect = useMultiSelect({
    items: facilities,
    getItemId: (f) => f.facility_id,
    getItemLabel: (f) => f.facility_name,
  });

  const config = typeConfig[type];
  const Icon = config.icon;

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  const handleSubmit = () => {
    const item = options.find((o) => o.item_name === itemKey);
    if (!item) {
      setError(`Choose the ${config.nameLabel.toLowerCase()} to record.`);
      return;
    }
    const parsed = parseConditionDraft(counts);
    if (!parsed) {
      setError("Counts must be whole numbers, 0 or more.");
      return;
    }
    if (showFacilitySelector && facilitySelect.selectedIds.length === 0) {
      setError("Please select at least one facility");
      return;
    }

    setError("");
    onSubmit?.({
      name: item.item_name,
      displayName: item.name,
      ...parsed,
      facilityIds: showFacilitySelector
        ? facilitySelect.selectedIds
        : undefined,
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
      >
        {/* Header */}
        <div className="from-primary to-primary/80 relative overflow-hidden bg-linear-to-r px-6 py-5">
          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-6 h-16 w-16 rounded-full bg-white/10" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Icon size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  {config.title}
                </h2>
                <p className="mt-0.5 text-xs text-white/70">
                  {config.description}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              aria-label="Close"
              className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div
          className="overflow-y-auto px-6 py-5"
          style={{ maxHeight: "calc(100vh - 2rem - 140px)" }}
        >
          <div className="space-y-5">
            {/* Facility Selector (for super-admin) — pick one or many
                facilities to add this same item to in one go. */}
            {showFacilitySelector && (
              <MultiSelectDropdown
                items={facilities}
                selectedIds={facilitySelect.selectedIds}
                getItemId={(f) => f.facility_id}
                getItemLabel={(f) => f.facility_name}
                onToggle={facilitySelect.toggle}
                onSelectAll={() =>
                  facilitySelect.isAllSelected
                    ? facilitySelect.deselectAll()
                    : facilitySelect.selectAll()
                }
                isAllSelected={facilitySelect.isAllSelected}
                isPartiallySelected={facilitySelect.isPartiallySelected}
                label="Facilities"
                required
                disabled={isSubmitting}
                isLoading={isLoadingFacilities}
                loadingText="Loading facilities..."
                placeholder="Select one or more facilities"
                searchPlaceholder="Search facility..."
                emptyText="No facilities found"
                icon={<Building2 size={15} className="text-slate-400" />}
              />
            )}

            {/* Item picker — the catalogue is fixed, so free text would only
                produce 409s. */}
            {catalogue.isError ? (
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>
                  The item catalogue could not be loaded, so items can&apos;t
                  be added right now. Please try again later.
                </span>
              </div>
            ) : (
              <SearchableSelect<CatalogueItem>
                items={options}
                value={itemKey}
                onChange={(key) => {
                  setItemKey(key);
                  if (error) setError("");
                }}
                getItemId={(item) => item.item_name}
                getItemLabel={(item) => item.name}
                label={config.nameLabel}
                required
                placeholder={`Select ${config.nameLabel.toLowerCase()}`}
                searchPlaceholder="Search the catalogue…"
                emptyText={
                  excludeKeys?.length
                    ? "Every catalogue item is already recorded"
                    : "No matching items"
                }
                disabled={isSubmitting}
                isLoading={catalogue.isLoading}
                loadingText="Loading catalogue…"
                icon={<Icon size={15} className="text-slate-400" />}
              />
            )}

            <ConditionCountFields
              value={counts}
              onChange={(next) => {
                setCounts(next);
                if (error) setError("");
              }}
              disabled={isSubmitting}
              error={error || undefined}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              catalogue.isError ||
              (showFacilitySelector && isLoadingFacilities)
            }
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Adding…
              </>
            ) : showFacilitySelector && facilitySelect.selectedCount > 1 ? (
              <>
                <Check size={15} />
                {config.buttonText} to {facilitySelect.selectedCount}{" "}
                facilities
              </>
            ) : (
              <>
                <Check size={15} />
                {config.buttonText}
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default InventoryItemModal;
