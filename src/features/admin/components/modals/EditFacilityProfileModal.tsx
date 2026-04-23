"use client";

import React, { useState, useEffect, KeyboardEvent } from "react";
import {
  X,
  Building2,
  MapPin,
  Phone,
  Mail,
  Hash,
  Loader2,
  ArrowRight,
  Stethoscope,
  ListChecks,
  Clock,
  Plus,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { Button } from "../ui/button";
import { useUpdateFacilityProfile } from "@/features/admin/hooks/useAdminStaff";
import { UpdateFacilityProfileRequest } from "@/services/admin.service";
import { RIVERS_STATE_LGAS } from "@/features/super-admin/constants/lga";

interface EditFacilityProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilityId: string;
  currentData: any;
}

type WorkingHourRow = { day: string; hours: string };

const inputClass =
  "focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none";

const inputClassNoIcon =
  "focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none";

const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="col-span-2 mt-2 border-b border-slate-100 pb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
      {children}
    </p>
  );
}

function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder,
}: {
  tags: string[];
  onAdd: (val: string) => void;
  onRemove: (idx: number) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");

  const commit = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) onAdd(v);
    setInput("");
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    }
    if (e.key === "Backspace" && input === "" && tags.length > 0) {
      onRemove(tags.length - 1);
    }
  };

  return (
    <div className="rounded-lg border border-slate-300 bg-white px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-colors">
      <div className="flex flex-wrap gap-1.5 mb-1.5">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
          >
            {tag}
            <button type="button" onClick={() => onRemove(i)} className="hover:text-red-500">
              <X size={11} />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={commit}
        placeholder={placeholder}
        className="w-full text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none bg-transparent"
      />
      <p className="mt-1 text-[10px] text-slate-400">Press Enter or comma to add</p>
    </div>
  );
}

