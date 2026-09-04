import {
  ACCEPTED_VIDEO_EXTENSIONS,
  ACCEPTED_VIDEO_MIME_TYPES,
  MAX_VIDEO_FILE_SIZE_BYTES,
} from "@/lib/video/constants";
import type { FileLike, ValidationResult } from "@/types/image";

function hasAcceptedExtension(name: string): boolean {
  const lower = name.toLowerCase();
  return ACCEPTED_VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function isLikelyVideoFile(file: FileLike): boolean {
  if (file.type.startsWith("video/")) return true;
  return hasAcceptedExtension(file.name);
}

export function validateVideoFile(file: FileLike): ValidationResult {
  const mimeOk = ACCEPTED_VIDEO_MIME_TYPES.includes(
    file.type as (typeof ACCEPTED_VIDEO_MIME_TYPES)[number],
  );
  const extensionOk = hasAcceptedExtension(file.name);

  if (file.type ? !mimeOk : !extensionOk) {
    return {
      ok: false,
      code: "UNSUPPORTED_TYPE",
      message: "Please upload an MP4 or MOV video.",
    };
  }

  if (file.size > MAX_VIDEO_FILE_SIZE_BYTES) {
    return {
      ok: false,
      code: "FILE_TOO_LARGE",
      message:
        "This video is too large to process on this device. Try a smaller video.",
    };
  }

  return { ok: true };
}
