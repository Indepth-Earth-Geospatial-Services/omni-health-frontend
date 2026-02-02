import { ReactNode } from "react";

interface InfoCardProps {
  title: string;
  value: string | number | ReactNode;
  icon: ReactNode;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "gray";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  className?: string;
}
const colorClasses = {
  blue: "bg-blue-50 text-blue-800 border-blue-200",
  green: "bg-green-50 text-green-800 border-green-200",
  purple: "bg-purple-50 text-purple-800 border-purple-200",
  orange: "bg-orange-50 text-orange-800 border-orange-200",
  red: "bg-red-50 text-red-800 border-red-200",
  gray: "bg-gray-50 text-gray-800 border-gray-200",
};

const sizeClasses = {
  sm: "p-2",
  md: "p-3",
  lg: "p-4",
};

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  value,
  icon,
  color = "blue",
  size = "md",
  loading = false,
  className = "",
}) => {
  if (loading) {
    return (
      <div
        className={`animate-pulse ${sizeClasses[size]} rounded-lg border ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-gray-200"></div>
            <div className="h-6 w-16 rounded bg-gray-200"></div>
          </div>
          <div className="h-8 w-8 rounded-full bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-lg border ${colorClasses[color]} ${className}`}
    >
      <div className="flex flex-wrap items-center gap-1">
        <div className="*:block">
          <span className="mb-1 text-sm font-medium">{title}</span>
          <span
            className={`font-bold ${size === "lg" ? "text-2xl" : size === "md" ? "text-xl" : "text-lg"}`}
          >
            {value}
          </span>
        </div>

        <div
          className={`rounded-full p-2 ${colorClasses[color].split(" ")[0]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
