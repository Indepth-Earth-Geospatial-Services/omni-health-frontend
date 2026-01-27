import { useCallback, useEffect, useState, useRef } from "react";
import { useUserStore } from "../store/user-store";
import { toast } from "sonner";

type PermissionState = "prompt" | "granted" | "denied" | "unsupported";

interface UseUserLocationReturn {
  permissionState: PermissionState;
  requestLocation: () => void;
}
const TOAST_ID = "user-location-toast";

export function useUserLocation(): UseUserLocationReturn {
  const setIsLoading = useUserStore((state) => state.setIsLoadingPosition);
  const setError = useUserStore((state) => state.setLocationError);
  const [permissionState, setPermissionState] =
    useState<PermissionState>("prompt");
  const setUserLocation = useUserStore((state) => state.setUserLocation);

  const requestRef = useRef<() => void>(() => {});
  // const loadingToastId = useRef<string | number | null>(null);
  // Use ref to store the permission result for cleanup
  const permissionStatusRef = useRef<PermissionStatus | null>(null);

  const onLocationSuccess = useCallback(
    (position: GeolocationPosition) => {
      toast.success("Location updated", { id: TOAST_ID });

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
      setIsLoading(false);

      // 1. Specific Handle for "Denied" (Permanent Block)
      if (err.code === 1) {
        setPermissionState("denied");
        setError("Location permission denied.");

        return toast.error("Permission Blocked", {
          id: TOAST_ID,
          // description:
          //   "Please enable location access in your browser settings to continue.",
          // duration: 5000,
        });
      }

      // 2. Handle Transient Errors (Retry-able)
      let message = "An unknown error occurred.";
      switch (err.code) {
        case 2:
          message = "Location information unavailable.";
          break;
        case 3:
          message = "Location request timed out.";
          break;
      }

      setError(message);

      toast.error(message, {
        id: TOAST_ID,
        action: {
          label: "Retry",
          onClick: () => requestRef.current(),
        },
      });
    },
    [setError, setIsLoading],
  );
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setPermissionState("unsupported");
      return;
    }
    toast.loading("Getting your location...", { id: TOAST_ID });
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

  useEffect(() => {
    requestRef.current = requestLocation;
  }, [requestLocation]);

  return {
    permissionState,
    requestLocation,
  };
}
