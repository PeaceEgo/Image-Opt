import {
  formatAspectRatio,
  formatDimensions,
  formatFileSize,
  formatType,
} from "@/lib/image/format";
import type { ImageMetadata } from "@/types/image";

type ImageMetadataProps = {
  image: ImageMetadata;
  label?: string;
};

export function ImageMetadataDisplay({ image, label = "Original" }: ImageMetadataProps) {
  const items = [
    { label: "Source", value: label },
    { label: "Format", value: formatType(image.type, image.name) },
    { label: "Size", value: formatFileSize(image.size) },
    { label: "Dimensions", value: formatDimensions(image.width, image.height) },
    { label: "Aspect", value: formatAspectRatio(image.width, image.height) },
  ];

  return (
    <dl className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted">
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline gap-2">
          <dt className="sr-only">{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
