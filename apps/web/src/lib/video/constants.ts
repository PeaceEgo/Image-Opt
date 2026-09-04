export const STATUS_MAX_WIDTH = 1080;
export const STATUS_MAX_HEIGHT = 1920;
export const STATUS_LANDSCAPE_MAX_WIDTH = 1920;
export const STATUS_LANDSCAPE_MAX_HEIGHT = 1080;
export const STATUS_SQUARE_MAX = 1080;

/** WhatsApp Status video length limit. */
export const STATUS_MAX_DURATION_SEC = 60;

export const MAX_VIDEO_FILE_SIZE_BYTES = 100 * 1024 * 1024;

export const OPTIMIZED_VIDEO_FILENAME = "whatsapp-status-ready.mp4";

export const ACCEPTED_VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/quicktime",
] as const;

export const ACCEPTED_VIDEO_EXTENSIONS = [".mp4", ".mov"] as const;
