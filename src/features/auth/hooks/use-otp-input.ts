"use client";

import { useState, useRef, useCallback } from "react";

interface UseOtpInputOptions {
  length?: number;
  onComplete?: (otp: string) => void;
}

interface UseOtpInputReturn {
  digits: string[];
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  handleChange: (index: number, value: string) => void;
  handleKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  handlePaste: () => Promise<void>;
  reset: () => void;
  focusFirst: () => void;
  getOtp: () => string;
  isComplete: boolean;
}

/**
 * Hook to manage OTP input with auto-focus and paste support
 * @param options - Configuration options
 * @returns Object with OTP state and handlers
 */
export function useOtpInput(options: UseOtpInputOptions = {}): UseOtpInputReturn {
  const { length = 6, onComplete } = options;

  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const getOtp = useCallback(() => digits.join(""), [digits]);

  const isComplete = digits.every((d) => d !== "");

  const handleChange = useCallback(
    (index: number, value: string) => {
      // Only allow digits
      if (value && !/^\d$/.test(value)) return;

      const newDigits = [...digits];
      newDigits[index] = value;
      setDigits(newDigits);

      // Auto-focus next input
      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Check if complete and trigger callback
      const fullOtp = newDigits.join("");
      if (value && index === length - 1 && fullOtp.length === length) {
        onComplete?.(fullOtp);
      }
    },
    [digits, length, onComplete]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      // Handle paste shortcut
      if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handlePaste();
      }
    },
    [digits]
  );

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const pastedDigits = text.replace(/\D/g, "").slice(0, length);

      if (pastedDigits.length > 0) {
        const newDigits = Array(length).fill("");
        for (let i = 0; i < pastedDigits.length; i++) {
          newDigits[i] = pastedDigits[i];
        }
        setDigits(newDigits);

        // Focus appropriate input
        if (pastedDigits.length < length) {
          inputRefs.current[pastedDigits.length]?.focus();
        } else {
          inputRefs.current[length - 1]?.focus();
          onComplete?.(pastedDigits);
        }
      }
    } catch {
      // Clipboard access denied - silently fail
    }
  }, [length, onComplete]);

  const reset = useCallback(() => {
    setDigits(Array(length).fill(""));
    inputRefs.current[0]?.focus();
  }, [length]);

  const focusFirst = useCallback(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return {
    digits,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    reset,
    focusFirst,
    getOtp,
    isComplete,
  };
}
