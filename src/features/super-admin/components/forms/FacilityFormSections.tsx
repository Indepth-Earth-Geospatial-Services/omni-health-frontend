"use client";

import React from "react";
import { Input } from "@/features/super-admin/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RIVERS_STATE_LGAS,
  FACILITY_TYPES,
  NIGERIAN_STATES,
} from "@/features/super-admin/constants/lga";
import type { FacilityFormData } from "@/features/super-admin/hooks/use-facility-form";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface FormSectionProps {
  formData: FacilityFormData;
  errors: Record<string, string>;
  onInputChange: (field: keyof FacilityFormData, value: string) => void;
}

interface WorkingHoursSectionProps {
  formData: FacilityFormData;
  onWorkingHoursChange: (
    day: string,
    field: "open" | "close" | "closed",
    value: string | boolean,
  ) => void;
}

function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </Label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-1 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mb-4 text-xs text-slate-500">{description}</p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function BasicDetailsSection({
  formData,
  errors,
  onInputChange,
}: FormSectionProps) {
  return (
    <FormSection
      title="Basic Details"
      description="Core information about the healthcare facility"
    >
      <FormField
        id="facility_name"
        label="Facility Name *"
        error={errors.facility_name}
      >
        <Input
          id="facility_name"
          value={formData.facility_name}
          onChange={(e) => onInputChange("facility_name", e.target.value)}
          placeholder="Obonoma Healthcare Centre"
          className={`mt-1.5 ${errors.facility_name ? "border-red-500" : ""}`}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="facility_type"
          label="Facility Type"
          error={errors.facility_type}
        >
          <Select
            value={formData.facility_type}
            onValueChange={(value) => onInputChange("facility_type", value)}
          >
            <SelectTrigger
              className={`mt-1.5 w-full ${errors.facility_type ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {FACILITY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField id="hfr_id" label="HFR ID">
          <Input
            id="hfr_id"
            value={formData.hfr_id}
            onChange={(e) => onInputChange("hfr_id", e.target.value)}
            placeholder="e.g. HC-1009-A"
            className="mt-1.5"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="contact_number" label="Contact Number">
          <Input
            id="contact_number"
            value={formData.contact_number}
            onChange={(e) => onInputChange("contact_number", e.target.value)}
            placeholder="08012345678"
            className="mt-1.5"
          />
        </FormField>

        <FormField
          id="contact_email"
          label="Contact Email"
          error={errors.contact_email}
        >
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => onInputChange("contact_email", e.target.value)}
            placeholder="info@facility.com"
            className={`mt-1.5 ${errors.contact_email ? "border-red-500" : ""}`}
          />
        </FormField>
      </div>
    </FormSection>
  );
}

export function LocationDetailsSection({
  formData,
  errors,
  onInputChange,
}: FormSectionProps) {
  return (
    <FormSection
      title="Location Details"
      description="Physical location of the healthcare facility"
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField id="state" label="State">
          <Select
            value={formData.state}
            onValueChange={(value) => onInputChange("state", value)}
          >
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {NIGERIAN_STATES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          id="lga"
          label="Local Government Area *"
          error={errors.lga}
        >
          <Select
            value={formData.lga}
            onValueChange={(value) => onInputChange("lga", value)}
          >
            <SelectTrigger
              className={`mt-1.5 w-full ${errors.lga ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select LGA" />
            </SelectTrigger>
            <SelectContent>
              {RIVERS_STATE_LGAS.map((lga) => (
                <SelectItem key={lga.value} value={lga.value}>
                  {lga.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="street_address"
          label="Street Address *"
          error={errors.street_address}
        >
          <Input
            id="street_address"
            value={formData.street_address}
            onChange={(e) => onInputChange("street_address", e.target.value)}
            placeholder="123 Health Drive"
            className={`mt-1.5 ${errors.street_address ? "border-red-500" : ""}`}
          />
        </FormField>

        <FormField id="town" label="Town">
          <Input
            id="town"
            value={formData.town}
            onChange={(e) => onInputChange("town", e.target.value)}
            placeholder="Port Harcourt"
            className="mt-1.5"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="latitude" label="Latitude *" error={errors.latitude}>
          <Input
            id="latitude"
            value={formData.latitude}
            onChange={(e) => onInputChange("latitude", e.target.value)}
            placeholder="e.g. 4.8396"
            className={`mt-1.5 ${errors.latitude ? "border-red-500" : ""}`}
          />
        </FormField>

        <FormField id="longitude" label="Longitude *" error={errors.longitude}>
          <Input
            id="longitude"
            value={formData.longitude}
            onChange={(e) => onInputChange("longitude", e.target.value)}
            placeholder="e.g. 7.0335"
            className={`mt-1.5 ${errors.longitude ? "border-red-500" : ""}`}
          />
        </FormField>
      </div>
    </FormSection>
  );
}

export function ServicesSection({
  formData,
  onInputChange,
}: FormSectionProps) {
  return (
    <FormSection
      title="Services & Specialists"
      description="Enter one item per line"
    >
      <FormField id="services_list" label="Services Offered">
        <textarea
          id="services_list"
          value={formData.services_list}
          onChange={(e) => onInputChange("services_list", e.target.value)}
          placeholder={"General Outpatient\nMaternal Health\nEmergency Care"}
          rows={4}
          className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 resize-none"
        />
        <p className="mt-1 text-xs text-slate-400">One service per line</p>
      </FormField>

      <FormField id="specialists" label="Specialists">
        <textarea
          id="specialists"
          value={formData.specialists}
          onChange={(e) => onInputChange("specialists", e.target.value)}
          placeholder={"Dr. Amara Okafor\nDr. Chidi Nwosu"}
          rows={4}
          className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 resize-none"
        />
        <p className="mt-1 text-xs text-slate-400">One specialist per line</p>
      </FormField>
    </FormSection>
  );
}

export function WorkingHoursSection({
  formData,
  onWorkingHoursChange,
}: WorkingHoursSectionProps) {
  return (
    <FormSection
      title="Working Hours"
      description="Set the facility's operating hours for each day"
    >
      <div className="overflow-hidden rounded-lg border border-slate-200">
        {/* Header */}
        <div className="grid grid-cols-[120px_1fr_1fr_64px] gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
          <span className="text-xs font-medium text-slate-500">Day</span>
          <span className="text-xs font-medium text-slate-500">Open</span>
          <span className="text-xs font-medium text-slate-500">Close</span>
          <span className="text-xs font-medium text-slate-500 text-center">Closed</span>
        </div>

        {DAYS.map((day, idx) => {
          const schedule = formData.working_hours[day] ?? {
            open: "",
            close: "",
            closed: false,
          };
          return (
            <div
              key={day}
              className={`grid grid-cols-[120px_1fr_1fr_64px] items-center gap-2 px-4 py-2.5 ${
                idx < DAYS.length - 1 ? "border-b border-slate-100" : ""
              } ${schedule.closed ? "bg-slate-50/60" : "bg-white"}`}
            >
              <span
                className={`text-sm font-medium ${
                  schedule.closed ? "text-slate-400" : "text-slate-700"
                }`}
              >
                {day}
              </span>

              <input
                type="time"
                value={schedule.open}
                disabled={schedule.closed}
                onChange={(e) =>
                  onWorkingHoursChange(day, "open", e.target.value)
                }
                className="rounded-md border border-slate-200 px-2 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              />

              <input
                type="time"
                value={schedule.close}
                disabled={schedule.closed}
                onChange={(e) =>
                  onWorkingHoursChange(day, "close", e.target.value)
                }
                className="rounded-md border border-slate-200 px-2 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              />

              <div className="flex justify-center">
                <input
                  type="checkbox"
                  checked={schedule.closed}
                  onChange={(e) =>
                    onWorkingHoursChange(day, "closed", e.target.checked)
                  }
                  className="h-4 w-4 cursor-pointer accent-slate-700"
                />
              </div>
            </div>
          );
        })}
      </div>
    </FormSection>
  );
}
