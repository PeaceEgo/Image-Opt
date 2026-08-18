import {
  STATUS_LANDSCAPE_MAX_HEIGHT,
  STATUS_LANDSCAPE_MAX_WIDTH,
  STATUS_MAX_HEIGHT,
  STATUS_MAX_WIDTH,
  STATUS_SQUARE_MAX,
} from "@/lib/image/constants";

export type ImageOrientation = "portrait" | "landscape" | "square";

export function getImageOrientation(
  width: number,
  height: number,
): ImageOrientation {
  if (width <= 0 || height <= 0) {
    throw new Error("Image has invalid dimensions.");
  }
  if (width === height) return "square";
  return height > width ? "portrait" : "landscape";
}

/**
 * WhatsApp HD target: fit inside an orientation-aware Status box.
 * Never upscales. Preserves aspect ratio (no crop).
 */
export function getTargetSize(
  width: number,
  height: number,
): { width: number; height: number; orientation: ImageOrientation } {
  if (width <= 0 || height <= 0) {
    throw new Error("Image has invalid dimensions.");
  }

  const orientation = getImageOrientation(width, height);
  let maxWidth = STATUS_MAX_WIDTH;
  let maxHeight = STATUS_MAX_HEIGHT;

  if (orientation === "landscape") {
    maxWidth = STATUS_LANDSCAPE_MAX_WIDTH;
    maxHeight = STATUS_LANDSCAPE_MAX_HEIGHT;
  } else if (orientation === "square") {
    maxWidth = STATUS_SQUARE_MAX;
    maxHeight = STATUS_SQUARE_MAX;
  }

  const scale = Math.min(1, maxWidth / width, maxHeight / height);

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
    orientation,
  };
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}

export function formatAspectRatio(width: number, height: number): string {
  const divisor = gcd(width, height);
  const w = width / divisor;
  const h = height / divisor;

  if (w > 30 || h > 30) {
    return `${(width / height).toFixed(2)}:1`;
  }

  return `${w}:${h}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatType(type: string, name?: string): string {
  const value = type || name || "";
  if (value.includes("jpeg") || value.endsWith(".jpg") || value.endsWith(".jpeg")) {
    return "JPG";
  }
  if (value.includes("png") || value.endsWith(".png")) {
    return "PNG";
  }
  if (value.includes("webp") || value.endsWith(".webp")) {
    return "WebP";
  }
  return "Image";
}

export function formatDimensions(width: number, height: number): string {
  return `${width} × ${height}`;
}

/** Percent smaller vs original; null when not smaller. */
export function getSizeReductionPercent(
  originalBytes: number,
  optimizedBytes: number,
): number | null {
  if (originalBytes <= 0 || optimizedBytes <= 0 || optimizedBytes >= originalBytes) {
    return null;
  }
  return Math.round(((originalBytes - optimizedBytes) / originalBytes) * 100);
}

export function formatSizeReduction(
  originalBytes: number,
  optimizedBytes: number,
): string | null {
  const percent = getSizeReductionPercent(originalBytes, optimizedBytes);
  if (percent === null) return null;
  return `${percent}% smaller`;
}
