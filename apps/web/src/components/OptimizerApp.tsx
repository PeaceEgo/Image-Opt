"use client";

import { useEffect, useState } from "react";

import { ImageMetadataDisplay } from "@/components/image/ImageMetadata";
import { ImagePreview } from "@/components/image/ImagePreview";
import { OptimizationProgress } from "@/components/optimizer/OptimizationProgress";
import { OptimizationResultView } from "@/components/optimizer/OptimizationResult";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/upload/ImageUploader";
import { getUserFacingError } from "@/lib/image/errors";
import { processImage, revokeResultUrls } from "@/lib/image/optimize";
import type { AppStatus, OptimizationResult } from "@/types/image";

export function OptimizerApp() {
  const [status, setStatus] = useState<AppStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      revokeResultUrls(result);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // Unmount-only cleanup; result/previewUrl are captured from the last render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clearMedia() {
    revokeResultUrls(result);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setResult(null);
    setPreviewUrl(null);
  }

  function reset() {
    clearMedia();
    setError(null);
    setStatus("idle");
  }

  async function handleFile(file: File) {
    clearMedia();
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setError(null);
    setStatus("reading");

    try {
      const next = await processImage(file, (stage) => setStatus(stage));
      URL.revokeObjectURL(url);
      setPreviewUrl(null);
      setResult(next);
      setStatus("complete");
    } catch (caught) {
      URL.revokeObjectURL(url);
      setPreviewUrl(null);
      setError(getUserFacingError(caught));
      setStatus("error");
    }
  }

  const busy = status === "reading" || status === "optimizing";

  return (
    <div className="flex min-h-full flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-surface focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <header className="px-5 py-5 sm:px-8">
        <p className="text-sm font-medium tracking-wide text-foreground">
          Status Optimize
        </p>
      </header>

      <main
        id="main"
        className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pb-16 sm:px-8"
      >
        {status === "idle" ? (
          <section className="flex flex-1 flex-col justify-center py-8 sm:py-16">
            <h1 className="max-w-xl font-display text-[2.35rem] leading-[1.1] text-foreground sm:text-6xl">
              Your photos deserve better.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted sm:text-xl">
              Optimize your photos for WhatsApp Status and keep them looking
              sharp.
            </p>
            <div className="mt-10">
              <ImageUploader
                onFile={handleFile}
                onError={(message) => setError(message)}
              />
            </div>
            {error ? (
              <p className="mt-4 text-center text-sm text-accent" role="alert">
                {error}
              </p>
            ) : (
              <p className="mt-6 text-center text-sm text-muted">
                No uploads. No accounts. Just optimize and download.
              </p>
            )}
          </section>
        ) : null}

        {busy ? (
          <section className="py-8 sm:py-12">
            <OptimizationProgress
              stage={status === "optimizing" ? "optimizing" : "reading"}
            />
            {previewUrl ? (
              <div className="mt-8 space-y-4">
                <ImagePreview src={previewUrl} alt="Photo being optimized" />
              </div>
            ) : null}
          </section>
        ) : null}

        {status === "complete" && result ? (
          <section className="py-6 sm:py-10">
            <div className="mb-6">
              <ImageMetadataDisplay image={result.original} />
            </div>
            <OptimizationResultView result={result} onReset={reset} />
          </section>
        ) : null}

        {status === "error" ? (
          <section className="flex flex-1 flex-col items-center justify-center py-16 text-center">
            <h2 className="font-display text-3xl text-foreground">
              We couldn&apos;t optimize this image.
            </h2>
            <p className="mt-4 max-w-sm text-muted" role="alert">
              {error ?? "Please try another photo."}
            </p>
            <Button className="mt-8" onClick={reset}>
              Try another photo
            </Button>
          </section>
        ) : null}
      </main>

      <footer className="px-5 py-6 text-center text-xs leading-relaxed text-muted sm:px-8">
        Your photos stay on your device. We prepare them for a better result
        after WhatsApp processes them — we cannot prevent WhatsApp compression.
      </footer>
    </div>
  );
}
