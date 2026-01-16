import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  size?: "sm" | "md" | "lg";
  bgColor?: string;
  iconBgColor?: string;
  titleColor?: string;
  descriptionColor?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  size = "md",
  bgColor = "bg-[#B8D8D4]",
  iconBgColor = "bg-white",
  titleColor = "text-[#0A0D14]",
  descriptionColor = "text-gray-700",
}: FeatureCardProps) {
  const sizeClasses = {
    sm: "p-3 sm:p-4 rounded-2xl",
    md: "p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl",
    lg: "p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl min-h-[280px] sm:min-h-[300px] md:min-h-[320px] flex flex-col justify-center",
  };

  const iconSizeClasses = {
    sm: "w-9 h-9 sm:w-10 sm:h-10",
    md: "w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12",
    lg: "w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14",
  };

  const titleSizeClasses = {
    sm: "text-sm sm:text-base",
    md: "text-base sm:text-lg",
    lg: "text-lg sm:text-xl",
  };

  const descriptionSizeClasses = {
    sm: "text-xs sm:text-sm",
    md: "text-xs sm:text-sm",
    lg: "text-sm sm:text-base",
  };

  return (
    <div className={`${bgColor} ${sizeClasses[size]} shadow-sm h-full`}>
      {/* Icon Circle */}
      <div className={`${iconBgColor} ${iconSizeClasses[size]} rounded-full flex items-center justify-center mb-3 sm:mb-4`}>
        {icon}
      </div>

      {/* Title */}
      <h3 className={`${titleSizeClasses[size]} font-semibold ${titleColor} mb-1.5 sm:mb-2`}>
        {title}
      </h3>

      {/* Description */}
      <p className={`${descriptionSizeClasses[size]} ${descriptionColor} leading-relaxed`}>
        {description}
      </p>
    </div>
  );
}
