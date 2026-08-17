import { formatDimensions } from "@/lib/image/format";

type ImagePreviewProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export function ImagePreview({ src, alt, width, height }: ImagePreviewProps) {
  return (
    <figure className="overflow-hidden rounded-3xl bg-cream">
      {/* User-selected preview; next/image is not used for blob URLs. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="mx-auto max-h-[min(70vh,720px)] w-full object-contain"
      />
      {width && height ? (
        <figcaption className="sr-only">{formatDimensions(width, height)}</figcaption>
      ) : null}
    </figure>
  );
}
