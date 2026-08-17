import { describe, expect, it } from "vitest";

import { metadataFromFile } from "@/lib/image/analyze";

describe("metadataFromFile", () => {
  it("captures dimensions, size, and aspect ratio", () => {
    const meta = metadataFromFile(
      { name: "photo.jpg", type: "image/jpeg", size: 4_800_000 },
      3024,
      4032,
    );

    expect(meta.width).toBe(3024);
    expect(meta.height).toBe(4032);
    expect(meta.size).toBe(4_800_000);
    expect(meta.type).toBe("image/jpeg");
    expect(meta.aspectRatio).toBeCloseTo(0.75);
  });
});
