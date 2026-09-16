"use client";

import { useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Users,
  Stethoscope,
  Package,
  Boxes,
  Clock,
  Phone,
  Mail,
  Eye,
  Loader2,
  Search,
  UserCircle,
} from "lucide-react";
import { useFacility } from "@/hooks/use-facilities";
import { useFacilityStaff } from "@/features/super-admin/hooks/useFacilityStaff";
import { InventoryChecklist } from "@/features/admin/components/ui/InventoryChecklist";
import { convertInventoryToArray } from "@/features/admin/hooks/use-equipment-actions";
import Tabs from "@/features/super-admin/components/ui/Tabs";

type TabType = "overview" | "staff" | "equipment" | "infrastructure" | "hours";

const TABS = [
  { label: "Overview", value: "overview" },
  { label: "Staff", value: "staff" },
  { label: "Equipment", value: "equipment" },
  { label: "Infrastructure", value: "infrastructure" },
  { label: "Working Hours", value: "hours" },
];

// InventoryChecklist's write-action props are required by its interface but
// unreachable here — readOnly hides every control that would call them.
const noop = () => {};
const noopAsync = async () => {};

/**
 * Full-page, read-only view of one facility — for a super-admin browsing an
 * admin's facilities (from UserProfileModal) without switching into that
 * admin's actual (write-capable) dashboard. Reuses the same data hooks the
 * admin dashboard and FacilityDetailsModal already use; nothing here can
 * mutate anything, so there's no need to touch auth-store's facility-access
 * checks for this.
 */
