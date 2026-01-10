"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MapPin, AlertCircle } from "lucide-react";
import { useUserLocation } from "../hooks/useUserLocation";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";

function LocationHandler() {
  const { permissionState, requestLocation } = useUserLocation();
  const [open, setOpen] = useState(false);
  const isLoading = useUserStore((state) => state.isLoadingPosition);

  useEffect(() => {
    if (permissionState === "prompt" || permissionState === "denied") {
      setOpen(true);
    } else if (permissionState === "granted") {
      setOpen(false);
    }
  }, [permissionState]);

  if (permissionState === "granted") {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="w-[80%] rounded-[24px]">
        {/* Permission Denied State */}
        {permissionState === "denied" && (
          <>
            <AlertDialogHeader className="items-center text-center">
              <div className="mb-2 flex size-16 items-center justify-center rounded-full border border-red-500 bg-red-50">
                <AlertCircle size={24} color="#EF4444" />
              </div>
              <AlertDialogTitle className="text-[19px]">
                Location Denied
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[13px] text-[#868C98]">
                Please enable location access in your browser settings to get
                personalized facility recommendations.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">
                Close
              </AlertDialogCancel>
            </AlertDialogFooter>
          </>
        )}

        {/* Permission Prompt State */}
        {permissionState === "prompt" && (
          <>
            <AlertDialogHeader className="items-center text-center">
              <div className="border-primary mb-2 flex size-16 items-center justify-center rounded-full border bg-[#E0FFFC]">
                <MapPin size={24} color="#51A199" />
              </div>
              <AlertDialogTitle className="text-[19px]">
                Location Request
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-[13px] text-[#868C98]">
                Allow Live Location Tracking to enable accurate Facility
                Recommendation
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-[47px] flex-row gap-4">
              <AlertDialogCancel
                className="grow rounded-full border border-[#E2E4E9] bg-[#F6F8FA] text-black hover:bg-[#F6F8FA]/90"
                onClick={() => setOpen(false)}
              >
                Back
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-primary hover:bg-primary/90 grow rounded-full"
                onClick={() => {
                  requestLocation();
                }}
                disabled={isLoading}
              >
                {isLoading ? "Requesting..." : "Allow"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LocationHandler;
