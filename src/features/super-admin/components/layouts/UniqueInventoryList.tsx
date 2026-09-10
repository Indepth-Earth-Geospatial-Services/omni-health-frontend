"use client";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  Building2,
  Check,
  ChevronDown,
  Loader2,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import DeleteConfirmationModal from "@/features/admin/feature/DeleteConfirmationModal";
import {
  useFacilitiesByInventory,
  useDeleteInventoryItem,
  type FacilitySummary,
  type InventoryItemType,
} from "../../hooks/useFacilitiesByInventory";
import { StaffPagination } from "./Staff.Pagination";

interface UniqueInventoryListProps {
  items: string[];
  searchQuery?: string;
  type: InventoryItemType;
  emptyMessage: string;
}

const THEME: Record<
  InventoryItemType,
  {
    accent: string;
    hoverBg: string;
    panelBg: string;
    border: string;
    checkbox: string;
    quantityBadge: string;
  }
> = {
  equipment: {
    accent: "text-blue-600",
    hoverBg: "hover:bg-blue-50",
    panelBg: "bg-blue-50/60",
    border: "border-blue-200",
    checkbox: "border-blue-400 bg-blue-500",
    quantityBadge: "bg-blue-100 text-blue-700",
  },
  infrastructure: {
    accent: "text-green-600",
    hoverBg: "hover:bg-green-50",
    panelBg: "bg-green-50/60",
    border: "border-green-200",
    checkbox: "border-green-400 bg-green-500",
    quantityBadge: "bg-green-100 text-green-700",
  },
};

type Theme = (typeof THEME)[InventoryItemType];

/** "operating_theatre" -> "Operating Theatre" */
function formatName(name: string) {
  return name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Unique equipment/infrastructure items across every facility, with a
 * drill-down into which facilities carry a given item and a way to remove
 * the item from one or several of them. Shared by both tabs on the
 * super-admin inventory page — equipment and infrastructure only differ by
 * accent color and copy, so they used to be ~300 lines of duplicated code
 * each; now it's one generic list plus a `type` prop.
 */
export default function UniqueInventoryList({
  items,
  searchQuery = "",
  type,
  emptyMessage,
}: UniqueInventoryListProps) {
  const theme = THEME[type];

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((item) => item.toLowerCase().includes(q));
  }, [items, searchQuery]);

  const toggleExpand = (itemName: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemName)) next.delete(itemName);
      else next.add(itemName);
      return next;
    });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {type === "equipment" ? "Equipment Items" : "Infrastructure Items"}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Total: {filteredItems.length} item
          {filteredItems.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="max-h-[calc(100vh-260px)] divide-y divide-gray-200 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          filteredItems.map((itemName) => (
            <InventoryRow
              key={itemName}
              itemName={itemName}
              type={type}
              theme={theme}
              isExpanded={expandedItems.has(itemName)}
              onToggle={() => toggleExpand(itemName)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function Checkbox({
  checked,
  partial = false,
  theme,
  onClick,
  ariaLabel,
}: {
  checked: boolean;
  partial?: boolean;
  theme: Theme;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        // Stops the click from also firing a parent row's own onClick (e.g.
        // the "select all" label this sits inside), which would otherwise
        // toggle twice and net out to nothing.
        e.stopPropagation();
        onClick();
      }}
      aria-label={ariaLabel}
      aria-pressed={checked}
      className={cn(
        "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition-colors",
        checked ? theme.checkbox : partial ? cn(theme.checkbox, "opacity-50") : "border-gray-300 bg-white",
      )}
    >
      {checked && <Check size={11} className="text-white" />}
      {!checked && partial && <div className="h-1.5 w-1.5 rounded-sm bg-white" />}
    </button>
  );
}

