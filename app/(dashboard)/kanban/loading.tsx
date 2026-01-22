import { TaskCardSkeleton } from "@/components/common/Skeleton"

export default function KanbanLoading() {
    return (
        <div className="container mx-auto py-8 animate-in fade-in-50 duration-300">
            <div className="mb-8 space-y-4">
                <div className="h-10 w-40 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {["Todo", "In Progress", "Done", "Blocked"].map((status) => (
                    <div key={status} className="space-y-3">
                        <div className="flex items-center justify-between p-3 border-b">
                            <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                            <div className="h-5 w-8 bg-muted animate-pulse rounded-full" />
                        </div>
                        <div className="space-y-2 px-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <TaskCardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
