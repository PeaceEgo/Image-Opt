import { describe, expect, it } from "vitest";

import {
  formatAspectRatio,
  formatFileSize,
  formatSizeReduction,
  getImageOrientation,
  getSizeReductionPercent,
  getTargetSize,
} from "@/lib/image/format";
import { validateImageFile } from "@/lib/image/validate";
import { MAX_FILE_SIZE_BYTES, OPTIMIZED_FILENAME } from "@/lib/image/constants";

describe("getTargetSize", () => {
  it("fits a 3:4 portrait into 1080×1440", () => {
    expect(getTargetSize(3024, 4032)).toEqual({
      width: 1080,
      height: 1440,
      orientation: "portrait",
    });
  });

  it("uses a landscape Status box without cropping", () => {
    expect(getTargetSize(4032, 3024)).toEqual({
      width: 1440,
      height: 1080,
      orientation: "landscape",
    });
  });

  it("caps a square image at 1080", () => {
    expect(getTargetSize(4000, 4000)).toEqual({
      width: 1080,
      height: 1080,
      orientation: "square",
    });
  });

  it("does not upscale smaller images", () => {
    expect(getTargetSize(800, 1200)).toEqual({
      width: 800,
      height: 1200,
      orientation: "portrait",
    });
  });

  it("leaves an already-fitting 9:16 image unchanged", () => {
    expect(getTargetSize(1080, 1920)).toEqual({
      width: 1080,
      height: 1920,
      orientation: "portrait",
    });
  });
});

describe("getImageOrientation", () => {
  it("detects portrait, landscape, and square", () => {
    expect(getImageOrientation(1080, 1920)).toBe("portrait");
    expect(getImageOrientation(1920, 1080)).toBe("landscape");
    expect(getImageOrientation(1080, 1080)).toBe("square");
  });
});

describe("formatAspectRatio", () => {
  it("simplifies 3024×4032 to 3:4", () => {
    expect(formatAspectRatio(3024, 4032)).toBe("3:4");
  });
});

describe("formatFileSize", () => {
  it("formats megabytes to one decimal", () => {
    expect(formatFileSize(5 * 1024 * 1024)).toBe("5.0 MB");
  });
});

describe("size reduction", () => {
  it("calculates percent smaller from real byte sizes", () => {
    expect(getSizeReductionPercent(4_800_000, 1_200_000)).toBe(75);
    expect(formatSizeReduction(4_800_000, 1_200_000)).toBe("75% smaller");
  });

  it("returns null when the file is not smaller", () => {
    expect(getSizeReductionPercent(1000, 1000)).toBeNull();
    expect(formatSizeReduction(1000, 1200)).toBeNull();
  });
});

describe("validateImageFile", () => {
  it("accepts jpeg, png, and webp", () => {
    for (const file of [
      { name: "a.jpg", type: "image/jpeg", size: 1000 },
      { name: "a.png", type: "image/png", size: 1000 },
      { name: "a.webp", type: "image/webp", size: 1000 },
    ]) {
      expect(validateImageFile(file).ok).toBe(true);
    }
  });

  it("rejects gif and other types", () => {
    const result = validateImageFile({
      name: "a.gif",
      type: "image/gif",
      size: 1000,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("Please upload a JPG, PNG, or WebP image.");
    }
  });

  it("rejects oversized files", () => {
    const result = validateImageFile({
      name: "huge.jpg",
      type: "image/jpeg",
      size: MAX_FILE_SIZE_BYTES + 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("FILE_TOO_LARGE");
    }
  });
});

describe("download filename", () => {
  it("uses the WhatsApp HD filename", () => {
    expect(OPTIMIZED_FILENAME).toBe("whatsapp-status-hd.jpg");
  });
});
