import { describe, expect, it } from "vitest";

import { OPTIMIZED_FILENAME } from "@/lib/image/constants";

describe("download filename", () => {
  it("uses the suggested WhatsApp Status filename", () => {
    expect(OPTIMIZED_FILENAME).toBe("whatsapp-status-optimized.jpg");
  });
});
