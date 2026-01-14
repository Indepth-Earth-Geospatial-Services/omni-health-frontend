"use client";
import Image from "next/image";
import { ImageIcon, ImagePlayIcon } from "lucide-react";
import { DataSection } from "../atoms/data-section";
import { useState } from "react";

interface ImageGalleryProps {
  image_urls: string[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ image_urls }) => {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(
    Object.fromEntries(image_urls.map((_, i) => [i, true])),
  );

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
    setLoadingStates((prev) => ({ ...prev, [index]: false }));
  };

  const handleImageLoad = (index: number) => {
    setLoadingStates((prev) => ({ ...prev, [index]: false }));
  };

  return (
    <DataSection
      title="Facility Photos"
      icon={<ImagePlayIcon className="h-5 w-5" />}
      data={image_urls}
      emptyMessage="No photos available"
    >
      <div className="grid grid-cols-2 gap-3">
        {image_urls.slice(0, 4).map((url, index) => (
          <div
            key={index}
            className={`relative aspect-video overflow-hidden rounded-lg ${
              loadingStates[index] ? "animate-pulse bg-gray-200" : "bg-gray-100"
            }`}
          >
            {imageErrors[index] ? (
              // Placeholder for failed images
              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-xs text-gray-500">
                    Image unavailable
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Loading skeleton - shows while image loads */}
                {loadingStates[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
                  </div>
                )}

                <Image
                  src={url}
                  alt={`Facility photo ${index + 1}`}
                  fill
                  className={`object-cover transition-opacity duration-300 ${
                    loadingStates[index] ? "opacity-0" : "opacity-100"
                  }`}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  onError={() => handleImageError(index)}
                  onLoadingComplete={() => handleImageLoad(index)}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                />
              </>
            )}
          </div>
        ))}
      </div>
    </DataSection>
  );
};
