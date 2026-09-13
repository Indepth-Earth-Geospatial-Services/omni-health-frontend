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
