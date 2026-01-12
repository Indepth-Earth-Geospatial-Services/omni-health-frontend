import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { FILTERCATEGORIES } from "@/constants";

interface ActiveFiltersProps {
  selectedFilters: Record<string, string[]>;
  onRemoveFilter: (category: string, value: string) => void;
  className?: string;
}

export function ActiveFilters({
  selectedFilters,
  onRemoveFilter,
  className,
}: ActiveFiltersProps) {
  const selectedCount = Object.values(selectedFilters).reduce(
    (acc, curr) => acc + curr.length,
    0,
  );

  if (selectedCount === 0) return null;

  return (
    <div className={cn("mt-4 flex flex-wrap gap-2", className)}>
      {Object.entries(selectedFilters).map(([category, values]) =>
        values.map((value) => {
          const option = FILTERCATEGORIES.find(
            (c) => c.title.toLowerCase().replace(/\s+/g, "_") === category,
          )?.options.find((o) => o.value === value);

          if (!option) return null;

          return (
            <Badge
              key={`${category}-${value}`}
              variant="secondary"
              className="bg-primary px-3 py-1 text-white"
            >
              {option.label}
              <button
                onClick={() => onRemoveFilter(category, value)}
                className="ml-2 hover:text-blue-900"
              >
                <X size={14} />
              </button>
            </Badge>
          );
        }),
      )}
    </div>
  );
}
