import { ImagePlayIcon } from "lucide-react";
import { GalleryImage } from "../atoms/gallery-image";
import { DataSection } from "../atoms/data-section";
interface ImageGalleryProps {
  image_urls: string[];
}
export const ImageGallery: React.FC<ImageGalleryProps> = ({ image_urls }) => {
  return (
    <DataSection
      title="Facility Photos"
      icon={<ImagePlayIcon className="h-5 w-5" />}
      data={image_urls}
      emptyMessage="No photos available"
    >
      <div className="grid grid-cols-2 gap-3">
        {image_urls.slice(0, 4).map((url, index) => (
          <GalleryImage key={url + index} url={url} index={index} />
        ))}
      </div>
    </DataSection>
  );
};