export default function FacilityView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("facility_id") ?? "";
  const fromAdminName = searchParams.get("admin_name");

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [staffSearch, setStaffSearch] = useState("");
  const [equipmentOpen, setEquipmentOpen] = useState(true);
  const [infrastructureOpen, setInfrastructureOpen] = useState(true);

  const { data, isLoading, isError } = useFacility(facilityId);
  const facility = data?.facility;

  const { data: staffList = [], isLoading: isLoadingStaff } =
    useFacilityStaff(facilityId);

  if (!facilityId) {
    return (
      <EmptyState
        icon={<Building2 size={40} className="text-slate-300" />}
        message="No facility selected"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
      </div>
    );
  }

  if (isError || !facility) {
    return (
      <EmptyState
        icon={<Building2 size={40} className="text-slate-300" />}
        message="Could not load this facility"
      />
    );
  }

  const equipmentItems = convertInventoryToArray(facility.inventory?.equipment);
  const infrastructureItems = convertInventoryToArray(
    facility.inventory?.infrastructure,
  );
  const filteredStaff = staffList.filter((member) =>
    member.full_name.toLowerCase().includes(staffSearch.toLowerCase()),
  );

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <main className="flex min-h-screen flex-col p-6">
        <button
          onClick={() => router.back()}
          className="mb-4 flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
        >
          <ArrowLeft size={16} />
          Back{fromAdminName ? ` to ${fromAdminName}` : ""}
        </button>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100">
              <Building2 size={22} className="text-slate-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                {facility.facility_name}
              </h1>
              <p className="text-sm text-slate-500">
                {facility.facility_category} · {facility.facility_lga}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            <Eye size={12} />
            Read-only view
          </span>
        </div>

        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={(value) => setActiveTab(value as TabType)}
        />

        <div className="mt-4">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard
                  icon={<Users size={18} />}
                  label="Staff"
                  value={isLoadingStaff ? "—" : staffList.length}
                />
                <StatCard
                  icon={<Stethoscope size={18} />}
                  label="Specialists"
                  value={facility.specialists?.length ?? 0}
                />
                <StatCard
                  icon={<Package size={18} />}
                  label="Equipment types"
                  value={equipmentItems.length}
                />
                <StatCard
                  icon={<Boxes size={18} />}
                  label="Infrastructure types"
                  value={infrastructureItems.length}
                />
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-900">
                  Location
                </h3>
                <div className="space-y-3">
                  <Field
                    label="Local Government Area"
                    value={facility.facility_lga || "N/A"}
                  />
                  <Field label="Address" value={facility.address || "N/A"} />
                  {facility.lat && facility.lon && (
                    <Field
                      label="Geo-Coordinates"
                      value={`${facility.lat.toFixed(4)}, ${facility.lon.toFixed(4)}`}
                    />
                  )}
                </div>
              </div>

              <TagSection title="Specialists" items={facility.specialists} />
              <TagSection
                title="Services Offered"
                items={(facility.services_list ?? [])
                  .flatMap((item) => item.split(/\s+/))
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((s) => s.charAt(0).toUpperCase() + s.slice(1))}
              />

              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  {facility.contact_info?.phone && (
                    <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5">
                      <Phone size={16} className="text-slate-400" />
                      <p className="text-sm text-slate-600">
                        {facility.contact_info.phone}
                      </p>
                    </div>
                  )}
                  {facility.contact_info?.email && (
                    <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5">
                      <Mail size={16} className="text-slate-400" />
                      <p className="text-sm text-slate-600">
                        {facility.contact_info.email}
                      </p>
                    </div>
                  )}
                  {!facility.contact_info?.phone &&
                    !facility.contact_info?.email && (
                      <p className="text-sm text-slate-500">
                        No contact information available
                      </p>
                    )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "staff" && (
            <div>
              <div className="relative mb-4 max-w-sm">
                <Search
                  size={16}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={staffSearch}
                  onChange={(e) => setStaffSearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-4 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none"
                />
              </div>

              {isLoadingStaff ? (
                <div className="flex h-48 items-center justify-center text-slate-400">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : filteredStaff.length === 0 ? (
                <EmptyState
                  icon={<Users size={40} className="text-slate-300" />}
                  message={
                    staffSearch
                      ? `No results for "${staffSearch}"`
                      : "No staff found"
                  }
                />
              ) : (
                <div className="space-y-2">
                  {filteredStaff.map((member) => (
                    <div
                      key={member.staff_id}
                      className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                        <UserCircle size={20} className="text-slate-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {member.full_name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {member.rank_cadre ?? member.grade_level ?? "Staff"}
                        </p>
                      </div>
                      {member.is_active !== undefined && (
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                            member.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {member.is_active ? "Active" : "Inactive"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "equipment" && (
            <InventoryChecklist
              title="Equipment"
              items={equipmentItems}
              isOpen={equipmentOpen}
              onToggle={() => setEquipmentOpen((v) => !v)}
              onAdd={noop}
              onEdit={noop}
              onDelete={noop}
              onSaveStockTake={noopAsync}
              isAdding={false}
              addButtonLabel="Add Equipment"
              icon={Package}
              emptyMessage="No equipment tracked for this facility"
              readOnly
            />
          )}

          {activeTab === "infrastructure" && (
            <InventoryChecklist
              title="Infrastructure"
              items={infrastructureItems}
              isOpen={infrastructureOpen}
              onToggle={() => setInfrastructureOpen((v) => !v)}
              onAdd={noop}
              onEdit={noop}
              onDelete={noop}
              onSaveStockTake={noopAsync}
              isAdding={false}
              addButtonLabel="Add Infrastructure"
              icon={Boxes}
              emptyMessage="No infrastructure tracked for this facility"
              readOnly
            />
          )}

          {activeTab === "hours" && (
            <WorkingHoursTab hours={facility.working_hours} />
          )}
        </div>
      </main>
    </div>
  );
}

function EmptyState({ icon, message }: { icon: ReactNode; message: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 py-24 text-slate-400">
      {icon}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        {icon}
      </div>
      <div>
        <p className="text-xl font-semibold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-slate-500">{label}</p>
      <p className="border-b border-slate-200 pb-2 text-sm text-slate-900">
        {value}
      </p>
    </div>
  );
}

function TagSection({ title, items }: { title: string; items?: string[] }) {
  const list = items ?? [];
  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {list.length > 0 && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
            {list.length}
          </span>
        )}
      </div>
      {list.length === 0 ? (
        <p className="text-xs text-slate-400">Nothing listed</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {list.map((name, idx) => (
            <span
              key={idx}
              className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
            >
              {name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function WorkingHoursTab({ hours }: { hours?: Record<string, unknown> }) {
  const DAY_ORDER = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const todayKey = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  const formatHours = (value: unknown): string => {
    if (!value) return "Closed";
    if (typeof value === "string") return value;
    if (typeof value === "object" && value !== null) {
      const v = value as Record<string, unknown>;
      const open = v.open ?? v.opening_time ?? v.start ?? v.from;
      const close = v.close ?? v.closing_time ?? v.end ?? v.to;
      if (open && close) return `${open} – ${close}`;
      if (v.hours && typeof v.hours === "string") return v.hours;
      if (v.is_closed === true || v.closed === true) return "Closed";
    }
    return "—";
  };

  const isClosed = (value: unknown): boolean => {
    if (!value) return true;
    if (typeof value === "object" && value !== null) {
      const v = value as Record<string, unknown>;
      if (v.is_closed === true || v.closed === true) return true;
    }
    return false;
  };

  const entries = Object.entries(hours ?? {});

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={<Clock size={40} className="text-slate-300" />}
        message="No hours available"
      />
    );
  }

  const sorted = [...entries].sort(([a], [b]) => {
    const ai = DAY_ORDER.indexOf(a.toLowerCase());
    const bi = DAY_ORDER.indexOf(b.toLowerCase());
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <div className="space-y-2">
      {sorted.map(([day, value]) => {
        const isToday = day.toLowerCase() === todayKey;
        const closed = isClosed(value);
        return (
          <div
            key={day}
            className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
              isToday ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  isToday ? "bg-blue-100" : "bg-slate-100"
                }`}
              >
                <Clock
                  size={15}
                  className={isToday ? "text-blue-500" : "text-slate-400"}
                />
              </div>
              <div>
                <p
                  className={`text-sm font-medium capitalize ${
                    isToday ? "text-blue-700" : "text-slate-900"
                  }`}
                >
                  {day}
                  {isToday && (
                    <span className="ml-2 text-xs font-normal text-blue-400">
                      Today
                    </span>
                  )}
                </p>
                {!closed && (
                  <p className="text-xs text-slate-500">{formatHours(value)}</p>
                )}
              </div>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                closed ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"
              }`}
            >
              {closed ? "Closed" : "Open"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
