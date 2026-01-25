import { toast } from "sonner"
import type { NoteCreateInput, NoteUpdateInput } from "@/types/note"
import {
  getNotesQueue,
  removeNoteFromQueue,
  updateNoteQueueRetries,
  getTasksQueue,
  removeTaskFromQueue,
  updateTaskQueueRetries,
  type NoteSyncQueueItem,
  type TaskSyncQueueItem,
} from "./idb"

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

type SyncResult = {
  success: boolean
  synced: number
  failed: number
  errors: string[]
}

export type SyncStatus = "idle" | "syncing" | "error"

type SyncStatusListener = (status: SyncStatus, progress?: { current: number; total: number }) => void

const statusListeners = new Set<SyncStatusListener>()

export function onSyncStatusChange(listener: SyncStatusListener): () => void {
  statusListeners.add(listener)
  return () => {
    statusListeners.delete(listener)
  }
}

function notifyStatusChange(status: SyncStatus, progress?: { current: number; total: number }) {
  statusListeners.forEach((listener) => listener(status, progress))
}

async function syncNoteItem(item: NoteSyncQueueItem): Promise<boolean> {
  const { operation, data } = item

  try {
    switch (operation) {
      case "create": {
        const response = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: data.title || "Untitled",
            content: data.content || {},
            metadata: data.metadata,
          } satisfies NoteCreateInput),
        })
        return response.ok
      }

      case "update": {
        if (!data.id) return false
        const updateData: NoteUpdateInput = {}
        if (data.title !== undefined) updateData.title = data.title
        if (data.content !== undefined) updateData.content = data.content
        if (data.metadata !== undefined) updateData.metadata = data.metadata
        
        const response = await fetch(`/api/notes/${data.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        })
        return response.ok
      }

      case "delete": {
        if (!data.id) return false
        const response = await fetch(`/api/notes/${data.id}`, {
          method: "DELETE",
        })
        return response.ok
      }

      default:
        return false
    }
  } catch (error) {
    console.error(`Failed to sync note ${item.id}:`, error)
    return false
  }
}

async function syncTaskItem(item: TaskSyncQueueItem): Promise<boolean> {
  const { operation, data } = item

  try {
    switch (operation) {
      case "create": {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            status: data.status,
          }),
        })
        return response.ok
      }

      case "update": {
        if (!data.id) return false
        const response = await fetch(`/api/tasks/${data.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            status: data.status,
          }),
        })
        return response.ok
      }

      case "delete": {
        if (!data.id) return false
        const response = await fetch(`/api/tasks/${data.id}`, {
          method: "DELETE",
        })
        return response.ok
      }

      default:
        return false
    }
  } catch (error) {
    console.error(`Failed to sync task ${item.id}:`, error)
    return false
  }
}

export async function syncNotesQueue(): Promise<SyncResult> {
  const queue = await getNotesQueue()
  const errors: string[] = []
  let synced = 0
  let failed = 0

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i]
    notifyStatusChange("syncing", { current: i + 1, total: queue.length })

    const success = await syncNoteItem(item)

    if (success) {
      await removeNoteFromQueue(item.id)
      synced++
    } else {
      if (item.retries < MAX_RETRIES) {
        await updateNoteQueueRetries(item.id, item.retries + 1)
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
        const retrySuccess = await syncNoteItem(item)
        if (retrySuccess) {
          await removeNoteFromQueue(item.id)
          synced++
        } else {
          failed++
          errors.push(`Failed to sync note ${item.data.id || "new"} after ${item.retries + 1} retries`)
        }
      } else {
        failed++
        errors.push(`Max retries reached for note ${item.data.id || "new"}`)
      }
    }
  }

  return { success: failed === 0, synced, failed, errors }
}

export async function syncTasksQueue(): Promise<SyncResult> {
  const queue = await getTasksQueue()
  const errors: string[] = []
  let synced = 0
  let failed = 0

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i]
    notifyStatusChange("syncing", { current: i + 1, total: queue.length })

    const success = await syncTaskItem(item)

    if (success) {
      await removeTaskFromQueue(item.id)
      synced++
    } else {
      if (item.retries < MAX_RETRIES) {
        await updateTaskQueueRetries(item.id, item.retries + 1)
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
        const retrySuccess = await syncTaskItem(item)
        if (retrySuccess) {
          await removeTaskFromQueue(item.id)
          synced++
        } else {
          failed++
          errors.push(`Failed to sync task ${item.data.id || "new"} after ${item.retries + 1} retries`)
        }
      } else {
        failed++
        errors.push(`Max retries reached for task ${item.data.id || "new"}`)
      }
    }
  }

  return { success: failed === 0, synced, failed, errors }
}

export async function syncAllQueues(): Promise<SyncResult> {
  notifyStatusChange("syncing")

  try {
    const [notesResult, tasksResult] = await Promise.all([syncNotesQueue(), syncTasksQueue()])

    const totalResult: SyncResult = {
      success: notesResult.success && tasksResult.success,
      synced: notesResult.synced + tasksResult.synced,
      failed: notesResult.failed + tasksResult.failed,
      errors: [...notesResult.errors, ...tasksResult.errors],
    }

    if (totalResult.success) {
      notifyStatusChange("idle")
      if (totalResult.synced > 0) {
        toast.success(`Synced ${totalResult.synced} items`)
      }
    } else {
      notifyStatusChange("error")
      toast.error(`Sync failed: ${totalResult.failed} items failed`)
    }

    return totalResult
  } catch (error) {
    notifyStatusChange("error")
    console.error("Sync error:", error)
    const message = error instanceof Error ? error.message : "Unknown sync error"
    toast.error(message)
    return {
      success: false,
      synced: 0,
      failed: 0,
      errors: [message],
    }
  }
}

export function setupAutoSync() {
  // Sync when coming back online
  if (typeof window !== "undefined") {
    window.addEventListener("online", async () => {
      toast.info("Connection restored. Syncing...")
      await syncAllQueues()
    })
  }

  // Periodic sync every 5 minutes if online
  const syncInterval = setInterval(
    async () => {
      if (navigator.onLine) {
        await syncAllQueues()
      }
    },
    5 * 60 * 1000
  )

  return () => clearInterval(syncInterval)
}
