"use client";

import React, { useState } from "react";
import {
  Activity,
  Building2,
  Check,
  Clock,
  CornerDownLeft,
  Hash,
  ListChecks,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Stethoscope,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useCurrentFacilityId } from "@/features/auth/auth-store";
import { useFacility } from "@/hooks/use-facilities";
import { useCollapsibleSections } from "@/hooks/use-collapsible-sections";
import { CollapsibleSection, LoadingSkeleton } from "../ui/CollapsibleSection";
import { useUpdateFacilityProfile } from "@/features/admin/hooks/useAdminStaff";
import type { UpdateFacilityProfileRequest } from "@/services/admin.service";
import { RIVERS_STATE_LGAS } from "@/features/super-admin/constants/lga";
import {
  formatTimeRange,
  formatDate,
  formatSpecialistName,
  formatServiceName,
} from "../../utils/formatters";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import { MAPBOX_TOKEN } from "@/constants";

// Section configuration
const SECTIONS = [
  { id: "facilityOverview", label: "Facility Overview", defaultOpen: true },
  { id: "operatingHours", label: "Operating Hours", defaultOpen: true },
  { id: "services", label: "Services", defaultOpen: true },
  { id: "specialists", label: "Specialists", defaultOpen: true },
  { id: "activity", label: "Activity", defaultOpen: true },
];

export default function FacilityProfile() {
  const sections = useCollapsibleSections(SECTIONS);

  // Facility data
  const facilityId = useCurrentFacilityId();
  const { data: facilityData, isLoading, isError } = useFacility(facilityId);
  const facility = facilityData?.facility;

  return (
    <div className="w-full">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Facility Overview */}
        <FacilityOverviewCard
          facility={facility}
          facilityId={facilityId}
          isLoading={isLoading}
          isError={isError}
          isOpen={sections.isOpen("facilityOverview")}
          onToggle={() => sections.toggle("facilityOverview")}
        />

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Operating Hours */}
          <OperatingHoursCard
            facility={facility}
            facilityId={facilityId}
            isLoading={isLoading}
            isError={isError}
            isOpen={sections.isOpen("operatingHours")}
            onToggle={() => sections.toggle("operatingHours")}
          />

          {/* Services */}
          <ServicesCard
            facility={facility}
            facilityId={facilityId}
            isLoading={isLoading}
            isOpen={sections.isOpen("services")}
            onToggle={() => sections.toggle("services")}
          />
        </div>

        {/* Specialists */}
        <SpecialistsCard
          facility={facility}
          facilityId={facilityId}
          isLoading={isLoading}
          isError={isError}
          isOpen={sections.isOpen("specialists")}
          onToggle={() => sections.toggle("specialists")}
        />

        {/* Activity Overview — genuinely read-only, no edit control */}
        <CollapsibleSection
          title="Activity Overview"
          description="Read-only system information"
          icon={<Activity size={20} className="text-slate-600" />}
          isOpen={sections.isOpen("activity")}
          onToggle={() => sections.toggle("activity")}
          maxHeight="560px"
        >
          <ActivityContent
            facility={facility}
            isLoading={isLoading}
            isError={isError}
          />
        </CollapsibleSection>
      </div>
    </div>
  );
}

// ============ Shared types ============

interface FacilityData {
  facility_id?: string;
  hfr_id?: string;
  facility_name?: string;
  facility_category?: string;
  facility_lga?: string;
  town?: string;
  address?: string;
  lat?: number;
  lon?: number;
  last_updated?: string | Date;
  working_hours?: {
    monday?: string;
    saturday?: string;
    [key: string]: string | undefined;
  };
  contact_info?: {
    phone?: string;
    email?: string;
  };
  services_list?: string[];
  specialists?: string[];
}

interface CardBaseProps {
  facility: FacilityData | undefined;
  facilityId: string;
  isLoading: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

// ============ Shared edit styling & controls ============

const inputClass =
  "focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none disabled:opacity-50";

const inputClassNoIcon =
  "focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none disabled:opacity-50";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";

/** Edit / Save / Cancel controls for a card header. Every click stops
 *  propagation so it never also fires the section's own open/close toggle. */
function HeaderEditControls({
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
}: {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={stop(onEdit)}
        aria-label="Edit"
        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
      >
        <Pencil size={16} />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={stop(onCancel)}
        disabled={isSaving}
        aria-label="Cancel"
        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
      >
        <X size={16} />
      </button>
      <button
        type="button"
        onClick={stop(onSave)}
        disabled={isSaving}
        className="bg-primary hover:bg-primary/90 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors disabled:opacity-50"
      >
        {isSaving ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <Check size={13} />
        )}
        Save
      </button>
    </div>
  );
}

