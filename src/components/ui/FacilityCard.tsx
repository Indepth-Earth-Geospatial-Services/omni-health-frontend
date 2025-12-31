import type { HealthcareFacility } from '@/types/facility';
import { memo } from 'react';

interface FacilityCardProps {
  facility: HealthcareFacility;
  onClick?: (facility: HealthcareFacility) => void;
}

export const FacilityCard = memo(function FacilityCard({
  facility,
  onClick,
}: FacilityCardProps) {
  const handleClick = () => {
    onClick?.(facility);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(facility);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="border-b border-gray-200 p-4 transition-all cursor-pointer hover:bg-gray-50"
      aria-label={`${facility.name}, ${facility.status}`}
    >
      <h3 className="font-medium text-gray-900 mb-1 text-heading text-sm">
        {facility.name}
      </h3>
      <p className="text-xs text-gray-600 mb-1 text-small">
        {facility.address}
      </p>
      {facility.fullAddress && (
        <p className="text-sm text-gray-600 mb-2 text-small">
          {facility.fullAddress}
        </p>
      )}
      <div className="flex items-center gap-1 text-sm">
        <span
          className={`text-small font-medium ${facility.status === 'Open'
            ? 'text-green-600'
            : 'text-red-600'
            }`}
          aria-label={`Status: ${facility.status}`}
        >
          {facility.status}
        </span>
        <span className="text-gray-500" aria-hidden="true">
        </span>
        <span className="text-gray-600 text-small">  &#8901;
          Opens at {facility.closingTime}
        </span>
      </div>
    </div>
  );
});
