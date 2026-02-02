import { AlertCircle } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="py-12 text-center">
      <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        No facilities found
      </h3>
      <p className="mt-2 text-gray-600">
        Try adjusting your filters or check back later.
      </p>
    </div>
  );
};

export default EmptyState;
