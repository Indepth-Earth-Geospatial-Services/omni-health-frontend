"use client";

import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

/** Below Tailwind's `lg` — i.e. medium screens and narrower. */
const NARROW_SCREEN_QUERY = "(max-width: 1023px)";

/**
 * Collapse state shared by the admin and super-admin sidebars.
 *
 * Medium screens and narrower collapse on their own to hand the width back to
 * the tables and maps. An explicit toggle overrides that — `userPreference` of
 * `null` means "follow the viewport".
 *
 * State lives in the layout, which persists across routes within a section, so
 * a choice survives navigation. A hard reload starts from the viewport again.
 */
export function useSidebarCollapse() {
  const isNarrowScreen = useMediaQuery(NARROW_SCREEN_QUERY);
  const [userPreference, setUserPreference] = useState<boolean | null>(null);
  const [lastScreenWasNarrow, setLastScreenWasNarrow] =
    useState(isNarrowScreen);

  // Crossing the breakpoint retires the old preference, so resizing back to a
  // wide screen reopens the sidebar rather than stranding it collapsed at a
  // width the choice was never made for. Adjusting state during render is the
  // documented alternative to synchronising it from an effect.
  if (lastScreenWasNarrow !== isNarrowScreen) {
    setLastScreenWasNarrow(isNarrowScreen);
    setUserPreference(null);
  }

  const isCollapsed = userPreference ?? isNarrowScreen;

  return {
    isCollapsed,
    toggle: () => setUserPreference(!isCollapsed),
  };
}
