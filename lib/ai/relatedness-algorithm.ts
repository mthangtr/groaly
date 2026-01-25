import { isSameDay, isSameWeek, parseISO } from "date-fns"

import type { Task } from "@/types/task"

type TaskMetadata = {
  note_id?: string
  goal?: string
  scheduled_at?: string
  dependencies?: string[]
  blocked_by?: string[]
}

type RelatedTaskScore = {
  task: Task
  score: number
  reasons: string[]
}

function getTaskMetadata(task: Task): TaskMetadata {
  if (!task.metadata || typeof task.metadata !== "object" || Array.isArray(task.metadata)) {
    return {}
  }
  return task.metadata as TaskMetadata
}

function getTaskDate(task: Task): Date | null {
  const metadata = getTaskMetadata(task)
  const scheduledAt = metadata.scheduled_at

  if (scheduledAt) {
    const parsed = parseISO(scheduledAt)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed
    }
  }

  if (task.due_date) {
    const parsed = parseISO(task.due_date)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed
    }
  }

  return null
}

function getDependencies(task: Task): string[] {
  const metadata = getTaskMetadata(task)
  if (Array.isArray(metadata.dependencies)) {
    return metadata.dependencies
  }
  if (Array.isArray(metadata.blocked_by)) {
    return metadata.blocked_by
  }
  return []
}

function getCommonTags(taskA: Task, taskB: Task): string[] {
  const tagsA = taskA.tags ?? []
  const tagsB = taskB.tags ?? []
  if (tagsA.length === 0 || tagsB.length === 0) {
    return []
  }
  return tagsA.filter((tag) => tagsB.includes(tag))
}

function hasDependencyRelation(taskA: Task, taskB: Task): boolean {
  const depsA = getDependencies(taskA)
  const depsB = getDependencies(taskB)
  return depsA.includes(taskB.id) || depsB.includes(taskA.id)
}

export function calculateRelatednessScore(taskA: Task, taskB: Task): RelatedTaskScore {
  let score = 0
  const reasons: string[] = []
  const metadataA = getTaskMetadata(taskA)
  const metadataB = getTaskMetadata(taskB)

  if (metadataA.note_id && metadataA.note_id === metadataB.note_id) {
    score += 10
    reasons.push("Same note origin")
  }

  if (metadataA.goal && metadataA.goal === metadataB.goal) {
    score += 8
    reasons.push("Same goal")
  }

  const commonTags = getCommonTags(taskA, taskB)
  if (commonTags.length > 0) {
    score += commonTags.length * 3
    reasons.push(`Common tags: ${commonTags.join(", ")}`)
  }

  const dateA = getTaskDate(taskA)
  const dateB = getTaskDate(taskB)
  if (dateA && dateB) {
    if (isSameDay(dateA, dateB)) {
      score += 5
      reasons.push("Scheduled on the same day")
    } else if (isSameWeek(dateA, dateB)) {
      score += 2
      reasons.push("Scheduled in the same week")
    }
  }

  if (hasDependencyRelation(taskA, taskB)) {
    score += 15
    reasons.push("Dependency relationship")
  }

  return { task: taskB, score, reasons }
}

export function getRelatedTasks(
  task: Task,
  candidates: Task[],
  limit = 5
): RelatedTaskScore[] {
  return candidates
    .filter((candidate) => candidate.id !== task.id)
    .map((candidate) => calculateRelatednessScore(task, candidate))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function buildRelatednessReasoning(results: RelatedTaskScore[]): string {
  if (results.length === 0) {
    return "No related tasks found using the current rules."
  }

  const lines = results.map((result) => {
    const reasonText = result.reasons.length > 0 ? result.reasons.join("; ") : "Shared context"
    return `- ${result.task.title}: ${reasonText}`
  })

  return [
    "Related tasks are selected based on shared context signals.",
    ...lines,
  ].join("\n")
}
