import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onClick?: () => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onClick,
  onChange,
  onFocus,
  placeholder = "Search for Facilities",
  className,
}: SearchBarProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Input
        value={value}
        onClick={onClick}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        className="h-12 rounded-full border border-[#E2E4E9] bg-white px-12 placeholder:text-[15px] placeholder:text-[#868C98]"
        placeholder={placeholder}
      />
      <div className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
        <Search color="#868C98" size={22} />
      </div>
    </div>
  );
}
