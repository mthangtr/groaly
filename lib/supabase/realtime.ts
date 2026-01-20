import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

export type TableName = keyof Database["public"]["Tables"]

export type RealtimeEvent = "INSERT" | "UPDATE" | "DELETE"

export type RealtimePayload<T extends Record<string, unknown>> = RealtimePostgresChangesPayload<T>

export type RealtimeCallback<T extends Record<string, unknown>> = (
  event: RealtimeEvent,
  payload: RealtimePayload<T>
) => void

export type SubscriptionConfig = {
  table: TableName
  filter?: string
  schema?: string
}

export function createRealtimeFilter(userId: string, additionalFilter?: string): string {
  const baseFilter = `user_id=eq.${userId}`
  return additionalFilter ? `${baseFilter},${additionalFilter}` : baseFilter
}

export function isInsertEvent<T extends Record<string, unknown>>(
  payload: RealtimePayload<T>
): payload is RealtimePayload<T> & { eventType: "INSERT"; new: T } {
  return payload.eventType === "INSERT"
}

export function isUpdateEvent<T extends Record<string, unknown>>(
  payload: RealtimePayload<T>
): payload is RealtimePayload<T> & { eventType: "UPDATE"; new: T; old: Partial<T> } {
  return payload.eventType === "UPDATE"
}

export function isDeleteEvent<T extends Record<string, unknown>>(
  payload: RealtimePayload<T>
): payload is RealtimePayload<T> & { eventType: "DELETE"; old: Partial<T> } {
  return payload.eventType === "DELETE"
}

export function cleanupChannel(channel: RealtimeChannel | null): void {
  if (channel) {
    channel.unsubscribe()
  }
}
