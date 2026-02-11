"use client";

import { useState, useCallback } from "react";

export interface CollapsibleSection {
  id: string;
  label: string;
  defaultOpen?: boolean;
}

/**
 * Hook to manage multiple collapsible sections
 * @param sections - Array of section configurations
 * @returns Object with state and toggle functions
 */
export function useCollapsibleSections(sections: CollapsibleSection[]) {
  const initialState = sections.reduce(
    (acc, section) => {
      acc[section.id] = section.defaultOpen ?? true;
      return acc;
    },
    {} as Record<string, boolean>
  );

  const [openSections, setOpenSections] = useState(initialState);

  const toggle = useCallback((sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  const open = useCallback((sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: true,
    }));
  }, []);

  const close = useCallback((sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: false,
    }));
  }, []);

  const openAll = useCallback(() => {
    setOpenSections(
      sections.reduce(
        (acc, section) => {
          acc[section.id] = true;
          return acc;
        },
        {} as Record<string, boolean>
      )
    );
  }, [sections]);

  const closeAll = useCallback(() => {
    setOpenSections(
      sections.reduce(
        (acc, section) => {
          acc[section.id] = false;
          return acc;
        },
        {} as Record<string, boolean>
      )
    );
  }, [sections]);

  const isOpen = useCallback(
    (sectionId: string) => openSections[sectionId] ?? false,
    [openSections]
  );

  return {
    openSections,
    toggle,
    open,
    close,
    openAll,
    closeAll,
    isOpen,
  };
}
