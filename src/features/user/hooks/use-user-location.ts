import { useCallback, useEffect, useRef } from "react";
import { useUserStore } from "../store/user-store";
import { toast } from "sonner";

const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const TOAST_ID = "user-location-toast";

export function useUserLocation() {
  const {
    userLocation,
    lastUpdated,
    permissionState,
    setPermissionState,
    setIsLoadingPosition: setIsLoading,
    setLocationError: setError,
    setUserLocation,
  } = useUserStore();

  // Refs for managing stable function references and cleanup
  const requestRef = useRef<(force?: boolean) => void>(() => {});
  const permissionStatusRef = useRef<PermissionStatus | null>(null);
  const handlerRef = useRef<(() => void) | null>(null);

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

      if (err.code === 1) {
        setPermissionState("denied");
        setError("Location permission denied.");
        return toast.error("Permission Blocked", { id: TOAST_ID });
      }

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
          onClick: () => requestRef.current(true), // Use 'force' on manual retry
        },
      });
    },
    [setError, setIsLoading, setPermissionState],
  );

  /**
   * Request Location Logic
   * @param force - If true, bypasses the 5-minute staleness guard.
   */
  const requestLocation = useCallback(
    (force = false) => {
      const isStale = !lastUpdated || Date.now() - lastUpdated > STALE_TIME;

      // GUARD: Abort if we have fresh data and the user didn't force a refresh
      if (userLocation && !isStale && !force) {
        return;
      }

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
          timeout: 15000,
          maximumAge: STALE_TIME,
        },
      );
    },
    [
      userLocation,
      lastUpdated,
      onLocationSuccess,
      onLocationError,
      setIsLoading,
      setError,
      setPermissionState,
    ],
  );

  // Sync permissions and set up event listeners
  useEffect(() => {
    const setupPermissions = async () => {
      if (!navigator.permissions) {
        setPermissionState("unsupported");
        return;
      }

      try {
        const result = await navigator.permissions.query({
          name: "geolocation",
        });
        permissionStatusRef.current = result;

        const handlePermissionChange = () => {
          setPermissionState(result.state);
        };

        // Store handler in ref so we can remove it during cleanup
        handlerRef.current = handlePermissionChange;
        result.addEventListener("change", handlePermissionChange);

        // Set initial state
        setPermissionState(result.state);

        // Auto-fetch only if granted and necessary
        if (result.state === "granted") {
          requestLocation();
        }
      } catch (err) {
        console.error("Permission query failed:", err);
        setPermissionState("unsupported");
      }
    };

    setupPermissions();

    return () => {
      if (permissionStatusRef.current && handlerRef.current) {
        permissionStatusRef.current.removeEventListener(
          "change",
          handlerRef.current,
        );
      }
    };
  }, [requestLocation, setPermissionState]);

  // Sync the requestRef so retries in the toast can access the current function
  useEffect(() => {
    requestRef.current = requestLocation;
  }, [requestLocation]);

  return {
    permissionState,
    requestLocation,
  };
}
