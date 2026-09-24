"use client";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { downloadOptimizedMedia } from "@/lib/image/download";
import {
  formatFileSize,
  formatSizeReduction,
} from "@/lib/image/format";
import { SHARE_UNSUPPORTED_VIDEO_MESSAGE } from "@/lib/image/share";
import { useAutoShare } from "@/lib/image/useAutoShare";
import { OPTIMIZED_VIDEO_FILENAME } from "@/lib/video/constants";
import type { VideoOptimizationResult } from "@/types/video";

type VideoResultViewProps = {
  result: VideoOptimizationResult;
  onReset: () => void;
};

export function VideoResultView({ result, onReset }: VideoResultViewProps) {
  const { shareReady, sharing, shareMessage, share } = useAutoShare({
    blob: result.optimizedBlob,
    filename: OPTIMIZED_VIDEO_FILENAME,
    unsupportedMessage: SHARE_UNSUPPORTED_VIDEO_MESSAGE,
  });

  const reduction = formatSizeReduction(
    result.original.size,
    result.optimized.size,
  );

  function handleDownload() {
    trackEvent("download");
    downloadOptimizedMedia(result.optimizedUrl, OPTIMIZED_VIDEO_FILENAME);
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-sm font-medium tracking-wide text-accent">Complete</p>
        <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
          Your video is WhatsApp-ready
        </h2>
        {shareReady ? (
          <p className="mt-3 text-sm text-muted">
            {sharing
              ? "Opening share…"
              : "Share sheet opens automatically when your browser allows it."}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-surface px-5 py-5 text-center">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">
            Original
          </p>
          <p className="mt-2 text-2xl font-medium text-foreground">
            {formatFileSize(result.original.size)}
          </p>
        </div>
        <div className="rounded-3xl bg-surface px-5 py-5 text-center">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">
            Optimized
          </p>
          <p className="mt-2 text-2xl font-medium text-foreground">
            {formatFileSize(result.optimized.size)}
          </p>
          {reduction ? (
            <p className="mt-2 text-sm font-medium text-accent">{reduction}</p>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-cream">
        <video
          src={result.optimizedUrl}
          controls
          playsInline
          className="mx-auto max-h-[min(50vh,420px)] w-full bg-black object-contain"
        />
      </div>

      <div className="flex w-full flex-col items-stretch gap-3 sm:items-center">
        {shareReady ? (
          <Button
            size="lg"
            className="w-full sm:w-auto sm:min-w-[16rem]"
            disabled={sharing}
            onClick={() => void share()}
          >
            {sharing ? "Opening share…" : "Share to WhatsApp"}
          </Button>
        ) : null}

        <Button
          size="lg"
          variant={shareReady ? "secondary" : "default"}
          className="w-full sm:w-auto sm:min-w-[16rem]"
          onClick={handleDownload}
        >
          Download video
        </Button>

        {!shareReady ? (
          <p
            className="max-w-sm self-center text-center text-sm text-muted"
            role="status"
          >
            {SHARE_UNSUPPORTED_VIDEO_MESSAGE}
          </p>
        ) : null}

        {shareMessage ? (
          <p
            className="max-w-sm self-center text-center text-sm text-accent"
            role="status"
          >
            {shareMessage}
          </p>
        ) : null}

        <Button variant="ghost" className="w-full sm:w-auto" onClick={onReset}>
          Try another file
        </Button>
      </div>
    </div>
  );
}
