import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LocationDeniedHelp() {
  const [showInstructions, setShowInstructions] = useState(false);
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-red-50">
          <AlertCircle size={24} className="text-red-500" />
        </div>
        <h4 className="mb-1 text-[15px] font-medium">Location Access Denied</h4>
        <p className="mb-3 text-[13px] text-gray-500">
          Enable location to see facilities near you
        </p>

        <Button
          onClick={() => setShowInstructions(!showInstructions)}
          variant="outline"
          className="mb-3 rounded-full text-[13px]"
        >
          {showInstructions ? "Hide" : "Show"} Instructions
        </Button>

        {showInstructions && (
          <div className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-left">
            <h5 className="mb-2 text-[13px] font-medium">How to Enable:</h5>

            {/* Chrome/Edge */}
            <div className="mb-3">
              <p className="mb-1 text-[12px] font-medium text-gray-700">
                Chrome/Edge:
              </p>
              <ol className="ml-4 list-decimal space-y-1 text-[11px] text-gray-600">
                <li>Click the 🔒 lock icon in the address bar</li>
                <li>Find "Location" → Select "Allow"</li>
                <li>Click the button below to refresh</li>
              </ol>
            </div>

            {/* Safari */}
            <div className="mb-3">
              <p className="mb-1 text-[12px] font-medium text-gray-700">
                Safari:
              </p>
              <ol className="ml-4 list-decimal space-y-1 text-[11px] text-gray-600">
                <li>Safari menu → Settings for This Website</li>
                <li>Location → Allow</li>
                <li>Refresh the page</li>
              </ol>
            </div>

            {/* Firefox */}
            <div>
              <p className="mb-1 text-[12px] font-medium text-gray-700">
                Firefox:
              </p>
              <ol className="ml-4 list-decimal space-y-1 text-[11px] text-gray-600">
                <li>Click the 🔒 lock icon</li>
                <li>Click the "X" next to "Blocked" for Location</li>
                <li>Refresh and allow when prompted</li>
              </ol>
            </div>
          </div>
        )}

        <div className="mt-4 flex w-full max-w-xs flex-col gap-2">
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary rounded-full"
          >
            <RefreshCw size={16} />
            I've Enabled Location
          </Button>
          <Button
            onClick={() => router.push("/facilities")}
            variant="outline"
            className="rounded-full"
          >
            Browse All Facilities
          </Button>
        </div>
      </div>
    </div>
  );
}
