"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "flex h-10 rounded-md bg-white px-3 py-2 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary",
  {
    variants: {
      width: {
        sm: "w-32",
        lg: "w-64",
        xl: "w-80",
        "2xl": "w-96",
        full: "w-full",
      },
    },
    defaultVariants: {
      width: "full",
    },
  },
);

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "width">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, width, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ width, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
