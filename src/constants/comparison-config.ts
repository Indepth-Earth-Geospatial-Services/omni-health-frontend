// src/constants/comparison-config.ts

export const COMPARISON_WEIGHTS = {
  rating: 0.35,
  travelTime: 0.2,
  distance: 0.1,
  services: 0.1,
  specialists: 0.1,
  reviews: 0.1,
  beds: 0.05,
};

export const COMPARISON_THRESHOLDS = {
  rating: 0.2, // Must be at least 0.2 points higher
  travelTime: 300, // Must be at least 5 minutes (300 seconds) shorter
  distance: 1000, // Must be at least 1 km (1000 meters) shorter
  count: 2, // Must have at least 2 more items (services, specialists, beds)
  reviews: 10, // Must have at least 10 more reviews
};
