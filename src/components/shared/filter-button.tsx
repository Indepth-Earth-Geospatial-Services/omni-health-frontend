import { ListFilter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FilterButtonProps {
  onClick: () => void;
  badgeCount: number;
  className?: string;
}

export function FilterButton({ onClick, badgeCount, className }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn("flex items-center gap-2", className)}
    >
      <ListFilter size={20} color="#868C98" />
      {badgeCount > 0 && (
        <Badge
          variant="secondary"
          className="h-5 w-5 rounded-full p-0 text-xs"
        >
          {badgeCount}
        </Badge>
      )}
    </button>
  );
}