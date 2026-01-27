import { useMemo } from "react";
import { Facility } from "@/types/api-response";
import { DirectionsRoute, mapboxService } from "@/services/mapbox.service";
import { COMPARISON_WEIGHTS, COMPARISON_THRESHOLDS } from "@/constants/comparison-config";
import { normalize, higherIsBetter, lowerIsBetter } from "@/lib/comparison-utils"; // Import utility functions

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
  scoreA: number;
  scoreB: number;
}

export function useFacilityComparison(
  facilityA: Facility | null,
  facilityB: Facility | null,
  directionsA: DirectionsRoute | null | undefined,
  directionsB: DirectionsRoute | null | undefined,
) {
  const comparisonData: ComparisonData | null = useMemo(() => {
    if (!facilityA || !facilityB) {
      return null;
    }

    const detailedResults: ComparisonResult[] = [];
    const reasonsA: string[] = [];
    const reasonsB: string[] = [];
    let scoreA = 0;
    let scoreB = 0;

    // --- Data Extraction ---
    const ratingA = facilityA.average_rating;
    const ratingB = facilityB.average_rating;
    const servicesA = facilityA.services_list ?? [];
    const servicesB = facilityB.services_list ?? [];
    const specialistsA = facilityA.specialists ?? [];
    const specialistsB = facilityB.specialists ?? [];
    const reviewsA = facilityA.total_reviews ?? 0;
    const reviewsB = facilityB.total_reviews ?? 0;
    const bedsA = facilityA.inventory?.infrastructure?.inpatient_beds ?? 0;
    const bedsB = facilityB.inventory?.infrastructure?.inpatient_beds ?? 0;
    const durationA = directionsA?.duration;
    const durationB = directionsB?.duration;
    const distanceA = directionsA?.distance;
    const distanceB = directionsB?.distance;

    // --- Normalization ---
    const maxRating = Math.max(ratingA ?? 0, ratingB ?? 0);
    const maxServices = Math.max(servicesA.length, servicesB.length);
    const maxSpecialists = Math.max(specialistsA.length, specialistsB.length);
    const maxReviews = Math.max(reviewsA, reviewsB);
    const maxBeds = Math.max(bedsA, bedsB);
    const maxDuration = Math.max(durationA ?? 0, durationB ?? 0);
    const maxDistance = Math.max(distanceA ?? 0, distanceB ?? 0);

    // --- Scoring & Reasons ---

    // 1. Average Rating
    let winner = higherIsBetter(ratingA, ratingB, COMPARISON_THRESHOLDS.rating);
    if (winner === "A") {
      reasonsA.push(
        `Higher average rating (${ratingA?.toFixed(1)} vs ${ratingB?.toFixed(
          1,
        )})`,
      );
    }
    if (winner === "B") {
      reasonsB.push(
        `Higher average rating (${ratingB?.toFixed(1)} vs ${ratingA?.toFixed(
          1,
        )})`,
      );
    }
    scoreA += normalize(ratingA ?? 0, 0, maxRating) * COMPARISON_WEIGHTS.rating;
    scoreB += normalize(ratingB ?? 0, 0, maxRating) * COMPARISON_WEIGHTS.rating;
    detailedResults.push({
      key: "rating",
      label: "Average Rating",
      valueA: ratingA?.toFixed(1) ?? "N/A",
      valueB: ratingB?.toFixed(1) ?? "N/A",
      winner,
    });

    // 2. Travel Time
    winner = lowerIsBetter(durationA, durationB, COMPARISON_THRESHOLDS.travelTime);
    if (winner === "A") {
      reasonsA.push(
        `Shorter travel time (by ${mapboxService.formatDuration(
          (durationB ?? 0) - (durationA ?? 0),
        )})`,
      );
    }
    if (winner === "B") {
      reasonsB.push(
        `Shorter travel time (by ${mapboxService.formatDuration(
          (durationA ?? 0) - (durationB ?? 0),
        )})`,
      );
    }
    scoreA +=
      normalize(durationA ?? maxDuration + 1, 0, maxDuration, true) *
      COMPARISON_WEIGHTS.travelTime;
    scoreB +=
      normalize(durationB ?? maxDuration + 1, 0, maxDuration, true) *
      COMPARISON_WEIGHTS.travelTime;
    detailedResults.push({
      key: "travel_time",
      label: "Travel Time",
      valueA: durationA ? mapboxService.formatDuration(durationA) : "N/A",
      valueB: durationB ? mapboxService.formatDuration(durationB) : "N/A",
      winner,
    });

    // 3. Distance
    winner = lowerIsBetter(distanceA, distanceB, COMPARISON_THRESHOLDS.distance);
    if (winner === "A") reasonsA.push("Closer distance");
    if (winner === "B") reasonsB.push("Closer distance");
    scoreA +=
      normalize(distanceA ?? maxDistance + 1, 0, maxDistance, true) *
      COMPARISON_WEIGHTS.distance;
    scoreB +=
      normalize(distanceB ?? maxDistance + 1, 0, maxDistance, true) *
      COMPARISON_WEIGHTS.distance;
    detailedResults.push({
      key: "distance",
      label: "Distance",
      valueA: distanceA ? mapboxService.formatDistance(distanceA) : "N/A",
      valueB: distanceB ? mapboxService.formatDistance(distanceB) : "N/A",
      winner,
    });

    // 4. Services
    winner = higherIsBetter(servicesA.length, servicesB.length, COMPARISON_THRESHOLDS.count);
    if (winner === "A") {
      reasonsA.push(
        `Offers ${servicesA.length - servicesB.length} more services`,
      );
    }
    if (winner === "B") {
      reasonsB.push(
        `Offers ${servicesB.length - servicesA.length} more services`,
      );
    }
    scoreA += normalize(servicesA.length, 0, maxServices) * COMPARISON_WEIGHTS.services;
    scoreB += normalize(servicesB.length, 0, maxServices) * COMPARISON_WEIGHTS.services;
    detailedResults.push({
      key: "services",
      label: "Available Services",
      valueA: servicesA,
      valueB: servicesB,
      winner,
    });

    // 5. Specialists
    winner = higherIsBetter(specialistsA.length, specialistsB.length, COMPARISON_THRESHOLDS.count);
    if (winner === "A") {
      reasonsA.push(
        `Has ${specialistsA.length - specialistsB.length} more specialists`,
      );
    }
    if (winner === "B") {
      reasonsB.push(
        `Has ${specialistsB.length - specialistsA.length} more specialists`,
      );
    }
    scoreA +=
      normalize(specialistsA.length, 0, maxSpecialists) * COMPARISON_WEIGHTS.specialists;
    scoreB +=
      normalize(specialistsB.length, 0, maxSpecialists) * COMPARISON_WEIGHTS.specialists;
    detailedResults.push({
      key: "specialists",
      label: "Available Specialists",
      valueA: specialistsA,
      valueB: specialistsB,
      winner,
    });

    // 6. Total Reviews
    winner = higherIsBetter(reviewsA, reviewsB, COMPARISON_THRESHOLDS.reviews);
    if (winner === "A") {
      reasonsA.push(`More established (${reviewsA} vs ${reviewsB} reviews)`);
    }
    if (winner === "B") {
      reasonsB.push(`More established (${reviewsB} vs ${reviewsA} reviews)`);
    }
    scoreA += normalize(reviewsA, 0, maxReviews) * COMPARISON_WEIGHTS.reviews;
    scoreB += normalize(reviewsB, 0, maxReviews) * COMPARISON_WEIGHTS.reviews;
    detailedResults.push({
      key: "reviews",
      label: "Total Reviews",
      valueA: reviewsA,
      valueB: reviewsB,
      winner,
    });

    // 7. Inpatient Beds
    winner = higherIsBetter(bedsA, bedsB, COMPARISON_THRESHOLDS.count);
    if (winner === "A") {
      reasonsA.push(`More inpatient capacity (${bedsA} vs ${bedsB} beds)`);
    }
    if (winner === "B") {
      reasonsB.push(`More inpatient capacity (${bedsB} vs ${bedsA} beds)`);
    }
    scoreA += normalize(bedsA, 0, maxBeds) * COMPARISON_WEIGHTS.beds;
    scoreB += normalize(bedsB, 0, maxBeds) * COMPARISON_WEIGHTS.beds;
    detailedResults.push({
      key: "beds",
      label: "Inpatient Beds",
      valueA: bedsA,
      valueB: bedsB,
      winner,
    });

    return {
      reasonsA,
      reasonsB,
      detailedResults,
      scoreA: Math.round(scoreA * 100),
      scoreB: Math.round(scoreB * 100),
    };
  }, [facilityA, facilityB, directionsA, directionsB]);

  return comparisonData;
}