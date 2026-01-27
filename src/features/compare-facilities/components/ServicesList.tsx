"use client";

import { Badge } from "@/components/ui/badge";

interface ServicesListProps {
  services: string[];
}

export function ServicesList({ services }: ServicesListProps) {
  if (services.length === 0) {
    return <p className="text-sm text-slate-500">No services listed.</p>;
  }
  return (
    <div className="mt-4">
      <h4 className="mb-2 font-semibold text-[#36454F]">Services Offered</h4>
      <div className="flex flex-wrap gap-2">
        {services.map((service) => (
          <Badge key={service} variant="secondary">
            {service}
          </Badge>
        ))}
      </div>
    </div>
  );
}
