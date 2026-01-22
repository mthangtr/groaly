import { NoteCardSkeleton } from "@/components/common/Skeleton"

export default function NotesLoading() {
    return (
        <div className="container mx-auto py-8 animate-in fade-in-50 duration-300">
            <div className="mb-8 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="h-10 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-10 w-28 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-10 w-64 bg-muted animate-pulse rounded" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <NoteCardSkeleton key={i} />
                ))}
            </div>
        </div>
    )
}
