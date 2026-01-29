"use client";

import { CheckCircle } from "lucide-react";

interface ReasonsListProps {
  reasons: string[];
}

export function ReasonsList({ reasons }: ReasonsListProps) {
  if (reasons.length === 0) {
    return <p className="text-sm text-[#868C98]">No specific advantages.</p>;
  }
  return (
    <ul className="space-y-2">
      {reasons.map((reason) => (
        <li key={reason} className="flex items-start">
          <CheckCircle className="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-primary" />
          <span className="text-[#343434]">{reason}</span>
        </li>
      ))}
    </ul>
  );
}
