"use client";

import { useId, useState } from "react";

import { FILE_INPUT_ACCEPT } from "@/lib/image/constants";
import { cn } from "@/lib/utils";

type UploadDropzoneProps = {
  disabled?: boolean;
  onFile: (file: File) => void;
};

export function UploadDropzone({ disabled, onFile }: UploadDropzoneProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  function takeFile(fileList: FileList | null) {
    const file = fileList?.[0];
    if (file) onFile(file);
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
        accept={FILE_INPUT_ACCEPT}
        disabled={disabled}
        onChange={(event) => {
          takeFile(event.target.files);
          event.target.value = "";
        }}
      />
      <span className="inline-flex h-14 items-center rounded-full bg-accent px-7 text-base font-medium text-accent-foreground shadow-sm">
        Upload a photo
      </span>
      <p className="mt-5 text-base text-muted">Drag & drop your image here</p>
      <p className="mt-2 text-sm tracking-wide text-muted/80">JPG · PNG · WebP</p>
    </label>
  );
}
