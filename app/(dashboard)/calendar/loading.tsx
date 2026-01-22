import { CalendarSkeleton } from "@/components/common/Skeleton"

export default function CalendarLoading() {
    return (
        <div className="container mx-auto py-8 animate-in fade-in-50 duration-300">
            <div className="mb-6">
                <div className="h-10 w-40 bg-muted animate-pulse rounded" />
            </div>

            <CalendarSkeleton />
        </div>
    )
}
