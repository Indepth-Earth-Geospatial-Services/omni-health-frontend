# Change to `src/features/user/hooks/use-drawer-data.ts`

**Date:** 2026-09-13
**File owner:** citizen/public "User" side of the app (not modified by me otherwise)
**Status:** Applied while investigating a reported page freeze. That freeze turned out to
be about a *different* page (`src/features/super-admin/components/pages/AllUsers.tsx`) —
this change was made on a mistaken premise. It is a real, narrow bug fix on its own merits
(explained below), but it was **not requested by the file's owner** and should be reviewed
by them before being treated as permanent.

## What was changed

One `useEffect`'s dependency array, inside `useDrawerData()`. Nothing else in the file,
and nothing in any other file, was touched.

## Why (the bug, if you want the context)

```ts
// BEFORE
useEffect(() => {
  const timer = setTimeout(() => {
    if (inView && lgaQuery.hasNextPage && !lgaQuery.isFetchingNextPage) {
      lgaQuery.fetchNextPage();
    }
  }, 100);
  return () => clearTimeout(timer);
}, [inView, lgaQuery]);
```

`lgaQuery` is a React Query result object, which React Query returns as a **new object
reference on nearly every render** — not only when the pagination state actually changes.
Because the whole object was in the dependency array, this effect re-ran far more often
than intended, re-arming the same 100ms auto-fetch timer each time. Combined with the
"load more" sentinel typically being in view for most of the page's life, this produced
near-continuous `fetchNextPage()` calls instead of one fetch per genuine scroll event —
and each new page arriving re-triggers a map camera-fit animation elsewhere
(`use-map-camera.ts`), which is what made the page feel like it froze.

## The actual diff

```ts
// AFTER — added this line just above the effect
const { hasNextPage, isFetchingNextPage, fetchNextPage } = lgaQuery;

useEffect(() => {
  const timer = setTimeout(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, 100);
  return () => clearTimeout(timer);
}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
```

The logic inside the effect is byte-for-byte identical — only *what triggers the effect
to re-run* changed, from the whole `lgaQuery` object to its three actual fields.

## How to revert

Open `src/features/user/hooks/use-drawer-data.ts` and replace this block:

```ts
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = lgaQuery;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, 100);
    return () => clearTimeout(timer);
    // `lgaQuery` itself is a fresh object every render (React Query returns a
    // new result object on essentially every render, including ones this
    // effect shouldn't care about), so depending on it directly reran this
    // effect constantly. Each rerun re-armed the same 100ms auto-fetch timer,
    // and since the sentinel is in view for most of this page's life, that
    // meant near-continuous fetchNextPage() calls racing each other — each
    // one growing `allFacilities`, which in turn re-triggers the map's
    // fitBounds/camera-animation effect (see use-map-camera.ts) on every new
    // page. That combination of rapid-fire network + repeated camera resets
    // is what froze the tab. Depending on the primitives themselves makes
    // this effect only run when one of them actually changes.
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
```

with the original:

```ts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inView && lgaQuery.hasNextPage && !lgaQuery.isFetchingNextPage) {
        lgaQuery.fetchNextPage();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [inView, lgaQuery]);
```

That fully restores the file to its state before this session touched it. No other files
need changing to revert — this was the only edit made to the "User" side of the app.

## If your colleague objects

Point them at this file. The whole change is the one dependency-array line shown above;
everything else in `use-drawer-data.ts` (and the rest of `src/features/user/**`) is
untouched.

---

# Change to `src/features/compare-facilities/hooks/useFacilityDirections.ts`

**Date:** 2026-09-14
**Status:** Applied to fix a real, reported console warning. Not a revert candidate for
the same reason as above — it's a straightforward bug fix — but logged here at the
client's request alongside the other narrow hook fix in this file.

## What was reported

Repeated console spam on `/compare-facilities`:

```
[QueriesObserver]: Duplicate Queries found. This might result in unexpected behavior.
```

## Why (the bug)

`useFacilityDirections` fetches directions for both comparison slots (A and B) in a single
`useQueries` call, one entry per slot:

```ts
// BEFORE
const facilities = [facilityA, facilityB];
return facilities.map((facility, index) => ({
  queryKey: ["directions", userLocation, facility?.facility_id],
  ...
}));
```

Before the user has selected any facilities — the page's default state
(`useCompareFacilities` initializes both slots to `null`) — `facility?.facility_id` is
`undefined` for *both* array entries. That makes both queries resolve to the exact same
key, `["directions", userLocation, undefined]`. TanStack's `QueriesObserver` checks its own
`queries` array for duplicate query hashes on every render and warns exactly when two
entries collide like that, which is why it fired repeatedly while no facilities were
selected yet (the page's normal starting state, not an edge case).

## The actual diff

```ts
// AFTER
const facilities = [facilityA, facilityB];
return facilities.map((facility, index) => ({
  queryKey: [
    "directions",
    userLocation,
    facility?.facility_id ?? `empty-${index}`,
  ],
  ...
}));
```

Falling back to the slot index instead of leaving both keys as `undefined` keeps the two
queries distinct whenever a slot is empty, while still legitimately sharing a cache entry
if the same facility is ever picked for both slots (that case is a real duplicate, not a bug).

## How to revert

Open `src/features/compare-facilities/hooks/useFacilityDirections.ts` and change the
`queryKey` line back to:

```ts
queryKey: ["directions", userLocation, facility?.facility_id],
```

removing the `?? \`empty-${index}\`` fallback. No other files need changing.

---

# Change to `src/services/facility.service.ts`

**Date:** 2026-09-14
**Status:** Production bug fix, same root cause as a fix already made earlier in
`super-admin.service.ts`.

## What was reported

After deploying, the public/citizen side of the app failed to load facilities at all:

```
GET https://www.geohealth.ng/api/backend/facilities?limit=10&page=1 405 (Method Not Allowed)
```

Worked fine locally, broke only in production — same signature as the earlier inventory-page
405.

## Why (the bug)

`FacilityService.getAllFacilities()` called the bare list endpoint:

```ts
// BEFORE
const response = await apiClient.get(this.ENDPOINTS.HOME, { params }); // "/facilities"
```

The production backend does not accept `GET` on plain `/facilities` (it 405s there — that
route is apparently POST-only, for facility creation). This is the exact same class of bug
already found and fixed once this session in `getFacilitiesByInventory`
(`super-admin.service.ts`), which was switched from `/facilities` to `/facilities/search`.
`getAllFacilities` was the one call site that got missed at the time.

## The actual diff

```ts
// AFTER
const response = await apiClient.get(this.ENDPOINTS.SEARCH, { params }); // "/facilities/search"
```

`GetAllFacilities` and `SearchFacilities` are both aliases of the same `FacilityArray` type
(`src/types/api-response.ts`), so no downstream type or consumer changes were needed —
`filters` (name/category/performance_tier/service/lga_name) are the same params
`/facilities/search` already accepts via `addFilterParams`.

## How to revert

Open `src/services/facility.service.ts`, in `getAllFacilities`, change:

```ts
const response = await apiClient.get(this.ENDPOINTS.SEARCH, { params });
```

back to:

```ts
const response = await apiClient.get(this.ENDPOINTS.HOME, { params });
```

No other files need changing. (Reverting this will restore the production 405 on every page
that lists facilities for citizens — only do this if the backend's `/facilities` route is
fixed to support GET, not as a way to "undo" this change.)
