import {
  STATUS_LANDSCAPE_MAX_HEIGHT,
  STATUS_LANDSCAPE_MAX_WIDTH,
  STATUS_MAX_HEIGHT,
  STATUS_MAX_WIDTH,
  STATUS_SQUARE_MAX,
} from "@/lib/video/constants";

export type VideoOrientation = "portrait" | "landscape" | "square";

export function getVideoOrientation(
  width: number,
  height: number,
): VideoOrientation {
  if (width <= 0 || height <= 0) {
    throw new Error("Video has invalid dimensions.");
  }
  if (width === height) return "square";
  return height > width ? "portrait" : "landscape";
}

function ensureEven(value: number): number {
  const rounded = Math.max(2, Math.round(value));
  return rounded % 2 === 0 ? rounded : rounded - 1;
}

/**
 * Fit-inside Status box; never upscale; even width/height for H.264.
 */
export function getVideoTargetSize(
  width: number,
  height: number,
): { width: number; height: number; orientation: VideoOrientation } {
  if (width <= 0 || height <= 0) {
    throw new Error("Video has invalid dimensions.");
  }

  const orientation = getVideoOrientation(width, height);
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
    width: ensureEven(width * scale),
    height: ensureEven(height * scale),
    orientation,
  };
}
