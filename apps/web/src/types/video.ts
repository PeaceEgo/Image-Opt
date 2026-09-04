export type VideoMetadata = {
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
  duration: number;
};

export type VideoTrimRange = {
  start: number;
  end: number;
};

export type VideoOptimizationResult = {
  original: VideoMetadata;
  optimized: VideoMetadata;
  originalUrl: string;
  optimizedUrl: string;
  optimizedBlob: Blob;
  trim: VideoTrimRange;
};

export type VideoProgressPhase =
  | "loading_tools"
  | "preparing"
  | "optimizing"
  | "finishing";

export type VideoProgress = {
  phase: VideoProgressPhase;
  /** 0–100, smoothed for UI */
  percent: number;
};
