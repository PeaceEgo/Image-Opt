export function getVideoUserFacingError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";

  if (message === "UNSUPPORTED_TYPE") {
    return "Please upload an MP4 or MOV video.";
  }

  if (message === "FILE_TOO_LARGE") {
    return "This video is too large to process on this device. Try a smaller video.";
  }

  if (
    message === "DEVICE_LIMIT" ||
    message === "PROBE_FAILED" ||
    /memory|wasm|allocate|quota|ffmpeg/i.test(message)
  ) {
    return "We couldn’t prepare this video. Try a shorter clip.";
  }

  return "Something went wrong while preparing your video. Please try again.";
}
