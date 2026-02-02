import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";

export const Error = ({
  error,
  isRefetching,
  refetch,
}: {
  error: Error;
  isRefetching: boolean;
  refetch: () => void;
}) => {
  return (
    <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <h3 className="font-medium text-red-700">Unable to load facilities</h3>
      </div>
      <p className="mt-2 text-sm text-red-600">
        {error instanceof Error
          ? error.message
          : "An unexpected error occurred"}
      </p>
      <Button
        onClick={() => refetch()}
        disabled={isRefetching}
        variant="outline"
        className="mt-4"
      >
        {isRefetching ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="mr-2 h-4 w-4" />
        )}
        Try Again
      </Button>
    </div>
  );
};

export default Error;
