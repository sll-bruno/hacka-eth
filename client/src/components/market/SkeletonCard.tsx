export function SkeletonCard() {
  return (
    <div className="relative w-full aspect-[3/4] rounded-2xl border border-card-border bg-surface overflow-hidden">
      <div className="absolute inset-0 p-4 flex flex-col gap-4">
        <div className="mt-auto space-y-3">
          <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-12 rounded bg-white/10 animate-pulse" />
            <div className="h-12 rounded bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

