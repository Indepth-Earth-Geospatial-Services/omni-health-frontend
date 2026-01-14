import { Shield, Bed, Baby, Activity, Thermometer, Pill } from "lucide-react";
import { DataSection } from "../atoms/data-section";

interface InventorySectionProps {
  inventory: {
    inpatient_beds?: number;
    baby_cots?: number;
    delivery_beds?: number;
    resuscitation_beds?: number;
    stethoscopes?: number;
    sphygmomanometers?: number;
    refrigerators?: number;
  };
}

export const InventorySection: React.FC<InventorySectionProps> = ({
  inventory,
}) => {
  const {
    inpatient_beds = 0,
    baby_cots = 0,
    delivery_beds = 0,
    resuscitation_beds = 0,
    stethoscopes = 0,
    sphygmomanometers = 0,
    refrigerators = 0,
  } = inventory;

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
    { name: "Baby Cots", value: baby_cots, icon: <Baby className="h-4 w-4" /> },
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