function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder,
  disabled,
}: {
  tags: string[];
  onAdd: (val: string) => void;
  onRemove: (idx: number) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  const [input, setInput] = useState("");

  const commit = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) onAdd(v);
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    }
    // Backspace only ever edits the draft text — removing an already-added
    // tag requires clicking its own remove button, never a stray keystroke.
  };

  return (
    <div className="focus-within:border-primary focus-within:ring-primary/20 rounded-lg border border-slate-300 bg-white px-3 py-2 transition-colors focus-within:ring-2">
      <div className="mb-1.5 flex flex-wrap gap-1.5">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="text-primary bg-primary/10 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="hover:text-red-500"
              >
                <X size={11} />
              </button>
            )}
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={commit}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent pr-16 text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
        />
        {input.trim() !== "" && (
          <span className="pointer-events-none absolute top-1/2 right-0 flex -translate-y-1/2 items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
            <CornerDownLeft size={10} />
            Enter
          </span>
        )}
      </div>
    </div>
  );
}

// ============ Facility Overview ============

interface OverviewFormState {
  facility_name: string;
  hfr_id: string;
  facility_category: string;
  lga_id?: number;
  town: string;
  address: string;
  phone: string;
  email: string;
  lat: number;
  lon: number;
}

function overviewFormFromFacility(facility?: FacilityData): OverviewFormState {
  // The GET response only carries the LGA name (`facility_lga`), not its id,
  // so the id has to be recovered by matching the name against the same
  // Rivers-State list the dropdown is built from.
  const matchedLga = facility?.facility_lga
    ? RIVERS_STATE_LGAS.find(
        (l) => l.label.toLowerCase() === facility.facility_lga!.toLowerCase(),
      )
    : undefined;

  return {
    facility_name: facility?.facility_name || "",
    hfr_id: facility?.hfr_id || "",
    facility_category: facility?.facility_category || "",
    lga_id: matchedLga ? Number(matchedLga.value) : undefined,
    town: facility?.town || "",
    address: facility?.address || "",
    phone: facility?.contact_info?.phone || "",
    email: facility?.contact_info?.email || "",
    lat: facility?.lat || 0,
    lon: facility?.lon || 0,
  };
}

