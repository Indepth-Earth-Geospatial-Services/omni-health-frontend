'use client';

import { useState, useEffect, useCallback } from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { apiClient } from '@/lib/api-client';
import { useGeolocation } from '@/hooks/useGeolocation';
import type { FacilityApiResponse } from '@/types/api';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';
const PORT_HARCOURT_CENTER: [number, number] = [7.0498, 4.8156]; // [lng, lat]

interface FacilityMapProps {
  onFacilitySelect?: (facility: FacilityApiResponse) => void;
}

export default function FacilityMap({ onFacilitySelect }: FacilityMapProps) {
  const [facilities, setFacilities] = useState<FacilityApiResponse[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<FacilityApiResponse | null>(null);
  const [viewState, setViewState] = useState({
    longitude: PORT_HARCOURT_CENTER[0],
    latitude: PORT_HARCOURT_CENTER[1],
    zoom: 12,
  });
  const [fetchingFacilities, setFetchingFacilities] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { coordinates, error: geoError } = useGeolocation();

  // Fetch facilities by location when user location is available
  useEffect(() => {
    // Skip if no location yet
    if (!coordinates?.latitude || !coordinates?.longitude) {
      console.log('❌ No location available yet');
      return;
    }

    console.log('✅ Location available:', {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      accuracy: coordinates.accuracy
    });
    console.log('📍 Fetching facilities for your location...');

    const abortController = new AbortController();

    const fetchFacilitiesByLocation = async () => {
      try {
        setFetchingFacilities(true);
        setError(null);

        // Check location accuracy - if > 10km, it's likely IP/WiFi based and unreliable
        if (coordinates.accuracy > 10000) {
          console.warn('⚠️ Low accuracy location detected:', coordinates.accuracy, 'meters');
          console.log('📍 Loading facilities for Port Harcourt due to low accuracy...');

          // Load Port Harcourt facilities directly
          const fallbackData = await apiClient.getFacilitiesByLocation(
            PORT_HARCOURT_CENTER[1], // latitude
            PORT_HARCOURT_CENTER[0]  // longitude
          );

          console.log('✅ Port Harcourt facilities loaded:', fallbackData.length, 'facilities');
          setFacilities(fallbackData);
          setError('Location accuracy is low. Showing Port Harcourt facilities. Use the location button to get precise location.');

          // Keep map at Port Harcourt
          setViewState({
            longitude: PORT_HARCOURT_CENTER[0],
            latitude: PORT_HARCOURT_CENTER[1],
            zoom: 12,
          });
          return;
        }

        // Try to fetch facilities for user's accurate location
        const data = await apiClient.getFacilitiesByLocation(
          coordinates.latitude,
          coordinates.longitude
        );

        console.log('✅ Facilities fetched:', data.length, 'facilities');

        if (data.length === 0) {
          console.warn('⚠️ No facilities found at your location:', {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          });
          console.log('📍 Loading facilities for Port Harcourt instead...');

          // Load Port Harcourt facilities as fallback
          const fallbackData = await apiClient.getFacilitiesByLocation(
            PORT_HARCOURT_CENTER[1], // latitude
            PORT_HARCOURT_CENTER[0]  // longitude
          );

          console.log('✅ Port Harcourt facilities loaded:', fallbackData.length, 'facilities');
          setFacilities(fallbackData);
          setError('No facilities found near your location. Showing Port Harcourt facilities.');

          // Keep map at Port Harcourt
          setViewState({
            longitude: PORT_HARCOURT_CENTER[0],
            latitude: PORT_HARCOURT_CENTER[1],
            zoom: 12,
          });
        } else {
          setFacilities(data);

          // Pan to user location only if facilities are found
          setViewState({
            longitude: coordinates.longitude,
            latitude: coordinates.latitude,
            zoom: 13,
          });
        }
      } catch (err: any) {
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
          console.log('🚫 Request cancelled');
          return;
        }

        console.error('❌ Fetch error:', err);
        setError(err.message || 'Unable to load facilities. Please check your connection.');
      } finally {
        setFetchingFacilities(false);
      }
    };

    fetchFacilitiesByLocation();

    return () => {
      abortController.abort();
    };
  }, [coordinates]);

  // Check if facility is currently open
  const isFacilityOpen = useCallback((facility: FacilityApiResponse) => {
    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof facility.working_hours;
    const todayHours = facility.working_hours[dayName];
    return todayHours !== 'Closed' && todayHours !== undefined;
  }, []);

  const handleMarkerClick = useCallback((facility: FacilityApiResponse) => {
    setSelectedFacility(facility);
    onFacilitySelect?.(facility);
  }, [onFacilitySelect]);

  return (
    <div className="relative w-full h-full">
      <Map
        {...viewState}
        onMove={(evt: any) => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {/* User location marker */}
        {coordinates && (
          <Marker
            longitude={coordinates.longitude}
            latitude={coordinates.latitude}
            anchor="center"
          >
            <div
              className="user-location-marker"
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#4A90E2',
                border: '3px solid #fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            />
          </Marker>
        )}

        {/* Facility markers */}
        {facilities.map((facility) => (
          <Marker
            key={facility.facility_id}
            longitude={facility.lon}
            latitude={facility.lat}
            anchor="bottom"
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              handleMarkerClick(facility);
            }}
          >
            <div className="facility-marker cursor-pointer">
              <svg
                width="30"
                height="40"
                viewBox="0 0 30 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 0C6.716 0 0 6.716 0 15c0 8.284 15 25 15 25s15-16.716 15-25C30 6.716 23.284 0 15 0z"
                  fill={isFacilityOpen(facility) ? '#22c55e' : '#ef4444'}
                />
                <circle cx="15" cy="14" r="5" fill="white" />
              </svg>
            </div>
          </Marker>
        ))}

        {/* Popup for selected facility */}
        {selectedFacility && (
          <Popup
            longitude={selectedFacility.lon}
            latitude={selectedFacility.lat}
            anchor="bottom"
            offset={[0, -40]}
            onClose={() => setSelectedFacility(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="p-3">
              <h3 className="font-semibold text-sm mb-1">{selectedFacility.facility_name}</h3>
              <p className="text-xs text-gray-600 mb-2">{selectedFacility.address}</p>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium ${
                    isFacilityOpen(selectedFacility) ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isFacilityOpen(selectedFacility) ? 'Open' : 'Closed'}
                </span>
                {selectedFacility.road_distance_meters && (
                  <span className="text-xs text-gray-500">
                    {(selectedFacility.road_distance_meters / 1000).toFixed(1)} km away
                  </span>
                )}
              </div>
            </div>
          </Popup>
        )}

        {/* Navigation controls */}
        <NavigationControl position="top-right" />

        {/* Geolocate control */}
        <GeolocateControl
          position="top-right"
          trackUserLocation
          showUserHeading
          onGeolocate={(e: any) => {
            setViewState({
              longitude: e.coords.longitude,
              latitude: e.coords.latitude,
              zoom: 13,
            });
          }}
        />
      </Map>

      {/* Error overlay */}
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg z-10">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Geolocation error */}
      {geoError && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg shadow-lg z-10 max-w-md">
          <p className="text-sm">{geoError}</p>
        </div>
      )}

      {/* Facility count badge */}
      {facilities.length > 0 && (
        <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md z-10">
          <div className="flex items-center gap-2">
            {fetchingFacilities && (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
            <p className="text-sm font-medium text-gray-700">
              {facilities.length} {facilities.length === 1 ? 'facility' : 'facilities'} found
            </p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {fetchingFacilities && facilities.length === 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-md z-10">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-600">Loading facilities...</p>
          </div>
        </div>
      )}
    </div>
  );
}
