// // import { useMemo } from "react";
// // import { Coordinates, mapboxService } from "@/services/mapbox.service";

// // interface UseNativeNavigationOptions {
// //   origin: Coordinates | null;
// //   destination: Coordinates | null;
// //   destinationName?: string;
// // }

// // export function useNativeNavigation({
// //   origin,
// //   destination,
// //   destinationName = "Destination",
// // }: UseNativeNavigationOptions) {
// //   // Calculate ETA and distance using Mapbox
// //   const routeInfo = useMemo(() => {
// //     if (!origin || !destination) {
// //       return null;
// //     }

// //     // Calculate haversine distance (straight line)
// //     const distance = mapboxService.calculateHaversineDistance(
// //       origin,
// //       destination,
// //     );
// //     const formattedDistance = mapboxService.formatDistance(distance);

// //     // Estimate travel time (assuming average speed of 30km/h for driving)
// //     const estimatedTimeMinutes = Math.round((distance / 1000 / 30) * 60);
// //     const formattedDuration = mapboxService.formatDuration(
// //       estimatedTimeMinutes * 60,
// //     );

// //     // Calculate arrival time
// //     const arrivalTime = (() => {
// //       const now = new Date();
// //       const arrival = new Date(now.getTime() + estimatedTimeMinutes * 60000);
// //       return arrival.toLocaleTimeString([], {
// //         hour: "2-digit",
// //         minute: "2-digit",
// //       });
// //     })();

// //     return {
// //       distance,
// //       formattedDistance,
// //       estimatedTimeMinutes,
// //       formattedDuration,
// //       arrivalTime,
// //     };
// //   }, [origin, destination]);

// //   const openNativeNavigation = () => {
// //     if (!destination || !destinationName) return;

// //     try {
// //       mapboxService.openNativeNavigation(destination, destinationName);
// //       return { success: true, message: "Opening navigation app..." };
// //     } catch (error) {
// //       console.error("Failed to open native navigation:", error);
// //       return {
// //         success: false,
// //         message: "Failed to open navigation app. Please try the link below.",
// //       };
// //     }
// //   };

// //   // Get the direct URL for Google Maps as fallback
// //   const getGoogleMapsUrl = () => {
// //     if (!destination) return "";

// //     const { latitude, longitude } = destination;
// //     const originParam = origin
// //       ? `&origin=${origin.latitude},${origin.longitude}`
// //       : "";

// //     return `https://www.google.com/maps/dir/?api=1${originParam}&destination=${latitude},${longitude}&travelmode=driving`;
// //   };

// //   // Get the direct URL for Apple Maps as fallback
// //   const getAppleMapsUrl = () => {
// //     if (!destination) return "";

// //     const { latitude, longitude } = destination;
// //     return `maps://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`;
// //   };

// //   // Get the appropriate URL based on device
// //   const getFallbackUrl = () => {
// //     const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
// //     const isAndroid = /Android/.test(navigator.userAgent);

// //     if (isIOS) return getAppleMapsUrl();
// //     if (isAndroid) return getGoogleMapsUrl();
// //     return getGoogleMapsUrl(); // Default to Google Maps web
// //   };

// //   // Get store links for downloading the apps
// //   const getAppStoreLinks = () => {
// //     return {
// //       googleMaps:
// //         "https://play.google.com/store/apps/details?id=com.google.android.apps.maps",
// //       appleMaps: "https://apps.apple.com/us/app/apple-maps/id915056765",
// //       googleMapsWeb: "https://www.google.com/maps",
// //     };
// //   };

// //   // Check if we're on mobile
// //   const isMobile = () => {
// //     return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
// //   };

// //   // Get platform info
// //   const getPlatformInfo = () => {
// //     const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
// //     const isAndroid = /Android/.test(navigator.userAgent);

// //     return {
// //       isIOS,
// //       isAndroid,
// //       isMobile: isIOS || isAndroid,
// //       platformName: isIOS ? "Apple Maps" : "Google Maps",
// //       appStoreLink: isIOS
// //         ? "https://apps.apple.com/us/app/apple-maps/id915056765"
// //         : "https://play.google.com/store/apps/details?id=com.google.android.apps.maps",
// //     };
// //   };

// //   return {
// //     routeInfo,
// //     openNativeNavigation,
// //     getGoogleMapsUrl,
// //     getAppleMapsUrl,
// //     getFallbackUrl,
// //     getAppStoreLinks,
// //     isAvailable: !!destination,
// //     platformInfo: getPlatformInfo(),
// //   };
// // }
// import { useMemo, useState, useEffect } from "react";
// import { Coordinates, mapboxService } from "@/services/mapbox.service";

// interface UseNativeNavigationOptions {
//   origin: Coordinates | null;
//   destination: Coordinates | null;
//   destinationName?: string;
// }

// export function useNativeNavigation({
//   origin,
//   destination,
//   destinationName = "Destination",
// }: UseNativeNavigationOptions) {
//   // 1. SSR-SAFE PLATFORM DETECTION
//   const [platformInfo, setPlatformInfo] = useState({
//     isIOS: false,
//     isAndroid: false,
//     isMobile: false,
//     platformName: "Google Maps", // Default for SSR
//     appStoreLink: "",
//   });

//   useEffect(() => {
//     // This only runs on the client
//     const ua = navigator.userAgent;
//     const isIOS = /iPad|iPhone|iPod/.test(ua);
//     const isAndroid = /Android/.test(ua);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     setPlatformInfo({
//       isIOS,
//       isAndroid,
//       isMobile: isIOS || isAndroid,
//       platformName: isIOS ? "Apple Maps" : "Google Maps",
//       appStoreLink: isIOS
//         ? "https://apps.apple.com/us/app/apple-maps/id915056765"
//         : "https://play.google.com/store/apps/details?id=com.google.android.apps.maps",
//     });
//   }, []);

//   // 2. ROUTE INFO (Your logic was fine, just keeping it consistent)
//   const routeInfo = useMemo(() => {
//     if (!origin || !destination) return null;

//     const distance = mapboxService.calculateHaversineDistance(
//       origin,
//       destination,
//     );
//     const formattedDistance = mapboxService.formatDistance(distance);

//     // 30km/h average speed assumption
//     const estimatedTimeMinutes = Math.round((distance / 1000 / 30) * 60);
//     const formattedDuration = mapboxService.formatDuration(
//       estimatedTimeMinutes * 60,
//     );

//     // const arrivalTime = new Date(Date.now() + estimatedTimeMinutes * 60000)
//     //   .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//     const arrivalTime = (() => {
//       const now = new Date();
//       const arrival = new Date(now.getTime() + estimatedTimeMinutes * 60000);
//       return arrival.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     })();
//     return { formattedDistance, formattedDuration, arrivalTime };
//   }, [origin, destination]);

//   // 3. ROBUST URL GENERATION
//   const getFallbackUrl = () => {
//     if (!destination) return "#";
//     const { latitude, longitude } = destination;

//     if (platformInfo.isIOS) {
//       // Apple Maps URL Scheme
//       return `maps://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`;
//     }

//     // Google Maps Universal Link (Works on Android App, iOS App, and Web)
//     const originStr = origin
//       ? `&origin=${origin.latitude},${origin.longitude}`
//       : "";
//     return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}${originStr}&travelmode=driving`;
//   };

//   const openNativeNavigation = () => {
//     if (!destination) return;

//     // Try to open via window location assignment first (triggers app intents)
//     window.location.href = getFallbackUrl();
//   };

//   return {
//     routeInfo,
//     openNativeNavigation,
//     getFallbackUrl,
//     isAvailable: !!destination,
//     platformInfo,
//   };
// }
