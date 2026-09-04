import { FFMPEG_CORE_CDN } from "@/lib/video/constants";

type FFmpegInstance = import("@ffmpeg/ffmpeg").FFmpeg;

let ffmpeg: FFmpegInstance | null = null;
let loadPromise: Promise<FFmpegInstance> | null = null;

export type FFmpegLoadStage = "idle" | "loading" | "ready";

/**
 * Lazy singleton. Photo path never imports this module, so WASM stays unloaded.
 */
export async function getFFmpeg(
  onStage?: (stage: FFmpegLoadStage) => void,
): Promise<FFmpegInstance> {
  if (ffmpeg?.loaded) {
    onStage?.("ready");
    return ffmpeg;
  }

  if (loadPromise) {
    onStage?.("loading");
    return loadPromise;
  }

  onStage?.("loading");
  loadPromise = (async () => {
    const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
      import("@ffmpeg/ffmpeg"),
      import("@ffmpeg/util"),
    ]);

    const instance = new FFmpeg();
    const base = FFMPEG_CORE_CDN;

    await instance.load({
      coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
    });

    ffmpeg = instance;
    onStage?.("ready");
    return instance;
  })();

  try {
    return await loadPromise;
  } catch (error) {
    loadPromise = null;
    ffmpeg = null;
    throw error;
  }
}
