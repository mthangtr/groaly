import { Skeleton } from "@/components/common/Skeleton"

export default function FocusLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center animate-in fade-in-50 duration-300">
            <div className="w-full max-w-4xl space-y-8 p-8">
                <div className="text-center space-y-4">
                    <Skeleton className="h-12 w-3/4 mx-auto" />
                    <Skeleton variant="text" className="w-1/2 mx-auto" />
                </div>

                <div className="rounded-lg border bg-card p-8 space-y-6">
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton variant="text" className="w-full" />
                        <Skeleton variant="text" className="w-5/6" />
                    </div>

                    <div className="flex items-center gap-4">
                        <Skeleton variant="circle" size="xl" className="w-16 h-16" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton variant="text" className="w-48" />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <Skeleton className="h-12 flex-1" />
                        <Skeleton className="h-12 w-32" />
                    </div>
                </div>
            </div>
        </div>
    )
}
