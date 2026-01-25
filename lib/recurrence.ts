import { RRule, Frequency, type Options, type Weekday } from "rrule"

export type RecurrenceFrequency = "daily" | "weekly" | "monthly"

export type RecurrenceConfig = {
  frequency: RecurrenceFrequency
  interval?: number
  byweekday?: number[] // 0-6 (Sunday-Saturday)
  until?: Date
  count?: number
}

/**
 * Generate RRULE string from config
 */
export function generateRRuleString(config: RecurrenceConfig): string {
  const options: Partial<Options> = {
    freq: frequencyToRRuleFreq(config.frequency),
    interval: config.interval ?? 1,
  }

  if (config.byweekday && config.byweekday.length > 0) {
    options.byweekday = config.byweekday.map((day) => weekdayToRRuleWeekday(day))
  }

  if (config.until) {
    options.until = config.until
  }

  if (config.count) {
    options.count = config.count
  }

  const rule = new RRule(options)
  return rule.toString().replace("RRULE:", "")
}

/**
 * Parse RRULE string to config
 */
export function parseRRuleString(rruleString: string): RecurrenceConfig | null {
  try {
    const rruleWithPrefix = rruleString.startsWith("RRULE:")
      ? rruleString
      : `RRULE:${rruleString}`
    const rule = RRule.fromString(rruleWithPrefix)
    const options = rule.origOptions

    if (!options.freq) return null
    const frequency = rruleFreqToFrequency(options.freq)
    if (!frequency) return null

    const config: RecurrenceConfig = {
      frequency,
      interval: options.interval ?? 1,
    }

    if (options.byweekday) {
      config.byweekday = (Array.isArray(options.byweekday)
        ? options.byweekday
        : [options.byweekday]
      ).map((day) => {
        if (typeof day === "number") return day
        return (day as Weekday).weekday
      })
    }

    if (options.until) {
      config.until = options.until
    }

    if (options.count) {
      config.count = options.count
    }

    return config
  } catch {
    return null
  }
}

/**
 * Get all occurrences between start and end dates
 */
export function getOccurrences(
  rruleString: string,
  dtstart: Date,
  startDate: Date,
  endDate: Date,
  limit = 100
): Date[] {
  try {
    const rruleWithPrefix = rruleString.startsWith("RRULE:")
      ? rruleString
      : `RRULE:${rruleString}`
    
    // Create RRule with dtstart
    const rule = new RRule({
      ...RRule.parseString(rruleWithPrefix.replace("RRULE:", "")),
      dtstart,
    })

    return rule.between(startDate, endDate, true).slice(0, limit)
  } catch {
    return []
  }
}

/**
 * Get human-readable description of recurrence
 */
export function getRecurrenceDescription(config: RecurrenceConfig): string {
  const { frequency, interval = 1, byweekday, until, count } = config

  let description = ""

  // Frequency
  if (interval === 1) {
    description = frequency.charAt(0).toUpperCase() + frequency.slice(1)
  } else {
    description = `Every ${interval} ${frequency === "daily" ? "days" : frequency === "weekly" ? "weeks" : "months"}`
  }

  // Days of week
  if (byweekday && byweekday.length > 0) {
    const dayNames = byweekday
      .map((day) => getDayName(day))
      .join(", ")
    description += ` on ${dayNames}`
  }

  // End condition
  if (until) {
    description += ` until ${formatDate(until)}`
  } else if (count) {
    description += ` for ${count} times`
  }

  return description
}

// Helper functions

function frequencyToRRuleFreq(frequency: RecurrenceFrequency): Frequency {
  switch (frequency) {
    case "daily":
      return RRule.DAILY
    case "weekly":
      return RRule.WEEKLY
    case "monthly":
      return RRule.MONTHLY
  }
}

function rruleFreqToFrequency(freq: Frequency): RecurrenceFrequency | null {
  switch (freq) {
    case RRule.DAILY:
      return "daily"
    case RRule.WEEKLY:
      return "weekly"
    case RRule.MONTHLY:
      return "monthly"
    default:
      return null
  }
}

function weekdayToRRuleWeekday(day: number): Weekday {
  // Convert from JS (0=Sunday) to RRule (0=Monday)
  const rruleDay = day === 0 ? 6 : day - 1
  return [
    RRule.MO,
    RRule.TU,
    RRule.WE,
    RRule.TH,
    RRule.FR,
    RRule.SA,
    RRule.SU,
  ][rruleDay]
}

function getDayName(day: number): string {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return dayNames[day] ?? "?"
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * Validate recurrence config
 */
export function validateRecurrenceConfig(config: RecurrenceConfig): string | null {
  if (!config.frequency) {
    return "Frequency is required"
  }

  if (config.interval !== undefined && config.interval < 1) {
    return "Interval must be at least 1"
  }

  if (config.frequency === "weekly" && (!config.byweekday || config.byweekday.length === 0)) {
    return "At least one day must be selected for weekly recurrence"
  }

  if (config.until && config.count) {
    return "Cannot specify both until and count"
  }

  if (config.until && config.until < new Date()) {
    return "End date must be in the future"
  }

  if (config.count !== undefined && config.count < 1) {
    return "Count must be at least 1"
  }

  return null
}
