"use client";
import { useMemo } from "react";
import KPIStatsCards from "@/features/admin/components/layout/KPICards";
import QuickStatsHeader from "@/features/admin/components/layout/QuickStatsHeader";
import AdmissionsRateChart from "../charts/AdmissionsRateChartProps";
import { Users, ChevronRight, Bed, Package, UserCog } from "lucide-react";
import { useCurrentFacilityId } from "@/store/auth-store";
import {
  useAdminStaff,
  useFacilityInventory,
} from "@/features/admin/hooks/useAdminStaff";
import { useFacility } from "@/hooks/use-facilities";

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
        <QuickStatsHeader />
        <div className="mb-4 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPIStatsCards
            title="Total Staff"
            value={isLoading ? "-" : kpiMetrics.totalStaff}
            subtitle={`${kpiMetrics.activeStaff} Active, ${kpiMetrics.inactiveStaff} Inactive`}
            icon={<Users size={24} />}
            trend={{
              value: `${kpiMetrics.activeStaff > 0 ? Math.round((kpiMetrics.activeStaff / kpiMetrics.totalStaff) * 100) : 0}%`,
              isPositive: true,
            }}
          />
          <KPIStatsCards
            title="Available Beds"
            value={isLoading ? "-" : kpiMetrics.totalBeds}
            subtitle="From equipment inventory"
            icon={<Bed size={24} />}
            trend={{
              value: kpiMetrics.totalBeds > 0 ? "Available" : "None",
              isPositive: kpiMetrics.totalBeds > 0,
            }}
          />
          <KPIStatsCards
            title="Inventory"
            value={
              isLoading
                ? "-"
                : kpiMetrics.equipmentItems + kpiMetrics.equipmentCount
            }
            subtitle={`${kpiMetrics.equipmentItems} Equipment (${kpiMetrics.equipmentCount}), ${kpiMetrics.infrastructureItems} Infrastructure (${kpiMetrics.infrastructureCount})`}
            icon={<Package size={24} />}
            trend={{ value: "In Stock", isPositive: true }}
          />
          <KPIStatsCards
            title="Specialist"
            value={isLoading ? "-" : kpiMetrics.specialists}
            subtitle="Healthcare professionals"
            icon={<UserCog size={24} />}
            trend={{ value: "Active", isPositive: true }}
          />
        </div>

        <AdmissionsRateChart />

        <section>
          <div className="mt-6 flex w-full flex-col justify-between gap-4 md:flex-row">
            {/* --- Card 1: Facility Specialists List --- */}
            <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-700">
                  Healthcare Professionals
                </h2>
                <button className="flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">
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
                        className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#375DFB] text-sm font-medium text-white">
                            {formattedName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-700">
                              {formattedName}
                            </h3>
                            <p className="text-sm text-slate-400">
                              Facility Specialist
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
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

            {/* --- Card 2: Teaching Sessions --- */}
            <div className="flex flex-[1.2] flex-col items-center justify-between gap-8 rounded-xl border border-gray-200 bg-white p-8 xl:flex-row">
              <div className="relative flex h-80 w-80 items-center justify-center">
                <svg
                  viewBox="0 0 256 256"
                  className="h-full w-full -rotate-90 transform"
                >
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke="#f1f5f9"
                    strokeWidth="14"
                    fill="transparent"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="88"
                    stroke="#f1f5f9"
                    strokeWidth="14"
                    fill="transparent"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="66"
                    stroke="#f1f5f9"
                    strokeWidth="14"
                    fill="transparent"
                  />

                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke="#2D5A5A"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray="691"
                    strokeDashoffset="318"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="88"
                    stroke="#14B8A6"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray="553"
                    strokeDashoffset="177"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="66"
                    stroke="#5EEAD4"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray="414"
                    strokeDashoffset="58"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute text-center">
                  <p className="text-base text-slate-400">Ongoing</p>
                  <p className="text-2xl leading-tight font-bold text-slate-800">
                    Teaching
                    <br />
                    Sessions
                  </p>
                </div>
              </div>

              <div className="flex min-w-40 flex-col justify-center space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="h-4 w-4 rounded-full bg-teal-300"></span>
                    <span className="text-base font-medium text-slate-500">
                      <b className="font-bold text-slate-800">14%</b> Available
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-4 w-4 rounded-full bg-teal-500"></span>
                    <span className="text-base font-medium text-slate-500">
                      <b className="font-bold text-slate-800">32%</b> Occupied
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-4 w-4 rounded-full bg-[#2D5A5A]"></span>
                    <span className="text-base font-medium text-slate-500">
                      <b className="font-bold text-slate-800">54%</b>{" "}
                      Utilization
                    </span>
                  </div>
                </div>

                <button className="mt-4 flex w-fit items-center rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-gray-50">
                  View all{" "}
                  <ChevronRight size={16} className="ml-2 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
