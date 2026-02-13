import { ReactNode } from "react";

interface DataSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  emptyMessage?: string;
  // eslint-disable-next-line
  data: any[] | Record<string, any>;
  className?: string;
}

export const DataSection: React.FC<DataSectionProps> = ({
  title,
  icon,
  children,
  emptyMessage = "No data available",
  data,
  className = "",
}) => {
  const hasData = Array.isArray(data)
    ? data.length > 0
    : Object.keys(data || {}).length > 0;

  if (!hasData) {
    return null;
  }

  return (
    <div className={`mb-6 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          {icon}
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
};
