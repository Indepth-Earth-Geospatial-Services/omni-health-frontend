import { AlertCircle } from "lucide-react";
import { DataSection } from "../atoms/data-section";

interface AdditionalInfoSectionProps {
  hfr_id?: string;
  facility_lga?: string;
  town?: string;
  facility_category?: string;
}

export const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  hfr_id,
  facility_lga,
  town,
  facility_category,
}) => {
  const additionalInfo = [
    { label: "HFR ID", value: hfr_id },
    { label: "LGA", value: facility_lga },
    { label: "Town", value: town },
    { label: "Facility Category", value: facility_category },
  ].filter((info) => info.value);

  if (additionalInfo.length === 0) return null;

  return (
    <DataSection
      title="Additional Information"
      icon={<AlertCircle className="h-5 w-5" />}
      data={additionalInfo}
    >
      <div className="space-y-3">
        {additionalInfo.map((info, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
          >
            <span className="font-medium">{info.label}</span>
            <span className="text-gray-700">{info.value}</span>
          </div>
        ))}
      </div>
    </DataSection>
  );
};
