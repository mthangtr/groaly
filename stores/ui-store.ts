"use client"

import { create } from "zustand"

type ModalType = "create-note" | "create-task" | "settings" | null

type TaskFilters = {
  status: string | null
  priority: number | null
  dueBefore: string | null
  dueAfter: string | null
  tags: string[]
}

type UIState = {
  sidebarOpen: boolean
  activeModal: ModalType
  taskFilters: TaskFilters
}

type UIActions = {
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  openModal: (modal: ModalType) => void
  closeModal: () => void
  setTaskFilters: (filters: Partial<TaskFilters>) => void
  resetTaskFilters: () => void
}

const defaultFilters: TaskFilters = {
  status: null,
  priority: null,
  dueBefore: null,
  dueAfter: null,
  tags: [],
}

export const useUIStore = create<UIState & UIActions>((set) => ({
  sidebarOpen: true,
  activeModal: null,
  taskFilters: defaultFilters,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  openModal: (modal) => set({ activeModal: modal }),

  closeModal: () => set({ activeModal: null }),

  setTaskFilters: (filters) =>
    set((state) => ({
      taskFilters: { ...state.taskFilters, ...filters },
    })),

  resetTaskFilters: () => set({ taskFilters: defaultFilters }),
}))
