export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-white/10 rounded w-3/4"></div>
      <div className="h-4 bg-white/10 rounded w-1/2"></div>
      <div className="space-y-3">
        <div className="h-20 bg-white/10 rounded"></div>
        <div className="h-20 bg-white/10 rounded"></div>
        <div className="h-20 bg-white/10 rounded"></div>
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-white/10 rounded-lg mb-4"></div>
      <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-white/10 rounded w-1/2"></div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-white/10 rounded"></div>
      ))}
    </div>
  )
}
