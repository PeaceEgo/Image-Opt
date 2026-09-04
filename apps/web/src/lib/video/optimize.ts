import {
  OPTIMIZED_VIDEO_FILENAME,
} from "@/lib/video/constants";
import type {
  VideoOptimizationResult,
  VideoProgress,
  VideoTrimRange,
} from "@/types/video";

function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:8787"
  );
}

function mapUploadProgress(ratio: number): VideoProgress {
  const percent = Math.min(35, Math.round(ratio * 35));
  return { phase: "preparing", percent };
}

/**
 * Upload trim range + file to the API; server runs native ffmpeg and returns MP4.
 * Photos remain client-side — this path is video-only.
 */
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

  onProgress?.({ phase: "preparing", percent: 5 });

  const form = new FormData();
  form.append("file", file, file.name);
  form.append("start", String(trim.start));
  form.append("end", String(trim.end));

  onProgress?.(mapUploadProgress(0.5));

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}/v1/video/optimize`, {
      method: "POST",
      body: form,
    });
  } catch (error) {
    console.error("[video] API unreachable", error);
    throw new Error("API_UNAVAILABLE");
  }

  onProgress?.({ phase: "optimizing", percent: 55 });

  if (!response.ok) {
    let code = "ENCODE_FAILED";
    try {
      const json = (await response.json()) as { error?: string; message?: string };
      if (json.error) code = json.error;
      if (json.error === "FILE_TOO_LARGE") throw new Error("FILE_TOO_LARGE");
      if (json.error === "UNSUPPORTED_TYPE") throw new Error("UNSUPPORTED_TYPE");
    } catch (error) {
      if (error instanceof Error && error.message === "FILE_TOO_LARGE") throw error;
      if (error instanceof Error && error.message === "UNSUPPORTED_TYPE") throw error;
    }
    console.error("[video] optimize failed", response.status, code);
    throw new Error("DEVICE_LIMIT");
  }

  onProgress?.({ phase: "finishing", percent: 90 });

  const blob = await response.blob();
  const width = Number(response.headers.get("X-Video-Width")) || probe.width;
  const height = Number(response.headers.get("X-Video-Height")) || probe.height;
  const outDuration =
    Number(response.headers.get("X-Video-Duration")) || duration;

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
      duration: outDuration,
    },
    originalUrl: URL.createObjectURL(file),
    optimizedUrl: URL.createObjectURL(blob),
    optimizedBlob: blob,
    trim: { start: trim.start, end: trim.end },
  };
}

export function revokeVideoResultUrls(result: VideoOptimizationResult | null) {
  if (!result) return;
  URL.revokeObjectURL(result.originalUrl);
  URL.revokeObjectURL(result.optimizedUrl);
}
