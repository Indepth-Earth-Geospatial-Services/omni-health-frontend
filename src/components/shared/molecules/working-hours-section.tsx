import { getToday } from "@/lib/utils";
import { Clock, AlertCircle } from "lucide-react";
import { DataSection } from "../atoms/data-section";

interface WorkingHoursSectionProps {
  working_hours: Record<string, string>;
}

export const WorkingHoursSection: React.FC<WorkingHoursSectionProps> = ({
  working_hours,
}) => {
  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  const today = getToday();
  const hasEmergency = working_hours?.emergency === "24/7";

  return (
    <DataSection
      title="Working Hours"
      icon={<Clock className="h-5 w-5" />}
      data={working_hours}
      emptyMessage="Working hours not specified"
    >
      <div className="overflow-hidden rounded-lg bg-gray-50">
        {days.map((day) => {
          const hours = working_hours[day.key];
          const isToday = today === day.key;

          return (
            <div
              key={day.key}
              className={`flex items-center justify-between p-3 ${isToday ? "bg-blue-50" : ""} ${day.key !== "sunday" ? "border-b border-gray-200" : ""}`}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{day.label}</span>
                {isToday && (
                  <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                    Today
                  </span>
                )}
              </div>
              <span
                className={
                  hours === "Closed" || !hours
                    ? "text-red-500"
                    : "text-gray-700"
                }
              >
                {hours || "Not specified"}
              </span>
            </div>
          );
        })}
      </div>
      {hasEmergency && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="font-medium text-red-700">
              24/7 Emergency Services Available
            </span>
          </div>
        </div>
      )}
    </DataSection>
  );
};
