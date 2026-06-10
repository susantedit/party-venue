import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  width?: string;
  height?: string;
}

export function SkeletonLoader({ className, width, height }: SkeletonLoaderProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-zinc-800/60 border border-white/5',
        className,
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-white/5 bg-zinc-900/30 p-4 backdrop-blur-sm">
      <SkeletonLoader className="mb-3 h-40 w-full rounded-lg" />
      <SkeletonLoader className="mb-2 h-4 w-3/4" />
      <SkeletonLoader className="h-4 w-1/2" />
    </div>
  );
}
