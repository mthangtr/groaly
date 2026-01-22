import { TableRowSkeleton } from "@/components/common/Skeleton"

export default function TableLoading() {
    return (
        <div className="container mx-auto py-8 animate-in fade-in-50 duration-300">
            <div className="mb-6 space-y-4">
                <div className="h-10 w-32 bg-muted animate-pulse rounded" />
                <div className="flex gap-4">
                    <div className="h-10 flex-1 bg-muted animate-pulse rounded" />
                    <div className="h-10 w-32 bg-muted animate-pulse rounded" />
                </div>
            </div>

            <div className="rounded-lg border bg-card">
                <div className="flex items-center gap-4 p-4 border-b bg-muted/50">
                    <div className="h-5 w-5 bg-muted animate-pulse rounded" />
                    <div className="h-5 w-1/4 bg-muted animate-pulse rounded" />
                    <div className="h-5 w-20 bg-muted animate-pulse rounded" />
                    <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                    <div className="h-5 w-24 bg-muted animate-pulse rounded" />
                </div>
                {Array.from({ length: 10 }).map((_, i) => (
                    <TableRowSkeleton key={i} />
                ))}
            </div>
        </div>
    )
}
