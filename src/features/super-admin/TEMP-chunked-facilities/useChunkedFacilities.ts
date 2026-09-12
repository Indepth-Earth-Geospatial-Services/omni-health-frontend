"use client";

/**
 * ⚠️ TEMPORARY — delete this whole folder once the backend ships a lightweight
 * facility endpoint. See ./README.md for why it exists and how to remove it.
 */

import { useEffect, useSyncExternalStore } from "react";
import type { UseQueryOptions } from "@tanstack/react-query";
import {
  superAdminService,
  type Facility,
  type SearchFacilityResponse,
} from "@/features/super-admin/services/super-admin.service";
import { useFacilities } from "@/features/super-admin/hooks/useSuperAdminUsers";

/**
 * Chunking is a LOCAL-ONLY fix. Measured on the same request:
 *
 *   direct to backend            200 — 796,644 bytes, 54.1 s
 *   production (Vercel rewrite)  200 — 796,644 bytes, 54.1 s
 *   local `next dev` rewrite     500 at ~30 s — socket hang up
 *
 * Vercel's edge proxy streams a long upstream response happily; the dev
 * server's undici fetch gives up at ~30 s. So production must keep using the
 * single request — chunking there would turn one 54 s call into six sequential
 * ones (~75 s) and lose Map.tsx's caching options for no benefit.
 */
const USE_CHUNKED_FETCH = process.env.NODE_ENV === "development";

/**
 * 50 records ≈ 14 s against a backend that costs ~0.21 s per facility. The
 * Next.js rewrite proxy aborts at 30 s, so this leaves ~15 s of headroom on
 * every request. Page size drives the per-request time — not the total number
 * of facilities — so this stays safe as the dataset grows.
 */
const PAGE_SIZE = 50;

/** Stops a malformed pagination response from looping forever. */
const MAX_PAGES = 100;

type Status = "idle" | "loading" | "done" | "error";

interface Snapshot {
  facilities: Facility[];
  /** Total the API reports, so callers can show "120 of 271". */
  totalCount: number;
  loadedCount: number;
  /** True only once every page has landed. */
  isComplete: boolean;
  /** True while the first page is still in flight — nothing to draw yet. */
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

const EMPTY: Snapshot = {
  facilities: [],
  totalCount: 0,
  loadedCount: 0,
  isComplete: false,
  isLoading: true,
  isError: false,
  error: null,
};

// Module-level so every consumer on the page shares one set of requests and one
// result. QuickAccessMap and MostActiveZonesCard both mount on the dashboard.
const listeners = new Set<() => void>();
let status: Status = "idle";
let collected: Facility[] = [];
let reportedTotal = 0;
let failure: unknown = null;
let snapshot: Snapshot = EMPTY;

function publish() {
  snapshot = {
    facilities: collected,
    totalCount: reportedTotal,
    loadedCount: collected.length,
    isComplete: status === "done",
    isLoading: status === "loading" && collected.length === 0,
    isError: status === "error",
    error: failure,
  };
  listeners.forEach((notify) => notify());
}

/**
 * Walks the pages one at a time, publishing after each so pins appear
 * progressively rather than all at once at the end. Sequential on purpose:
 * only ever one request in flight against the backend.
 */
async function loadAllFacilities() {
  if (status === "loading" || status === "done") return;

  status = "loading";
  failure = null;
  collected = [];
  publish();

  try {
    const accumulated: Facility[] = [];

    for (let page = 1; page <= MAX_PAGES; page++) {
      const response = await superAdminService.searchFacilities({
        page,
        limit: PAGE_SIZE,
      });

      const batch = response.facilities ?? [];
      accumulated.push(...batch);

      // New array each time so consumers see a changed reference and re-render.
      collected = [...accumulated];
      reportedTotal = response.pagination?.total_records ?? accumulated.length;
      publish();

      const totalPages = response.pagination?.total_pages ?? 1;
      if (page >= totalPages || batch.length === 0) break;
    }

    status = "done";
    publish();
  } catch (err) {
    status = "error";
    failure = err;
    publish();
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/** Lets a caller force a refetch after an error. */
export function retryChunkedFacilities() {
  if (status === "loading") return;
  status = "idle";
  void loadAllFacilities();
}

/**
 * Drop-in stand-in for `useFacilities({ page: 1, limit: 1000 })`, which now
 * exceeds the proxy timeout. Returns the same `{ data, isLoading, isError }`
 * shape so call sites barely change, plus progress fields.
 */
export function useChunkedFacilities(enabled = true) {
  const state = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => EMPTY,
  );

  useEffect(() => {
    if (!enabled) return;
    void loadAllFacilities();
  }, [enabled]);

  if (!enabled) {
    return {
      data: { facilities: [] as Facility[], pagination: { total_records: 0 } },
      isLoading: false,
      isError: false,
      error: null,
      isComplete: false,
      loadedCount: 0,
      totalCount: 0,
    };
  }

  return {
    // Mirrors the SearchFacilityResponse shape the old hook returned, so call
    // sites reading `data.facilities` / `data.pagination.total_records` keep
    // working unchanged.
    data: {
      facilities: state.facilities,
      pagination: { total_records: state.totalCount },
    },
    isLoading: state.isLoading,
    isError: state.isError,
    error: state.error,
    isComplete: state.isComplete,
    loadedCount: state.loadedCount,
    totalCount: state.totalCount,
  };
}

/**
 * What the map call sites import.
 *
 * Chooses the chunked pager in local development and the ordinary single
 * request everywhere else, so production behaviour is exactly what it was
 * before this folder existed — including the caching options Map.tsx passes.
 *
 * Both hooks are called unconditionally (rules of hooks); the inactive one is
 * disabled so it issues no request.
 */
export function useFacilitiesForMap(
  options?: Partial<UseQueryOptions<SearchFacilityResponse>>,
) {
  const chunked = useChunkedFacilities(USE_CHUNKED_FETCH);
  const direct = useFacilities(
    { page: 1, limit: 1000 },
    { ...options, enabled: !USE_CHUNKED_FETCH },
  );

  if (USE_CHUNKED_FETCH) {
    return {
      data: chunked.data,
      isLoading: chunked.isLoading,
      isError: chunked.isError,
    };
  }

  return {
    data: direct.data
      ? {
          facilities: direct.data.facilities,
          pagination: {
            total_records: direct.data.pagination?.total_records ?? 0,
          },
        }
      : undefined,
    isLoading: direct.isLoading,
    isError: direct.isError,
  };
}
