import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";

const filters = [
  "All Types",
  "Health Post (HP)",
  "Health Clinic (HC)",
  "Model Primary Health Center (MPHC)",
] as const;

function FilterCard() {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <ListFilter size={20} color="#868C98" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="rounded-3xl border border-[#E2E4E9] p-2 shadow-[0_24px_56px_-4px_#585C5F29]">
          {filters.map((filter, index) => (
            <DropdownMenuLabel key={index}>{filter}</DropdownMenuLabel>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default FilterCard;
