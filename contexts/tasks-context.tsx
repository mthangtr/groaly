"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { useTasksStore } from "@/stores/tasks-store"
import type { RealtimeChannel } from "@supabase/supabase-js"
import type { Task } from "@/types/task"

type TasksContextValue = {
  isLoading: boolean
  error: string | null
  isSubscribed: boolean
}

const TasksContext = React.createContext<TasksContextValue | null>(null)

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const supabase = React.useMemo(() => createClient(), [])
  
  const { setTasks, addTask, updateTask, removeTask, isLoading, error, setLoading, setError } = useTasksStore()
  
  const [isSubscribed, setIsSubscribed] = React.useState(false)
  const channelRef = React.useRef<RealtimeChannel | null>(null)
  const hasFetched = React.useRef(false)

  // Fetch tasks once on mount
  React.useEffect(() => {
    if (!user?.id || hasFetched.current) return
    
    const fetchTasks = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch("/api/tasks")
        if (!response.ok) {
          throw new Error("Failed to fetch tasks")
        }
        const data = await response.json()
        setTasks(data.tasks || [])
        hasFetched.current = true
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch tasks"
        setError(message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTasks()
  }, [user?.id, setTasks, setLoading, setError])

  // Setup realtime subscription
  React.useEffect(() => {
    if (!user?.id) {
      setIsSubscribed(false)
      return
    }

    const channelName = `tasks-global-${user.id}`
    
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const eventType = payload.eventType
          
          if (eventType === "INSERT") {
            const newTask = payload.new as Task
            addTask(newTask)
          }
          
          if (eventType === "UPDATE") {
            const updatedTask = payload.new as Task
            updateTask(updatedTask.id, updatedTask)
          }
          
          if (eventType === "DELETE") {
            const deletedId = (payload.old as Partial<Task>).id
            if (deletedId) {
              removeTask(deletedId)
            }
          }
        }
      )
      .subscribe((status) => {
        setIsSubscribed(status === "SUBSCRIBED")
      })

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
      setIsSubscribed(false)
    }
  }, [user?.id, supabase, addTask, updateTask, removeTask])

  // Reset on user change
  React.useEffect(() => {
    return () => {
      hasFetched.current = false
    }
  }, [user?.id])

  const value = React.useMemo(
    () => ({ isLoading, error, isSubscribed }),
    [isLoading, error, isSubscribed]
  )

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasksContext() {
  const context = React.useContext(TasksContext)
  if (!context) {
    throw new Error("useTasksContext must be used within a TasksProvider")
  }
  return context
}
