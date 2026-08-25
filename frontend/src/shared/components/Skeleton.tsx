export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-[#EADAD6] ${className || ""}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-1.5 py-2">
          <div className="flex gap-2">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="space-y-3 px-4 py-4">
      <div className="flex justify-end">
        <Skeleton className="h-12 w-48 rounded-lg" />
      </div>
      <div className="flex justify-start">
        <Skeleton className="h-16 w-64 rounded-lg" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
    </div>
  );
}
