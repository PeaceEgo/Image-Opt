"use client";

import { useState } from "react";

import {
  formatDimensions,
  formatFileSize,
  formatSizeReduction,
} from "@/lib/image/format";
import type { OptimizationResult } from "@/types/image";

type ImageComparisonProps = {
  result: OptimizationResult;
};

export function ImageComparison({ result }: ImageComparisonProps) {
  const [position, setPosition] = useState(50);
  const { width, height } = result.original;
  const aspect = width / height;
  const reduction = formatSizeReduction(
    result.original.size,
    result.optimized.size,
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-3">
        <StatCard
          label="Original"
          dimensions={formatDimensions(
            result.original.width,
            result.original.height,
          )}
          size={formatFileSize(result.original.size)}
        />
        <p className="hidden text-center text-muted sm:block" aria-hidden="true">
          ↓
        </p>
        <StatCard
          label="WhatsApp HD"
          dimensions={formatDimensions(
            result.optimized.width,
            result.optimized.height,
          )}
          size={formatFileSize(result.optimized.size)}
          accent={reduction}
        />
      </div>

      {reduction ? (
        <p className="text-center text-sm font-medium text-foreground sm:hidden">
          {reduction}
        </p>
      ) : null}

      <div
        role="group"
        aria-label="Original and WhatsApp HD comparison"
        className="relative overflow-hidden rounded-3xl bg-cream"
      >
        <div
          className="relative mx-auto max-w-full"
          style={{
            aspectRatio: `${width} / ${height}`,
            width: `min(100%, calc(min(70vh, 720px) * ${aspect}))`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.optimizedUrl}
            alt={`WhatsApp HD photo, ${formatDimensions(result.optimized.width, result.optimized.height)}`}
            className="absolute inset-0 h-full w-full object-contain"
          />
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
            WhatsApp HD
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
            aria-label="Compare original and WhatsApp HD"
            aria-valuetext={`${position}% original, ${100 - position}% WhatsApp HD`}
            className="absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  dimensions,
  size,
  accent,
}: {
  label: string;
  dimensions: string;
  size: string;
  accent?: string | null;
}) {
  return (
    <div className="rounded-3xl bg-surface px-5 py-4 text-center">
      <p className="text-xs font-medium tracking-wide text-muted uppercase">
        {label}
      </p>
      <p className="mt-2 text-lg font-medium text-foreground">{dimensions}</p>
      <p className="mt-1 text-sm text-muted">{size}</p>
      {accent ? (
        <p className="mt-2 text-sm font-medium text-accent">{accent}</p>
      ) : null}
    </div>
  );
}
