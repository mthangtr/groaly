"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import type { RealtimeChannel } from "@supabase/supabase-js"
import type {
  TableName,
  RealtimeEvent,
  RealtimePayload,
  RealtimeCallback,
} from "@/lib/supabase/realtime"
import {
  createRealtimeFilter,
  isInsertEvent,
  isUpdateEvent,
  isDeleteEvent,
  cleanupChannel,
} from "@/lib/supabase/realtime"

type OptimisticState<T> = {
  data: T[]
  pendingOperations: Map<string, { type: "create" | "update" | "delete"; originalData?: T }>
}

type UseRealtimeSubscriptionOptions<T extends Record<string, unknown>> = {
  table: TableName
  filter?: string
  initialData?: T[]
  onUpdate?: RealtimeCallback<T>
  enabled?: boolean
}

type UseRealtimeSubscriptionReturn<T> = {
  data: T[]
  isSubscribed: boolean
  error: Error | null
  optimisticCreate: (tempId: string, data: T) => void
  optimisticUpdate: (id: string, updates: Partial<T>) => void
  optimisticDelete: (id: string) => void
  rollback: (id: string) => void
  confirmOperation: (tempId: string, realData?: T) => void
  setData: React.Dispatch<React.SetStateAction<T[]>>
}

export function useRealtimeSubscription<T extends Record<string, unknown> & { id: string }>({
  table,
  filter,
  initialData = [],
  onUpdate,
  enabled = true,
}: UseRealtimeSubscriptionOptions<T>): UseRealtimeSubscriptionReturn<T> {
  const { user } = useAuth()
  const supabase = React.useMemo(() => createClient(), [])
  
  const [state, setState] = React.useState<OptimisticState<T>>({
    data: initialData,
    pendingOperations: new Map(),
  })
  const [isSubscribed, setIsSubscribed] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  
  const channelRef = React.useRef<RealtimeChannel | null>(null)

  React.useEffect(() => {
    setState((prev) => ({
      ...prev,
      data: initialData,
    }))
  }, [initialData])

  React.useEffect(() => {
    if (!enabled || !user?.id) {
      setIsSubscribed(false)
      return
    }

    const realtimeFilter = createRealtimeFilter(user.id, filter)
    const channelName = `${table}-${user.id}-${filter ?? "all"}`

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          filter: realtimeFilter,
        },
        (payload: RealtimePayload<T>) => {
          const eventType = payload.eventType as RealtimeEvent

          if (isInsertEvent(payload)) {
            setState((prev) => {
              const exists = prev.data.some((item) => item.id === payload.new.id)
              if (exists) return prev
              return {
                ...prev,
                data: [...prev.data, payload.new as T],
              }
            })
          }

          if (isUpdateEvent(payload)) {
            setState((prev) => ({
              ...prev,
              data: prev.data.map((item) =>
                item.id === (payload.new as T).id ? (payload.new as T) : item
              ),
            }))
          }

          if (isDeleteEvent(payload)) {
            const deletedId = (payload.old as Partial<T>).id
            if (deletedId) {
              setState((prev) => ({
                ...prev,
                data: prev.data.filter((item) => item.id !== deletedId),
              }))
            }
          }

          onUpdate?.(eventType, payload)
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsSubscribed(true)
          setError(null)
        } else if (status === "CHANNEL_ERROR") {
          setError(new Error(`Failed to subscribe to ${table}`))
          setIsSubscribed(false)
        }
      })

    channelRef.current = channel

    return () => {
      cleanupChannel(channelRef.current)
      channelRef.current = null
      setIsSubscribed(false)
    }
  }, [enabled, user?.id, table, filter, supabase, onUpdate])

  const optimisticCreate = React.useCallback((tempId: string, data: T) => {
    setState((prev) => ({
      data: [...prev.data, { ...data, id: tempId }],
      pendingOperations: new Map(prev.pendingOperations).set(tempId, { type: "create" }),
    }))
  }, [])

  const optimisticUpdate = React.useCallback((id: string, updates: Partial<T>) => {
    setState((prev) => {
      const originalItem = prev.data.find((item) => item.id === id)
      const newPending = new Map(prev.pendingOperations)
      
      if (!prev.pendingOperations.has(id) && originalItem) {
        newPending.set(id, { type: "update", originalData: originalItem })
      }

      return {
        data: prev.data.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
        pendingOperations: newPending,
      }
    })
  }, [])

  const optimisticDelete = React.useCallback((id: string) => {
    setState((prev) => {
      const originalItem = prev.data.find((item) => item.id === id)
      const newPending = new Map(prev.pendingOperations)
      
      if (originalItem) {
        newPending.set(id, { type: "delete", originalData: originalItem })
      }

      return {
        data: prev.data.filter((item) => item.id !== id),
        pendingOperations: newPending,
      }
    })
  }, [])

  const rollback = React.useCallback((id: string) => {
    setState((prev) => {
      const operation = prev.pendingOperations.get(id)
      if (!operation) return prev

      const newPending = new Map(prev.pendingOperations)
      newPending.delete(id)

      if (operation.type === "create") {
        return {
          data: prev.data.filter((item) => item.id !== id),
          pendingOperations: newPending,
        }
      }

      if (operation.type === "update" && operation.originalData) {
        return {
          data: prev.data.map((item) =>
            item.id === id ? operation.originalData! : item
          ),
          pendingOperations: newPending,
        }
      }

      if (operation.type === "delete" && operation.originalData) {
        return {
          data: [...prev.data, operation.originalData],
          pendingOperations: newPending,
        }
      }

      return { ...prev, pendingOperations: newPending }
    })
  }, [])

  const confirmOperation = React.useCallback((tempId: string, realData?: T) => {
    setState((prev) => {
      const newPending = new Map(prev.pendingOperations)
      newPending.delete(tempId)

      if (realData) {
        return {
          data: prev.data.map((item) =>
            item.id === tempId ? realData : item
          ),
          pendingOperations: newPending,
        }
      }

      return { ...prev, pendingOperations: newPending }
    })
  }, [])

  const setData = React.useCallback((action: React.SetStateAction<T[]>) => {
    setState((prev) => ({
      ...prev,
      data: typeof action === "function" ? action(prev.data) : action,
    }))
  }, [])

  return {
    data: state.data,
    isSubscribed,
    error,
    optimisticCreate,
    optimisticUpdate,
    optimisticDelete,
    rollback,
    confirmOperation,
    setData,
  }
}
