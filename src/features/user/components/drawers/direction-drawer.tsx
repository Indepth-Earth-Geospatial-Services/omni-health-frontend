// "use client";
// import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
// import { useState } from "react";
// import { useUserStore } from "../../store/user-store";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { Phone, X } from "lucide-react";
// import exportIcon from "@assets/img/icons/svg/Export.svg";
// import compass from "@assets/img/icons/svg/compass-rose.svg";
// import { useDrawerStore } from "../../store/drawer-store";
// import { useFacilityStore } from "../../store/facility-store";

// interface ResultsDrawerProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// function DirectionDrawer({ isOpen, onClose }: ResultsDrawerProps) {
//   const [snap, setSnap] = useState<number | string | null>(0.5);
//   const hasStartDirections = useDrawerStore(
//     (state) => state.hasStartDirections,
//   );
//   const endDirections = useDrawerStore((state) => state.endDirections);
//   const startDirections = useDrawerStore((state) => state.startDirections);
//   const facility = useFacilityStore((s) => s.selectedFacility);
//   const userLocation = useUserStore((state) => state.userLocation);
//   // useFacilityStore(s=>s.)
//   const handleStartDirections = () => {
//     startDirections();
//   };
//   const handleEndDirections = () => {
//     endDirections();
//   };
//   return (
//     <Drawer
//       open={isOpen}
//       onOpenChange={onClose}
//       snapPoints={[0.5]}
//       activeSnapPoint={snap}
//       setActiveSnapPoint={setSnap}
//       dismissible={false}
//       modal={false}
//     >
//       <DrawerContent className="flex h-full">
//         <DrawerTitle className="sr-only">
//           {!hasStartDirections ? "Directions to Facility" : "Active Navigation"}
//         </DrawerTitle>
//         <div className="px-5 pt-8.5 pb-5">
//           {!hasStartDirections ? (
//             <>
//               <div className="flex justify-between gap-x-2">
//                 <h2 className="text-[19px] font-normal">
//                   7mins Drive to {facility?.facility_name}
//                 </h2>
//                 <div className="shrink-0 space-x-3">
//                   <Button className="rounded-full bg-[#E2E4E9]" size="icon-sm">
//                     <Image
//                       src={exportIcon}
//                       alt=""
//                       className="size-5 object-cover"
//                     />
//                   </Button>
//                   <Button
//                     onClick={onClose}
//                     className="rounded-full bg-[#E2E4E9]"
//                     size="icon-sm"
//                   >
//                     <X size={20} color="black" />
//                   </Button>
//                 </div>
//               </div>

//               <div className="text-[11px] font-normal text-[#868C98]">
//                 <h6 className="text-primary">{facility?.address}</h6>
//                 <p className="text-[15px] text-[#868C98]">Arrive by 18:20pm</p>
//               </div>

//               <div className="mt-3 space-x-3">
//                 <Button
//                   onClick={handleStartDirections}
//                   size="lg"
//                   className="bg-primary rounded-full text-[11px]"
//                 >
//                   <Image
//                     src={compass}
//                     alt=""
//                     className="size-3.5 object-cover"
//                   />
//                   Start Directions
//                 </Button>
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="rounded-full border border-[#868C98] text-[11px] text-[#868C98]"
//                   onClick={() => window.open(`tel:8080`)}
//                 >
//                   <Phone size={14} /> Call
//                 </Button>
//               </div>
//             </>
//           ) : (
//             <div>
//               <div className="flex items-center justify-between">
//                 <h4 className="text-[28px] font-normal">7 mins left</h4>
//                 <Button
//                   onClick={handleEndDirections}
//                   className="rounded-full"
//                   variant="destructive"
//                   size="lg"
//                 >
//                   End
//                 </Button>
//               </div>
//               <p className="text-[19px] text-[#868C98]">28.km</p>
//             </div>
//           )}
//         </div>
//       </DrawerContent>
//     </Drawer>
//   );
// }

// export default DirectionDrawer;

