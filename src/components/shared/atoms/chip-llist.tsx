interface ChipListProps {
  items: string[];
  limit?: number;
  color?: "blue" | "green" | "purple" | "orange";
  className?: string;
}

export const ChipList: React.FC<ChipListProps> = ({
  items,
  limit,
  color = "blue",
  className = "",
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    green: "bg-green-100 text-green-800 hover:bg-green-200",
    purple: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    orange: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  };

  const displayItems = limit ? items.slice(0, limit) : items;
  const remainingCount = limit ? items.length - limit : 0;

  if (items.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">No items available</div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {displayItems.map((item, index) => (
        <span
          key={index}
          className={`px-3 py-1.5 ${colorClasses[color]} rounded-full text-sm transition-colors`}
        >
          {item}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-600">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
};
