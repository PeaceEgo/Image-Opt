import { OPTIMIZED_FILENAME } from "@/lib/image/constants";

export function downloadOptimizedMedia(
  objectUrl: string,
  filename = OPTIMIZED_FILENAME,
) {
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/** @deprecated Prefer downloadOptimizedMedia */
export function downloadOptimizedImage(
  objectUrl: string,
  filename = OPTIMIZED_FILENAME,
) {
  downloadOptimizedMedia(objectUrl, filename);
}
