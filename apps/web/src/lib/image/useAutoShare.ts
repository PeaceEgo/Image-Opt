"use client";

import { useEffect, useRef, useState } from "react";

import { trackEvent } from "@/lib/analytics";
import {
  canShareFiles,
  canUseWebShare,
  createOptimizedFile,
  shareOptimizedFile,
  type ShareOutcome,
} from "@/lib/image/share";

type UseAutoShareArgs = {
  blob: Blob;
  filename?: string;
  unsupportedMessage: string;
};

/**
 * Opens the native share sheet once when the result is ready (if supported).
 * Always keeps manual Share / Download available — never fakes success.
 */
export function useAutoShare({
  blob,
  filename,
  unsupportedMessage,
}: UseAutoShareArgs) {
  const [sharing, setSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const attemptedForBlob = useRef<Blob | null>(null);

  const file = createOptimizedFile(blob, filename);
  const shareReady = canUseWebShare() && canShareFiles(file);

  async function runShare(source: "auto" | "manual"): Promise<ShareOutcome> {
    setShareMessage(null);
    setSharing(true);
    try {
      const outcome = await shareOptimizedFile(blob, filename);
      if (outcome === "shared") {
        trackEvent("share_whatsapp");
        return outcome;
      }
      if (outcome === "cancelled") {
        return outcome;
      }
      // Auto-share often fails without a user gesture — keep UI quiet.
      if (source === "manual") {
        setShareMessage(unsupportedMessage);
      }
      return outcome;
    } finally {
      setSharing(false);
    }
  }

  useEffect(() => {
    if (!shareReady) return;
    if (attemptedForBlob.current === blob) return;
    attemptedForBlob.current = blob;

    void runShare("auto");
    // Intentionally once per optimized blob.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blob, shareReady]);

  return {
    shareReady,
    sharing,
    shareMessage,
    share: () => runShare("manual"),
  };
}