function FacilityOverviewCard({
  facility,
  facilityId,
  isLoading,
  isError,
  isOpen,
  onToggle,
}: CardBaseProps & { isError: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<OverviewFormState>(() =>
    overviewFormFromFacility(),
  );
  const mutation = useUpdateFacilityProfile();

  const startEdit = () => {
    setForm(overviewFormFromFacility(facility));
    setIsEditing(true);
  };

  const handleSave = () => {
    const data: UpdateFacilityProfileRequest = {
      facility_name: form.facility_name,
      hfr_id: form.hfr_id,
      facility_category: form.facility_category,
      lga_id: form.lga_id,
      town: form.town,
      address: form.address,
      contact_info: { phone: form.phone, email: form.email },
      lat: form.lat,
      lon: form.lon,
    };
    mutation.mutate(
      { facilityId, data },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  return (
    <CollapsibleSection
      title="Facility Overview"
      description="Basic details about your facility"
      icon={<Activity size={20} className="text-slate-600" />}
      isOpen={isOpen}
      onToggle={onToggle}
      headerAction={
        !isLoading &&
        !isError && (
          <HeaderEditControls
            isEditing={isEditing}
            isSaving={mutation.isPending}
            onEdit={startEdit}
            onCancel={() => setIsEditing(false)}
            onSave={handleSave}
          />
        )
      }
    >
      {isEditing ? (
        <OverviewFormFields
          form={form}
          setForm={setForm}
          disabled={mutation.isPending}
        />
      ) : (
        <FacilityOverviewContent
          facility={facility}
          isLoading={isLoading}
          isError={isError}
        />
      )}
    </CollapsibleSection>
  );
}

function OverviewFormFields({
  form,
  setForm,
  disabled,
}: {
  form: OverviewFormState;
  setForm: React.Dispatch<React.SetStateAction<OverviewFormState>>;
  disabled: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className={labelClass}>Facility Name</label>
        <div className="relative">
          <Building2
            size={15}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={form.facility_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, facility_name: e.target.value }))
            }
            disabled={disabled}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>HFR ID</label>
        <div className="relative">
          <Hash
            size={15}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={form.hfr_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, hfr_id: e.target.value }))
            }
            disabled={disabled}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Category</label>
        <div className="relative">
          <ListChecks
            size={15}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={form.facility_category}
            onChange={(e) =>
              setForm((f) => ({ ...f, facility_category: e.target.value }))
            }
            disabled={disabled}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>LGA</label>
        <select
          value={form.lga_id ?? ""}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              lga_id: e.target.value ? Number(e.target.value) : undefined,
            }))
          }
          disabled={disabled}
          className={inputClassNoIcon}
        >
          <option value="">Select LGA</option>
          {RIVERS_STATE_LGAS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Town</label>
        <div className="relative">
          <MapPin
            size={15}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={form.town}
            onChange={(e) => setForm((f) => ({ ...f, town: e.target.value }))}
            disabled={disabled}
            className={inputClass}
          />
        </div>
      </div>

      <div className="sm:col-span-2">
        <label className={labelClass}>Full Address</label>
        <div className="relative">
          <MapPin
            size={15}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={form.address}
            onChange={(e) =>
              setForm((f) => ({ ...f, address: e.target.value }))
            }
            disabled={disabled}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Officer in-Charge / Phone</label>
        <div className="relative">
          <Phone
            size={15}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            type="tel"
            value={form.phone}
            onChange={(e) =>
              setForm((f) => ({ ...f, phone: e.target.value }))
            }
            disabled={disabled}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Contact Email</label>
        <div className="relative">
          <Mail
            size={15}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((f) => ({ ...f, email: e.target.value }))
            }
            disabled={disabled}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Latitude</label>
        <input
          type="number"
          step="any"
          value={form.lat}
          onChange={(e) =>
            setForm((f) => ({ ...f, lat: parseFloat(e.target.value) || 0 }))
          }
          disabled={disabled}
          className={inputClassNoIcon}
        />
      </div>
      <div>
        <label className={labelClass}>Longitude</label>
        <input
          type="number"
          step="any"
          value={form.lon}
          onChange={(e) =>
            setForm((f) => ({ ...f, lon: parseFloat(e.target.value) || 0 }))
          }
          disabled={disabled}
          className={inputClassNoIcon}
        />
      </div>
    </div>
  );
}

interface FacilityOverviewContentProps {
  facility: FacilityData | undefined;
  isLoading: boolean;
  isError: boolean;
}

function FacilityOverviewContent({
  facility,
  isLoading,
  isError,
}: FacilityOverviewContentProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 pt-2">
        <LoadingSkeleton className="h-5 w-48" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="pt-2 text-sm text-red-500">Failed to load facility data</p>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      <FieldDisplay label="Facility Name" value={facility?.facility_name} />
      <FieldDisplay label="Address" value={facility?.address} />
      <FieldDisplay label="Category" value={facility?.facility_category} />

      <div>
        <label className="font-geist mb-1.5 block text-[19px] font-normal text-black">
          Facility Description
        </label>
        <div className="font-geist min-h-[100px] w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] leading-tight font-normal tracking-[0%] text-[#868C98]">
          A comprehensive healthcare facility providing primary and specialized
          medical services to the{" "}
          {facility?.town || facility?.facility_lga || "local"} community. Our
          team of dedicated healthcare professionals is committed to delivering
          quality care with compassion and excellence.
        </div>
      </div>

      {/* Contact & Performance */}
      <div className="mt-6 border-t border-slate-100 pt-4">
        <h4 className="mb-4 text-[17px] font-medium text-slate-800">
          Contact & Performance
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FieldDisplay
            label="Officer in-Charge / Phone"
            value={facility?.contact_info?.phone}
            small
          />
          <div>
            <label className="mb-1 block text-sm text-slate-500">
              Contact Email
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-[#868C98]">
              <Mail size={16} className="text-slate-400" />
              <span className="truncate">
                {facility?.contact_info?.email || "N/A"}
              </span>
            </div>
          </div>
          <FieldDisplay
            label="Last Updated"
            value={formatDate(String(facility?.last_updated || ""))}
            small
          />
        </div>
      </div>
    </div>
  );
}

