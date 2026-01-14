import { Users } from "lucide-react";
import { DataSection } from "../atoms/data-section";
import { ChipList } from "../atoms/chip-llist";

interface SpecialistsSectionProps {
  specialists: string[];
}

export const SpecialistsSection: React.FC<SpecialistsSectionProps> = ({
  specialists,
}) => (
  <DataSection
    title="Available Specialists"
    icon={<Users className="h-5 w-5" />}
    data={specialists}
    emptyMessage="No specialist information available"
  >
    <ChipList items={specialists} color="green" />
  </DataSection>
);
