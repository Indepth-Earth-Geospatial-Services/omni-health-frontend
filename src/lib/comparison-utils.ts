// src/lib/comparison-utils.ts

type Winner = "A" | "B" | "TIE";

export const normalize = (val: number, min: number, max: number, inverted = false) => {
  if (max === min) return 1; // Avoid division by zero
  const normalized = (val - min) / (max - min);
  return inverted ? 1 - normalized : normalized;
};

export const higherIsBetter = (
  a: number | undefined,
  b: number | undefined,
  threshold: number = 0,
): Winner => {
  const valA = a ?? -1;
  const valB = b ?? -1;
  if (valA - valB > threshold) return "A";
  if (valB - valA > threshold) return "B";
  return "TIE";
};

export const lowerIsBetter = (
  a: number | undefined,
  b: number | undefined,
  threshold: number = 0,
): Winner => {
  const valA = a ?? Infinity;
  const valB = b ?? Infinity;
  if (valB - valA > threshold) return "A";
  if (valA - valB > threshold) return "B";
  return "TIE";
};
