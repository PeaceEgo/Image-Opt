import {
  STATUS_MAX_HEIGHT,
  STATUS_MAX_WIDTH,
} from "@/lib/image/constants";

export function getTargetSize(
  width: number,
  height: number,
  maxWidth = STATUS_MAX_WIDTH,
  maxHeight = STATUS_MAX_HEIGHT,
): { width: number; height: number } {
  if (width <= 0 || height <= 0) {
    throw new Error("Image has invalid dimensions.");
  }

  const scale = Math.min(1, maxWidth / width, maxHeight / height);

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
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