function FieldDisplay({
  label,
  value,
  small,
}: {
  label: string;
  value?: string;
  small?: boolean;
}) {
  if (small) {
    return (
      <div>
        <label className="mb-1 block text-sm text-slate-500">{label}</label>
        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-[#868C98]">
          {value || "Not available"}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="font-geist mb-1.5 block text-[19px] font-normal text-black">
        {label}
      </label>
      <div className="font-geist w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] font-normal text-[#868C98]">
        {value || "Not available"}
      </div>
    </div>
  );
}

// ============ Operating Hours ============

type WorkingHourRow = { day: string; hours: string };

function workingHoursRowsFromFacility(
  facility?: FacilityData,
): WorkingHourRow[] {
  const wh = facility?.working_hours;
  if (wh && typeof wh === "object" && Object.keys(wh).length > 0) {
    return Object.entries(wh).map(([day, hours]) => ({
      day,
      hours: String(hours ?? ""),
    }));
  }
  return [{ day: "", hours: "" }];
}

function OperatingHoursCard({
  facility,
  facilityId,
  isLoading,
  isError,
  isOpen,
  onToggle,
}: CardBaseProps & { isError: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [rows, setRows] = useState<WorkingHourRow[]>(() =>
    workingHoursRowsFromFacility(),
  );
  const mutation = useUpdateFacilityProfile();

  const startEdit = () => {
    setRows(workingHoursRowsFromFacility(facility));
    setIsEditing(true);
  };

  const updateRow = (idx: number, key: "day" | "hours", value: string) =>
    setRows((r) => r.map((row, i) => (i === idx ? { ...row, [key]: value } : row)));
  const addRow = () => setRows((r) => [...r, { day: "", hours: "" }]);
  const removeRow = (idx: number) => setRows((r) => r.filter((_, i) => i !== idx));

  const handleSave = () => {
    const working_hours = rows.reduce<Record<string, string>>(
      (acc, { day, hours }) =>
        day.trim() ? { ...acc, [day.trim()]: hours.trim() } : acc,
      {},
    );
    mutation.mutate(
      { facilityId, data: { working_hours } },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  return (
    <CollapsibleSection
      title="Operating Hours"
      description="When your facility is open"
      icon={<Clock size={20} className="text-slate-600" />}
      isOpen={isOpen}
      onToggle={onToggle}
      headerAction={
        !isLoading &&
        !isError && (
          <HeaderEditControls
            isEditing={isEditing}
            isSaving={mutation.isPending}
            onEdit={startEdit}
            onCancel={() => setIsEditing(false)}
            onSave={handleSave}
          />
        )
      }
    >
      {isEditing ? (
        <div className="space-y-2 pt-2">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Clock
                  size={13}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={row.day}
                  onChange={(e) => updateRow(i, "day", e.target.value)}
                  placeholder="Day(s), e.g. Mon–Fri"
                  disabled={mutation.isPending}
                  className={inputClass}
                />
              </div>
              <input
                type="text"
                value={row.hours}
                onChange={(e) => updateRow(i, "hours", e.target.value)}
                placeholder="Hours, e.g. 8am–5pm"
                disabled={mutation.isPending}
                className={`${inputClassNoIcon} flex-1`}
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                disabled={rows.length === 1 || mutation.isPending}
                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRow}
            disabled={mutation.isPending}
            className="text-primary flex items-center gap-1.5 text-xs font-medium hover:underline disabled:opacity-50"
          >
            <Plus size={13} /> Add row
          </button>
        </div>
      ) : (
        <OperatingHoursContent
          workingHours={
            facility?.working_hours as Record<string, string> | undefined
          }
          isLoading={isLoading}
          isError={isError}
        />
      )}
    </CollapsibleSection>
  );
}

function OperatingHoursContent({
  workingHours,
  isLoading,
  isError,
}: {
  workingHours: Record<string, string> | undefined;
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-2 pt-4">
        {[1, 2, 3, 4].map((i) => (
          <LoadingSkeleton key={i} className="h-9 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="pt-4 text-sm text-red-500">
        Failed to load operating hours
      </p>
    );
  }

  const DAY_ORDER = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const entries = workingHours
    ? Object.entries(workingHours).sort(([a], [b]) => {
        const ai = DAY_ORDER.indexOf(a.toLowerCase());
        const bi = DAY_ORDER.indexOf(b.toLowerCase());
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      })
    : [];

  if (entries.length === 0) {
    return (
      <p className="pt-4 text-center text-sm text-slate-400">
        No operating hours set
      </p>
    );
  }

  return (
    <div className="space-y-1.5 pt-4">
      {entries.map(([day, hours]) => {
        const isClosed = !hours || hours.toLowerCase() === "closed";
        return (
          <div
            key={day}
            className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2.5 sm:px-4"
          >
            <span className="truncate text-sm font-medium text-slate-700 capitalize">
              {day}
            </span>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap sm:px-2.5 sm:text-xs ${
                isClosed
                  ? "bg-red-50 text-red-500"
                  : "bg-green-50 text-green-600"
              }`}
            >
              {isClosed ? "Closed" : formatTimeRange(hours)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ============ Services ============

function ServicesCard({
  facility,
  facilityId,
  isLoading,
  isOpen,
  onToggle,
}: CardBaseProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const mutation = useUpdateFacilityProfile();

  const startEdit = () => {
    setTags(facility?.services_list ?? []);
    setIsEditing(true);
  };

  const handleSave = () => {
    mutation.mutate(
      { facilityId, data: { services_list: tags } },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  return (
    <CollapsibleSection
      title="Service List"
      description="Medical services offered"
      icon={<Stethoscope size={20} className="text-slate-600" />}
      isOpen={isOpen}
      onToggle={onToggle}
      maxHeight="600px"
      headerAction={
        !isLoading && (
          <HeaderEditControls
            isEditing={isEditing}
            isSaving={mutation.isPending}
            onEdit={startEdit}
            onCancel={() => setIsEditing(false)}
            onSave={handleSave}
          />
        )
      }
    >
      {isEditing ? (
        <div className="pt-4 pb-2">
          <TagInput
            tags={tags}
            onAdd={(v) => setTags((t) => [...t, v])}
            onRemove={(idx) => setTags((t) => t.filter((_, i) => i !== idx))}
            placeholder="e.g. Maternity, Immunisation…"
            disabled={mutation.isPending}
          />
        </div>
      ) : (
        <ServicesContent services={facility?.services_list} isLoading={isLoading} />
      )}
    </CollapsibleSection>
  );
}

function ServicesContent({
  services,
  isLoading,
}: {
  services?: string[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2 py-4">
        <LoadingSkeleton className="h-8 w-24 rounded-full" />
        <LoadingSkeleton className="h-8 w-32 rounded-full" />
        <LoadingSkeleton className="h-8 w-20 rounded-full" />
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-slate-400">
        No services listed
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 py-6">
      {services.map((service, idx) => (
        <span
          key={idx}
          className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
        >
          {formatServiceName(service)}
        </span>
      ))}
    </div>
  );
}

// ============ Specialists ============

function SpecialistsCard({
  facility,
  facilityId,
  isLoading,
  isError,
  isOpen,
  onToggle,
}: CardBaseProps & { isError: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const mutation = useUpdateFacilityProfile();

  const startEdit = () => {
    setTags(facility?.specialists ?? []);
    setIsEditing(true);
  };

  const handleSave = () => {
    mutation.mutate(
      { facilityId, data: { specialists: tags } },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  return (
    <CollapsibleSection
      title="Specialist Availability"
      description="Healthcare professionals at your facility"
      icon={<Users size={20} className="text-slate-600" />}
      isOpen={isOpen}
      onToggle={onToggle}
      maxHeight="560px"
      headerAction={
        !isLoading &&
        !isError && (
          <HeaderEditControls
            isEditing={isEditing}
            isSaving={mutation.isPending}
            onEdit={startEdit}
            onCancel={() => setIsEditing(false)}
            onSave={handleSave}
          />
        )
      }
    >
      {isEditing ? (
        <div className="pt-4 pb-2">
          <TagInput
            tags={tags}
            onAdd={(v) => setTags((t) => [...t, v])}
            onRemove={(idx) => setTags((t) => t.filter((_, i) => i !== idx))}
            placeholder="e.g. Cardiologist, Paediatrician…"
            disabled={mutation.isPending}
          />
        </div>
      ) : (
        <SpecialistsContent
          specialists={facility?.specialists}
          isLoading={isLoading}
          isError={isError}
        />
      )}
    </CollapsibleSection>
  );
}

function SpecialistsContent({
  specialists,
  isLoading,
  isError,
}: {
  specialists?: string[];
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <LoadingSkeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <LoadingSkeleton className="h-4 w-32" />
              <LoadingSkeleton className="h-3 w-40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-4 text-center text-sm text-red-500">
        Failed to load specialists. Please try again later.
      </p>
    );
  }

  if (!specialists || specialists.length === 0) {
    return (
      <p className="font-geist py-4 text-center text-sm text-[#868C98]">
        No specialists listed for this facility
      </p>
    );
  }

  return (
    <div className="max-h-90 space-y-3 overflow-y-auto">
      {specialists.map((specialist, idx) => {
        const formattedName = formatSpecialistName(specialist);
        return (
          <div
            key={idx}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#868C98] text-sm font-medium text-white">
              {formattedName.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
              <div className="min-w-0">
                <h4 className="font-geist truncate text-[15px] font-medium text-black">
                  {formattedName}
                </h4>
                <p className="font-geist truncate text-[13px] text-[#868C98]">
                  Facility Specialist
                </p>
              </div>
              <div className="flex shrink-0 items-center">
                <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-green-700">
                  Available
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============ Activity (read-only) ============

function ActivityContent({
  facility,
  isLoading,
  isError,
}: {
  facility: FacilityData | undefined;
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-b border-gray-100 pb-2">
            <LoadingSkeleton className="mb-2 h-3 w-24" />
            <LoadingSkeleton className="h-5 w-32" />
          </div>
        ))}
        <LoadingSkeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-sm text-red-500">Failed to load activity data</p>;
  }

  return (
    <div className="space-y-4">
      <InfoRow
        label="Local Government Area"
        value={facility?.town || facility?.facility_lga}
      />
      <InfoRow label="Facility ID" value={facility?.facility_id} />
      <InfoRow
        label="Geo-Coordinates"
        value={
          facility?.lat && facility?.lon
            ? `${facility.lat.toFixed(4)}, ${facility.lon.toFixed(4)}`
            : undefined
        }
      />

      <div className="mt-4">
        <div className="h-56 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {facility?.lat && facility?.lon ? (
            <Map
              initialViewState={{
                longitude: facility.lon,
                latitude: facility.lat,
                zoom: 15,
              }}
              style={{ width: "100%", height: "100%" }}
              mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
              mapboxAccessToken={MAPBOX_TOKEN}
            >
              <NavigationControl position="top-right" />
              <Marker
                longitude={facility.lon}
                latitude={facility.lat}
                anchor="center"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute h-16 w-16 animate-ping rounded-full bg-teal-400 opacity-20" />
                  <span
                    className="absolute h-9 w-9 animate-ping rounded-full bg-teal-500 opacity-30"
                    style={{ animationDelay: "0.4s" }}
                  />
                  <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 shadow-lg ring-2 ring-white">
                    <MapPin size={14} className="text-white" />
                  </div>
                </div>
              </Marker>
            </Map>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
              <MapPin size={32} className="opacity-40" />
              <p className="text-sm">No location data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="border-b border-gray-100">
      <p className="font-geist mb-1 text-[15px] font-normal text-[#868C98]">
        {label}
      </p>
      {/* Facility ID is a UUID with no spaces — it has to be allowed to break
          mid-string or it pushes the whole card wider than the viewport. */}
      <p className="font-geist mb-2 text-[17px] font-normal wrap-break-word text-black sm:text-[19px]">
        {value || "Not available"}
      </p>
    </div>
  );
}
