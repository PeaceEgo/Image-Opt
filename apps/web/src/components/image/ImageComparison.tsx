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

export function ImageComparison({ result }: ImageComparisonProps) {
  const [position, setPosition] = useState(50);
  const optimizedReveal = 100 - position;
  const { width, height } = result.original;
  const aspect = width / height;

  return (
    <div className="space-y-5">
      <div
        role="group"
        aria-label="Original and optimized comparison"
        className="relative overflow-hidden rounded-3xl bg-cream"
      >
        {/* Shared frame so both layers share the same box even when pixel sizes differ. */}
        <div
          className="relative mx-auto max-w-full"
          style={{
            aspectRatio: `${width} / ${height}`,
            width: `min(100%, calc(min(70vh, 720px) * ${aspect}))`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.originalUrl}
            alt={`Original photo, ${formatDimensions(width, height)}`}
            className="absolute inset-0 h-full w-full object-contain"
          />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${optimizedReveal}% 0 0)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.optimizedUrl}
              alt={`Optimized photo, ${formatDimensions(result.optimized.width, result.optimized.height)}`}
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
            aria-label="Reveal optimized image"
            aria-valuetext={`${position}% of the original is visible`}
            className="absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>
      </div>

      <div className="space-y-1 text-center text-sm text-muted">
        <p>
          Original: {formatFileSize(result.original.size)}
          <span className="mx-2 text-border">·</span>
          Optimized: {formatFileSize(result.optimized.size)}
        </p>
        <p>
          Resolution: {formatDimensions(result.original.width, result.original.height)} →{" "}
          {formatDimensions(result.optimized.width, result.optimized.height)}
        </p>
      </div>
    </div>
  );
}
