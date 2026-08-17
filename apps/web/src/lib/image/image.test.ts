import { describe, expect, it } from "vitest";

import {
  formatAspectRatio,
  formatFileSize,
  getTargetSize,
} from "@/lib/image/format";
import { validateImageFile } from "@/lib/image/validate";
import { MAX_FILE_SIZE_BYTES } from "@/lib/image/constants";

describe("getTargetSize", () => {
  it("fits a 3:4 portrait into 1080×1440", () => {
    expect(getTargetSize(3024, 4032)).toEqual({ width: 1080, height: 1440 });
  });

  it("preserves landscape aspect ratio without cropping", () => {
    expect(getTargetSize(4032, 3024)).toEqual({ width: 1080, height: 810 });
  });

  it("caps a square image at 1080", () => {
    expect(getTargetSize(4000, 4000)).toEqual({ width: 1080, height: 1080 });
  });

  it("does not upscale smaller images", () => {
    expect(getTargetSize(800, 1200)).toEqual({ width: 800, height: 1200 });
  });

  it("leaves an already-fitting 9:16 image unchanged", () => {
    expect(getTargetSize(1080, 1920)).toEqual({ width: 1080, height: 1920 });
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
