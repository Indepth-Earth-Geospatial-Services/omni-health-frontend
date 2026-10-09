import { Facility } from "@/types/api-response";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatPhones } from "@/lib/utils";

/**
 * Badge tint per facility category — the same hue family the explore map
 * uses for its markers (MPHC green, clinic blue, post purple), so a category
 * reads the same everywhere. Unknown values fall back to neutral.
 */
const CATEGORY_BADGE: Record<string, string> = {
  "Model Primary Health Centre":
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Health Clinic": "border-blue-200 bg-blue-50 text-blue-700",
  "Health Post": "border-violet-200 bg-violet-50 text-violet-700",
};

export function categoryBadgeClass(category?: string) {
  return (
    (category && CATEGORY_BADGE[category]) ||
    "border-slate-200 bg-slate-100 text-slate-600"
  );
}

export function CategoryBadge({ category }: { category?: string }) {
  if (!category) return null;
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center truncate rounded-full border px-2 py-0.5 text-[11px] font-medium",
        categoryBadgeClass(category),
      )}
      title={category}
    >
      {category}
    </span>
  );
}

interface FacilityCardProps {
  facility: Facility;
  isActive: boolean;
  onExplore: (facilityId: string) => void;
}

/**
 * One facility the admin can switch to. Compact enough to stack in a board
 * column; the facility currently in view is marked and can't be re-selected.
 */
export default function FacilityCard({
  facility,
  isActive,
  onExplore,
}: FacilityCardProps) {
  const phone = formatPhones(facility.contact_info?.phone);
  const place = [facility.town, facility.facility_lga]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-white p-4 transition-all",
        isActive
          ? "border-primary/60 ring-primary/20 shadow-sm ring-2"
          : "border-slate-200 hover:border-slate-300 hover:shadow-sm",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <CategoryBadge category={facility.facility_category} />
        {isActive && (
          <span className="bg-primary shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium text-white">
            Current
          </span>
        )}
      </div>

      <h4
        className="mt-2 line-clamp-2 text-sm font-semibold text-slate-900"
        title={facility.facility_name}
      >
        {facility.facility_name}
      </h4>

      {place && (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
          <MapPin size={13} className="mt-px shrink-0 text-slate-400" />
          <span className="line-clamp-2">{place}</span>
        </p>
      )}
      {phone && (
        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
          <Phone size={13} className="shrink-0 text-slate-400" />
          <span className="truncate">{phone}</span>
        </p>
      )}

      <div className="mt-3 border-t border-slate-100 pt-3">
        <Button
          onClick={() => onExplore(facility.facility_id)}
          variant={isActive ? "outline" : "default"}
          size="sm"
          className="w-full"
          disabled={isActive}
        >
          {isActive ? "Currently viewing" : "Switch to facility"}
          {!isActive && <ArrowRight size={15} className="ml-1" />}
        </Button>
      </div>
    </div>
  );
}
