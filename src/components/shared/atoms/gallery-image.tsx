import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export const GalleryImage = ({
  url,
  index = 0,
}: {
  url: string;
  index?: number;
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div
      className={`relative aspect-video size-full overflow-hidden rounded-lg ${loading ? "animate-pulse bg-gray-200" : "bg-gray-100"}`}
    >
      {error || !url ? (
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      ) : (
        <Image
          src={url}
          alt={`Photo ${index + 1}`}
          fill
          className={`object-cover transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
          loading="lazy"
        />
      )}
    </div>
  );
};
