"use client";

import { useState } from "react";

import {
  formatDimensions,
  formatFileSize,
} from "@/lib/image/format";
import type { OptimizationResult } from "@/types/image";

type ImageComparisonProps = {
  result: OptimizationResult;
};

function savingsLabel(originalBytes: number, optimizedBytes: number): string {
  if (optimizedBytes <= 0 || originalBytes <= optimizedBytes) {
    return "Smaller file for Status";
  }
  const ratio = originalBytes / optimizedBytes;
  if (ratio >= 10) {
    return `${Math.round(ratio)}× smaller file`;
  }
  return `${ratio.toFixed(1)}× smaller file`;
}

export function ImageComparison({ result }: ImageComparisonProps) {
  const [position, setPosition] = useState(50);
  const { width, height } = result.original;
  const aspect = width / height;
  const savings = savingsLabel(result.original.size, result.optimized.size);

  return (
    <div className="space-y-5">
      <p className="text-center text-sm text-muted">
        At this size they look almost the same — that&apos;s intentional. The win
        is fewer pixels and a much smaller file for WhatsApp Status.
      </p>

      <div
        role="group"
        aria-label="Original and optimized comparison"
        className="relative overflow-hidden rounded-3xl bg-cream"
      >
        <div
          className="relative mx-auto max-w-full"
          style={{
            aspectRatio: `${width} / ${height}`,
            width: `min(100%, calc(min(70vh, 720px) * ${aspect}))`,
          }}
        >
          {/* Bottom: optimized (revealed on the right) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.optimizedUrl}
            alt={`Optimized photo, ${formatDimensions(result.optimized.width, result.optimized.height)}`}
            className="absolute inset-0 h-full w-full object-contain"
          />
          {/* Top: original, clipped from the right so left = original */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.originalUrl}
              alt={`Original photo, ${formatDimensions(width, height)}`}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-px bg-white/90 shadow-sm"
            style={{ left: `${position}%` }}
          />
          <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs font-medium tracking-wide text-white">
            Original
          </div>
          <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs font-medium tracking-wide text-white">
            Optimized
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
            aria-label="Compare original and optimized"
            aria-valuetext={`${position}% original, ${100 - position}% optimized`}
            className="absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>
      </div>

      <div className="space-y-1 text-center">
        <p className="text-base font-medium text-foreground">{savings}</p>
        <p className="text-sm text-muted">
          {formatFileSize(result.original.size)}
          <span className="mx-2 text-border">→</span>
          {formatFileSize(result.optimized.size)}
        </p>
        <p className="text-sm text-muted">
          {formatDimensions(result.original.width, result.original.height)}
          <span className="mx-2 text-border">→</span>
          {formatDimensions(result.optimized.width, result.optimized.height)}
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-center text-sm font-medium text-foreground">
          Zoomed detail (same spot, 1:1 pixels)
        </p>
        <div className="grid grid-cols-2 gap-3">
          <DetailCrop
            src={result.originalUrl}
            label="Original"
            caption={formatDimensions(result.original.width, result.original.height)}
          />
          <DetailCrop
            src={result.optimizedUrl}
            label="Optimized"
            caption={formatDimensions(result.optimized.width, result.optimized.height)}
          />
        </div>
        <p className="text-center text-xs text-muted">
          Zoomed into the center so the resolution drop is easier to see.
        </p>
      </div>
    </div>
  );
}

function DetailCrop({
  src,
  label,
  caption,
}: {
  src: string;
  label: string;
  caption: string;
}) {
  return (
    <figure className="overflow-hidden rounded-2xl bg-cream">
      <div className="relative aspect-square overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="h-full w-full scale-[2.75] object-cover"
        />
        <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/45 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-white">
          {label}
        </span>
      </div>
      <figcaption className="px-2 py-2 text-center text-xs text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
