"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
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

        <Accordion type="single" collapsible className="w-full">
          <div className="space-y-6">
            {FILTERCATEGORIES.map((category) => {
              const categoryKey = category.storeKey;
              return (
                <AccordionItem
                  key={category.title}
                  value={categoryKey}
                  className="space-y-3 border-0"
                >
                  <AccordionTrigger className="text-[15px] font-normal text-[##343434]">
                    {category.title}
                  </AccordionTrigger>
                  <AccordionContent className={`flex flex-wrap gap-2`}>
                    {category.options.map((option) => {
                      const isChecked = selectedFilters[categoryKey]?.includes(
                        option.value,
                      );

                      return (
                        <div key={option.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={option.id}
                            className="hidden"
                            checked={isChecked}
                            onChange={() =>
                              onFilterChange(categoryKey, option.value)
                            }
                          />
                          <label
                            htmlFor={option.id}
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
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </div>
        </Accordion>
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
