"use client"

import * as React from "react"
import { Loader2Icon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const spinnerVariants = cva("animate-spin", {
    variants: {
        size: {
            sm: "h-4 w-4",
            md: "h-6 w-6",
            lg: "h-8 w-8",
            xl: "h-12 w-12",
        },
    },
    defaultVariants: {
        size: "md",
    },
})

export type LoadingSpinnerProps = React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof spinnerVariants> & {
        text?: string
        fullScreen?: boolean
    }

export function LoadingSpinner({
    className,
    size,
    text,
    fullScreen = false,
    ...props
}: LoadingSpinnerProps) {
    const content = (
        <>
            <Loader2Icon className={cn(spinnerVariants({ size }), className)} />
            {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
        </>
    )

    if (fullScreen) {
        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                {...props}
            >
                <div className="flex flex-col items-center gap-2">{content}</div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center" {...props}>
            {content}
        </div>
    )
}

// Button loading spinner
export function ButtonSpinner({ className }: { className?: string }) {
    return <Loader2Icon className={cn("h-4 w-4 animate-spin", className)} />
}
