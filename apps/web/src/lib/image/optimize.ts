import { metadataFromFile } from "@/lib/image/analyze";
import {
  JPEG_QUALITY,
  JPEG_SOFT_QUALITY,
  JPEG_SOFT_SIZE_BYTES,
  OPTIMIZED_FILENAME,
  PROCESS_TIMEOUT_MS,
} from "@/lib/image/constants";
import { getTargetSize } from "@/lib/image/format";
import type { OptimizationResult } from "@/types/image";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("DEVICE_LIMIT"));
    }, ms);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to encode image."));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}

async function encodeWhatsAppHd(canvas: HTMLCanvasElement): Promise<Blob> {
  let blob = await canvasToJpeg(canvas, JPEG_QUALITY);
  if (blob.size > JPEG_SOFT_SIZE_BYTES) {
    blob = await canvasToJpeg(canvas, JPEG_SOFT_QUALITY);
  }
  return blob;
}

export async function optimizeBitmap(
  bitmap: ImageBitmap,
): Promise<{ blob: Blob; width: number; height: number }> {
  const { width, height } = getTargetSize(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("DEVICE_LIMIT");
  }

  // JPEG has no alpha; fill opaque so transparent PNGs don't become black.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, width, height);

  try {
    const blob = await encodeWhatsAppHd(canvas);
    return { blob, width, height };
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}

export async function processImage(
  file: File,
  onStage?: (stage: "reading" | "optimizing") => void,
): Promise<OptimizationResult> {
  onStage?.("reading");

  const run = async (): Promise<OptimizationResult> => {
    let bitmap: ImageBitmap;
    try {
      // Honor EXIF Orientation so phone photos aren't sideways after canvas encode.
      bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      throw new Error("DEVICE_LIMIT");
    }

    try {
      const original = metadataFromFile(file, bitmap.width, bitmap.height);
      onStage?.("optimizing");

      const { blob, width, height } = await optimizeBitmap(bitmap);

      return {
        original,
        optimized: {
          name: OPTIMIZED_FILENAME,
          type: "image/jpeg",
          size: blob.size,
          width,
          height,
          aspectRatio: width / height,
        },
        originalUrl: URL.createObjectURL(file),
        optimizedUrl: URL.createObjectURL(blob),
        optimizedBlob: blob,
      };
    } finally {
      bitmap.close();
    }
  };

  try {
    return await withTimeout(run(), PROCESS_TIMEOUT_MS);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (
      message === "DEVICE_LIMIT" ||
      /memory|canvas|allocation|quota/i.test(message)
    ) {
      throw new Error("DEVICE_LIMIT");
    }
    throw error;
  }
}

export function revokeResultUrls(result: OptimizationResult | null) {
  if (!result) return;
  URL.revokeObjectURL(result.originalUrl);
  URL.revokeObjectURL(result.optimizedUrl);
}
