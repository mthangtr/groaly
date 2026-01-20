import type { Database } from "./database"

export type ProtectedSlot = Database["public"]["Tables"]["protected_slots"]["Row"]
export type ProtectedSlotInsert = Database["public"]["Tables"]["protected_slots"]["Insert"]
export type ProtectedSlotUpdate = Database["public"]["Tables"]["protected_slots"]["Update"]

export const SLOT_TYPES = ["focus", "break", "meeting", "personal"] as const
export type SlotType = (typeof SLOT_TYPES)[number]

export type ProtectedSlotsListResponse = {
  slots: ProtectedSlotWithDuration[]
  count: number
}

export type ProtectedSlotResponse = {
  slot: ProtectedSlotWithDuration
}

export type ProtectedSlotWithDuration = ProtectedSlot & {
  duration_minutes: number
}

export type ProtectedSlotCreateInput = {
  title: string
  start_time: string
  end_time: string
  is_recurring?: boolean
  recurrence_rule?: string | null
}

export type ProtectedSlotUpdateInput = Partial<ProtectedSlotCreateInput>

export type ProtectedSlotErrorResponse = {
  error: string
  details?: string
}
