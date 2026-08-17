export function getUserFacingError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";

  if (message === "UNSUPPORTED_TYPE") {
    return "Please upload a JPG, PNG, or WebP image.";
  }

  if (message === "FILE_TOO_LARGE" || message === "DEVICE_LIMIT") {
    return "This image is too large to process on this device. Please choose a smaller image.";
  }

  return "We couldn't optimize this image. Please try another photo.";
}
