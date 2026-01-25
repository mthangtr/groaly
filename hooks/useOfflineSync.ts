"use client"

import * as React from "react"
import { toast } from "sonner"
import { useNotesStore } from "@/stores/notes-store"
import type { NoteCreateInput, NoteUpdateInput } from "@/types/note"
import { addNoteToQueue, getQueueStats } from "@/lib/offline/idb"
import { syncAllQueues, setupAutoSync, onSyncStatusChange, type SyncStatus } from "@/lib/offline/sync-queue"

type OfflineSyncState = {
  isOnline: boolean
  syncStatus: SyncStatus
  queuedCount: number
  syncProgress?: { current: number; total: number }
}

type OfflineSyncActions = {
  createNoteOffline: (input: NoteCreateInput, userId: string) => Promise<void>
  updateNoteOffline: (id: string, input: NoteUpdateInput) => Promise<void>
  deleteNoteOffline: (id: string) => Promise<void>
  syncNow: () => Promise<void>
  refreshQueueStats: () => Promise<void>
}

export function useOfflineSync(): OfflineSyncState & OfflineSyncActions {
  const [isOnline, setIsOnline] = React.useState(
    typeof window !== "undefined" ? navigator.onLine : true
  )
  const [syncStatus, setSyncStatus] = React.useState<SyncStatus>("idle")
  const [queuedCount, setQueuedCount] = React.useState(0)
  const [syncProgress, setSyncProgress] = React.useState<{ current: number; total: number }>()

  const { addNote, updateNote, removeNote } = useNotesStore()

  // Monitor online/offline status
  React.useEffect(() => {
    if (typeof window === "undefined") return

    const handleOnline = () => {
      setIsOnline(true)
      toast.success("Connection restored")
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast.warning("You're offline. Changes will sync when reconnected.")
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Setup auto-sync
  React.useEffect(() => {
    const cleanup = setupAutoSync()
    return () => cleanup()
  }, [])

  // Listen to sync status changes
  React.useEffect(() => {
    const unsubscribe = onSyncStatusChange((status, progress) => {
      setSyncStatus(status)
      setSyncProgress(progress)
    })
    return () => unsubscribe()
  }, [])

  // Refresh queue stats periodically
  const refreshQueueStats = React.useCallback(async () => {
    try {
      const stats = await getQueueStats()
      setQueuedCount(stats.totalCount)
    } catch (error) {
      console.error("Failed to get queue stats:", error)
    }
  }, [])

  React.useEffect(() => {
    refreshQueueStats()
    const interval = setInterval(refreshQueueStats, 10000) // Every 10s
    return () => clearInterval(interval)
  }, [refreshQueueStats])

  // Create note offline
  const createNoteOffline = React.useCallback(
    async (input: NoteCreateInput, userId: string) => {
      const tempId = `temp-${Date.now()}`
      const optimisticNote = {
        id: tempId,
        title: input.title,
        content: input.content,
        metadata: input.metadata ?? null,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Add to UI immediately
      addNote(optimisticNote)

      if (isOnline) {
        // Try direct API call
        try {
          const response = await fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
          })

          if (response.ok) {
            const data = await response.json()
            updateNote(tempId, data.note)
            toast.success("Note created")
            return
          }
        } catch (error) {
          console.error("Failed to create note online:", error)
        }
      }

      // Fallback to queue
      await addNoteToQueue("create", {
        title: input.title,
        content: input.content,
        metadata: input.metadata,
        user_id: userId,
      })
      await refreshQueueStats()
      toast.info("Note saved offline. Will sync when online.")
    },
    [isOnline, addNote, updateNote, refreshQueueStats]
  )

  // Update note offline
  const updateNoteOffline = React.useCallback(
    async (id: string, input: NoteUpdateInput) => {
      // Update UI immediately
      updateNote(id, {
        ...input,
        updated_at: new Date().toISOString(),
      })

      if (isOnline) {
        // Try direct API call
        try {
          const response = await fetch(`/api/notes/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
          })

          if (response.ok) {
            const data = await response.json()
            updateNote(id, data.note)
            toast.success("Note updated")
            return
          }
        } catch (error) {
          console.error("Failed to update note online:", error)
        }
      }

      // Fallback to queue
      const queueData: Record<string, unknown> = { id }
      if (input.title !== undefined) queueData.title = input.title
      if (input.content !== undefined) queueData.content = input.content
      if (input.metadata !== undefined) queueData.metadata = input.metadata
      
      await addNoteToQueue("update", queueData as typeof queueData & { id: string })
      await refreshQueueStats()
      toast.info("Changes saved offline. Will sync when online.")
    },
    [isOnline, updateNote, refreshQueueStats]
  )

  // Delete note offline
  const deleteNoteOffline = React.useCallback(
    async (id: string) => {
      // Remove from UI immediately
      removeNote(id)

      if (isOnline) {
        // Try direct API call
        try {
          const response = await fetch(`/api/notes/${id}`, {
            method: "DELETE",
          })

          if (response.ok) {
            toast.success("Note deleted")
            return
          }
        } catch (error) {
          console.error("Failed to delete note online:", error)
        }
      }

      // Fallback to queue
      await addNoteToQueue("delete", { id })
      await refreshQueueStats()
      toast.info("Deletion queued. Will sync when online.")
    },
    [isOnline, removeNote, refreshQueueStats]
  )

  // Manual sync trigger
  const syncNow = React.useCallback(async () => {
    if (!isOnline) {
      toast.warning("Cannot sync while offline")
      return
    }

    await syncAllQueues()
    await refreshQueueStats()
  }, [isOnline, refreshQueueStats])

  return {
    isOnline,
    syncStatus,
    queuedCount,
    syncProgress,
    createNoteOffline,
    updateNoteOffline,
    deleteNoteOffline,
    syncNow,
    refreshQueueStats,
  }
}
