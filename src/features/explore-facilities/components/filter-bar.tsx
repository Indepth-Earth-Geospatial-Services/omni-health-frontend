"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  lgaCounts: { name: string; count: number }[];
  categoryCounts: { name: string; count: number }[];
  totalLgaCount: number;
  totalCategoryCount: number;
  onLgaChange: (lga: string) => void;
  onCategoryChange: (category: string) => void;
}

function FilterBar({
  lgaCounts,
  categoryCounts,
  totalLgaCount,
  totalCategoryCount,
  onLgaChange,
  onCategoryChange,
}: FilterBarProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex flex-wrap justify-center gap-4 bg-white/90 p-4 rounded-lg shadow-lg backdrop-blur-sm w-11/12 md:w-auto">
      <Select onValueChange={onLgaChange}>
        <SelectTrigger className="w-full md:w-[200px] bg-transparent border-2" style={{ borderColor: '#51a199' }}>
          <SelectValue placeholder="Filter by LGA" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All LGAs ({totalLgaCount})</SelectItem>
          {lgaCounts.map((lga) => (
            <SelectItem key={lga.name} value={lga.name}>
              {lga.name} ({lga.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full md:w-[200px] bg-transparent border-2" style={{ borderColor: '#51a199' }}>
          <SelectValue placeholder="Filter by Facility Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types ({totalCategoryCount})</SelectItem>
          {categoryCounts.map((category) => (
            <SelectItem key={category.name} value={category.name}>
              {category.name} ({category.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default FilterBar;
