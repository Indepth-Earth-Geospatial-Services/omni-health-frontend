"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FILTERCATEGORIES } from "@/constants";
import { cn } from "@/lib/utils";
import { SelectedFilters } from "@/types/search-filter";
import { memo } from "react";

interface FilterSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFilters: SelectedFilters;
  onFilterChange: (category: string, value: string) => void;
  onApplyFilters: () => void;
  onClearAll: () => void;
  trigger?: React.ReactNode;
}

function FilterSheetComponent({
  isOpen,
  onOpenChange,
  selectedFilters,
  onFilterChange,
  onApplyFilters,
  onClearAll,
  trigger,
}: FilterSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}

      <SheetContent className="overflow-auto px-5 pb-5">
        <SheetHeader className="sticky top-0 bg-white pt-5">
          <SheetTitle className="text-[23px] font-medium text-[#111111]">
            Filters
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {FILTERCATEGORIES.map((category) => {
            const categoryKey = category.storeKey;
            return (
              <div key={category.title} className="space-y-3">
                <h3 className="text-[15px] font-normal text-[##343434]">
                  {category.title}
                </h3>
                <div className={`flex flex-wrap gap-2`}>
                  {category.options.map((option) => {
                    const isChecked = selectedFilters[categoryKey]?.includes(
                      option.value,
                    );

                    return (
                      <div key={option.id} className="flex items-center">
                        <Checkbox
                          id={option.id}
                          checked={selectedFilters[categoryKey]?.includes(
                            option.value,
                          )}
                          onCheckedChange={() =>
                            onFilterChange(categoryKey, option.value)
                          }
                          className="hidden h-5 w-5 rounded border-[#E2E4E9] data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                        />
                        <label
                          htmlFor={option.id}
                          // peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary
                          className={cn(
                            "flex h-6 cursor-pointer items-center justify-center gap-1 rounded-[24px] border-[0.5px] border-[#E4E4E4] px-2 text-xs tracking-[-0.5px]",
                            isChecked && "border-primary text-primary",
                          )}
                        >
                          {" "}
                          <span>{option.icon ? option.icon : ""}</span>
                          {option.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3.5 flex items-end justify-between gap-4">
          <button onClick={onClearAll} className="underline">
            Clear all
          </button>
          <Button
            onClick={onApplyFilters}
            className="bg-primary h-10 rounded-full"
          >
            Apply filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
export const FilterSheet = memo(FilterSheetComponent);
FilterSheet.displayName = "FilterSheet";
