"use client";

import { useEffect, useState } from "react";

import { ImagePreview } from "@/components/image/ImagePreview";
import { OptimizationProgress } from "@/components/optimizer/OptimizationProgress";
import { OptimizationResultView } from "@/components/optimizer/OptimizationResult";
import { Button } from "@/components/ui/button";
import { MediaUploader } from "@/components/upload/MediaUploader";
import {
  VideoProgressView,
  videoProgressLabel,
} from "@/components/video/VideoProgressView";
import { VideoResultView } from "@/components/video/VideoResultView";
import { VideoTrimStep } from "@/components/video/VideoTrimStep";
import { trackEvent } from "@/lib/analytics";
import { getUserFacingError } from "@/lib/image/errors";
import { processImage, revokeResultUrls } from "@/lib/image/optimize";
import { getVideoUserFacingError } from "@/lib/video/errors";
import {
  processVideo,
  revokeVideoResultUrls,
} from "@/lib/video/optimize";
import { probeVideo, type VideoProbe } from "@/lib/video/probe";
import type { AppStatus, OptimizationResult } from "@/types/image";
import type {
  VideoOptimizationResult,
  VideoProgress,
  VideoTrimRange,
} from "@/types/video";

type MediaKind = "image" | "video";

export function OptimizerApp() {
  const [status, setStatus] = useState<AppStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [mediaKind, setMediaKind] = useState<MediaKind | null>(null);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [videoResult, setVideoResult] = useState<VideoOptimizationResult | null>(
    null,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoProbe, setVideoProbe] = useState<VideoProbe | null>(null);
  const [videoProgress, setVideoProgress] = useState<VideoProgress | null>(null);

  useEffect(() => {
    return () => {
      revokeResultUrls(result);
      revokeVideoResultUrls(videoResult);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // Unmount-only cleanup; captures from the last render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clearMedia() {
    revokeResultUrls(result);
    revokeVideoResultUrls(videoResult);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setResult(null);
    setVideoResult(null);
    setPreviewUrl(null);
    setVideoFile(null);
    setVideoProbe(null);
    setVideoProgress(null);
    setMediaKind(null);
  }

  function reset() {
    clearMedia();
    setError(null);
    setStatus("idle");
  }

  async function handleImage(file: File) {
    clearMedia();
    setMediaKind("image");
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
      trackEvent("hd_optimize");
    } catch (caught) {
      URL.revokeObjectURL(url);
      setPreviewUrl(null);
      setError(getUserFacingError(caught));
      setStatus("error");
    }
  }

  async function handleVideo(file: File) {
    clearMedia();
    setMediaKind("video");
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setVideoFile(file);
    setError(null);
    setStatus("reading");

    try {
      const probe = await probeVideo(file);
      setVideoProbe(probe);
      setStatus("video_trim");
    } catch {
      URL.revokeObjectURL(url);
      setPreviewUrl(null);
      setVideoFile(null);
      setError(getVideoUserFacingError(new Error("PROBE_FAILED")));
      setStatus("error");
    }
  }

  async function handleVideoConfirm(trim: VideoTrimRange) {
    if (!videoFile || !videoProbe) return;

    setError(null);
    setStatus("optimizing");
    setVideoProgress({ phase: "loading_tools", percent: 0 });

    try {
      const next = await processVideo(
        videoFile,
        trim,
        videoProbe,
        (progress) => setVideoProgress(progress),
      );
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setVideoFile(null);
      setVideoProbe(null);
      setVideoResult(next);
      setVideoProgress(null);
      setStatus("complete");
      trackEvent("video_optimize");
    } catch (caught) {
      setVideoProgress(null);
      setError(getVideoUserFacingError(caught));
      setStatus("error");
    }
  }

  const imageBusy =
    mediaKind === "image" && (status === "reading" || status === "optimizing");
  const videoBusy = mediaKind === "video" && status === "optimizing";

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
              Make your photos &amp; videos WhatsApp-ready without sacrificing
              unnecessary quality.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted sm:text-xl">
              Prepare Status media on your device, then share it straight to
              WhatsApp.
            </p>
            <div className="mt-10">
              <MediaUploader
                onImage={handleImage}
                onVideo={handleVideo}
                onError={(message) => setError(message)}
              />
            </div>
            {error ? (
              <p className="mt-4 text-center text-sm text-accent" role="alert">
                {error}
              </p>
            ) : (
              <p className="mt-6 text-center text-sm text-muted">
                No uploads. No accounts. Your media stays on your device.
              </p>
            )}
          </section>
        ) : null}

        {status === "reading" && mediaKind === "video" ? (
          <section className="py-8 sm:py-12">
            <OptimizationProgress stage="reading" label="Reading your video…" />
          </section>
        ) : null}

        {status === "video_trim" && previewUrl && videoProbe ? (
          <section className="py-6 sm:py-10">
            <VideoTrimStep
              key={`${previewUrl}-${videoProbe.duration}`}
              previewUrl={previewUrl}
              probe={videoProbe}
              onConfirm={handleVideoConfirm}
              onCancel={reset}
            />
          </section>
        ) : null}

        {imageBusy ? (
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

        {videoBusy && videoProgress ? (
          <section className="py-8 sm:py-12">
            <VideoProgressView
              label={videoProgressLabel(
                videoProgress.phase,
                videoProgress.percent,
              )}
              percent={videoProgress.percent}
            />
          </section>
        ) : null}

        {status === "complete" && result && mediaKind === "image" ? (
          <section className="py-6 sm:py-10">
            <OptimizationResultView result={result} onReset={reset} />
          </section>
        ) : null}

        {status === "complete" && videoResult && mediaKind === "video" ? (
          <section className="py-6 sm:py-10">
            <VideoResultView result={videoResult} onReset={reset} />
          </section>
        ) : null}

        {status === "error" ? (
          <section className="flex flex-1 flex-col items-center justify-center py-16 text-center">
            <h2 className="font-display text-3xl text-foreground">
              {mediaKind === "video"
                ? "We couldn’t prepare this video."
                : "We couldn’t optimize this image."}
            </h2>
            <p className="mt-4 max-w-sm text-muted" role="alert">
              {error ??
                (mediaKind === "video"
                  ? "Please try another video."
                  : "Please try another photo.")}
            </p>
            <Button className="mt-8" onClick={reset}>
              Try again
            </Button>
          </section>
        ) : null}
      </main>

      <footer className="px-5 py-6 text-center text-xs leading-relaxed text-muted sm:px-8">
        Your media stays on your device. WhatsApp may still process your media —
        this tool prepares files for WhatsApp Status before you post them.
      </footer>
    </div>
  );
}
