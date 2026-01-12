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
    sm: "p-4 rounded-2xl",
    md: "p-6 rounded-3xl",
    lg: "p-10 rounded-3xl min-h-[320px] flex flex-col justify-center",
  };

  const iconSizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-14 h-14",
  };

  const titleSizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  const descriptionSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={`${bgColor} ${sizeClasses[size]} shadow-sm`}>
      {/* Icon Circle */}
      <div className={`${iconBgColor} ${iconSizeClasses[size]} rounded-full flex items-center justify-center mb-4`}>
        {icon}
      </div>

      {/* Title */}
      <h3 className={`${titleSizeClasses[size]} font-semibold ${titleColor} mb-2`}>
        {title}
      </h3>

      {/* Description */}
      <p className={`${descriptionSizeClasses[size]} ${descriptionColor} leading-relaxed`}>
        {description}
      </p>
    </div>
  );
}
