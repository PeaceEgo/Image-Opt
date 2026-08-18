import { describe, expect, it } from "vitest";

import { OPTIMIZED_FILENAME } from "@/lib/image/constants";

describe("download filename", () => {
  it("uses the WhatsApp HD filename", () => {
    expect(OPTIMIZED_FILENAME).toBe("whatsapp-status-hd.jpg");
  });
});
