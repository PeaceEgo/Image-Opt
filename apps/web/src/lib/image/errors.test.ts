import { describe, expect, it } from "vitest";

import { getUserFacingError } from "@/lib/image/errors";

describe("getUserFacingError", () => {
  it("explains device limits", () => {
    expect(getUserFacingError(new Error("DEVICE_LIMIT"))).toBe(
      "This image is too large to process on this device. Please choose a smaller image.",
    );
  });

  it("uses a friendly fallback", () => {
    expect(getUserFacingError(new Error("boom"))).toBe(
      "We couldn't optimize this image. Please try another photo.",
    );
  });
});
