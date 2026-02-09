import { Shield, Bed, Baby, Activity, Thermometer, Pill } from "lucide-react";
import { DataSection } from "../atoms/data-section";
import { Inventory } from "@/types";

interface InventorySectionProps {
  inventory: Inventory;
}

export const InventorySection: React.FC<InventorySectionProps> = ({
  inventory,
}) => {
  const eq = inventory?.equipment || {};

  const stethoscopes = eq.stethoscope_littman || 0;
  const sphygmomanometers = eq.sphygmomanometer || 0;

  const refrigerators =
    (eq.refrigerator_100_120l_capacity || 0) +
    (eq.refrigerator_medium_60l || 0) +
    (eq.solar_direct_drive_sdd_refrigerator || 0);

  const inpatient_beds = eq.inpatient_beds_with_mattress || 0;
  const baby_cots = eq.baby_cots || 0;
  const delivery_beds = eq.delivery_bed || 0;
  const resuscitation_beds =
    eq.work_surface_for_resuscitation_of_newborn_paediatric_resuscitation_bed_with_radiant_warmer ||
    0;

  const inventoryItems = [
    {
      name: "Inpatient Beds",
      value: inpatient_beds,
      icon: <Bed className="h-4 w-4" />,
    },
    {
      name: "Delivery Beds",
      value: delivery_beds,
      icon: <Bed className="h-4 w-4" />,
    },
    {
      name: "Baby Cots",
      value: baby_cots,
      icon: <Baby className="h-4 w-4" />,
    },
    {
      name: "Resuscitation Beds",
      value: resuscitation_beds,
      icon: <Activity className="h-4 w-4" />,
    },
    {
      name: "Stethoscopes",
      value: stethoscopes,
      icon: <Thermometer className="h-4 w-4" />,
    },
    {
      name: "Sphygmomanometers",
      value: sphygmomanometers,
      icon: <Activity className="h-4 w-4" />,
    },
    {
      name: "Refrigerators",
      value: refrigerators,
      icon: <Pill className="h-4 w-4" />,
    },
  ].filter((item) => item.value !== undefined);

  return (
    <DataSection
      title="Medical Equipment"
      icon={<Shield className="h-5 w-5" />}
      data={inventoryItems}
      emptyMessage="Inventory information not available"
    >
      <div className="grid grid-cols-2 gap-4">
        {inventoryItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-1 flex-wrap items-center justify-between rounded-lg bg-gray-50 p-3 text-xs"
          >
            <div className="flex items-center gap-2">
              {item.icon}
              <span className={`font-medium break-all hyphens-auto`}>
                {item.name}
              </span>
            </div>
            <span className="text-lg font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    </DataSection>
  );
};
