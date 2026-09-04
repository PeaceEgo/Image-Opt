type OptimizationProgressProps = {
  stage: "reading" | "optimizing";
  label?: string;
};

const copy = {
  reading: "Reading your photo...",
  optimizing: "Preparing WhatsApp HD...",
} as const;

export function OptimizationProgress({ stage, label }: OptimizationProgressProps) {
  return (
    <div
      className="flex min-h-56 flex-col items-center justify-center rounded-3xl bg-surface px-6 py-16 text-center"
      role="status"
      aria-live="polite"
    >
      <span
        className="mb-6 h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent motion-reduce:animate-none"
        aria-hidden="true"
      />
      <p className="font-display text-2xl text-foreground">
        {label ?? copy[stage]}
      </p>
    </div>
  );
}