"use client";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useNativeNavigation } from "@/hooks/useNativeNavigation";
import compass from "@assets/img/icons/svg/compass-rose.svg";
import {
  AlertCircle,
  Clock,
  Download,
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useDrawerStore } from "../../store/drawer-store";
import { useFacilityStore } from "../../store/facility-store";
import { useUserStore } from "../../store/user-store";

interface DirectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function DirectionDrawer({ isOpen, onClose }: DirectionDrawerProps) {
  const [snap, setSnap] = useState<number | string | null>(0.8);
  const [hasAttemptedNavigation, setHasAttemptedNavigation] = useState(false);

  // Store states
  const hasStartDirections = useDrawerStore(
    (state) => state.hasStartDirections,
  );
  const endDirections = useDrawerStore((state) => state.endDirections);
  const startDirections = useDrawerStore((state) => state.startDirections);

  // Data
  const facility = useFacilityStore((s) => s.selectedFacility);
  const userLocation = useUserStore((state) => state.userLocation);

  // Native navigation hook
  const {
    routeInfo,
    openNativeNavigation,
    getFallbackUrl,
    isAvailable,
    platformInfo,
  } = useNativeNavigation({
    origin: userLocation,
    destination: facility
      ? {
          latitude: facility.lat,
          longitude: facility.lon,
        }
      : null,
    destinationName: facility?.facility_name,
  });

  // Handle start navigation
  const handleStartNavigation = () => {
    if (!facility) return;

    // Update store and local state
    startDirections();
    setHasAttemptedNavigation(true);

    // Use the service method for opening navigation
    openNativeNavigation();
  };

  // Handle end navigation
  const handleEndNavigation = () => {
    endDirections();
    setHasAttemptedNavigation(false);
    onClose();
  };

