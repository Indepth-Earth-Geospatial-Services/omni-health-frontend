"use client";
import { useMemo } from "react";
import KPIStatsCards from "@/features/admin/components/layout/KPICards";
// import QuickStatsHeader from "@/features/admin/components/layout/QuickStatsHeader";
import {
  Users,
  ChevronRight,
  Bed,
  Package,
  UserCog,
  Clock,
  MapPin,
  Phone,
  Mail,
  Building2,
  Pencil,
} from "lucide-react";
import { formatTimeRange } from "../../utils/formatters";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import { MAPBOX_TOKEN } from "@/constants";
import { useCurrentFacilityId } from "@/features/auth/auth-store";
import {
  useAdminStaff,
  useFacilityInventory,
} from "@/features/admin/hooks/useAdminStaff";
import { useFacility } from "@/hooks/use-facilities";
import { useRouter } from "next/navigation";

/**
 * Helper function to count all bed-related items in inventory
 */
const countBedsFromInventory = (
  inventory: Record<string, number | unknown> | undefined,
): number => {
  if (!inventory) return 0;

  let totalBeds = 0;
  Object.entries(inventory).forEach(([key, value]) => {
    const keyLower = key.toLowerCase();
    if (keyLower.includes("bed") || keyLower.includes("cot")) {
      const val = Number(value);
      if (!isNaN(val)) {
        totalBeds += val;
      }
    }
  });

  return totalBeds;
};

