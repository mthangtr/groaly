"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const skeletonVariants = cva(
    "animate-pulse bg-muted rounded-md",
    {
        variants: {
            variant: {
                default: "",
                circle: "rounded-full",
                text: "h-4",
            },
            size: {
                sm: "h-4",
                md: "h-8",
                lg: "h-12",
                xl: "h-24",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
)

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof skeletonVariants>

export function Skeleton({
    className,
    variant,
    size,
    ...props
}: SkeletonProps) {
    return (
        <div
            className={cn(skeletonVariants({ variant, size }), className)}
            {...props}
        />
    )
}

// Specialized skeleton components
export function NoteCardSkeleton() {
    return (
        <div className="rounded-lg border bg-card p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-5/6" />
            <Skeleton variant="text" className="w-4/6" />
            <div className="flex gap-2 mt-4">
                <Skeleton variant="circle" className="h-6 w-6" />
                <Skeleton variant="text" className="w-24" />
            </div>
        </div>
    )
}

export function TaskCardSkeleton() {
    return (
        <div className="rounded-lg border bg-card p-3 space-y-2">
            <div className="flex items-start gap-3">
                <Skeleton variant="circle" className="h-5 w-5 mt-0.5" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton variant="text" className="w-full" />
                </div>
            </div>
            <div className="flex items-center gap-2 ml-8">
                <Skeleton variant="circle" className="h-4 w-4" />
                <Skeleton variant="text" className="w-16" />
                <Skeleton variant="circle" className="h-4 w-4" />
                <Skeleton variant="text" className="w-20" />
            </div>
        </div>
    )
}

export function TableRowSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 border-b">
            <Skeleton variant="circle" className="h-5 w-5" />
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-24" />
        </div>
    )
}

export function CalendarSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                ))}
            </div>
        </div>
    )
}
