"use client";
import { cn } from "@/lib/utils";
import { Hospital, ListFilter, Search, Stethoscope, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

interface FilterOption {
  id: string;
  label: string;
  value: string;
  icon?: any;
}

interface FilterCategory {
  title: string;
  options: FilterOption[];
}

const filterCategories: FilterCategory[] = [
  {
    title: "Facility Type",
    options: [
      {
        id: "hospital",
        icon: <Hospital size={14} />,
        label: "Hospital",
        value: "hospital",
      },
      {
        id: "pharmacy",
        icon: <Hospital size={14} />,
        label: "Pharmacy",
        value: "pharmacy",
      },
      {
        id: "clinic",
        icon: <Stethoscope size={14} />,
        label: "Clinic",
        value: "clinic",
      },
      {
        id: "teaching-hospital",
        label: "Teaching Hospital",
        value: "teaching_hospital",
      },
      {
        id: "healthcare-center",
        label: "Healthcare Center",
        value: "healthcare_center",
      },
    ],
  },
  {
    title: "Performance Tier",
    options: [
      { id: "high-performance", label: "High Performance", value: "high" },
      { id: "moderate", label: "Moderate", value: "moderate" },
      { id: "average", label: "Average", value: "average" },
    ],
  },
  {
    title: "Service Availability",
    options: [
      { id: "cardiology", label: "Cardiology", value: "cardiology" },
      { id: "dentistry", label: "Dentistry", value: "dentistry" },
      { id: "dermatology", label: "Dermatology", value: "dermatology" },
      { id: "emergency", label: "Emergency", value: "emergency" },
      { id: "ent", label: "ENT", value: "ent" },
      { id: "maternity", label: "Maternity", value: "maternity" },
      {
        id: "general-practice",
        label: "General Practice",
        value: "general_practice",
      },
      { id: "gynaecology", label: "Gynaecology", value: "gynaecology" },
      { id: "pediatrics", label: "Pediatrics", value: "pediatrics" },
      { id: "neurology", label: "Neurology", value: "neurology" },
    ],
  },
];

interface FilterComponentProps {
  onApplyFilters?: (filters: Record<string, string[]>) => void;
  includeFilter?: boolean;
  className?: string;
}

export function FilterComponent({
  onApplyFilters,
  includeFilter = true,
  className,
}: FilterComponentProps) {
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({
    facilityType: [],
    performanceTier: [],
    serviceAvailability: [],
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleCheckboxChange = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[category] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [category]: newValues,
      };
    });
  };

  const handleClearAll = () => {
    setSelectedFilters({
      facilityType: [],
      performanceTier: [],
      serviceAvailability: [],
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters?.(selectedFilters);
    setIsOpen(false);
  };

  const getSelectedCount = () => {
    return Object.values(selectedFilters).reduce(
      (acc, curr) => acc + curr.length,
      0,
    );
  };

  const selectedCount = getSelectedCount();

  return (
    <div className={cn("relative z-10 w-full", className)}>
      {/* Search Bar with Filter Button */}
      <div className="relative mb-6 w-full">
        <div className="relative w-full">
          <Input
            className="h-12 rounded-full border border-[#E2E4E9] bg-white px-12 placeholder:text-[15px] placeholder:text-[#868C98]"
            placeholder="Search for Facilities"
          />

          <div className="absolute top-1/2 left-4 -translate-y-1/2">
            <Search color="#868C98" size={22} />
          </div>
          {includeFilter && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="absolute top-1/2 right-4 -translate-y-1/2">
                  <div className="flex items-center gap-2">
                    <ListFilter size={20} color="#868C98" />
                    {selectedCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="h-5 w-5 rounded-full p-0 text-xs"
                      >
                        {selectedCount}
                      </Badge>
                    )}
                  </div>
                </button>
              </SheetTrigger>

              <SheetContent className="p-5">
                <SheetHeader>
                  <SheetTitle className="text-[23px] font-medium text-[#111111]">
                    Filters
                  </SheetTitle>
                </SheetHeader>

                <div className="space-y-6">
                  {filterCategories.map((category) => {
                    const categoryKey = category.title
                      .toLowerCase()
                      .replace(/\s+/g, "_");
                    return (
                      <div key={category.title} className="space-y-3">
                        <h3 className="text-[15px] font-normal text-[##343434]">
                          {category.title}
                        </h3>
                        <div className={`flex flex-wrap gap-2`}>
                          {category.options.map((option) => (
                            <div key={option.id} className="flex items-center">
                              <Checkbox
                                id={option.id}
                                checked={selectedFilters[categoryKey]?.includes(
                                  option.value,
                                )}
                                onCheckedChange={() =>
                                  handleCheckboxChange(
                                    categoryKey,
                                    option.value,
                                  )
                                }
                                className="hidden h-5 w-5 rounded border-[#E2E4E9] data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                              />
                              <label
                                htmlFor={option.id}
                                className={cn(
                                  "peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary flex h-6 cursor-pointer items-center justify-center gap-1 rounded-[24px] border-[0.5px] border-[#E4E4E4] px-2 text-xs tracking-[-0.5px]",
                                )}
                              >
                                {" "}
                                {option.icon ? option.icon : ""}
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3.5 flex items-end justify-between gap-4">
                  <button onClick={handleClearAll} className="underline">
                    Clear all
                  </button>
                  <Button
                    onClick={handleApplyFilters}
                    className="bg-primary h-10 rounded-full"
                  >
                    Apply filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      {/* Selected Filters Display (Optional) */}
      {selectedCount > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(selectedFilters).map(([category, values]) =>
            values.map((value) => {
              const option = filterCategories
                .find(
                  (c) =>
                    c.title.toLowerCase().replace(/\s+/g, "_") === category,
                )
                ?.options.find((o) => o.value === value);

              if (!option) return null;

              return (
                <Badge
                  key={`${category}-${value}`}
                  variant="secondary"
                  className="bg-primary px-3 py-1 text-white"
                >
                  {option.label}
                  <button
                    onClick={() => handleCheckboxChange(category, value)}
                    className="ml-2 hover:text-blue-900"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              );
            }),
          )}
        </div>
      )}
    </div>
  );
}
