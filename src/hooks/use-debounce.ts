import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number, minLength?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 1. Only guard against null/undefined, NOT empty strings
    if (value === undefined || value === null) return;

    // 2. Handle the "Min Length" logic
    // If it's a string and too short, we DON'T stop the effect;
    // we just don't update to the new value yet (or we reset to initial).
    const isString = typeof value === "string";
    if (
      minLength !== undefined &&
      isString &&
      value.length > 0 &&
      value.length < minLength
    ) {
      return;
    }

    // 3. The logic for clearing:
    // If the user deletes everything, we want the UI to update INSTANTLY
    // rather than waiting for the delay.
    if (isString && value.length === 0) {
      // eslint-disable-next-line
      setDebouncedValue(value);
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay, minLength]);

  return debouncedValue;
}
