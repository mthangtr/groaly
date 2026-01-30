"use client"

import * as React from "react"
import { CloudOff, Cloud, CloudUpload, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useOfflineSync } from "@/hooks/useOfflineSync"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

export function OfflineIndicator() {
  const { isOnline, syncStatus, queuedCount, syncProgress, syncNow } = useOfflineSync()

  const shouldShow = !isOnline || syncStatus === "syncing" || syncStatus === "error" || queuedCount > 0

  if (!shouldShow) {
    return null
  }

  const getStatusIcon = () => {
    if (!isOnline) {
      return <CloudOff className="h-4 w-4" />
    }

    if (syncStatus === "syncing") {
      return <CloudUpload className="h-4 w-4 animate-pulse" />
    }

    if (syncStatus === "error") {
      return <AlertCircle className="h-4 w-4" />
    }

    if (queuedCount > 0) {
      return <CloudUpload className="h-4 w-4" />
    }

    return <Cloud className="h-4 w-4" />
  }

  const getStatusText = () => {
    if (!isOnline) {
      return "Offline"
    }

    if (syncStatus === "syncing") {
      if (syncProgress) {
        return `Syncing ${syncProgress.current}/${syncProgress.total}`
      }
      return "Syncing..."
    }

    if (syncStatus === "error") {
      return "Sync error"
    }

    return `${queuedCount} pending`
  }

  const getStatusColor = () => {
    if (!isOnline) {
      return "bg-orange-500/10 text-orange-600 border-orange-500/20"
    }

    if (syncStatus === "syncing") {
      return "bg-blue-500/10 text-blue-600 border-blue-500/20"
    }

    if (syncStatus === "error") {
      return "bg-red-500/10 text-red-600 border-red-500/20"
    }

    return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
  }

  const getTooltipContent = () => {
    if (!isOnline) {
      return (
        <div className="space-y-1">
          <p className="font-medium">You&apos;re offline</p>
          <p className="text-sm text-muted-foreground">
            Changes will be saved locally and synced when reconnected
          </p>
          {queuedCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {queuedCount} change{queuedCount !== 1 ? "s" : ""} waiting to sync
            </p>
          )}
        </div>
      )
    }

    if (syncStatus === "syncing") {
      return (
        <div className="space-y-1">
          <p className="font-medium">Syncing changes...</p>
          {syncProgress && (
            <div className="space-y-2">
              <Progress value={(syncProgress.current / syncProgress.total) * 100} />
              <p className="text-sm text-muted-foreground">
                {syncProgress.current} of {syncProgress.total} items
              </p>
            </div>
          )}
        </div>
      )
    }

    if (syncStatus === "error") {
      return (
        <div className="space-y-1">
          <p className="font-medium">Sync error</p>
          <p className="text-sm text-muted-foreground">
            Some changes failed to sync. Try again later.
          </p>
          {queuedCount > 0 && (
            <Button size="sm" onClick={syncNow} className="mt-2 w-full">
              Retry sync
            </Button>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-1">
        <p className="font-medium">Pending changes</p>
        <p className="text-sm text-muted-foreground">
          {queuedCount} change{queuedCount !== 1 ? "s" : ""} waiting to sync
        </p>
        <Button size="sm" onClick={syncNow} className="mt-2 w-full">
          Sync now
        </Button>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-1.5 cursor-pointer transition-colors",
              getStatusColor()
            )}
          >
            {getStatusIcon()}
            <span className="text-xs font-medium">{getStatusText()}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
