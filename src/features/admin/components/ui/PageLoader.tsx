"use client";

// import Loader from "@/components/shared/Loader";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  /** Text to display below the loader */
  text?: string;
  /** Minimum height of the loader container */
  minHeight?: "sm" | "md" | "lg" | "full";
  /** Custom className */
  className?: string;
}

const heightClasses = {
  sm: "min-h-[200px]",
  md: "min-h-[400px]",
  lg: "min-h-[600px]",
  full: "min-h-screen",
};

export default function PageLoader({
  text = "Loading...",
  minHeight = "md",
  className,
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center",
        heightClasses[minHeight],
        className,
      )}
    >
      {/* <Loader size="lg" text={text} variant="default" /> */}
    </div>
  );
}
