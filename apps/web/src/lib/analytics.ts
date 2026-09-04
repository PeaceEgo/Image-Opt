import { track } from "@vercel/analytics";

/** Lightweight product events — visitor totals live in the Vercel Analytics dashboard. */
export function trackEvent(
  name: "hd_optimize" | "video_optimize" | "share_whatsapp" | "download",
) {
  try {
    track(name);
  } catch {
    // Analytics must never break the product flow.
  }
}
