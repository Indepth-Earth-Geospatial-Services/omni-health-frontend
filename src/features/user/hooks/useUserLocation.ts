import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";

interface Location {
  lat: number;
  lng: number;
}

type PermissionState = "prompt" | "granted" | "denied" | "unsupported";

interface UseUserLocationReturn {
  permissionState: PermissionState;
  requestLocation: () => void;
}

export function useUserLocation(): UseUserLocationReturn {
  const setIsLoading = useUserStore((state) => state.setIsLoadingPosition);
  const setError = useUserStore((state) => state.setLocationError);
  const [permissionState, setPermissionState] =
    useState<PermissionState>("prompt");
  const setUserLocation = useUserStore((state) => state.setUserLocation);

  const onLocationSuccess = useCallback(
    (position: GeolocationPosition) => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setIsLoading(false);
      setError(null);
    },
    [setUserLocation, setIsLoading, setError],
  );

  const onLocationError = useCallback(
    (err: GeolocationPositionError) => {
      console.error("Location error:", err);
      switch (err.code) {
        case 1:
          setError(
            "Location permission denied. Please enable location access.",
          );
          setPermissionState("denied");
          break;
        case 2:
          setError("Location information unavailable.");
          break;
        case 3:
          setError("Location request timed out.");
          break;
        default:
          setError("An unknown error occurred.");
      }
      setIsLoading(false);
    },
    [setError, setIsLoading],
  );

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
  }, [onLocationSuccess, onLocationError, setIsLoading, setError]);

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
  }, [requestLocation]);

  useEffect(() => {
    checkPermissionState();
  }, [checkPermissionState]);

  return {
    permissionState,
    requestLocation,
  };
}
