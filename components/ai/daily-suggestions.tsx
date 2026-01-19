"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { RefreshCw, Loader2, Play, AlertCircle } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Task } from "@/types/task"

type WorkloadLevel = "light" | "balanced" | "heavy"

type SuggestionInsights = {
    workload: WorkloadLevel
    total_minutes: number
    blocked_count: number
    urgent_count: number
    overdue_count: number
}

type SuggestionsResponse = {
    suggestions: Task[]
    insights: SuggestionInsights
}

const priorityLabels: Record<number, string> = {
    0: "urgent",
    1: "high",
    2: "medium",
    3: "low",
}

const priorityColors: Record<number, string> = {
    0: "bg-red-500",
    1: "bg-orange-500",
    2: "bg-yellow-500",
    3: "bg-zinc-400",
}

const workloadColors: Record<WorkloadLevel, string> = {
    light: "text-green-500",
    balanced: "text-yellow-500",
    heavy: "text-red-500",
}

const workloadLabels: Record<WorkloadLevel, string> = {
    light: "Light day",
    balanced: "Balanced",
    heavy: "Heavy workload",
}

export function DailySuggestions() {
    const router = useRouter()
    const [data, setData] = React.useState<SuggestionsResponse | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    const fetchSuggestions = React.useCallback(async (showToast = false) => {
        try {
            setIsLoading(true)
            setError(null)

            const res = await fetch("/api/ai/suggestions?max_suggestions=3&consider_energy=true")

            if (!res.ok) {
                if (res.status === 401) {
                    router.push("/login")
                    return
                }
                throw new Error("Failed to fetch suggestions")
            }

            const result: SuggestionsResponse = await res.json()
            setData(result)

            if (showToast) {
                toast.success("Suggestions refreshed")
            }
        } catch (err) {
            console.error("Error fetching suggestions:", err)
            setError(err instanceof Error ? err.message : "An error occurred")
            if (showToast) {
                toast.error("Failed to refresh suggestions")
            }
        } finally {
            setIsLoading(false)
        }
    }, [router])

    // Fetch on mount
    React.useEffect(() => {
        fetchSuggestions()
    }, [fetchSuggestions])

    const handleStart = (task: Task) => {
        // Navigate to focus mode with this task
        // For now, just navigate to kanban
        toast.info(`Starting: ${task.title}`, {
            description: "Focus mode coming soon!",
            action: {
                label: "View task",
                onClick: () => router.push("/kanban"),
            },
        })
    }

    if (isLoading && !data) {
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Today&apos;s Suggestions
                    </h3>
                </div>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Today&apos;s Suggestions
                    </h3>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => fetchSuggestions(true)}
                    >
                        <RefreshCw className="size-3.5" />
                    </Button>
                </div>
                <div className="flex flex-col items-center justify-center py-6 text-center">
                    <AlertCircle className="size-8 text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => fetchSuggestions(true)}
                    >
                        Try again
                    </Button>
                </div>
            </div>
        )
    }

    if (!data || data.suggestions.length === 0) {
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Today&apos;s Suggestions
                    </h3>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => fetchSuggestions(true)}
                        disabled={isLoading}
                    >
                        <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
                    </Button>
                </div>
                <div className="rounded-lg border border-dashed p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        No suggestions for today. Create some tasks to get started!
                    </p>
                </div>
            </div>
        )
    }

    const { suggestions, insights } = data

    const formatTime = (minutes: number) => {
        if (minutes < 60) return `${minutes}m`
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
    }

    return (
        <div className="space-y-3">
            {/* Header with insights */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Today&apos;s Suggestions
                    </h3>
                    <span className={cn("text-xs font-medium", workloadColors[insights.workload])}>
                        · {workloadLabels[insights.workload]}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => fetchSuggestions(true)}
                    disabled={isLoading}
                    title="Refresh suggestions"
                >
                    <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
                </Button>
            </div>

            {/* Quick insights */}
            <div className="flex gap-3 text-xs text-muted-foreground">
                <span>{formatTime(insights.total_minutes)} total</span>
                {insights.overdue_count > 0 && (
                    <span className="text-red-500">{insights.overdue_count} overdue</span>
                )}
                {insights.urgent_count > 0 && (
                    <span className="text-orange-500">{insights.urgent_count} urgent</span>
                )}
                {insights.blocked_count > 0 && (
                    <span className="text-muted-foreground">{insights.blocked_count} blocked</span>
                )}
            </div>

            {/* Suggestions list */}
            <div className="space-y-2">
                {suggestions.map((task) => {
                    const metadata = task.metadata as { estimated_time_minutes?: number } | null
                    const estimatedMinutes = metadata?.estimated_time_minutes

                    return (
                        <div
                            key={task.id}
                            className="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
                        >
                            <div
                                className={cn(
                                    "size-2 rounded-full shrink-0",
                                    priorityColors[task.priority ?? 2]
                                )}
                                title={priorityLabels[task.priority ?? 2]}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{task.title}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    {estimatedMinutes && (
                                        <span>{formatTime(estimatedMinutes)}</span>
                                    )}
                                    {task.due_date && (
                                        <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                                    )}
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="shrink-0 gap-1"
                                onClick={() => handleStart(task)}
                            >
                                <Play className="size-3" />
                                Start
                            </Button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
