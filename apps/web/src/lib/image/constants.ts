export const STATUS_MAX_WIDTH = 1080;
export const STATUS_MAX_HEIGHT = 1920;

/** Landscape Status-friendly box (letterboxed on phones). */
export const STATUS_LANDSCAPE_MAX_WIDTH = 1920;
export const STATUS_LANDSCAPE_MAX_HEIGHT = 1080;

/** Square Status-friendly box. */
export const STATUS_SQUARE_MAX = 1080;

/** High-quality JPEG for WhatsApp HD (still Status-friendly size). */
export const JPEG_QUALITY = 0.9;

/** If HD encode exceeds this, do one softer re-encode. */
export const JPEG_SOFT_QUALITY = 0.82;
export const JPEG_SOFT_SIZE_BYTES = 2.5 * 1024 * 1024;

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
export const PROCESS_TIMEOUT_MS = 45_000;
export const OPTIMIZED_FILENAME = "whatsapp-status-hd.jpg";

export const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ACCEPTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;

export const FILE_INPUT_ACCEPT = [
  ...ACCEPTED_MIME_TYPES,
  ...ACCEPTED_EXTENSIONS,
].join(",");
