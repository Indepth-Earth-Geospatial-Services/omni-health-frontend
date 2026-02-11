"use client";

import { useEffect, useRef, RefObject } from "react";

/**
 * Hook to detect clicks outside of a referenced element
 * @param handler - Callback function to execute when clicking outside
 * @param enabled - Whether the listener should be active (default: true)
 * @returns RefObject to attach to the element
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: () => void,
  enabled: boolean = true
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handler, enabled]);

  return ref;
}
