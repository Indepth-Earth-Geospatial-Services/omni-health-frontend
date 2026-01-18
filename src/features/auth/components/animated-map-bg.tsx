"use client";

import { useEffect, useRef, useState } from "react";
import Map, { Marker, MapRef } from "react-map-gl/mapbox";
import { motion, AnimatePresence } from "framer-motion";
import { MAPBOX_TOKEN } from "@/constants";
import "mapbox-gl/dist/mapbox-gl.css";

// Sample facility locations for animation (Rivers State area)
const FACILITY_MARKERS = [
  { id: 1, lat: 4.8156, lng: 7.0498, delay: 0 }, // Port Harcourt
  { id: 2, lat: 4.7774, lng: 7.0134, delay: 200 }, // Rumuokoro
  { id: 3, lat: 4.8396, lng: 7.0042, delay: 400 }, // GRA
  { id: 4, lat: 4.8028, lng: 7.0322, delay: 600 }, // D-Line
  { id: 5, lat: 4.8500, lng: 7.0800, delay: 800 }, // Eleme
  { id: 6, lat: 4.7900, lng: 6.9800, delay: 1000 }, // Rumuigbo
  { id: 7, lat: 4.8600, lng: 7.0200, delay: 1200 }, // Trans Amadi
];

// Camera animation waypoints (Rivers State area)
const CAMERA_WAYPOINTS = [
  { center: [7.0498, 4.8156], zoom: 12, pitch: 45, bearing: 0 },
  { center: [7.0200, 4.8000], zoom: 13, pitch: 50, bearing: 30 },
  { center: [7.0600, 4.8300], zoom: 12.5, pitch: 45, bearing: -20 },
  { center: [7.0498, 4.8156], zoom: 12, pitch: 45, bearing: 0 },
];

export default function AnimatedMapBackground() {
  const mapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);
  const [currentWaypoint, setCurrentWaypoint] = useState(0);

  // Start marker animation after map loads
  useEffect(() => {
    if (mapLoaded) {
      const timer = setTimeout(() => setShowMarkers(true), 500);
      return () => clearTimeout(timer);
    }
  }, [mapLoaded]);

  // Animate camera through waypoints
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const animateCamera = () => {
      const nextWaypoint = (currentWaypoint + 1) % CAMERA_WAYPOINTS.length;
      const waypoint = CAMERA_WAYPOINTS[nextWaypoint];

      mapRef.current?.flyTo({
        center: waypoint.center as [number, number],
        zoom: waypoint.zoom,
        pitch: waypoint.pitch,
        bearing: waypoint.bearing,
        duration: 15000,
        essential: true,
      });

      setCurrentWaypoint(nextWaypoint);
    };

    const interval = setInterval(animateCamera, 16000);
    return () => clearInterval(interval);
  }, [mapLoaded, currentWaypoint]);


  // Check if token exists - show gradient fallback if no token
  if (!MAPBOX_TOKEN) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="h-full w-full bg-gradient-to-br from-primary/30 via-blue-100 to-green-100">
          {/* Decorative circles */}
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-blue-300/40 blur-3xl" />
          <div className="absolute left-1/3 top-1/3 h-64 w-64 rounded-full bg-green-300/30 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-primary/15 blur-2xl" />
        </div>
        {/* Lighter gradient overlay */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/40 to-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="h-full w-full"
      >
        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude: 7.0498,
            latitude: 4.8156,
            zoom: 12,
            pitch: 45,
            bearing: 0,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/light-v11"
          interactive={false}
          attributionControl={false}
          onLoad={() => setMapLoaded(true)}
        >
          {/* Animated Facility Markers */}
          <AnimatePresence>
            {showMarkers &&
              FACILITY_MARKERS.map((marker) => (
                <Marker
                  key={marker.id}
                  longitude={marker.lng}
                  latitude={marker.lat}
                  anchor="center"
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: marker.delay / 1000,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="relative"
                  >
                    {/* Pulse Effect */}
                    <motion.div
                      animate={{
                        scale: [1, 2, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: marker.delay / 1000,
                      }}
                      className="bg-primary/30 absolute -inset-2 rounded-full"
                    />
                    {/* Marker Dot */}
                    <div className="bg-primary relative h-3 w-3 rounded-full border-2 border-white shadow-lg" />
                  </motion.div>
                </Marker>
              ))}
          </AnimatePresence>
        </Map>
      </motion.div>

      {/* Gradient Overlays for readability - lighter to show more map */}
      <div className="pointer-events-none absolute inset-0">
        {/* Main gradient overlay - reduced opacity to show map better */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-transparent" />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/70 to-transparent" />
        {/* Top subtle overlay */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </div>
  );
}
