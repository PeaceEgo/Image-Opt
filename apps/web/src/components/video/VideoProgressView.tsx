"use client";

type VideoProgressViewProps = {
  label: string;
  percent: number;
};

export function VideoProgressView({ label, percent }: VideoProgressViewProps) {
  const safe = Math.max(0, Math.min(100, Math.round(percent)));

  return (
    <div
      className="flex min-h-56 flex-col items-center justify-center rounded-3xl bg-surface px-6 py-16 text-center"
      role="status"
      aria-live="polite"
    >
      <p className="font-display text-2xl text-foreground">{label}</p>
      <div className="mt-8 h-2 w-full max-w-xs overflow-hidden rounded-full bg-cream">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${safe}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-muted">{safe}%</p>
    </div>
  );
}

export function videoProgressLabel(phase: string, percent: number): string {
  if (phase === "preparing" || percent < 40) return "Uploading your video…";
  if (percent < 90) return "Optimizing your video…";
  return "Finishing up…";
}
