import { parseISO, startOfDay, endOfDay } from "date-fns"
import { getOccurrences } from "./recurrence"
import type { ProtectedSlotWithDuration } from "@/types/protected-slot"

type TimeRange = {
  start: Date
  end: Date
}

/**
 * Check if a time range conflicts with any protected slots
 */
export function hasProtectedSlotConflict(
  taskTimeRange: TimeRange,
  protectedSlots: ProtectedSlotWithDuration[]
): boolean {
  const { start: taskStart, end: taskEnd } = taskTimeRange

  return protectedSlots.some((slot) => {
    const slotStart = parseISO(slot.start_time)
    const slotEnd = parseISO(slot.end_time)

    // Check for direct overlap
    const hasDirectOverlap = slotStart < taskEnd && slotEnd > taskStart

    if (!slot.is_recurring || !slot.recurrence_rule) {
      return hasDirectOverlap
    }

    // Check recurring occurrences
    const dayStart = startOfDay(taskStart)
    const dayEnd = endOfDay(taskEnd)
    const occurrences = getOccurrences(slot.recurrence_rule, slotStart, dayStart, dayEnd, 10)

    return occurrences.some((occurrenceDate) => {
      // Calculate the actual time range for this occurrence
      const duration = slotEnd.getTime() - slotStart.getTime()
      const occurrenceStart = occurrenceDate
      const occurrenceEnd = new Date(occurrenceDate.getTime() + duration)

      return occurrenceStart < taskEnd && occurrenceEnd > taskStart
    })
  })
}

/**
 * Get all protected slots that conflict with a time range
 */
export function getConflictingProtectedSlots(
  taskTimeRange: TimeRange,
  protectedSlots: ProtectedSlotWithDuration[]
): ProtectedSlotWithDuration[] {
  return protectedSlots.filter((slot) => {
    const slotStart = parseISO(slot.start_time)
    const slotEnd = parseISO(slot.end_time)

    const hasDirectOverlap = slotStart < taskTimeRange.end && slotEnd > taskTimeRange.start

    if (!slot.is_recurring || !slot.recurrence_rule) {
      return hasDirectOverlap
    }

    const dayStart = startOfDay(taskTimeRange.start)
    const dayEnd = endOfDay(taskTimeRange.end)
    const occurrences = getOccurrences(slot.recurrence_rule, slotStart, dayStart, dayEnd, 10)

    return occurrences.some((occurrenceDate) => {
      const duration = slotEnd.getTime() - slotStart.getTime()
      const occurrenceStart = occurrenceDate
      const occurrenceEnd = new Date(occurrenceDate.getTime() + duration)

      return occurrenceStart < taskTimeRange.end && occurrenceEnd > taskTimeRange.start
    })
  })
}

/**
 * Find available time slots on a given date, avoiding protected slots
 */
export function findAvailableTimeSlots(
  date: Date,
  durationMinutes: number,
  protectedSlots: ProtectedSlotWithDuration[],
  workingHours: { start: number; end: number } = { start: 9, end: 17 }
): Date[] {
  const dayStart = new Date(date)
  dayStart.setHours(workingHours.start, 0, 0, 0)

  const dayEnd = new Date(date)
  dayEnd.setHours(workingHours.end, 0, 0, 0)

  const availableSlots: Date[] = []
  const intervalMinutes = 30 // Check every 30 minutes

  let currentTime = new Date(dayStart)

  while (currentTime < dayEnd) {
    const slotEnd = new Date(currentTime.getTime() + durationMinutes * 60 * 1000)

    // Check if this slot would go past working hours
    if (slotEnd > dayEnd) {
      break
    }

    // Check if this slot conflicts with any protected slot
    const hasConflict = hasProtectedSlotConflict(
      { start: currentTime, end: slotEnd },
      protectedSlots
    )

    if (!hasConflict) {
      availableSlots.push(new Date(currentTime))
    }

    // Move to next interval
    currentTime = new Date(currentTime.getTime() + intervalMinutes * 60 * 1000)
  }

  return availableSlots
}
