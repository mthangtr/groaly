"use client"

import { create } from "zustand"
import { toast } from "sonner"
import type { Task, TaskCreateInput, TaskUpdateInput } from "@/types/task"

type TasksState = {
  tasks: Task[]
  isLoading: boolean
  error: string | null
}

type TasksActions = {
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  removeTask: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  createTaskOptimistic: (input: TaskCreateInput, userId: string) => Promise<Task | null>
  updateTaskOptimistic: (id: string, input: TaskUpdateInput) => Promise<Task | null>
  deleteTaskOptimistic: (id: string) => Promise<boolean>
  fetchTasks: () => Promise<void>
}

export const useTasksStore = create<TasksState & TasksActions>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) =>
    set((state) => ({
      tasks: [task, ...state.tasks.filter((t) => t.id !== task.id)],
    })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  fetchTasks: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/tasks")
      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }
      const data = await response.json()
      set({ tasks: data.tasks, isLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch tasks"
      set({ error: message, isLoading: false })
      toast.error(message)
    }
  },

  createTaskOptimistic: async (input, userId) => {
    const tempId = `temp-${Date.now()}`
    const optimisticTask: Task = {
      id: tempId,
      title: input.title,
      description: input.description ?? null,
      status: input.status ?? "todo",
      priority: input.priority ?? 1,
      due_date: input.due_date ?? null,
      tags: input.tags ?? null,
      metadata: input.metadata ?? null,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    get().addTask(optimisticTask)

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        throw new Error("Failed to create task")
      }

      const data = await response.json()
      const realTask = data.task as Task

      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === tempId ? realTask : t)),
      }))

      toast.success("Task created")
      return realTask
    } catch (err) {
      get().removeTask(tempId)
      const message = err instanceof Error ? err.message : "Failed to create task"
      toast.error(message)
      return null
    }
  },

  updateTaskOptimistic: async (id, input) => {
    const { tasks } = get()
    const originalTask = tasks.find((t) => t.id === id)
    if (!originalTask) return null

    get().updateTask(id, {
      ...input,
      updated_at: new Date().toISOString(),
    })

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        throw new Error("Failed to update task")
      }

      const data = await response.json()
      const updatedTask = data.task as Task

      get().updateTask(id, updatedTask)
      toast.success("Task updated")
      return updatedTask
    } catch (err) {
      get().updateTask(id, originalTask)
      const message = err instanceof Error ? err.message : "Failed to update task"
      toast.error(message)
      return null
    }
  },

  deleteTaskOptimistic: async (id) => {
    const { tasks } = get()
    const originalTask = tasks.find((t) => t.id === id)
    if (!originalTask) return false

    get().removeTask(id)

    // Track if undo was triggered
    let undoTriggered = false

    // Show toast with undo action
    toast.success("Task deleted", {
      duration: 5000,
      action: {
        label: "Undo",
        onClick: () => {
          undoTriggered = true
          get().addTask(originalTask)
          toast.info("Task restored")
        },
      },
    })

    // Wait a bit to allow undo before making the API call
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // If undo was triggered, don't delete from backend
    if (undoTriggered) return false

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete task")
      }

      return true
    } catch (err) {
      get().addTask(originalTask)
      const message = err instanceof Error ? err.message : "Failed to delete task"
      toast.error(message)
      return false
    }
  },
}))
