// import {
//   Coordinates,
//   DirectionsRoute,
//   mapboxService,
//   NavigationState,
// } from "@/services/mapbox.service";
// import { useQuery } from "@tanstack/react-query";
// import { useCallback, useEffect, useRef, useState } from "react";

// interface UseNavigationOptions {
//   origin: Coordinates | null;
//   destination: Coordinates | null;
//   profile?: "driving" | "driving-traffic" | "walking" | "cycling";
//   language?: string;
//   autoStart?: boolean;
//   onArrival?: () => void;
//   onVoiceInstruction?: (text: string) => void;
// }

// interface NavigationStatus {
//   isNavigating: boolean;
//   route: DirectionsRoute | null;
//   currentState: NavigationState | null;
//   totalDistance: number;
//   totalDuration: number;
//   remainingDistance: number;
//   remainingDuration: number;
//   progress: number; // 0-100
// }

// export function useNavigation({
//   origin,
//   destination,
//   profile = "driving-traffic",
//   language = "en",
//   autoStart = false,
//   onArrival,
//   onVoiceInstruction,
// }: UseNavigationOptions) {
//   const [isNavigating, setIsNavigating] = useState(autoStart);
//   const [currentStepIndex, setCurrentStepIndex] = useState(0);
//   const [userPosition, setUserPosition] = useState<Coordinates | null>(origin);
//   const lastAnnouncementRef = useRef<string>("");
//   const watchIdRef = useRef<number | null>(null);
//   // Fetch route directions
//   const {
//     data: directionsData,
//     isLoading,
//     error,
//     refetch,
//   } = useQuery({
//     queryKey: ["directions", origin, destination, profile, language],
//     queryFn: async () => {
//       if (!origin || !destination) {
//         throw new Error("Origin and destination are required");
//       }

//       return await mapboxService.getDirections(origin, destination, {
//         profile,
//         language,
//         voiceUnits: "metric",
//         alternatives: false,
//       });
//     },
//     enabled: !!origin && !!destination,
//     staleTime: 10 * 60 * 1000, // 10 minutes
//     retry: 2,
//   });

//   const route = directionsData?.routes[0] || null;

//   // Calculate current navigation state
//   const currentState: NavigationState | null =
//     route && userPosition
//       ? mapboxService.calculateNavigationState(
//           userPosition,
//           route,
//           currentStepIndex,
//         )
//       : null;

//   // Calculate navigation status
//   const navigationStatus: NavigationStatus = {
//     isNavigating,
//     route,
//     currentState,
//     totalDistance: route?.distance || 0,
//     totalDuration: route?.duration || 0,
//     remainingDistance: currentState?.distanceToNextManeuver || 0,
//     remainingDuration: currentState?.timeToNextManeuver || 0,
//     progress: route
//       ? Math.min(
//           100,
//           (currentStepIndex / (route.legs[0].steps.length - 1)) * 100,
//         )
//       : 0,
//   };

//   // Start navigation
//   const startNavigation = useCallback(() => {
//     setIsNavigating(true);
//     setCurrentStepIndex(0);
//     lastAnnouncementRef.current = "";

//     // Start watching user position
//     if ("geolocation" in navigator) {
//       watchIdRef.current = navigator.geolocation.watchPosition(
//         (position) => {
//           setUserPosition({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//         },
//         (error) => {
//           console.error("Error watching position:", error);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 5000,
//           maximumAge: 0,
//         },
//       );
//     }
//   }, []);

//   // Stop navigation
//   const stopNavigation = useCallback(() => {
//     setIsNavigating(false);
//     setCurrentStepIndex(0);

//     if (watchIdRef.current !== null) {
//       navigator.geolocation.clearWatch(watchIdRef.current);
//       watchIdRef.current = null;
//     }
//   }, []);

//   // Update navigation as user moves
//   useEffect(() => {
//     if (!isNavigating || !route || !userPosition || !currentState) {
//       return;
//     }

//     // Check if we should announce voice instruction
//     if (currentState.shouldAnnounce && currentState.announcementText) {
//       // Only announce if it's different from last announcement
//       if (currentState.announcementText !== lastAnnouncementRef.current) {
//         lastAnnouncementRef.current = currentState.announcementText;
//         onVoiceInstruction?.(currentState.announcementText);

//         // Use Web Speech API to speak the instruction
//         if ("speechSynthesis" in window) {
//           const utterance = new SpeechSynthesisUtterance(
//             currentState.announcementText,
//           );
//           utterance.lang = language;
//           utterance.rate = 0.9; // Slightly slower for clarity
//           window.speechSynthesis.speak(utterance);
//         }
//       }
//     }

//     // Check if we should advance to next step
//     if (
//       mapboxService.shouldAdvanceToNextStep(
//         userPosition,
//         route,
//         currentStepIndex,
//       )
//     ) {
//       const nextIndex = currentStepIndex + 1;
//       setCurrentStepIndex(nextIndex);
//       lastAnnouncementRef.current = ""; // Reset for next step

//       // Check if we've reached the destination
//       if (nextIndex >= route.legs[0].steps.length - 1) {
//         onArrival?.();
//         stopNavigation();
//       }
//     }
//   }, [
//     isNavigating,
//     route,
//     userPosition,
//     currentState,
//     currentStepIndex,
//     language,
//     onArrival,
//     onVoiceInstruction,
//     stopNavigation,
//   ]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (watchIdRef.current !== null) {
//         navigator.geolocation.clearWatch(watchIdRef.current);
//       }
//     };
//   }, []);

//   return {
//     // Status
//     ...navigationStatus,
//     isLoading,
//     error,

//     // Controls
//     startNavigation,
//     stopNavigation,
//     refetch,

//     // Formatted values
//     formattedTotalDistance: route
//       ? mapboxService.formatDistance(route.distance)
//       : "N/A",
//     formattedTotalDuration: route
//       ? mapboxService.formatDuration(route.duration)
//       : "N/A",
//     formattedRemainingDistance: currentState
//       ? mapboxService.formatDistance(currentState.distanceToNextManeuver)
//       : "N/A",
//   };
// }
