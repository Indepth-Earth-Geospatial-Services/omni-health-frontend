import { useEffect, useState, useCallback, useRef } from "react";

interface Location {
  lat: number;
  lng: number;
}

interface UseUserLocationReturn {
  location: Location | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => void;
}

export function useUserLocation(): UseUserLocationReturn {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasRequestedRef = useRef(false); // Prevent double requests

  const onLocationSuccess = useCallback((position: GeolocationPosition) => {
    console.log("Location success:", position.coords);
    setLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
    setIsLoading(false);
    setError(null);
  }, []);

  const onLocationError = useCallback((err: GeolocationPositionError) => {
    console.error("Location error:", err);
    switch (err.code) {
      case err.PERMISSION_DENIED:
        setError("Location permission denied. Please enable location access.");
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
    console.log("Requesting location...");
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      onLocationSuccess,
      onLocationError,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000, // 5 minutes
      },
    );
  }, [onLocationSuccess, onLocationError]);

  useEffect(() => {
    // Only request once on mount
    if (!hasRequestedRef.current) {
      hasRequestedRef.current = true;
      requestLocation();
    }
  }, [requestLocation]);

  return { isLoading, error, requestLocation, location };
}
