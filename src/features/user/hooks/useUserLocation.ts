import { useCallback, useEffect, useState, useRef } from "react";
import { useUserStore } from "../store/user-store";

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

  // Use ref to store the permission result for cleanup
  const permissionStatusRef = useRef<PermissionStatus | null>(null);

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
        enableHighAccuracy: false,
        timeout: 15000, // 15 secs
        maximumAge: 300000, // 5mins
      },
    );
  }, [onLocationSuccess, onLocationError, setIsLoading, setError]);

  // Check permission state on mount
  useEffect(() => {
    const checkPermissionState = async () => {
      if (!navigator.permissions) {
        setPermissionState("unsupported");
        return;
      }

      try {
        // Use 'as any' because TypeScript doesn't recognize "geolocation" in PermissionName
        const result = await navigator.permissions.query({
          name: "geolocation" as any,
        });
        setPermissionState(result.state as PermissionState);

        // Store for cleanup
        permissionStatusRef.current = result;

        // Listen for permission changes
        const handlePermissionChange = () => {
          setPermissionState(result.state as PermissionState);
        };

        result.addEventListener("change", handlePermissionChange);

        // If already granted, get location automatically
        if (result.state === "granted") {
          requestLocation();
        }

        // Return cleanup function
        return () => {
          result.removeEventListener("change", handlePermissionChange);
        };
      } catch (err) {
        console.error("Permission query failed:", err);
        setPermissionState("unsupported");
      }
    };

    checkPermissionState();
  }, [requestLocation]);

  // Additional cleanup on unmount
  useEffect(() => {
    return () => {
      if (permissionStatusRef.current) {
        // Remove all event listeners
        permissionStatusRef.current.removeEventListener("change", () => {});
      }
    };
  }, []);

  return {
    permissionState,
    requestLocation,
  };
}
