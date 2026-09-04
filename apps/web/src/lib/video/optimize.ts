import type { FFmpeg, LogEventCallback, ProgressEventCallback } from "@ffmpeg/ffmpeg";
import {
  OPTIMIZED_VIDEO_FILENAME,
  VIDEO_CRF,
  VIDEO_PRESET,
} from "@/lib/video/constants";
import { getFFmpeg } from "@/lib/video/ffmpeg";
import { getVideoTargetSize } from "@/lib/video/target";
import type {
  VideoOptimizationResult,
  VideoProgress,
  VideoTrimRange,
} from "@/types/video";

function extensionForFile(file: File): string {
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".mov") || file.type === "video/quicktime") return "mov";
  return "mp4";
}

function mapProgress(
  ratio: number,
  phase: VideoProgress["phase"],
): VideoProgress {
  const clamped = Math.max(0, Math.min(1, ratio));
  let percent = 0;
  if (phase === "loading_tools") percent = Math.round(clamped * 12);
  else if (phase === "preparing") percent = 12 + Math.round(clamped * 8);
  else if (phase === "optimizing") percent = 20 + Math.round(clamped * 70);
  else percent = 90 + Math.round(clamped * 10);
  return { phase, percent: Math.min(99, percent) };
}

/** True when FFmpeg probe logs list an audio stream. */
export function ffmpegLogsIndicateAudio(logs: string[]): boolean {
  return logs.some((line) => /Stream #\d+:\d+(?:\([^)]*\))?: Audio:/i.test(line));
}

export function buildVideoEncodeArgs(options: {
  inputName: string;
  outputName: string;
  start: number;
  duration: number;
  width: number;
  height: number;
  hasAudio: boolean;
}): string[] {
  const scaleFilter = `scale=${options.width}:${options.height}:force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2`;

  const args = [
    "-ss",
    options.start.toFixed(3),
    "-i",
    options.inputName,
    "-t",
    options.duration.toFixed(3),
    "-vf",
    scaleFilter,
    "-c:v",
    "libx264",
    "-preset",
    VIDEO_PRESET,
    "-crf",
    String(VIDEO_CRF),
  ];

  if (options.hasAudio) {
    args.push("-c:a", "aac");
  } else {
    args.push("-an");
  }

  args.push("-movflags", "+faststart", "-y", options.outputName);
  return args;
}

/**
 * Probe streams via `ffmpeg -i` logs (no output file).
 * Exit code is often non-zero when no output is set — that is expected.
 */
export async function detectHasAudioStream(
  instance: FFmpeg,
  inputName: string,
): Promise<boolean> {
  const lines: string[] = [];
  const onLog: LogEventCallback = ({ message }) => {
    lines.push(message);
  };

  instance.on("log", onLog);
  try {
    await instance.exec(["-i", inputName]);
  } catch {
    // Expected: -i with no output fails after printing stream info.
  } finally {
    instance.off("log", onLog);
  }

  return ffmpegLogsIndicateAudio(lines);
}

export async function processVideo(
  file: File,
  trim: VideoTrimRange,
  probe: { width: number; height: number; duration: number },
  onProgress?: (progress: VideoProgress) => void,
): Promise<VideoOptimizationResult> {
  const duration = Math.max(0, trim.end - trim.start);
  if (duration <= 0) {
    throw new Error("DEVICE_LIMIT");
  }

  const { width, height } = getVideoTargetSize(probe.width, probe.height);
  const inputName = `input.${extensionForFile(file)}`;
  const outputName = "output.mp4";

  let instance: FFmpeg;
  try {
    instance = await getFFmpeg((stage) => {
      if (stage === "loading") {
        onProgress?.(mapProgress(0.4, "loading_tools"));
      }
      if (stage === "ready") {
        onProgress?.(mapProgress(1, "loading_tools"));
      }
    });
  } catch {
    throw new Error("DEVICE_LIMIT");
  }

  onProgress?.(mapProgress(0, "preparing"));

  const { fetchFile } = await import("@ffmpeg/util");
  const inputData = await fetchFile(file);
  await instance.writeFile(inputName, inputData);

  const hasAudio = await detectHasAudioStream(instance, inputName);
  onProgress?.(mapProgress(1, "preparing"));

  const onFfmpegProgress: ProgressEventCallback = ({ progress }) => {
    onProgress?.(mapProgress(progress, "optimizing"));
  };
  instance.on("progress", onFfmpegProgress);

  try {
    onProgress?.(mapProgress(0, "optimizing"));

    const args = buildVideoEncodeArgs({
      inputName,
      outputName,
      start: trim.start,
      duration,
      width,
      height,
      hasAudio,
    });

    const code = await instance.exec(args);
    if (code !== 0) {
      throw new Error("DEVICE_LIMIT");
    }

    onProgress?.(mapProgress(0.5, "finishing"));
    const data = await instance.readFile(outputName);
    const bytes =
      data instanceof Uint8Array ? data : new TextEncoder().encode(String(data));
    const copy = new Uint8Array(bytes);
    const blob = new Blob([copy], { type: "video/mp4" });

    onProgress?.({ phase: "finishing", percent: 100 });

    return {
      original: {
        name: file.name,
        type: file.type || "video/mp4",
        size: file.size,
        width: probe.width,
        height: probe.height,
        duration: probe.duration,
      },
      optimized: {
        name: OPTIMIZED_VIDEO_FILENAME,
        type: "video/mp4",
        size: blob.size,
        width,
        height,
        duration,
      },
      originalUrl: URL.createObjectURL(file),
      optimizedUrl: URL.createObjectURL(blob),
      optimizedBlob: blob,
      trim: { start: trim.start, end: trim.end },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (
      message === "DEVICE_LIMIT" ||
      /memory|wasm|allocate|quota|ffmpeg/i.test(message)
    ) {
      throw new Error("DEVICE_LIMIT");
    }
    throw error;
  } finally {
    instance.off("progress", onFfmpegProgress);
    try {
      await instance.deleteFile(inputName);
    } catch {
      /* ignore */
    }
    try {
      await instance.deleteFile(outputName);
    } catch {
      /* ignore */
    }
  }
}

export function revokeVideoResultUrls(result: VideoOptimizationResult | null) {
  if (!result) return;
  URL.revokeObjectURL(result.originalUrl);
  URL.revokeObjectURL(result.optimizedUrl);
}
