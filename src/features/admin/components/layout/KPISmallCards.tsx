"use client";
import React from "react";
import Link from "next/link";

interface KPICardProps {
  value?: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

export function KPISmallCard({
  value,
  subtitle,
  icon,
  onClick,
  href,
}: KPICardProps) {
  const cardContent = (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700">
        {icon}
      </div>
      <div>
        <div className="font-dmsans text-[18px] font-medium text-black">
          {value}
        </div>
        {subtitle && (
          <div className="mt-1 text-sm text-gray-500">{subtitle}</div>
        )}
      </div>
    </div>
  );

  const cardClasses =
    "group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-md cursor-pointer";

  // If href is provided, wrap in Link
  if (href) {
    return (
      <Link href={href} className="block">
        <div className={cardClasses}>{cardContent}</div>
      </Link>
    );
  }

  // If onClick is provided, use button behavior
  if (onClick) {
    return (
      <div className={cardClasses} onClick={onClick} role="button" tabIndex={0}>
        {cardContent}
      </div>
    );
  }

  // Default non-interactive card
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300">
      {cardContent}
    </div>
  );
}
