export type VideoProbe = {
  duration: number;
  width: number;
  height: number;
};

/**
 * Read duration/dimensions via a temporary <video> element.
 * Does not decode the full stream into memory beyond metadata.
 */
export function probeVideo(file: File): Promise<VideoProbe> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => {
      video.removeAttribute("src");
      video.load();
      URL.revokeObjectURL(url);
    };

    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const width = video.videoWidth || 0;
      const height = video.videoHeight || 0;
      cleanup();

      if (duration <= 0 || width <= 0 || height <= 0) {
        reject(new Error("PROBE_FAILED"));
        return;
      }

      resolve({ duration, width, height });
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("PROBE_FAILED"));
    };

    video.src = url;
  });
}
