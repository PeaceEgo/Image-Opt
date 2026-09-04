import { OPTIMIZED_FILENAME } from "@/lib/image/constants";

export type ShareOutcome = "shared" | "cancelled" | "unsupported";

export function canUseWebShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export function canShareFiles(file: File): boolean {
  if (!canUseWebShare()) return false;
  if (typeof navigator.canShare !== "function") {
    // Older Safari: share exists; file support is best-effort at call time.
    return true;
  }
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

export function createOptimizedFile(
  blob: Blob,
  filename = OPTIMIZED_FILENAME,
): File {
  return new File([blob], filename, {
    type: blob.type || "image/jpeg",
    lastModified: Date.now(),
  });
}

/**
 * Share an optimized media file via the native share sheet when file sharing works.
 * Does not fake success. AbortError (user cancel) → cancelled.
 */
export async function shareOptimizedFile(
  blob: Blob,
  filename = OPTIMIZED_FILENAME,
): Promise<ShareOutcome> {
  if (!canUseWebShare()) return "unsupported";

  const file = createOptimizedFile(blob, filename);

  if (!canShareFiles(file)) {
    return "unsupported";
  }

  try {
    await navigator.share({
      files: [file],
      title: "WhatsApp Status",
      text: "Ready for WhatsApp Status",
    });
    return "shared";
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return "cancelled";
    }
    if (error instanceof Error && error.name === "AbortError") {
      return "cancelled";
    }
    return "unsupported";
  }
}

/** @deprecated Prefer shareOptimizedFile — kept for call-site clarity on photos. */
export async function shareOptimizedImage(blob: Blob): Promise<ShareOutcome> {
  return shareOptimizedFile(blob, OPTIMIZED_FILENAME);
}

export const SHARE_UNSUPPORTED_MESSAGE =
  "Direct sharing isn't supported on this browser. Download your optimized image instead.";

export const SHARE_UNSUPPORTED_VIDEO_MESSAGE =
  "Direct sharing isn't supported on this browser. Download your optimized video instead.";
