import type { ImageMetadata } from "@/types/image";

function inferTypeFromName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

export function metadataFromFile(
  file: { name: string; type: string; size: number },
  width: number,
  height: number,
): ImageMetadata {
  return {
    name: file.name,
    type: file.type || inferTypeFromName(file.name),
    size: file.size,
    width,
    height,
    aspectRatio: width / height,
  };
}
