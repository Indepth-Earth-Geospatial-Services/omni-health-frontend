import { useEffect, useState } from "react";

interface Location {
  lat: number;
  lng: number;
}
interface UseUserLocationReturn {
  location: Location | null;
  isloading: boolean;
  error: string | null;
  requestLocation: () => void;
}

export function useUserLocation(): UseUserLocationReturn {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function onLocationSuccess(position: GeolocationPosition) {
    setLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
    setIsLoading(false);
  }
  function onLocationError(err: GeolocationPositionError) {
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
  }

  function requestLocation() {
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
        timeout: 10000, // 10 seconds
        maximumAge: 300000, // Accept catched location up to 5 minutes old
      },
    );
  }

  useEffect(() => {
    requestLocation();
  }, []);
}
