"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Building2, ChevronDown, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFacilityOptions } from "@/features/super-admin/hooks/useFacilityOptions";

interface FacilitySearchDropdownProps {
  value: string;
  onChange: (facilityId: string) => void;
  disabled?: boolean;
  error?: string;
}

export function FacilitySearchDropdown({
  value,
  onChange,
  disabled,
  error,
}: FacilitySearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: facilities = [], isLoading } = useFacilityOptions();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) searchInputRef.current?.focus();
  }, [isOpen]);

  const filteredFacilities = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return facilities;
    return facilities.filter((f) => f.facility_name.toLowerCase().includes(q));
  }, [facilities, search]);

  const selectedFacility = facilities.find((f) => f.facility_id === value);

  return (
    <div ref={dropdownRef}>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Facility <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          disabled={disabled || isLoading}
          className={cn(
            "focus:border-primary focus:ring-primary/20 flex w-full items-center justify-between rounded-lg border bg-white px-4 py-3 text-sm text-slate-600 transition-colors hover:border-slate-400 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-red-500" : "border-slate-300",
          )}
        >
          <span className="flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Loading facilities...
              </>
            ) : selectedFacility ? (
              <>
                <Building2 size={16} className="text-primary" />
                <span className="text-slate-800">
                  {selectedFacility.facility_name}
                </span>
              </>
            ) : (
              <span className="text-slate-400">Select a facility</span>
            )}
          </span>
          <ChevronDown
            size={16}
            className={cn(
              "text-slate-400 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen && !isLoading && (
          <div className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
            <div className="relative border-b border-slate-100 p-2">
              <Search
                size={14}
                className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-400"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search facility..."
                className="w-full rounded-md border border-slate-200 py-1.5 pr-3 pl-8 text-sm focus:border-transparent focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredFacilities.length === 0 ? (
                <div className="px-4 py-3 text-center text-sm text-slate-500">
                  No facilities found
                </div>
              ) : (
                filteredFacilities.map((facility) => (
                  <button
                    key={facility.facility_id}
                    type="button"
                    onClick={() => {
                      onChange(facility.facility_id);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50",
                      value === facility.facility_id &&
                        "bg-primary/5 text-primary font-medium",
                    )}
                  >
                    <Building2 size={16} className="shrink-0 text-slate-400" />
                    {facility.facility_name}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
