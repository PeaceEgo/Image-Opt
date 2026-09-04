import { describe, expect, it } from "vitest";

import {
  MAX_VIDEO_FILE_SIZE_BYTES,
  STATUS_MAX_DURATION_SEC,
} from "@/lib/video/constants";
import { getVideoUserFacingError } from "@/lib/video/errors";
import {
  buildVideoEncodeArgs,
  ffmpegLogsIndicateAudio,
} from "@/lib/video/optimize";
import { getVideoTargetSize } from "@/lib/video/target";
import { isLikelyVideoFile, validateVideoFile } from "@/lib/video/validate";

describe("validateVideoFile", () => {
  it("accepts mp4 and mov", () => {
    expect(
      validateVideoFile({ name: "a.mp4", type: "video/mp4", size: 1000 }).ok,
    ).toBe(true);
    expect(
      validateVideoFile({
        name: "a.mov",
        type: "video/quicktime",
        size: 1000,
      }).ok,
    ).toBe(true);
  });

  it("rejects unsupported types with friendly copy", () => {
    const result = validateVideoFile({
      name: "a.avi",
      type: "video/x-msvideo",
      size: 1000,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("Please upload an MP4 or MOV video.");
    }
  });

  it("rejects oversized files before processing", () => {
    const result = validateVideoFile({
      name: "huge.mp4",
      type: "video/mp4",
      size: MAX_VIDEO_FILE_SIZE_BYTES + 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("too large");
    }
  });
});

describe("isLikelyVideoFile", () => {
  it("detects video by mime or extension", () => {
    expect(isLikelyVideoFile({ name: "x.mp4", type: "", size: 1 })).toBe(true);
    expect(
      isLikelyVideoFile({ name: "x.jpg", type: "image/jpeg", size: 1 }),
    ).toBe(false);
  });
});

describe("getVideoTargetSize", () => {
  it("fits portrait into 1080×1920 without upscaling", () => {
    expect(getVideoTargetSize(1440, 2560)).toEqual({
      width: 1080,
      height: 1920,
      orientation: "portrait",
    });
    expect(getVideoTargetSize(720, 1280)).toEqual({
      width: 720,
      height: 1280,
      orientation: "portrait",
    });
  });

  it("fits landscape into 1920×1080", () => {
    expect(getVideoTargetSize(3840, 2160)).toEqual({
      width: 1920,
      height: 1080,
      orientation: "landscape",
    });
    expect(getVideoTargetSize(1920, 1080)).toEqual({
      width: 1920,
      height: 1080,
      orientation: "landscape",
    });
  });

  it("uses even dimensions for H.264", () => {
    const size = getVideoTargetSize(1001, 1501);
    expect(size.width % 2).toBe(0);
    expect(size.height % 2).toBe(0);
  });
});

describe("STATUS_MAX_DURATION_SEC", () => {
  it("is 60 seconds for WhatsApp Status", () => {
    expect(STATUS_MAX_DURATION_SEC).toBe(60);
  });
});

describe("getVideoUserFacingError", () => {
  it("maps device failures to a short-clip hint", () => {
    expect(getVideoUserFacingError(new Error("DEVICE_LIMIT"))).toBe(
      "We couldn’t prepare this video. Try a shorter clip.",
    );
  });
});

describe("ffmpegLogsIndicateAudio", () => {
  it("detects audio streams from probe logs", () => {
    expect(
      ffmpegLogsIndicateAudio([
        "Stream #0:0(und): Video: h264",
        "Stream #0:1(und): Audio: aac, 44100 Hz",
      ]),
    ).toBe(true);
    expect(
      ffmpegLogsIndicateAudio(["Stream #0:0(und): Video: h264 (High)"]),
    ).toBe(false);
  });
});

describe("buildVideoEncodeArgs", () => {
  it("includes AAC when audio is present", () => {
    const args = buildVideoEncodeArgs({
      inputName: "in.mp4",
      outputName: "out.mp4",
      start: 0,
      duration: 10,
      width: 1080,
      height: 1920,
      hasAudio: true,
    });
    expect(args).toContain("-c:a");
    expect(args).toContain("aac");
    expect(args).not.toContain("-an");
  });

  it("uses -an when audio is absent", () => {
    const args = buildVideoEncodeArgs({
      inputName: "in.mp4",
      outputName: "out.mp4",
      start: 0,
      duration: 10,
      width: 1080,
      height: 1920,
      hasAudio: false,
    });
    expect(args).toContain("-an");
    expect(args).not.toContain("-c:a");
  });
});
