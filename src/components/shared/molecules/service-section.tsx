import { Heart } from "lucide-react";
import { DataSection } from "../atoms/data-section";
import { ChipList } from "../atoms/chip-llist";

interface ServicesSectionProps {
  services_list: string[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services_list,
}) => (
  <DataSection
    title="Services Offered"
    icon={<Heart className="h-5 w-5" />}
    data={services_list}
    emptyMessage="No services information available"
  >
    <ChipList items={services_list} limit={8} color="blue" />
  </DataSection>
);
