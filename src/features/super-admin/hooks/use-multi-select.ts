"use client";

import { useState, useCallback, useMemo } from "react";

interface UseMultiSelectOptions<T> {
  items: T[];
  getItemId: (item: T) => string;
  getItemLabel?: (item: T) => string;
}

interface UseMultiSelectReturn<T> {
  selectedIds: string[];
  toggle: (id: string) => void;
  select: (id: string) => void;
  deselect: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  isSelected: (id: string) => boolean;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  selectedItems: T[];
  selectedCount: number;
  getDisplayText: (
    emptyText?: string,
    singleFormatter?: (item: T) => string,
    pluralFormatter?: (count: number) => string
  ) => string;
}

/**
 * Hook to manage multi-select state for lists
 * @param options - Configuration options
 * @returns Object with selection state and handlers
 */
export function useMultiSelect<T>(
  options: UseMultiSelectOptions<T>
): UseMultiSelectReturn<T> {
  const { items, getItemId, getItemLabel } = options;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const select = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const deselect = useCallback((id: string) => {
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(items.map(getItemId));
  }, [items, getItemId]);

  const deselectAll = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds]
  );

  const isAllSelected = useMemo(
    () => items.length > 0 && selectedIds.length === items.length,
    [items.length, selectedIds.length]
  );

  const isPartiallySelected = useMemo(
    () => selectedIds.length > 0 && selectedIds.length < items.length,
    [items.length, selectedIds.length]
  );

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.includes(getItemId(item))),
    [items, selectedIds, getItemId]
  );

  const selectedCount = selectedIds.length;

  const getDisplayText = useCallback(
    (
      emptyText = "Select items...",
      singleFormatter?: (item: T) => string,
      pluralFormatter?: (count: number) => string
    ) => {
      if (selectedCount === 0) return emptyText;
      if (selectedCount === 1) {
        const item = selectedItems[0];
        if (singleFormatter) return singleFormatter(item);
        if (getItemLabel) return getItemLabel(item);
        return getItemId(item);
      }
      if (pluralFormatter) return pluralFormatter(selectedCount);
      return `${selectedCount} items selected`;
    },
    [selectedCount, selectedItems, getItemId, getItemLabel]
  );

  return {
    selectedIds,
    toggle,
    select,
    deselect,
    selectAll,
    deselectAll,
    isSelected,
    isAllSelected,
    isPartiallySelected,
    selectedItems,
    selectedCount,
    getDisplayText,
  };
}
