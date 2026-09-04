"use client";

import { useId, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { STATUS_MAX_DURATION_SEC } from "@/lib/video/constants";
import type { VideoProbe } from "@/lib/video/probe";
import type { VideoTrimRange } from "@/types/video";

type VideoTrimStepProps = {
  previewUrl: string;
  probe: VideoProbe;
  onConfirm: (trim: VideoTrimRange) => void;
  onCancel: () => void;
};

function formatClock(seconds: number): string {
  const safe = Math.max(0, seconds);
  const m = Math.floor(safe / 60);
  const s = Math.floor(safe % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function defaultEnd(duration: number): number {
  return Math.min(duration, STATUS_MAX_DURATION_SEC);
}

export function VideoTrimStep({
  previewUrl,
  probe,
  onConfirm,
  onCancel,
}: VideoTrimStepProps) {
  const startId = useId();
  const endId = useId();
  const maxEnd = defaultEnd(probe.duration);
  const clampedNotice = probe.duration > STATUS_MAX_DURATION_SEC;

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(() => defaultEnd(probe.duration));

  const trimLength = Math.max(0, end - start);
  const canConfirm = trimLength >= 0.5;

  const durationLabel = useMemo(
    () => formatClock(probe.duration),
    [probe.duration],
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm font-medium tracking-wide text-accent">Video</p>
        <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
          Choose your clip
        </h2>
        <p className="mt-3 text-sm text-muted">
          Duration {durationLabel}
          {probe.width && probe.height
            ? ` · ${probe.width} × ${probe.height}`
            : null}
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl bg-cream">
        <video
          src={previewUrl}
          controls
          playsInline
          className="mx-auto max-h-[min(50vh,420px)] w-full bg-black object-contain"
        />
      </div>

      {clampedNotice ? (
        <p className="text-center text-sm text-muted" role="status">
          WhatsApp Status supports videos up to 60 seconds.
        </p>
      ) : null}

      <div className="space-y-4 rounded-3xl bg-surface px-5 py-5">
        <div className="space-y-2">
          <label htmlFor={startId} className="flex justify-between text-sm">
            <span className="text-muted">Start</span>
            <span className="font-medium text-foreground">{formatClock(start)}</span>
          </label>
          <input
            id={startId}
            type="range"
            min={0}
            max={Math.max(0, end - 0.5)}
            step={0.1}
            value={start}
            onChange={(event) => setStart(Number(event.target.value))}
            className="w-full accent-[var(--accent)]"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor={endId} className="flex justify-between text-sm">
            <span className="text-muted">End</span>
            <span className="font-medium text-foreground">{formatClock(end)}</span>
          </label>
          <input
            id={endId}
            type="range"
            min={Math.min(start + 0.5, maxEnd)}
            max={maxEnd}
            step={0.1}
            value={end}
            onChange={(event) => setEnd(Number(event.target.value))}
            className="w-full accent-[var(--accent)]"
          />
        </div>
        <p className="text-center text-sm text-muted">
          Clip length: {formatClock(trimLength)}
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-3 sm:items-center">
        <Button
          size="lg"
          className="w-full sm:w-auto sm:min-w-[16rem]"
          disabled={!canConfirm}
          onClick={() => onConfirm({ start, end })}
        >
          Make WhatsApp-ready
        </Button>
        <Button variant="ghost" className="w-full sm:w-auto" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
