import { Facility } from "@/features/user/types";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Mail } from "lucide-react";

interface FacilityInfoCardProps {
  facility: Facility;
  handleOnViewDetails: () => void;
}

function FacilityInfoCard({
  facility,
  handleOnViewDetails,
}: FacilityInfoCardProps) {
  return (
    <div className="w-full max-w-64 p-2">
      <div className="mb-2 border-b pb-2">
        <h3 className="text-lg font-bold">{facility.facility_name}</h3>
        <p className="text-sm text-gray-600">{facility.facility_category}</p>
      </div>
      <div className="mb-2 border-b pb-2 text-sm">
        <div className="flex items-center">
          <MapPin className="mr-2 h-4 w-4" />
          <p>{facility.address || facility.town}</p>
        </div>
        {facility.average_rating ? (
          <div className="mt-2 flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1">{facility.average_rating.toFixed(1)}</span>
            <span className="ml-2 text-gray-500">
              ({facility.total_reviews} reviews)
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-col gap-y-4 pb-2 text-sm">
        {facility.contact_info?.phone && (
          <a
            href={`tel:${facility.contact_info.phone}`}
            className="hover:text-primary flex items-center gap-1 text-gray-600"
          >
            <Phone className="mr-1 h-4 w-4" />
            <span>{facility.contact_info.phone}</span>
          </a>
        )}
        {facility.contact_info?.email && (
          <a
            href={`mailto:${facility.contact_info.email}`}
            className="hover:text-primary flex items-center gap-1 text-gray-600"
          >
            <Mail className="mr-1 h-4 w-4" />
            <span>{facility.contact_info.email}</span>
          </a>
        )}
      </div>
      <Button
        onClick={handleOnViewDetails}
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 w-full"
      >
        View Details
      </Button>
    </div>
  );
}

export default FacilityInfoCard;