function InventoryRow({
  itemName,
  type,
  theme,
  isExpanded,
  onToggle,
}: {
  itemName: string;
  type: InventoryItemType;
  theme: Theme;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<FacilitySummary[] | null>(null);

  // Fetched eagerly (not gated on `isExpanded`) so the facility count next to
  // the chevron is there as soon as the list renders, not only after a click.
  const { data, isLoading, isFetching, isError, refetch } =
    useFacilitiesByInventory(itemName, type, page, 10);
  const deleteMutation = useDeleteInventoryItem();

  const facilities = data?.facilities ?? [];
  const totalRecords = data?.pagination.total_records ?? 0;
  // Deleting the last facility on the last page can leave `page` one past the
  // new `total_pages`; clamped here (not via an effect) so the count and
  // pagination footer stay consistent on the same render the data arrives.
  const totalPages = Math.max(1, data?.pagination.total_pages ?? 1);
  const currentPage = Math.min(page, totalPages);

  const goToPage = (next: number) => {
    setPage(next);
    setSelectedIds(new Set());
  };

  const toggleSelected = (facilityId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(facilityId)) next.delete(facilityId);
      else next.add(facilityId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.size === facilities.length
        ? new Set()
        : new Set(facilities.map((f) => f.facility_id)),
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(
      {
        facilityIds: deleteTarget.map((f) => f.facility_id),
        itemName,
        type,
      },
      {
        onSuccess: (result) => {
          const label = formatName(itemName);
          if (result.failed === 0) {
            toast.success(
              result.succeeded === 1
                ? `${label} removed from ${deleteTarget[0].facility_name}.`
                : `${label} removed from ${result.succeeded} facilities.`,
            );
          } else if (result.succeeded === 0) {
            toast.error(`Failed to remove ${label}. Please try again.`);
          } else {
            toast.warning(
              `${label} removed from ${result.succeeded} of ${result.succeeded + result.failed} facilities — the rest failed.`,
            );
          }
          setDeleteTarget(null);
          setSelectedIds(new Set());
        },
        onError: (error: unknown) => {
          const err = error as { message?: string };
          toast.error(
            err?.message || "Failed to remove item. Please try again.",
          );
        },
      },
    );
  };

  const selectedCount = selectedIds.size;
  const isAllSelected = facilities.length > 0 && selectedCount === facilities.length;
  const isPartiallySelected = selectedCount > 0 && selectedCount < facilities.length;

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center justify-between px-6 py-4 text-left transition-colors",
          theme.hoverBg,
        )}
      >
        <div className="flex items-center gap-3">
          <ChevronDown
            size={20}
            className={cn(
              "shrink-0 transition-transform duration-300",
              theme.accent,
              isExpanded && "rotate-180",
            )}
          />
          <span className="font-semibold text-gray-900">{formatName(itemName)}</span>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
          {isLoading ? (
            <Loader2 size={13} className="animate-spin text-gray-400" />
          ) : isError ? (
            "—"
          ) : (
            `${totalRecords} facilit${totalRecords !== 1 ? "ies" : "y"}`
          )}
        </span>
      </button>

      {/* Smooth height transition without measuring — the grid track animates
          from 0fr to 1fr instead of the content just appearing. */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className={cn("border-t px-4 py-3", theme.border, theme.panelBg)}>
            {isLoading ? (
              <div className="space-y-2 py-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-10 animate-pulse rounded-lg bg-white/70"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <p className="text-sm text-gray-600">
                  Couldn&apos;t load facilities for this item.
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <RotateCcw size={13} />
                  Try again
                </button>
              </div>
            ) : facilities.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-600">
                No facilities found with this item.
              </p>
            ) : (
              <>
                {/* Selection toolbar */}
                <div className="flex items-center justify-between gap-3 px-2 pb-2">
                  <div
                    onClick={toggleSelectAll}
                    className="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-800"
                  >
                    <Checkbox
                      checked={isAllSelected}
                      partial={isPartiallySelected}
                      theme={theme}
                      onClick={toggleSelectAll}
                      ariaLabel="Select all facilities on this page"
                    />
                    Select all on this page
                  </div>
                  {selectedCount > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget(
                          facilities.filter((f) => selectedIds.has(f.facility_id)),
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 size={13} />
                      Delete {selectedCount} selected
                    </button>
                  )}
                </div>

                <div
                  className={cn(
                    "divide-y divide-white/80 transition-opacity",
                    isFetching && "opacity-60",
                  )}
                >
                  {facilities.map((facility) => (
                    <div
                      key={facility.facility_id}
                      className="group flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-white"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Checkbox
                          checked={selectedIds.has(facility.facility_id)}
                          theme={theme}
                          onClick={() => toggleSelected(facility.facility_id)}
                          ariaLabel={`Select ${facility.facility_name}`}
                        />
                        <Building2 size={15} className="shrink-0 text-gray-400" />
                        <span className="truncate text-sm text-gray-800">
                          {facility.facility_name}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          title={`${facility.quantity} in stock at this facility`}
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
                            facility.quantity > 0
                              ? theme.quantityBadge
                              : "bg-gray-100 text-gray-400",
                          )}
                        >
                          {facility.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget([facility])}
                          aria-label={`Remove ${formatName(itemName)} from ${facility.facility_name}`}
                          className="rounded-md p-1.5 text-gray-400 opacity-60 transition-colors group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="-mx-4 -mb-3 mt-2">
                    <StaffPagination
                      page={currentPage}
                      totalPages={totalPages}
                      totalRecords={totalRecords}
                      onPrevPage={() => goToPage(Math.max(1, currentPage - 1))}
                      onNextPage={() => goToPage(Math.min(totalPages, currentPage + 1))}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
        itemName={
          deleteTarget
            ? deleteTarget.length === 1
              ? `${formatName(itemName)} — ${deleteTarget[0].facility_name}`
              : `${formatName(itemName)} — ${deleteTarget.length} facilities`
            : ""
        }
        itemType={type}
      />
    </div>
  );
}
