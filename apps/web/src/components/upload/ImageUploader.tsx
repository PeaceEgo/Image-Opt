"use client";

import { UploadDropzone } from "@/components/upload/UploadDropzone";
import { validateImageFile } from "@/lib/image/validate";

type ImageUploaderProps = {
  disabled?: boolean;
  onFile: (file: File) => void;
  onError: (message: string) => void;
};

export function ImageUploader({ disabled, onFile, onError }: ImageUploaderProps) {
  function handleFile(file: File) {
    const result = validateImageFile(file);
    if (!result.ok) {
      onError(result.message);
      return;
    }
    onFile(file);
  }

  return <UploadDropzone disabled={disabled} onFile={handleFile} />;
}