export default function EditFacilityProfileModal({
  isOpen,
  onClose,
  facilityId,
  currentData,
}: EditFacilityProfileModalProps) {
  const updateProfileMutation = useUpdateFacilityProfile();

  const [formData, setFormData] = useState<UpdateFacilityProfileRequest>({
    facility_name: "",
    hfr_id: "",
    facility_category: "",
    lga_id: undefined,
    town: "",
    address: "",
    services_list: [],
    specialists: [],
    contact_info: { phone: "", email: "" },
    working_hours: {},
    lat: 0,
    lon: 0,
  });

  const [workingHours, setWorkingHours] = useState<WorkingHourRow[]>([
    { day: "", hours: "" },
  ]);

  useEffect(() => {
    if (isOpen && currentData) {
      setFormData({
        facility_name: currentData.facility_name || "",
        hfr_id: currentData.hfr_id || "",
        facility_category: currentData.facility_category || "",
        lga_id: currentData.lga_id ?? undefined,
        town: currentData.town || currentData.facility_lga || "",
        address: currentData.address || "",
        services_list: currentData.services_list || [],
        specialists: currentData.specialists || [],
        contact_info: {
          phone: currentData.contact_info?.phone || "",
          email: currentData.contact_info?.email || "",
        },
        lat: currentData.lat || 0,
        lon: currentData.lon || 0,
      });

      const wh = currentData.working_hours;
      if (wh && typeof wh === "object" && Object.keys(wh).length > 0) {
        setWorkingHours(
          Object.entries(wh).map(([day, hours]) => ({ day, hours: String(hours) })),
        );
      } else {
        setWorkingHours([{ day: "", hours: "" }]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentData?.facility_id]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "email") {
      setFormData((prev) => ({
        ...prev,
        contact_info: { ...prev.contact_info, [name]: value },
      }));
    } else if (name === "lat" || name === "lon") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name === "lga_id") {
      setFormData((prev) => ({ ...prev, lga_id: value ? Number(value) : undefined }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addTag = (field: "services_list" | "specialists") => (val: string) =>
    setFormData((prev) => ({ ...prev, [field]: [...(prev[field] ?? []), val] }));

  const removeTag = (field: "services_list" | "specialists") => (idx: number) =>
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] ?? []).filter((_, i) => i !== idx),
    }));

  const updateHourRow = (idx: number, key: "day" | "hours", value: string) =>
    setWorkingHours((rows) => rows.map((r, i) => (i === idx ? { ...r, [key]: value } : r)));

  const addHourRow = () => setWorkingHours((rows) => [...rows, { day: "", hours: "" }]);

  const removeHourRow = (idx: number) =>
    setWorkingHours((rows) => rows.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    const working_hours = workingHours.reduce<Record<string, string>>(
      (acc, { day, hours }) => (day.trim() ? { ...acc, [day.trim()]: hours.trim() } : acc),
      {},
    );
    updateProfileMutation.mutate(
      { facilityId, data: { ...formData, working_hours } },
      { onSuccess: onClose },
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 transition-opacity" onClick={onClose} />

      <div className="animate-in fade-in zoom-in-95 fixed top-1/2 left-1/2 z-50 flex w-full max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-white shadow-2xl duration-200 max-h-[90vh]">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-800">Edit Facility Profile</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">

            {/* ── Basic Info ─────────────────────────────── */}
            <SectionHeading>Basic Info</SectionHeading>

            {/* Facility Name */}
            <div className="col-span-2">
              <label className={labelClass}>Facility Name</label>
              <div className="relative">
                <Building2 size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
                <input type="text" name="facility_name" value={formData.facility_name} onChange={handleInput} placeholder="Enter facility name" className={inputClass} />
              </div>
            </div>

            {/* HFR ID */}
            <div className="col-span-1">
              <label className={labelClass}>HFR ID</label>
              <div className="relative">
                <Hash size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
                <input type="text" name="hfr_id" value={formData.hfr_id} onChange={handleInput} placeholder="HFR ID" className={inputClass} />
              </div>
            </div>

            {/* Facility Category */}
            <div className="col-span-1">
              <label className={labelClass}>Category</label>
              <div className="relative">
                <ListChecks size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
                <input type="text" name="facility_category" value={formData.facility_category} onChange={handleInput} placeholder="e.g. Primary Health Center" className={inputClass} />
              </div>
            </div>

            {/* LGA dropdown */}
            <div className="col-span-1">
              <label className={labelClass}>LGA</label>
              <div className="relative">
                <MapPin size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <ChevronDown size={14} className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  name="lga_id"
                  value={formData.lga_id ?? ""}
                  onChange={handleInput}
                  className="focus:border-primary focus:ring-primary/20 w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pr-8 pl-10 text-sm text-slate-600 transition-colors hover:border-slate-400 focus:ring-2 focus:outline-none"
                >
                  <option value="">Select LGA</option>
                  {RIVERS_STATE_LGAS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Town */}
            <div className="col-span-1">
              <label className={labelClass}>Town</label>
              <div className="relative">
                <MapPin size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
                <input type="text" name="town" value={formData.town} onChange={handleInput} placeholder="Town name" className={inputClass} />
              </div>
            </div>

            {/* Address */}
            <div className="col-span-2">
              <label className={labelClass}>Full Address</label>
              <div className="relative">
                <MapPin size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
                <input type="text" name="address" value={formData.address} onChange={handleInput} placeholder="Enter full address" className={inputClass} />
              </div>
            </div>

            {/* ── Contact ─────────────────────────────────── */}
            <SectionHeading>Contact</SectionHeading>

            <div className="col-span-1">
              <label className={labelClass}>Phone</label>
              <div className="relative">
                <Phone size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
                <input type="tel" name="phone" value={formData.contact_info?.phone} onChange={handleInput} placeholder="Phone number" className={inputClass} />
              </div>
            </div>

            <div className="col-span-1">
              <label className={labelClass}>Email</label>
              <div className="relative">
                <Mail size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
                <input type="email" name="email" value={formData.contact_info?.email} onChange={handleInput} placeholder="Email address" className={inputClass} />
              </div>
            </div>

            {/* ── Services ────────────────────────────────── */}
            <SectionHeading>Services</SectionHeading>

            <div className="col-span-2">
              <label className={labelClass}>Services Offered</label>
              <TagInput
                tags={formData.services_list ?? []}
                onAdd={addTag("services_list")}
                onRemove={removeTag("services_list")}
                placeholder="e.g. Maternity, Immunisation…"
              />
            </div>

            {/* ── Specialists ─────────────────────────────── */}
            <SectionHeading>Specialists</SectionHeading>

            <div className="col-span-2">
              <label className={labelClass}>
                <Stethoscope size={11} className="mr-1 inline" />
                Specialist Types
              </label>
              <TagInput
                tags={formData.specialists ?? []}
                onAdd={addTag("specialists")}
                onRemove={removeTag("specialists")}
                placeholder="e.g. Cardiologist, Paediatrician…"
              />
            </div>

            {/* ── Working Hours ────────────────────────────── */}
            <SectionHeading>Working Hours</SectionHeading>

            <div className="col-span-2 space-y-2">
              {workingHours.map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Clock size={13} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={row.day}
                      onChange={(e) => updateHourRow(i, "day", e.target.value)}
                      placeholder="Day(s), e.g. Mon–Fri"
                      className={inputClass}
                    />
                  </div>
                  <input
                    type="text"
                    value={row.hours}
                    onChange={(e) => updateHourRow(i, "hours", e.target.value)}
                    placeholder="Hours, e.g. 8am–5pm"
                    className={`${inputClassNoIcon} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => removeHourRow(i)}
                    disabled={workingHours.length === 1}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addHourRow}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                <Plus size={13} /> Add row
              </button>
            </div>

            {/* ── Coordinates ─────────────────────────────── */}
            <SectionHeading>Coordinates</SectionHeading>

            <div className="col-span-1">
              <label className={labelClass}>Latitude</label>
              <input type="number" name="lat" step="any" value={formData.lat} onChange={handleInput} className={inputClassNoIcon} />
            </div>
            <div className="col-span-1">
              <label className={labelClass}>Longitude</label>
              <input type="number" name="lon" step="any" value={formData.lon} onChange={handleInput} className={inputClassNoIcon} />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <Button variant="outline" onClick={onClose} disabled={updateProfileMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={updateProfileMutation.isPending}>
            {updateProfileMutation.isPending ? (
              <>
                <Loader2 size={15} className="mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                Save Changes
                <ArrowRight size={15} />
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
