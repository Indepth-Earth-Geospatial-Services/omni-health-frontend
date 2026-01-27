import { useMemo } from "react";
import { Facility } from "@/types/api-response";
import { DirectionsRoute, mapboxService } from "@/services/mapbox.service";

type Winner = "A" | "B" | "TIE";

export interface ComparisonResult {
  key: string;
  label: string;
  valueA: any;
  valueB: any;
  winner: Winner;
}

export interface ComparisonData {
  reasonsA: string[];
  reasonsB: string[];
  detailedResults: ComparisonResult[];
}

const higherIsBetter = (a: number | undefined, b: number | undefined): Winner => {
  const valA = a ?? -1;
  const valB = b ?? -1;
  if (valA > valB) return "A";
  if (valB > valA) return "B";
  return "TIE";
};

const lowerIsBetter = (a: number | undefined, b: number | undefined): Winner => {
  const valA = a ?? Infinity;
  const valB = b ?? Infinity;
  if (valA < valB) return "A";
  if (valB < valA) return "B";
  return "TIE";
};

export function useFacilityComparison(
  facilityA: Facility | null,
  facilityB: Facility | null,
  directionsA: DirectionsRoute | null | undefined,
  directionsB: DirectionsRoute | null | undefined
) {
  const comparisonData: ComparisonData | null = useMemo(() => {
    if (!facilityA || !facilityB) {
      return null;
    }

    const detailedResults: ComparisonResult[] = [];
    const reasonsA: string[] = [];
    const reasonsB: string[] = [];

    // 1. Average Rating
    let winner = higherIsBetter(
      facilityA.average_rating,
      facilityB.average_rating
    );
    if (winner === "A") reasonsA.push("Higher average rating");
    if (winner === "B") reasonsB.push("Higher average rating");
    detailedResults.push({
      key: "rating",
      label: "Average Rating",
      valueA: facilityA.average_rating?.toFixed(1) ?? "N/A",
      valueB: facilityB.average_rating?.toFixed(1) ?? "N/A",
      winner,
    });

    // 2. Travel Time (from Mapbox)
    winner = lowerIsBetter(directionsA?.duration, directionsB?.duration);
    if (winner === "A") reasonsA.push("Shorter travel time");
    if (winner === "B") reasonsB.push("Shorter travel time");
    detailedResults.push({
      key: "travel_time",
      label: "Travel Time",
      valueA: directionsA?.duration
        ? mapboxService.formatDuration(directionsA.duration)
        : "N/A",
      valueB: directionsB?.duration
        ? mapboxService.formatDuration(directionsB.duration)
        : "N/A",
      winner,
    });

    // 3. Distance (from Mapbox)
    winner = lowerIsBetter(directionsA?.distance, directionsB?.distance);
    if (winner === "A") reasonsA.push("Closer distance");
    if (winner === "B") reasonsB.push("Closer distance");
    detailedResults.push({
      key: "distance",
      label: "Distance",
      valueA: directionsA?.distance
        ? mapboxService.formatDistance(directionsA.distance)
        : "N/A",
      valueB: directionsB?.distance
        ? mapboxService.formatDistance(directionsB.distance)
        : "N/A",
      winner,
    });

    // 4. Services
    const servicesA = facilityA.services_list ?? [];
    const servicesB = facilityB.services_list ?? [];
    winner = higherIsBetter(servicesA.length, servicesB.length);
    if (winner === "A") reasonsA.push("Offers more services");
    if (winner === "B") reasonsB.push("Offers more services");
    detailedResults.push({
      key: "services",
      label: "Available Services",
      valueA: servicesA,
      valueB: servicesB,
      winner,
    });

    // 5. Specialists
    const specialistsA = facilityA.specialists ?? [];
    const specialistsB = facilityB.specialists ?? [];
    winner = higherIsBetter(specialistsA.length, specialistsB.length);
    if (winner === "A") reasonsA.push("Has more specialists");
    if (winner === "B") reasonsB.push("Has more specialists");
    detailedResults.push({
      key: "specialists",
      label: "Available Specialists",
      valueA: specialistsA,
      valueB: specialistsB,
      winner,
    });

    return { reasonsA, reasonsB, detailedResults };
  }, [facilityA, facilityB, directionsA, directionsB]);

  return comparisonData;
}