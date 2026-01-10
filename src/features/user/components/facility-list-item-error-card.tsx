import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function FacilityListItemErrorCard({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-3">
      <AlertCircle size={20} className="shrink-0 text-red-500" />
      <div className="flex-1">
        <p className="text-[13px] text-red-700">{message}</p>
      </div>
      <Button
        onClick={onRetry}
        size="sm"
        variant="outline"
        className="h-8 gap-1 rounded-full border-red-300 bg-white text-[11px] hover:bg-red-100"
      >
        <RefreshCw size={12} />
        Retry
      </Button>
    </div>
  );
}
