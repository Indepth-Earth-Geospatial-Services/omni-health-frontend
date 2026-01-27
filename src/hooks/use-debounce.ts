import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number, minLength?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    if (!value) return;

    // Check if value is a string and has minLength requirement
    if (
      minLength !== undefined &&
      typeof value === "string" &&
      value.length < minLength
    ) {
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
