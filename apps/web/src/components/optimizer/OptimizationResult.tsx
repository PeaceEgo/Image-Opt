"use client";

import { useMemo, useState } from "react";

import { ImageComparison } from "@/components/image/ImageComparison";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { downloadOptimizedImage } from "@/lib/image/download";
import {
  SHARE_UNSUPPORTED_MESSAGE,
  canShareFiles,
  canUseWebShare,
  createOptimizedFile,
  shareOptimizedImage,
} from "@/lib/image/share";
import type { OptimizationResult } from "@/types/image";

type OptimizationResultProps = {
  result: OptimizationResult;
  onReset: () => void;
};

export function OptimizationResultView({ result, onReset }: OptimizationResultProps) {
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);

  const optimizedFile = useMemo(
    () => createOptimizedFile(result.optimizedBlob),
    [result.optimizedBlob],
  );
  const shareReady = canUseWebShare() && canShareFiles(optimizedFile);

  async function handleShare() {
    setShareMessage(null);
    setSharing(true);
    try {
      const outcome = await shareOptimizedImage(result.optimizedBlob);
      if (outcome === "shared") {
        trackEvent("share_whatsapp");
        return;
      }
      if (outcome === "cancelled") {
        return;
      }
      setShareMessage(SHARE_UNSUPPORTED_MESSAGE);
    } finally {
      setSharing(false);
    }
  }

  function handleDownload() {
    trackEvent("download");
    downloadOptimizedImage(result.optimizedUrl);
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-sm font-medium tracking-wide text-accent">Complete</p>
        <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
          Your image is ready for WhatsApp.
        </h2>
      </div>

      <ImageComparison result={result} />

      <div className="flex w-full flex-col items-stretch gap-3 sm:items-center">
        {shareReady ? (
          <Button
            size="lg"
            className="w-full sm:w-auto sm:min-w-[16rem]"
            disabled={sharing}
            onClick={handleShare}
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
          Download
        </Button>

        {!shareReady ? (
          <p className="max-w-sm text-center text-sm text-muted" role="status">
            {SHARE_UNSUPPORTED_MESSAGE}
          </p>
        ) : null}

        {shareMessage ? (
          <p className="max-w-sm text-center text-sm text-accent" role="status">
            {shareMessage}
          </p>
        ) : null}

        <Button variant="ghost" className="w-full sm:w-auto" onClick={onReset}>
          Try another photo
        </Button>
      </div>
    </div>
  );
}
