import { checkDomainOfScale } from "recharts/types/util/ChartUtils";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MatrixResponse {
  durations: number[][];
  distances: number[][];
  code: string;
  message?: string;
}

export interface VoiceInstruction {
  distanceAlongGeometry: number; // When to announce (meters from current position)
  announcement: string; // What to say
  ssmlAnnouncement?: string; // SSML version for better pronunciation
}

export interface BannerInstruction {
  distanceAlongGeometry: number;
  primary: {
    text: string;
    type: string;
    modifier?: string;
  };
  secondary?: {
    text: string;
    type: string;
  };
}

export interface RouteStep {
  distance: number; // meters
  duration: number; // seconds
  name: string; // street name
  maneuver: {
    type: string; // "turn", "depart", "arrive", etc.
    instruction: string; // "Turn left onto Main Street"
    bearing_after: number;
    bearing_before: number;
    location: [number, number]; // [lon, lat]
    modifier?: string; // "left", "right", "sharp left", etc.
  };
  voiceInstructions?: VoiceInstruction[];
  bannerInstructions?: BannerInstruction[];
  geometry: {
    coordinates: [number, number][]; // Array of [lon, lat] points
  };
}

export interface RouteLeg {
  distance: number;
  duration: number;
  steps: RouteStep[];
  summary: string;
}

export interface DirectionsRoute {
  distance: number; // Total distance in meters
  duration: number; // Total duration in seconds
  geometry: {
    coordinates: [number, number][]; // Full route polyline
  };
  legs: RouteLeg[];
  weight_name: string;
  weight: number;
}

export interface DirectionsResponse {
  routes: DirectionsRoute[];
  waypoints: Array<{
    name: string;
    location: [number, number];
  }>;
  code: string;
  uuid?: string;
}

export interface NavigationState {
  currentStepIndex: number;
  distanceToNextManeuver: number; // meters
  timeToNextManeuver: number; // seconds
  currentInstruction: string;
  nextInstruction?: string;
  shouldAnnounce: boolean;
  announcementText?: string;
}

// ==================== MAPBOX SERVICE CLASS ====================

class MapboxService {
  private readonly baseUrl = "https://api.mapbox.com";
  private readonly accessToken: string;

  constructor() {
    this.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
    if (!this.accessToken) {
      console.warn("Mapbox access token is not configured");
    }
  }

  // ==================== DISTANCE CALCULATION ====================

  /**
   * Calculate distances from one origin to multiple destinations using Matrix API
   * Best for: Getting accurate road distances for multiple facilities
   * Limit: 25 destinations per request (free tier)
   */
  async getDistancesFromMatrix(
    userLocation: Coordinates,
    destinations: Coordinates[],
  ): Promise<number[]> {
    if (destinations.length === 0) {
      return [];
    }

    if (destinations.length > 25) {
      console.warn(
        "Mapbox Matrix API supports max 25 destinations. Truncating...",
      );
      destinations = destinations.slice(0, 25);
    }

    // Build coordinates string: user location first, then all destinations
    const coordinates = [
      `${userLocation.longitude},${userLocation.latitude}`,
      ...destinations.map((d) => `${d.longitude},${d.latitude}`),
    ].join(";");

    const url = `${this.baseUrl}/directions-matrix/v1/mapbox/driving/${coordinates}?sources=0&annotations=distance,duration&access_token=${this.accessToken}`;

    try {
      const response = await fetch(url);
      const data: MatrixResponse = await response.json();

      if (data.code !== "Ok") {
        throw new Error(data.message || "Matrix API request failed");
      }

      // data.distances[0] contains distances from user (source 0) to all destinations
      // Remove first element (distance to self = 0)
      return data.distances[0].slice(1);
    } catch (error) {
      console.error("Error fetching distances from Matrix API:", error);
      throw error;
    }
  }

