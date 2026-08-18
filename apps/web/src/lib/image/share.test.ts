import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import {
  SHARE_UNSUPPORTED_MESSAGE,
  canShareFiles,
  canUseWebShare,
  createOptimizedFile,
  shareOptimizedImage,
} from "@/lib/image/share";

describe("share helpers", () => {
  const originalNavigator = globalThis.navigator;

  afterEach(() => {
    Object.defineProperty(globalThis, "navigator", {
      value: originalNavigator,
      configurable: true,
    });
  });

  it("reports when Web Share is missing", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: {},
      configurable: true,
    });
    expect(canUseWebShare()).toBe(false);
  });

  it("creates a JPEG file for sharing", () => {
    const blob = new Blob(["abc"], { type: "image/jpeg" });
    const file = createOptimizedFile(blob);
    expect(file.name).toBe("whatsapp-status-hd.jpg");
    expect(file.type).toBe("image/jpeg");
  });

  it("returns unsupported when share is unavailable", async () => {
    Object.defineProperty(globalThis, "navigator", {
      value: {},
      configurable: true,
    });
    const blob = new Blob(["abc"], { type: "image/jpeg" });
    await expect(shareOptimizedImage(blob)).resolves.toBe("unsupported");
  });

  it("treats AbortError as cancelled", async () => {
    const share = vi.fn().mockRejectedValue(new DOMException("Nope", "AbortError"));
    Object.defineProperty(globalThis, "navigator", {
      value: {
        share,
        canShare: () => true,
      },
      configurable: true,
    });
    const blob = new Blob(["abc"], { type: "image/jpeg" });
    await expect(shareOptimizedImage(blob)).resolves.toBe("cancelled");
  });

  it("exposes a friendly unsupported message", () => {
    expect(SHARE_UNSUPPORTED_MESSAGE).toContain("Download");
  });
});

describe("canShareFiles", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "navigator", {
      value: {
        share: vi.fn(),
        canShare: ({ files }: { files?: File[] }) => Boolean(files?.length),
      },
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "navigator", {
      value: globalThis.navigator,
      configurable: true,
    });
  });

  it("detects file sharing support", () => {
    const file = createOptimizedFile(new Blob(["x"], { type: "image/jpeg" }));
    expect(canShareFiles(file)).toBe(true);
  });
});
