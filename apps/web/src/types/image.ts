export type ImageMetadata = {
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
  aspectRatio: number;
};

export type OptimizationResult = {
  original: ImageMetadata;
  optimized: ImageMetadata;
  originalUrl: string;
  optimizedUrl: string;
  /** Kept for native share without re-fetching the object URL. */
  optimizedBlob: Blob;
};

export type AppStatus =
  | "idle"
  | "reading"
  | "optimizing"
  | "video_trim"
  | "complete"
  | "error";


export type FileLike = {
  name: string;
  type: string;
  size: number;
};

export type ValidationResult =
  | { ok: true }
  | { ok: false; code: "UNSUPPORTED_TYPE" | "FILE_TOO_LARGE"; message: string };
