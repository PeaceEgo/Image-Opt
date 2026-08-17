export const STATUS_MAX_WIDTH = 1080;
export const STATUS_MAX_HEIGHT = 1920;
export const JPEG_QUALITY = 0.85;
export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
export const PROCESS_TIMEOUT_MS = 45_000;
export const OPTIMIZED_FILENAME = "whatsapp-status-optimized.jpg";

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
