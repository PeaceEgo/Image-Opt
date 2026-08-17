import {
  ACCEPTED_EXTENSIONS,
  ACCEPTED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
} from "@/lib/image/constants";
import type { FileLike, ValidationResult } from "@/types/image";

function hasAcceptedExtension(name: string): boolean {
  const lower = name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function validateImageFile(file: FileLike): ValidationResult {
  const mimeOk = ACCEPTED_MIME_TYPES.includes(
    file.type as (typeof ACCEPTED_MIME_TYPES)[number],
  );
  const extensionOk = hasAcceptedExtension(file.name);

  if (file.type ? !mimeOk : !extensionOk) {
    return {
      ok: false,
      code: "UNSUPPORTED_TYPE",
      message: "Please upload a JPG, PNG, or WebP image.",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      ok: false,
      code: "FILE_TOO_LARGE",
      message:
        "This image is too large to process on this device. Please choose a smaller image.",
    };
  }

  return { ok: true };
}
