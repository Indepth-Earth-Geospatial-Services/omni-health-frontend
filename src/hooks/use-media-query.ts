"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  // Single MQL instance shared by both subscribe and getSnapshot.
  // useMemo re-creates it only when query changes.
  const mql = useMemo(
    () => (typeof window !== "undefined" ? window.matchMedia(query) : null),
    [query],
  );

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!mql) return () => {};
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    [mql],
  );

  const getSnapshot = useCallback(() => mql?.matches ?? false, [mql]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
