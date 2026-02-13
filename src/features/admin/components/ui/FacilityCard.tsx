import { Facility } from "@/types/api-response";
import { MapPin, Phone, Mail, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FacilityCardProps {
  facility: Facility;
  isActive: boolean;
  onExplore: (facilityId: string) => void;
}

export default function FacilityCard({
  facility,
  isActive,
  onExplore,
}: FacilityCardProps) {
  const rating = facility.average_rating ?? 0;
  const reviews = facility.total_reviews ?? 0;

  return (
    <div
      className={`relative rounded-2xl border-2 bg-white px-6 py-5 transition-all ${
        isActive
          ? "border-primary/50 bg-primary/5 shadow-md"
          : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      {/* Active badge */}
      {isActive && (
        <span className="bg-primary absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-medium text-white">
          Current
        </span>
      )}

      {/* Facility name & category */}
      <h3 className="pr-16 text-lg font-semibold text-slate-900">
        {facility.facility_name}
      </h3>
      <span className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
        {facility.facility_category}
      </span>

      {/* Location */}
      <div className="mt-4 flex items-start gap-2 text-sm text-slate-600">
        <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
        <span>
          {[facility.town, facility.facility_lga, facility.address]
            .filter(Boolean)
            .join(", ")}
        </span>
      </div>

      {/* Contact info */}
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
        {facility.contact_info?.phone && (
          <div className="flex items-center gap-1.5">
            <Phone size={14} className="text-slate-400" />
            <span>{facility.contact_info.phone}</span>
          </div>
        )}
        {facility.contact_info?.email && (
          <div className="flex items-center gap-1.5">
            <Mail size={14} className="text-slate-400" />
            <span>{facility.contact_info.email}</span>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium text-slate-700">
            {rating.toFixed(1)}
          </span>
        </div>
        <span className="text-xs text-slate-400">
          ({reviews} {reviews === 1 ? "review" : "reviews"})
        </span>
      </div>

      {/* Explore button */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        <Button
          onClick={() => onExplore(facility.facility_id)}
          variant={isActive ? "outline" : "default"}
          size="sm"
          className="w-full"
          disabled={isActive}
        >
          {isActive ? "Currently Viewing" : "Explore Facility"}
          {!isActive && <ArrowRight size={16} className="ml-1" />}
        </Button>
      </div>
    </div>
  );
}
