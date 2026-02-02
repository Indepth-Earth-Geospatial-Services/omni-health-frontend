import { useMemo, useState, useEffect } from "react";
import { Coordinates, mapboxService } from "@/services/mapbox.service";

interface UseNativeNavigationOptions {
  origin: Coordinates | null;
  destination: Coordinates | null;
  destinationName?: string;
}

export function useNativeNavigation({
  origin,
  destination,
  destinationName = "Destination",
}: UseNativeNavigationOptions) {
  // 1. SSR-SAFE PLATFORM DETECTION
  const [platformInfo, setPlatformInfo] = useState({
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    platformName: "Google Maps", // Default for SSR
    appStoreLink: "",
  });

  useEffect(() => {
    // This only runs on the client
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setPlatformInfo({
      isIOS,
      isAndroid,
      isMobile: isIOS || isAndroid,
      platformName: isIOS ? "Apple Maps" : "Google Maps",
      appStoreLink: isIOS
        ? "https://apps.apple.com/us/app/apple-maps/id915056765"
        : "https://play.google.com/store/apps/details?id=com.google.android.apps.maps",
    });
  }, []);

  // 2. ROUTE INFO (Your logic was fine, just keeping it consistent)
  const routeInfo = useMemo(() => {
    if (!origin || !destination) return null;

    const distance = mapboxService.calculateHaversineDistance(
      origin,
      destination,
    );
    const formattedDistance = mapboxService.formatDistance(distance);

    // 30km/h average speed assumption
    const estimatedTimeMinutes = Math.round((distance / 1000 / 30) * 60);
    const formattedDuration = mapboxService.formatDuration(
      estimatedTimeMinutes * 60,
    );

    // const arrivalTime = new Date(Date.now() + estimatedTimeMinutes * 60000)
    //   .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const arrivalTime = (() => {
      const now = new Date();
      const arrival = new Date(now.getTime() + estimatedTimeMinutes * 60000);
      return arrival.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    })();
    return { formattedDistance, formattedDuration, arrivalTime };
  }, [origin, destination]);

  // 3. ROBUST URL GENERATION
  const getFallbackUrl = () => {
    if (!destination) return "#";
    const { latitude, longitude } = destination;

    if (platformInfo.isIOS) {
      // Apple Maps URL Scheme
      return `maps://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`;
    }

    // Google Maps Universal Link (Works on Android App, iOS App, and Web)
    const originStr = origin
      ? `&origin=${origin.latitude},${origin.longitude}`
      : "";
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}${originStr}&travelmode=driving`;
  };

  const openNativeNavigation = () => {
    if (!destination) return;

    // Try to open via window location assignment first (triggers app intents)
    window.location.href = getFallbackUrl();
  };

  return {
    routeInfo,
    openNativeNavigation,
    getFallbackUrl,
    isAvailable: !!destination,
    platformInfo,
  };
}