  /**
   * Calculate straight-line distance between two points (Haversine formula)
   * Best for: Quick approximations, offline use
   * Returns: Distance in meters
   */
  calculateHaversineDistance(from: Coordinates, to: Coordinates): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (from.latitude * Math.PI) / 180;
    const φ2 = (to.latitude * Math.PI) / 180;
    const Δφ = ((to.latitude - from.latitude) * Math.PI) / 180;
    const Δλ = ((to.longitude - from.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Format distance for display
   */
  formatDistance(distanceInMeters: number): string {
    if (distanceInMeters < 1000) {
      return `${Math.round(distanceInMeters)}m`;
    }
    return `${(distanceInMeters / 1000).toFixed(1)}km`;
  }

  /**
   * Format duration for display
   */
  formatDuration(durationInSeconds: number): string {
    const minutes = Math.round(durationInSeconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }

  // ==================== TURN-BY-TURN NAVIGATION ====================

  /**
   * Get turn-by-turn directions with voice and banner instructions
   * This fetches ALL the navigation data you need in ONE request
   */
  async getDirections(
    origin: Coordinates,
    destination: Coordinates,
    options: {
      profile?: "driving" | "driving-traffic" | "walking" | "cycling";
      language?: string;
      voiceUnits?: "imperial" | "metric";
      alternatives?: boolean;
    } = {},
  ): Promise<DirectionsResponse> {
    const {
      profile = "driving-traffic",
      language = "en",
      voiceUnits = "metric",
      alternatives = false,
    } = options;

    const coordinates = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;

    // Build query parameters
    const params = new URLSearchParams({
      access_token: this.accessToken,
      alternatives: alternatives.toString(),
      geometries: "geojson",
      overview: "full",
      steps: "true", // CRITICAL: Get step-by-step instructions
      voice_instructions: "true", // CRITICAL: Get voice announcements
      banner_instructions: "true", // CRITICAL: Get visual guidance
      voice_units: voiceUnits,
      language: language,
      annotations: "distance,duration",
    });

    const url = `${this.baseUrl}/directions/v5/mapbox/${profile}/${coordinates}?${params}`;

    try {
      const response = await fetch(url);
      const data: DirectionsResponse = await response.json();

      if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
        throw new Error("No routes found");
      }
      console.log("FROM MAP SERVICE", data);
      return data;
    } catch (error) {
      console.error("Error fetching directions:", error);
      throw error;
    }
  }

  /**
   * Calculate navigation state based on user's current position
   * This is what you call repeatedly as the user moves
   */
  calculateNavigationState(
    userPosition: Coordinates,
    route: DirectionsRoute,
    currentStepIndex: number = 0,
  ): NavigationState {
    const steps = route.legs[0].steps;

    if (currentStepIndex >= steps.length) {
      return {
        currentStepIndex,
        distanceToNextManeuver: 0,
        timeToNextManeuver: 0,
        currentInstruction: "You have arrived",
        shouldAnnounce: false,
      };
    }

    const currentStep = steps[currentStepIndex];
    const maneuverLocation = currentStep.maneuver.location;

    // Calculate distance to next maneuver
    const distanceToManeuver = this.calculateHaversineDistance(userPosition, {
      latitude: maneuverLocation[1],
      longitude: maneuverLocation[0],
    });

    // Check if we should announce a voice instruction
    let shouldAnnounce = false;
    let announcementText: string | undefined;

    if (currentStep.voiceInstructions) {
      for (const voiceInstruction of currentStep.voiceInstructions) {
        // Announce if we're within range of this instruction
        if (
          distanceToManeuver <= voiceInstruction.distanceAlongGeometry &&
          distanceToManeuver > voiceInstruction.distanceAlongGeometry - 20
        ) {
          shouldAnnounce = true;
          announcementText = voiceInstruction.announcement;
          break;
        }
      }
    }

    // Get next instruction
    const nextInstruction =
      currentStepIndex < steps.length - 1
        ? steps[currentStepIndex + 1].maneuver.instruction
        : undefined;

    return {
      currentStepIndex,
      distanceToNextManeuver: distanceToManeuver,
      timeToNextManeuver: currentStep.duration,
      currentInstruction: currentStep.maneuver.instruction,
      nextInstruction,
      shouldAnnounce,
      announcementText,
    };
  }

  /**
   * Check if user should advance to next step
   * Call this every time user position updates
   */
  shouldAdvanceToNextStep(
    userPosition: Coordinates,
    route: DirectionsRoute,
    currentStepIndex: number,
    threshold: number = 20, // meters
  ): boolean {
    const steps = route.legs[0].steps;

    if (currentStepIndex >= steps.length - 1) {
      return false;
    }

    const currentStep = steps[currentStepIndex];
    const maneuverLocation = currentStep.maneuver.location;

    const distanceToManeuver = this.calculateHaversineDistance(userPosition, {
      latitude: maneuverLocation[1],
      longitude: maneuverLocation[0],
    });

    return distanceToManeuver < threshold;
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Open native map apps for navigation (fallback option)
   */
  openNativeNavigation(
    destination: Coordinates,
    destinationName: string = "Destination",
  ): void {
    const { latitude, longitude } = destination;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isIOS) {
      // Open Apple Maps
      window.open(
        `maps://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`,
        "_blank",
      );
    } else if (isAndroid) {
      // Open Google Maps
      window.open(
        `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(destinationName)})`,
        "_blank",
      );
    } else {
      // Fallback to Google Maps web
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
        "_blank",
      );
    }
  }
  /**
   * Decode polyline geometry to coordinates array
   * Mapbox uses GeoJSON by default, but this is useful for other formats
   */
  decodePolyline(encoded: string): [number, number][] {
    // Implementation of polyline decoding if needed
    // For Mapbox, we use geometries=geojson so this isn't necessary
    return [];
  }
}

export const mapboxService = new MapboxService();

export { MapboxService };
