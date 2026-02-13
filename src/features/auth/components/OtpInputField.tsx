"use client";

import { motion } from "framer-motion";

interface OtpInputFieldProps {
  digits: string[];
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: () => void;
  disabled?: boolean;
  error?: boolean;
}

export function OtpInputField({
  digits,
  inputRefs,
  onChange,
  onKeyDown,
  onPaste,
  disabled,
  error,
}: OtpInputFieldProps) {
  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {digits.map((digit, index) => (
        <motion.input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => onChange(index, e.target.value)}
          onKeyDown={(e) => onKeyDown(index, e)}
          onPaste={(e) => {
            e.preventDefault();
            onPaste();
          }}
          disabled={disabled}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + index * 0.05 }}
          className={`h-14 w-12 rounded-xl border-2 bg-gray-50 text-center text-2xl font-bold transition-all focus:outline-none focus:ring-2 sm:h-16 sm:w-14 ${
            error
              ? "border-red-300 text-red-500 focus:border-red-500 focus:ring-red-200"
              : digit
                ? "border-primary text-primary focus:border-primary focus:ring-primary/20"
                : "border-gray-200 text-gray-900 focus:border-primary focus:ring-primary/20"
          } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        />
      ))}
    </div>
  );
}
