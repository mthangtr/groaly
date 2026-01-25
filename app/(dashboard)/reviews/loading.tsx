import { LoadingSpinner } from "@/components/common/LoadingSpinner"

export default function ReviewsLoading() {
  return (
    <div className="container max-w-5xl space-y-6 py-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-32 animate-pulse rounded bg-muted" />
          <div className="h-9 w-32 animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* Week Selector Skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-pulse rounded bg-muted" />
        <div className="h-10 w-[250px] animate-pulse rounded bg-muted" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg border bg-muted" />
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="h-[400px] animate-pulse rounded-lg border bg-muted" />

      {/* Content Loading */}
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    </div>
  )
}