export default function Overview() {
  const facilityId = useCurrentFacilityId();
  const router = useRouter();

  // Fetch facility data (includes specialists)
  const { data: facilityData, isLoading: isFacilityLoading } =
    useFacility(facilityId);
  const facility = facilityData?.facility;

  // Fetch staff data (needed for Total Staff KPI)
  const { data: staffData, isLoading: isStaffLoading } = useAdminStaff(
    facilityId,
    { page: 1, limit: 100 },
  );

  // Fetch inventory data
  const { data: inventoryData, isLoading: isInventoryLoading } =
    useFacilityInventory(facilityId);

  // Calculate KPI metrics
  const kpiMetrics = useMemo(() => {
    const staffList = staffData?.staff || [];
    const totalStaff = staffList.length;
    const activeStaff = staffList.filter((s) => s.is_active === true).length;
    const inactiveStaff = staffList.filter((s) => s.is_active === false).length;

    // --- Specialists Logic (From Facility Data) ---
    // The endpoint returns an array of strings: ["doctors", "nurses", "pharmacy_technicia", ...]
    const facilitySpecialists = facility?.specialists || [];
    const specialistsCount = facilitySpecialists.length;

    // --- Bed Logic ---
    const facilityInfrastructure = facility?.inventory?.infrastructure || {};
    const totalBeds = countBedsFromInventory(
      facilityInfrastructure as Record<string, number>,
    );

    // --- Inventory Logic ---
    const equipment = inventoryData?.inventory?.equipment || {};
    const infrastructure = inventoryData?.inventory?.infrastructure || {};

    const equipmentItems = Object.keys(equipment).length;
    const equipmentCount = Object.values(equipment).reduce((sum, qty) => {
      const val = Number(qty);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

    const infrastructureItems = Object.keys(infrastructure).length;
    const infrastructureCount = Object.values(infrastructure).reduce(
      (sum, qty) => {
        const val = Number(qty);
        return sum + (isNaN(val) ? 0 : val);
      },
      0,
    );

    const totalInventory = equipmentCount + infrastructureCount;

    return {
      totalStaff,
      activeStaff,
      inactiveStaff,
      specialists: specialistsCount,
      totalBeds,
      equipmentItems,
      equipmentCount,
      infrastructureItems,
      infrastructureCount,
      totalInventory,
      facilitySpecialists, // Full list of strings
    };
  }, [staffData, inventoryData, facility]);

  const isLoading = isStaffLoading || isInventoryLoading || isFacilityLoading;

  return (
    <>
      <main className="flex min-h-screen flex-col">
        <div className="mb-4 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* <QuickStatsHeader /> */}
          <KPIStatsCards
            title="Total Staff"
            value={isLoading ? "-" : kpiMetrics.totalStaff}
            subtitle={`${kpiMetrics.activeStaff} Active, ${kpiMetrics.inactiveStaff} Inactive`}
            icon={<Users size={24} />}
            detailsHref="/admin/staff"
          />
          <KPIStatsCards
            title="Available Beds"
            value={isLoading ? "-" : kpiMetrics.totalBeds}
            subtitle="From equipment inventory"
            icon={<Bed size={24} />}
            detailsHref="/admin/facility"
          />
          <KPIStatsCards
            title="Inventory"
            value={
              isLoading
                ? "-"
                : kpiMetrics.equipmentItems + kpiMetrics.equipmentCount
            }
            subtitle={`${kpiMetrics.equipmentItems} Equipment, ${kpiMetrics.infrastructureItems} Infrastructure`}
            icon={<Package size={24} />}
            detailsHref="/admin/equipments"
          />
          <KPIStatsCards
            title="Specialist"
            value={isLoading ? "-" : kpiMetrics.specialists}
            subtitle="Healthcare professionals"
            icon={<UserCog size={24} />}
            detailsHref="/admin/facility"
          />
        </div>

        {/* Working Hours + Facility Overview. Stacks below lg — two cards
            sharing a phone's width leaves neither readable. */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:gap-6">
          {/* Working Hours */}
          <div className="flex min-w-0 flex-1 flex-col rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50">
                <Clock size={18} className="text-teal-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Working Hours
                </h2>
                <p className="text-xs text-slate-400">
                  Current facility schedule
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-1 flex-col gap-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg px-3 py-2"
                  >
                    <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
                    <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-1 flex-col gap-1">
                {(() => {
                  const DAY_ORDER = [
                    "sunday",
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                  ];
                  const hours = Object.entries(
                    (facility?.working_hours as
                      Record<string, string> | undefined) ?? {},
                  ).sort(([a], [b]) => {
                    const ai = DAY_ORDER.indexOf(a.toLowerCase());
                    const bi = DAY_ORDER.indexOf(b.toLowerCase());
                    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
                  });
                  return hours.length === 0 ? (
                    <p className="py-6 text-center text-sm text-slate-400">
                      No operating hours set
                    </p>
                  ) : (
                    hours.map(([day, raw]) => {
                      const isClosed = !raw || raw.toLowerCase() === "closed";
                      const hours = isClosed ? "Closed" : formatTimeRange(raw);
                      const todayName = new Date()
                        .toLocaleDateString("en-US", { weekday: "long" })
                        .toLowerCase();
                      const isToday = day.toLowerCase() === todayName;

                      return (
                        <div
                          key={day}
                          className={`flex items-center justify-between gap-2 rounded-lg px-2 py-2 sm:px-3 ${isToday ? "bg-teal-50 ring-1 ring-teal-200" : "hover:bg-slate-50"}`}
                        >
                          <span
                            className={`truncate text-sm font-medium capitalize ${isToday ? "text-teal-700" : "text-slate-600"}`}
                          >
                            {isToday ? `${day} (Today)` : day}
                          </span>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap sm:px-2.5 sm:text-xs ${isClosed ? "bg-red-50 text-red-500" : isToday ? "bg-teal-100 text-teal-700" : "bg-green-50 text-green-600"}`}
                          >
                            {hours}
                          </span>
                        </div>
                      );
                    })
                  );
                })()}
              </div>
            )}
          </div>

          {/* Facility Overview */}
          <div className="flex min-w-0 flex-1 flex-col rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                  <Building2 size={18} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    Facility Overview
                  </h2>
                  <p className="text-xs text-slate-400">
                    Key facility information
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push("/admin/facility")}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <Pencil size={13} />
                Edit Profile
              </button>
            </div>

            {isLoading ? (
              <div className="flex flex-1 flex-col gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 w-full animate-pulse rounded-lg bg-slate-100"
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-1 flex-col gap-3">
                {/* Name + category */}
                <div className="rounded-lg bg-slate-50 px-4 py-3">
                  <p className="mb-0.5 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                    Facility Name
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {facility?.facility_name || "—"}
                  </p>
                  {facility?.facility_category && (
                    <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                      {facility.facility_category}
                    </span>
                  )}
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 rounded-lg bg-slate-50 px-4 py-3">
                  <MapPin
                    size={15}
                    className="mt-0.5 shrink-0 text-slate-400"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                      Location
                    </p>
                    <p className="text-sm text-slate-700">
                      {[
                        facility?.address,
                        facility?.town,
                        facility?.facility_lga,
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </p>
                  </div>
                </div>

                {/* Contact — one per row on phones, where two columns leave the
                    email truncated to nothing */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-3">
                    <Phone size={14} className="shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                        Phone
                      </p>
                      <p className="truncate text-xs text-slate-700">
                        {facility?.contact_info?.phone || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-3">
                    <Mail size={14} className="shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                        Email
                      </p>
                      <p className="truncate text-xs text-slate-700">
                        {facility?.contact_info?.email || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                {/* <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Star size={15} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-slate-800">
                      {facility?.average_rating?.toFixed(1) ?? "0.0"}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({facility?.total_reviews ?? 0}{" "}
                      {facility?.total_reviews === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                </div> */}
              </div>
            )}
          </div>
        </div>

        <section>
          <div className="mt-6 flex w-full flex-col justify-between gap-4 lg:flex-row">
            {/* --- Card 1: Facility Specialists List --- */}
            <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-slate-700 sm:text-xl">
                  Healthcare Professionals
                </h2>
                <button
                  onClick={() => router.push("/admin/facility")}
                  className="flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
                >
                  View all <ChevronRight size={16} className="ml-1" />
                </button>
              </div>

              <div className="max-h-90 space-y-4 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-pulse text-slate-400">
                      Loading...
                    </div>
                  </div>
                ) : kpiMetrics.facilitySpecialists.length > 0 ? (
                  kpiMetrics.facilitySpecialists.map((roleName, idx) => {
                    // Format the string: "medical_records_technician" -> "Medical Records Technician"
                    const formattedName = roleName
                      .toString()
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())
                      .replace(/"/g, ""); // Remove quotes if present in string

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50"
                      >
                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#375DFB] text-sm font-medium text-white">
                            {formattedName.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate font-semibold text-slate-700">
                              {formattedName}
                            </h3>
                            <p className="truncate text-sm text-slate-400">
                              Facility Specialist
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-medium text-[#375DFB]">
                            {/* Role is the same as name in this context */}
                            Staff
                          </p>
                          <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Available
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="py-8 text-center text-slate-400">
                    No specialists listed
                  </p>
                )}
              </div>
            </div>

            {/* --- Card 2: Facility Location Map --- */}
            <div className="relative min-h-80 min-w-0 flex-[1.2] overflow-hidden rounded-xl border border-gray-200 bg-white">
              {/* Header overlay */}
              <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-2 border-b border-gray-100 bg-white/90 px-4 py-3 backdrop-blur-sm sm:px-5">
                <div className="flex min-w-0 items-center gap-2">
                  <MapPin size={15} className="shrink-0 text-teal-600" />
                  <h2 className="truncate text-sm font-bold text-slate-800">
                    Facility Location
                  </h2>
                </div>
                {facility?.facility_lga && (
                  <span className="shrink-0 truncate rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700">
                    {facility.facility_lga}
                  </span>
                )}
              </div>

              {facility?.lat && facility?.lon ? (
                <FacilityMap lat={facility.lat} lon={facility.lon} />
              ) : (
                <div className="flex h-full min-h-94 flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
                  <MapPin size={32} className="opacity-40" />
                  <p className="text-sm">No location data available</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

// ── Facility Map sub-component ────────────────────────────────────────────────
function FacilityMap({ lat, lon }: { lat: number; lon: number }) {
  return (
    <div className="h-full min-h-64 pt-11">
      <Map
        initialViewState={{ longitude: lon, latitude: lat, zoom: 15 }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />
        <Marker longitude={lon} latitude={lat} anchor="center">
          <div className="relative flex items-center justify-center">
            {/* Ripple rings */}
            <span className="absolute h-20 w-20 animate-ping rounded-full bg-teal-400 opacity-20" />
            <span
              className="absolute h-12 w-12 animate-ping rounded-full bg-teal-500 opacity-30"
              style={{ animationDelay: "0.4s" }}
            />
            <span
              className="absolute h-7 w-7 animate-ping rounded-full bg-teal-600 opacity-40"
              style={{ animationDelay: "0.8s" }}
            />
            {/* Pin dot */}
            <span className="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-teal-600 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-white" />
            </span>
          </div>
        </Marker>
      </Map>
    </div>
  );
}
