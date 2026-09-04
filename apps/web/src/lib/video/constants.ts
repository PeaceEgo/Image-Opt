export const STATUS_MAX_WIDTH = 1080;
export const STATUS_MAX_HEIGHT = 1920;
export const STATUS_LANDSCAPE_MAX_WIDTH = 1920;
export const STATUS_LANDSCAPE_MAX_HEIGHT = 1080;
export const STATUS_SQUARE_MAX = 1080;

/** WhatsApp Status video length limit. */
export const STATUS_MAX_DURATION_SEC = 60;

export const MAX_VIDEO_FILE_SIZE_BYTES = 100 * 1024 * 1024;

/** Tunable encode defaults — adjust later without rewriting the pipeline. */
export const VIDEO_CRF = 28;
export const VIDEO_PRESET = "veryfast";

export const OPTIMIZED_VIDEO_FILENAME = "whatsapp-status-ready.mp4";

export const ACCEPTED_VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/quicktime",
] as const;

export const ACCEPTED_VIDEO_EXTENSIONS = [".mp4", ".mov"] as const;

/** Single-thread core — avoids SharedArrayBuffer / COOP-COEP requirements. */
export const FFMPEG_CORE_CDN =
  "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm";
