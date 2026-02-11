"use client";

import { useState, useEffect, useCallback } from "react";

interface UseResendCooldownOptions {
  initialCooldown?: number;
  defaultCooldownTime?: number;
}

interface UseResendCooldownReturn {
  cooldown: number;
  isOnCooldown: boolean;
  startCooldown: (duration?: number) => void;
  resetCooldown: () => void;
}

/**
 * Hook to manage resend cooldown timer
 * @param options - Configuration options
 * @returns Object with cooldown state and controls
 */
export function useResendCooldown(
  options: UseResendCooldownOptions = {}
): UseResendCooldownReturn {
  const { initialCooldown = 0, defaultCooldownTime = 30 } = options;

  const [cooldown, setCooldown] = useState(initialCooldown);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const startCooldown = useCallback(
    (duration: number = defaultCooldownTime) => {
      setCooldown(duration);
    },
    [defaultCooldownTime]
  );

  const resetCooldown = useCallback(() => {
    setCooldown(0);
  }, []);

  return {
    cooldown,
    isOnCooldown: cooldown > 0,
    startCooldown,
    resetCooldown,
  };
}
