"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import { useNotesStore } from "@/stores/notes-store"
import { useTasksStore } from "@/stores/tasks-store"
import type { Note } from "@/types/note"
import type { Task } from "@/types/task"
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js"

type RealtimeSyncOptions = {
  userId: string
  enabled?: boolean
}

export function useRealtimeSync({ userId, enabled = true }: RealtimeSyncOptions) {
  const { addNote, updateNote, removeNote } = useNotesStore()
  const { addTask, updateTask, removeTask } = useTasksStore()
  const channelRef = React.useRef<RealtimeChannel | null>(null)

  React.useEffect(() => {
    if (!enabled || !userId) return

    const supabase = createClient()

    const handleNotesChange = (payload: RealtimePostgresChangesPayload<Note>) => {
      const { eventType, new: newRecord, old: oldRecord } = payload

      if (eventType === "INSERT" && newRecord) {
        addNote(newRecord as Note)
      } else if (eventType === "UPDATE" && newRecord) {
        updateNote((newRecord as Note).id, newRecord as Note)
      } else if (eventType === "DELETE" && oldRecord) {
        removeNote((oldRecord as { id: string }).id)
      }
    }

    const handleTasksChange = (payload: RealtimePostgresChangesPayload<Task>) => {
      const { eventType, new: newRecord, old: oldRecord } = payload

      if (eventType === "INSERT" && newRecord) {
        addTask(newRecord as Task)
      } else if (eventType === "UPDATE" && newRecord) {
        updateTask((newRecord as Task).id, newRecord as Task)
      } else if (eventType === "DELETE" && oldRecord) {
        removeTask((oldRecord as { id: string }).id)
      }
    }

    const channel = supabase
      .channel(`realtime:user:${userId}`)
      .on<Note>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
          filter: `user_id=eq.${userId}`,
        },
        handleNotesChange
      )
      .on<Task>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${userId}`,
        },
        handleTasksChange
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [userId, enabled, addNote, updateNote, removeNote, addTask, updateTask, removeTask])

  const unsubscribe = React.useCallback(() => {
    if (channelRef.current) {
      const supabase = createClient()
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
  }, [])

  return { unsubscribe }
}