  // Content shown AFTER user starts navigation
  const navigationStartedContent = (
    <div className="flex h-full flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white pb-4">
        <div className="flex justify-between gap-x-2">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[19px] font-normal">
              Navigating to {facility?.facility_name}
            </h2>
            <div className="mt-2 text-[11px] font-normal text-[#868C98]">
              <div className="flex items-center gap-2 text-[15px]">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {routeInfo?.formattedDistance || "Calculating..."}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[15px]">
                <Clock className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  Arrive by {routeInfo?.arrivalTime || "..."}
                </span>
              </div>
            </div>
          </div>
          <div className="shrink-0 space-x-3">
            <Button
              onClick={handleEndNavigation}
              className="rounded-full bg-[#E2E4E9]"
              size="icon-sm"
            >
              <X size={20} color="black" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="scrollbar-hide flex-1 space-y-4 overflow-auto pb-60">
        {/* Optimistic Message */}
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <Navigation className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <div>
              <h3 className="font-medium text-blue-800">Navigation Started</h3>
              <p className="mt-1 text-sm text-blue-600">
                You should have been redirected to {platformInfo.platformName}{" "}
                for optimized turn-by-turn directions.
              </p>
            </div>
          </div>
        </div>

        {/* Fallback Section */}
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="mb-3 text-sm text-gray-600">
            If you're still here, use this link for instant directions:
          </p>
          <div className="space-y-2">
            <a
              href={getFallbackUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary flex items-center justify-center gap-2 rounded-lg p-3 text-white hover:opacity-90"
            >
              <ExternalLink className="h-5 w-5" />
              <span className="font-medium">
                Open in {platformInfo.platformName}
              </span>
            </a>

            {/* App Download Hint (for mobile) */}
            {platformInfo.isMobile && (
              <div className="rounded-lg bg-amber-50 p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-sm text-amber-800">
                      Don't have {platformInfo.platformName}? Download it from:
                    </p>
                    <a
                      href={platformInfo.appStoreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-amber-700 underline hover:text-amber-800"
                    >
                      <Download className="h-3 w-3" />
                      {platformInfo.isIOS ? "App Store" : "Google Play Store"}
                    </a>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleEndNavigation}
              variant="outline"
              className="w-full"
            >
              <X className="mr-2 h-4 w-4" />
              End Navigation
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 rounded-full border border-[#868C98] text-[11px] text-[#868C98]"
            onClick={() =>
              window.open(`tel:0${facility?.contact_info?.phone || "8080"}`)
            }
          >
            <Phone size={14} className="mr-1" />
            Call Facility
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-full border border-[#868C98] text-[11px] text-[#868C98]"
            onClick={onClose}
          >
            <X size={14} className="mr-1" />
            Close
          </Button>
        </div>

        {/* Additional Help Section */}
        <div className="rounded-lg bg-gray-50 p-3">
          <h4 className="mb-2 text-sm font-medium text-gray-700">Need Help?</h4>
          <ul className="space-y-1 text-xs text-gray-600">
            <li>
              • Make sure {platformInfo.platformName} is installed on your
              device
            </li>
            <li>• Check that you have an active internet connection</li>
            <li>• Enable location services for the best experience</li>
            {!platformInfo.isMobile && (
              <li>• On desktop, Google Maps will open in a new browser tab</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );

  // Content shown BEFORE user starts navigation
  const navigationSetupContent = (
    <div className="flex h-full flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white pb-4">
        <div className="flex justify-between gap-x-2">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[19px] font-normal">
              {routeInfo
                ? `${routeInfo.formattedDuration} to ${facility?.facility_name}`
                : "Calculating route..."}
            </h2>
            <div className="text-[11px] font-normal text-[#868C98]">
              <h6 className="text-primary truncate">{facility?.address}</h6>
              {routeInfo && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-[15px]">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{routeInfo.formattedDistance}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[15px]">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>Arrive by {routeInfo.arrivalTime}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="shrink-0 space-x-3">
            <Button
              onClick={onClose}
              className="rounded-full bg-[#E2E4E9]"
              size="icon-sm"
            >
              <X size={20} color="black" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="scrollbar-hide flex-1 space-y-4 overflow-auto pb-50">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-sm text-gray-600">
            This will open {platformInfo.platformName} for turn-by-turn
            navigation. Your location and destination will be sent to the maps
            app.
          </p>
        </div>

        <div className="space-x-3">
          <Button
            onClick={handleStartNavigation}
            size="lg"
            className="bg-primary w-full rounded-full text-[11px]"
            disabled={!isAvailable}
          >
            <Image
              src={compass}
              alt="Start Navigation"
              className="mr-2 size-3.5 object-cover"
            />
            Start Navigation
          </Button>
        </div>

        <div className="space-y-2">
          <Button
            size="lg"
            variant="outline"
            className="w-full rounded-full border border-[#868C98] text-[11px] text-[#868C98]"
            onClick={() =>
              window.open(`tel:${facility?.contact_info?.phone || "8080"}`)
            }
          >
            <Phone size={14} className="mr-2" />
            Call Facility
          </Button>

          {/* App Download Hint for mobile */}
          {platformInfo.isMobile && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-blue-500" />
                <p className="text-xs text-blue-700">
                  Make sure you have {platformInfo.platformName} installed for
                  the best experience.
                </p>
              </div>
              <a
                href={platformInfo.appStoreLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 underline hover:text-blue-700"
              >
                <Download className="h-3 w-3" />
                {platformInfo.isIOS
                  ? "Get Apple Maps from App Store"
                  : "Get Google Maps from Play Store"}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Determine which content to show
  const content =
    hasStartDirections || hasAttemptedNavigation
      ? navigationStartedContent
      : navigationSetupContent;

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // Reset when drawer closes
          setHasAttemptedNavigation(false);
          onClose();
        }
      }}
      snapPoints={[0.3, 0.5, 0.8, 1]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      dismissible={true}
      modal={false}
    >
      <DrawerTitle className="sr-only">
        {hasStartDirections ? "Navigation Active" : "Directions Setup"}
      </DrawerTitle>
      <DrawerContent className="flex h-full">
        <div className="flex h-full flex-col px-5 pt-2">{content}</div>
      </DrawerContent>
    </Drawer>
  );
}

export default DirectionDrawer;
