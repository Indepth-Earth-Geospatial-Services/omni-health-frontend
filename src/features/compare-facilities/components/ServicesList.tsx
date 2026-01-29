"use client";

import { Badge } from "@/components/ui/badge";

interface ServicesListProps {
  services: string[];
}

export function ServicesList({ services }: ServicesListProps) {
  if (services.length === 0) {
    return <p className="text-sm text-[#868C98]">No services listed.</p>;
  }
  return (
    <div className="mt-4">
      <h4 className="mb-2 font-semibold text-[#343434]">Services Offered</h4>
      <div className="flex flex-wrap gap-2">
        {services.map((service) => (
          <Badge
            key={service}
            variant="outline"
            className="border-[#E2E4E9] text-[#868C98]"
          >
            {service}
          </Badge>
        ))}
      </div>
    </div>
  );
}
