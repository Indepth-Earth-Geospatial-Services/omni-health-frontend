import { useEffect, useState, useCallback } from "react";
import { useUserStore } from "../store/userStore";

interface Location {
  lat: number;
  lng: number;
}

type PermissionState = "prompt" | "granted" | "denied" | "unsupported";

interface UseUserLocationReturn {
  location: Location | null;
  isLoading: boolean;
  error: string | null;
  permissionState: PermissionState;
  requestLocation: () => void;
  shouldShowPrompt: boolean;
}

export function useUserLocation(): UseUserLocationReturn {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] =
    useState<PermissionState>("prompt");
  const setUserLocation = useUserStore((state) => state.setUserLocation);

  // Check permission state on mount
  const checkPermissionState = useCallback(async () => {
    if (!navigator.permissions) {
      setPermissionState("unsupported");
      return;
    }

    try {
      const result = await navigator.permissions.query({ name: "geolocation" });
      setPermissionState(result.state as PermissionState);

      // Listen for permission changes
      result.addEventListener("change", () => {
        setPermissionState(result.state as PermissionState);
      });

      // If already granted, get location automatically
      if (result.state === "granted") {
        requestLocation();
      }
    } catch (err) {
      console.error("Permission query failed:", err);
      setPermissionState("unsupported");
    }
  }, []);

  const onLocationSuccess = useCallback(
    (position: GeolocationPosition) => {
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setLocation(newLocation);
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setIsLoading(false);
      setError(null);
    },
    [setUserLocation],
  );

  const onLocationError = useCallback((err: GeolocationPositionError) => {
    console.error("Location error:", err);
    switch (err.code) {
      case err.PERMISSION_DENIED:
        setError("Location permission denied. Please enable location access.");
        setPermissionState("denied");
        break;
      case err.POSITION_UNAVAILABLE:
        setError("Location information unavailable.");
        break;
      case err.TIMEOUT:
        setError("Location request timed out.");
        break;
      default:
        setError("An unknown error occurred.");
    }
    setIsLoading(false);
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setPermissionState("unsupported");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      onLocationSuccess,
      onLocationError,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      },
    );
  }, [onLocationSuccess, onLocationError]);

  useEffect(() => {
    checkPermissionState();
  }, [checkPermissionState]);

  const shouldShowPrompt = permissionState === "prompt" && !location;

  return {
    location,
    isLoading,
    error,
    permissionState,
    requestLocation,
    shouldShowPrompt,
  };
}
