"use client";

import { ImageComparison } from "@/components/image/ImageComparison";
import { Button } from "@/components/ui/button";
import { downloadOptimizedImage } from "@/lib/image/download";
import type { OptimizationResult } from "@/types/image";

type OptimizationResultProps = {
  result: OptimizationResult;
  onReset: () => void;
};

export function OptimizationResultView({ result, onReset }: OptimizationResultProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-sm font-medium tracking-wide text-accent">Complete</p>
        <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
          Your photo is ready ✨
        </h2>
      </div>

      <ImageComparison result={result} />

      <div className="flex flex-col items-center gap-3">
        <Button
          size="lg"
          onClick={() => downloadOptimizedImage(result.optimizedUrl)}
        >
          Download optimized image
        </Button>
        <Button variant="ghost" onClick={onReset}>
          Try another photo
        </Button>
      </div>
    </div>
  );
}
