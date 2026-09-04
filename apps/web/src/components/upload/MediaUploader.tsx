"use client";

import { useId, useState } from "react";

import { ACCEPTED_MIME_TYPES, ACCEPTED_EXTENSIONS } from "@/lib/image/constants";
import { validateImageFile } from "@/lib/image/validate";
import {
  ACCEPTED_VIDEO_EXTENSIONS,
  ACCEPTED_VIDEO_MIME_TYPES,
} from "@/lib/video/constants";
import { isLikelyVideoFile, validateVideoFile } from "@/lib/video/validate";
import { cn } from "@/lib/utils";

const MEDIA_ACCEPT = [
  ...ACCEPTED_MIME_TYPES,
  ...ACCEPTED_EXTENSIONS,
  ...ACCEPTED_VIDEO_MIME_TYPES,
  ...ACCEPTED_VIDEO_EXTENSIONS,
].join(",");

type MediaUploaderProps = {
  disabled?: boolean;
  onImage: (file: File) => void;
  onVideo: (file: File) => void;
  onError: (message: string) => void;
};

export function MediaUploader({
  disabled,
  onImage,
  onVideo,
  onError,
}: MediaUploaderProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  function handleFile(file: File) {
    if (isLikelyVideoFile(file)) {
      const result = validateVideoFile(file);
      if (!result.ok) {
        onError(result.message);
        return;
      }
      onVideo(file);
      return;
    }

    const result = validateImageFile(file);
    if (!result.ok) {
      // If MIME looks like neither, give a combined hint when type is empty/odd.
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        onError("Please upload a JPG, PNG, WebP photo or an MP4/MOV video.");
        return;
      }
      onError(result.message);
      return;
    }
    onImage(file);
  }

  function takeFile(fileList: FileList | null) {
    const file = fileList?.[0];
    if (file) handleFile(file);
  }

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed px-6 py-10 text-center transition-colors",
        isDragging
          ? "border-accent bg-cream"
          : "border-border bg-surface hover:border-accent/50 hover:bg-cream/80",
        disabled && "pointer-events-none opacity-60",
      )}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        takeFile(event.dataTransfer.files);
      }}
    >
      <input
        id={inputId}
        type="file"
        className="sr-only"
        accept={MEDIA_ACCEPT}
        disabled={disabled}
        onChange={(event) => {
          takeFile(event.target.files);
          event.target.value = "";
        }}
      />
      <span className="inline-flex h-14 items-center rounded-full bg-accent px-7 text-base font-medium text-accent-foreground shadow-sm">
        Upload photo or video
      </span>
      <p className="mt-5 text-base text-muted">Drag & drop your file here</p>
      <p className="mt-2 text-sm tracking-wide text-muted/80">
        JPG · PNG · WebP · MP4 · MOV
      </p>
    </label>
  );
}
