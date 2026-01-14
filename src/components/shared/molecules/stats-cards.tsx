import { Users, Stethoscope, Bed, Baby } from "lucide-react";
import { InfoCard } from "../atoms/info-card";

interface StatsCardsProps {
  avg_daily_patients?: number;
  doctor_patient_ratio?: number;
  totalBeds: number;
  baby_cots?: number;
  isLoading?: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  avg_daily_patients,
  doctor_patient_ratio,
  totalBeds,
  baby_cots,
  isLoading = false,
}) => {
  const stats = [
    {
      title: "Daily Patients",
      value: avg_daily_patients || "N/A",
      icon: <Users className="text-blue-600" size={24} />,
      color: "blue" as const,
    },
    {
      title: "Doctor Ratio",
      value: doctor_patient_ratio ? `1:${doctor_patient_ratio}` : "N/A",
      icon: <Stethoscope className="text-green-600" size={24} />,
      color: "green" as const,
    },
    {
      title: "Total Beds",
      value: totalBeds || "0",
      icon: <Bed className="text-purple-600" size={24} />,
      color: "purple" as const,
    },
    {
      title: "Baby Cots",
      value: baby_cots || "0",
      icon: <Baby className="text-orange-600" size={24} />,
      color: "orange" as const,
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <InfoCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          loading={isLoading}
        />
      ))}
    </div>
  );
};
