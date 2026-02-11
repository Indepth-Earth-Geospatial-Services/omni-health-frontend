"use client";

import React from "react";
import { Input } from "@/features/super-admin/components/ui/input";
import { Textarea } from "@/features/super-admin/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LGA_OPTIONS,
  FACILITY_TYPES,
  NIGERIAN_STATES,
} from "@/features/super-admin/constants/lga";
import type { FacilityFormData } from "@/features/super-admin/hooks/use-facility-form";

interface FormSectionProps {
  formData: FacilityFormData;
  errors: Record<string, string>;
  onInputChange: (field: keyof FacilityFormData, value: string) => void;
}

// Reusable form field with error display
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

// Section wrapper component
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

// Basic Details Section
export function BasicDetailsSection({
  formData,
  errors,
  onInputChange,
}: FormSectionProps) {
  return (
    <FormSection
      title="Basic Details"
      description="Provide a new healthcare facility to the platform"
    >
      {/* Facility Name */}
      <FormField
        id="facility_name"
        label="Facility Name"
        error={errors.facility_name}
      >
        <Input
          id="facility_name"
          value={formData.facility_name}
          onChange={(e) => onInputChange("facility_name", e.target.value)}
          placeholder="Obonoma Healthcare Centre"
          className={`mt-1.5 ${errors.facility_name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
        />
      </FormField>

      {/* Two Column: Facility Type & Contact Number */}
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
              className={`mt-1.5 w-full ${errors.facility_type ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
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

        <FormField id="contact_number" label="Contact Number">
          <Input
            id="contact_number"
            value={formData.contact_number}
            onChange={(e) => onInputChange("contact_number", e.target.value)}
            placeholder=""
            className="mt-1.5"
          />
        </FormField>
      </div>

      {/* Contact Email */}
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
          placeholder=""
          className={`mt-1.5 ${errors.contact_email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
        />
      </FormField>
    </FormSection>
  );
}

// Location Details Section
export function LocationDetailsSection({
  formData,
  errors,
  onInputChange,
}: FormSectionProps) {
  return (
    <FormSection
      title="Location Details"
      description="Indicate a new healthcare facility to the platform"
    >
      {/* Two Column: State & LGA */}
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

        <FormField id="lga" label="Local Government Area" error={errors.lga}>
          <Select
            value={formData.lga}
            onValueChange={(value) => onInputChange("lga", value)}
          >
            <SelectTrigger
              className={`mt-1.5 w-full ${errors.lga ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            >
              <SelectValue placeholder="Select LGA" />
            </SelectTrigger>
            <SelectContent>
              {LGA_OPTIONS.map((lga) => (
                <SelectItem key={lga} value={lga}>
                  {lga}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      {/* Street Address */}
      <FormField
        id="street_address"
        label="Street Address"
        error={errors.street_address}
      >
        <Input
          id="street_address"
          value={formData.street_address}
          onChange={(e) => onInputChange("street_address", e.target.value)}
          placeholder="Street Address"
          className={`mt-1.5 ${errors.street_address ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
        />
      </FormField>

      {/* Two Column: Latitude & Longitude */}
      <div className="grid grid-cols-2 gap-4">
        <FormField id="latitude" label="Latitude" error={errors.latitude}>
          <Input
            id="latitude"
            value={formData.latitude}
            onChange={(e) => onInputChange("latitude", e.target.value)}
            placeholder="e.g. 40.7128"
            className={`mt-1.5 ${errors.latitude ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          />
        </FormField>

        <FormField id="longitude" label="Longitude" error={errors.longitude}>
          <Input
            id="longitude"
            value={formData.longitude}
            onChange={(e) => onInputChange("longitude", e.target.value)}
            placeholder="e.g. -74.0060"
            className={`mt-1.5 ${errors.longitude ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          />
        </FormField>
      </div>
    </FormSection>
  );
}

// Capacity & Resources Section
export function CapacityResourcesSection({
  formData,
  onInputChange,
}: Omit<FormSectionProps, "errors">) {
  return (
    <FormSection
      title="Capacity & Resources"
      description="Populate a new healthcare facility to the platform"
    >
      {/* Two Column: Total Beds & Staff Count */}
      <div className="grid grid-cols-2 gap-4">
        <FormField id="total_beds" label="Total Beds">
          <Input
            id="total_beds"
            type="number"
            value={formData.total_beds}
            onChange={(e) => onInputChange("total_beds", e.target.value)}
            placeholder="Typical number of staff in facility"
            className="mt-1.5"
          />
        </FormField>

        <FormField id="staff_count" label="Staff Count">
          <Input
            id="staff_count"
            type="number"
            value={formData.staff_count}
            onChange={(e) => onInputChange("staff_count", e.target.value)}
            placeholder="Typical number of staff in facility"
            className="mt-1.5"
          />
        </FormField>
      </div>

      {/* Operation */}
      <FormField id="operation" label="Operation">
        <Textarea
          id="operation"
          value={formData.operation}
          onChange={(e) => onInputChange("operation", e.target.value)}
          placeholder="Brief Description of services offered and specialties etc."
          className="mt-1.5"
          rows={3}
        />
      </FormField>
    </FormSection>
  );
}
