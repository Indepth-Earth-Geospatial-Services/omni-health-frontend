# ⚠️ TEMPORARY — delete this folder when the backend ships the map endpoint

This is a workaround, not a design. It exists only because one request cannot
complete **on a local dev server**, and it should be removed the moment the
lightweight endpoint lands.

## This is a local-development problem only

Production is fine. The same request, three environments:

| environment | result |
|---|---|
| direct to backend | HTTP 200 — 796,644 bytes, **54.1 s** |
| **production** (Vercel rewrite) | HTTP 200 — 796,644 bytes, **54.1 s** |
| **local `next dev`** rewrite | **HTTP 500 at ~30 s** — `socket hang up` |

Identical bytes, identical time upstream. Vercel's edge proxy streams a long
upstream response happily; the dev server proxies through Node's `undici` fetch,
which gives up at ~30 s and surfaces a generic `Internal Server Error`. React
Query then retries a request that can never finish, filling the log with
`Failed to proxy … socket hang up`.

**So `useFacilitiesForMap` chunks only when `NODE_ENV === "development"`.**
Production keeps the single `limit=1000` request and its caching options,
exactly as before this folder existed. Chunking in production would turn one
54 s call into six sequential ones (~75 s) for no benefit.

## The problem it works around

The super-admin map needs every facility. It asks for them in one request:

```
GET /facilities/search?page=1&limit=1000
```

Throughput measures at ~10 KB/s, so the cost is **per-record work on the
server**, not transfer — roughly `1.5 s + 0.21 s × facilities`:

| page size | time |
|---|---|
| 25 | 7.3 s |
| 50 | 13.9 s |
| 100 | 23.4 s |
| 271 (all) | 55 s ❌ |

## What this does instead

Walks the list in pages of 50, one request at a time, publishing after each page
so pins appear progressively. Every request lands around 14 s — roughly half the
proxy's 30 s limit.

Page size drives per-request time, **not** the total facility count, so this
stays safe as the dataset grows. Total wall-clock does not:

| facilities | pages | total |
|---|---|---|
| 271 (at time of writing) | 6 | ~81 s |
| 400 | 8 | ~110 s |
| 500 | 10 | ~135 s |

**This gets worse every week you add data.** It buys a map that works, slowly.
It is not a solution.

## The real fix

A dedicated endpoint returning every facility with only the five fields the map
actually reads — verified by grepping `SuperAdminMap` and `MostActiveZonesCard`:

```json
{ "facility_id": "uuid", "facility_name": "…", "lat": 4.8156, "lon": 7.0498, "facility_category": "Health Post" }
```

That is **44.9 KB instead of 776.8 KB — a 94.2% reduction**. Because the latency
is per-record assembly (almost certainly subqueries for `inventory`,
`services_list` and `specialists`), a projection that never loads those fields
should collapse the time as well as the payload.

## How to delete this

1. Delete this folder.
2. Point the three call sites at the new endpoint's hook. Each imports
   `useFacilitiesForMap` from here and calls it once — swap both lines:

   | file | what to change |
   |---|---|
   | `components/layouts/QuickAccessMap.tsx` | import + `useFacilitiesForMap()` |
   | `components/layouts/MostActiveZonesCard.tsx` | import + `useFacilitiesForMap()` |
   | `components/pages/Map.tsx` | import + `useFacilitiesForMap({ gcTime, refetchInterval, refetchIntervalInBackground })` — keep those options, they are forwarded to React Query |

3. `npx tsc --noEmit` will point at anything missed — the folder has no other
   importers.

Note the call sites read `data.facilities` and `data.pagination.total_records`,
so a replacement hook returning that shape needs no further changes.

Nothing else in the codebase depends on it.
