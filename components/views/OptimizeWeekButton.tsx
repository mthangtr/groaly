"use client"

import * as React from "react"
import { Sparkles, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type OptimizeWeekButtonProps = {
  weekStart: string // ISO date (Monday of current week)
  onOptimized?: () => void
  className?: string
}

type OptimizeWeekResponse = {
  optimized_schedule: Array<{
    task_id: string
    scheduled_at: string
  }>
  reasoning: string
  stats: {
    total_scheduled: number
    unscheduled_count: number
    average_tasks_per_day: number
    protected_slots_respected: number
  }
}

export function OptimizeWeekButton({
  weekStart,
  onOptimized,
  className,
}: OptimizeWeekButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isOptimizing, setIsOptimizing] = React.useState(false)

  const handleOptimize = async () => {
    setIsOptimizing(true)

    try {
      const response = await fetch("/api/ai/optimize-week", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          week_start: weekStart,
          preserve_existing: false,
          energy_preference: "balanced",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to optimize week")
      }

      const data = (await response.json()) as OptimizeWeekResponse

      toast.success("Week optimized successfully!", {
        description: data.reasoning,
      })

      // Close dialog
      setIsOpen(false)

      // Trigger refresh
      onOptimized?.()
    } catch (error) {
      console.error("Error optimizing week:", error)
      toast.error("Failed to optimize week", {
        description: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className={className}
        onClick={() => setIsOpen(true)}
      >
        <Sparkles className="size-3.5" />
        Optimize my week
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Optimize your week?</AlertDialogTitle>
            <AlertDialogDescription>
              AI will automatically schedule your tasks across the week based on:
              <ul className="mt-2 space-y-1 text-left">
                <li>• Task priorities and due dates</li>
                <li>• Dependencies (blocked tasks won&apos;t be scheduled)</li>
                <li>• Your working hours and energy levels</li>
                <li>• Protected time slots (meetings, breaks)</li>
                <li>• Even workload distribution</li>
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                This will update <code className="rounded bg-muted px-1">scheduled_at</code> for
                all unscheduled tasks. You can manually adjust after.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isOptimizing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleOptimize} disabled={isOptimizing}>
              {isOptimizing ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Optimizing...
                </>
              ) : (
                "Optimize Week"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
