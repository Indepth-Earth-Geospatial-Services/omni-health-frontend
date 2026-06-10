"use client";

import { useRouteGeometry } from "@/hooks/use-route-geometry";
import { useNativeNavigation } from "@/hooks/use-native-navigation";
import { Facility } from "@/types";
import { cn } from "@/lib/utils";
import { ArrowLeft, Clock, MapPin, Navigation } from "lucide-react";
import Image from "next/image";
import compass from "@assets/img/icons/svg/compass-rose.svg";

interface DirectionsPanelProps {
  facility: Facility;
  userLocation: { latitude: number; longitude: number } | null;
  onBackToDetails: () => void;
  onClose: () => void;
  className?: string;
}

export function DirectionsPanel({
  facility,
  userLocation,
  onBackToDetails,
  onClose,
  className,
}: DirectionsPanelProps) {
  const destination = facility
    ? { latitude: facility.lat, longitude: facility.lon }
    : null;

  const {
    data: routeData,
    isLoading: isRouteLoading,
    isError: isRouteError,
  } = useRouteGeometry({
    origin: userLocation,
    destination,
    enabled: !!userLocation && !!destination,
  });

  const { routeInfo, openNativeNavigation, platformInfo } =
    useNativeNavigation({
      origin: userLocation,
      destination,
      destinationName: facility?.facility_name || "Destination",
    });

  const distance = routeData?.distanceFormatted || routeInfo?.formattedDistance;
  const duration = routeData?.durationFormatted || routeInfo?.formattedDuration;
  const arrivalTime = routeInfo?.arrivalTime;

  const isLoading = isRouteLoading && !!userLocation;

  return (
    <aside
      className={cn(
        "flex h-dvh w-[380px] shrink-0 flex-col border-r border-[#E2E4E9] bg-white xl:w-[420px]",
        className,
      )}
    >
      {/* Header */}
      <div className="shrink-0 border-b border-[#E2E4E9] px-5 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDetails}
            className="flex size-9 items-center justify-center rounded-full bg-[#E2E4E9] transition-colors hover:bg-gray-200"
            aria-label="Back to details"
          >
            <ArrowLeft size={18} color="black" />
          </button>
          <div>
            <h1 className="text-[17px] font-medium">Directions</h1>
            <p className="mt-0.5 text-[13px] text-[#868C98]">
              {facility.facility_name}
            </p>
          </div>
        </div>
      </div>

      {/* Route info */}
      <div className="space-y-3 px-5 py-4">
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4 animate-spin" />
            Calculating route...
          </div>
        )}

        {!isLoading && isRouteError && (
          <p className="text-sm text-red-500">
            Could not calculate route. Using estimated distance.
          </p>
        )}

        {distance && (
          <div className="flex items-center gap-3 rounded-lg border border-[#E2E4E9] p-3">
            <div className="rounded-full bg-blue-50 p-2">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-[#868C98]">Distance</p>
              <p className="text-sm font-medium">{distance}</p>
            </div>
          </div>
        )}

        {duration && (
          <div className="flex items-center gap-3 rounded-lg border border-[#E2E4E9] p-3">
            <div className="rounded-full bg-green-50 p-2">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-[#868C98]">Estimated time</p>
              <p className="text-sm font-medium">{duration}</p>
            </div>
          </div>
        )}

        {arrivalTime && (
          <div className="flex items-center gap-3 rounded-lg border border-[#E2E4E9] p-3">
            <div className="rounded-full bg-purple-50 p-2">
              <Navigation className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-[#868C98]">Arrival</p>
              <p className="text-sm font-medium">
                {arrivalTime}
              </p>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
          <p className="text-xs text-amber-700">
            This will open {platformInfo.platformName} for turn-by-turn
            navigation.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 px-5 pb-4">
        <button
          onClick={openNativeNavigation}
          disabled={!userLocation}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Image
            src={compass}
            alt=""
            className="h-4 w-4 object-cover"
          />
          Start Navigation
        </button>

        <button
          onClick={onBackToDetails}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[#E2E4E9] py-3 text-sm font-medium text-[#5A5F6B] transition-colors hover:bg-gray-50"
        >
          Back to Details
        </button>
      </div>
    </aside>
  );
}
