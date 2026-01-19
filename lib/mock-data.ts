// Mock data for UI visualization

export type Task = {
  id: string
  title: string
  description?: string
  status: "todo" | "in_progress" | "done" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  goal?: string
  tags: string[]
  estimated_time_minutes?: number
  energy_level?: "low" | "medium" | "high"
  scheduled_at?: string
  due_date?: string
  completed_at?: string
  note_id?: string
  created_at: string
}

export type Note = {
  id: string
  title: string
  content_preview: string
  created_at: string
  updated_at: string
  has_tasks: boolean
  task_count: number
}

export type Goal = {
  id: string
  name: string
  color: string
  percentage: number
}

export type User = {
  id: string
  name: string
  email: string
  avatar?: string
  timezone: string
}

// Mock user
export const mockUser: User = {
  id: "1",
  name: "mthangtr",
  email: "thang@dumtasking.com",
  timezone: "Asia/Ho_Chi_Minh",
}

// Mock goals
export const mockGoals: Goal[] = [
  { id: "1", name: "Startup", color: "#3b82f6", percentage: 65 },
  { id: "2", name: "Dev Learning", color: "#10b981", percentage: 22 },
  { id: "3", name: "Japanese N3", color: "#f59e0b", percentage: 13 },
]

// Mock tasks
export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Review customer feedback from last week",
    description: "Analyze and summarize key pain points",
    status: "todo",
    priority: "high",
    goal: "Startup",
    tags: ["customer", "research"],
    estimated_time_minutes: 45,
    energy_level: "high",
    scheduled_at: new Date().toISOString(),
    due_date: new Date().toISOString().split("T")[0],
    note_id: "1",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "2",
    title: "Complete Java Spring Boot module",
    description: "Finish the authentication chapter",
    status: "in_progress",
    priority: "medium",
    goal: "Dev Learning",
    tags: ["java", "backend"],
    estimated_time_minutes: 60,
    energy_level: "high",
    scheduled_at: new Date().toISOString(),
    note_id: "2",
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "3",
    title: "Anki flashcards - 50 new words",
    description: "Daily vocabulary practice",
    status: "todo",
    priority: "medium",
    goal: "Japanese N3",
    tags: ["vocabulary", "daily"],
    estimated_time_minutes: 15,
    energy_level: "low",
    scheduled_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "4",
    title: "Prepare pitch deck for investor meeting",
    description: "Update metrics and traction slide",
    status: "todo",
    priority: "urgent",
    goal: "Startup",
    tags: ["investor", "pitch"],
    estimated_time_minutes: 120,
    energy_level: "high",
    due_date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    note_id: "3",
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "5",
    title: "Write unit tests for auth module",
    status: "done",
    priority: "medium",
    goal: "Dev Learning",
    tags: ["testing", "java"],
    estimated_time_minutes: 90,
    completed_at: new Date(Date.now() - 43200000).toISOString(),
    created_at: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: "6",
    title: "Grammar review - N3 patterns",
    description: "Focus on conditional forms",
    status: "todo",
    priority: "low",
    goal: "Japanese N3",
    tags: ["grammar"],
    estimated_time_minutes: 30,
    energy_level: "medium",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "7",
    title: "Call with potential customer - ABC Corp",
    status: "done",
    priority: "high",
    goal: "Startup",
    tags: ["sales", "meeting"],
    estimated_time_minutes: 30,
    completed_at: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: "8",
    title: "Design database schema for new feature",
    description: "Multi-tenant support",
    status: "in_progress",
    priority: "high",
    goal: "Startup",
    tags: ["database", "architecture"],
    estimated_time_minutes: 60,
    energy_level: "high",
    note_id: "4",
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
]

// Mock notes
export const mockNotes: Note[] = [
  {
    id: "1",
    title: "Weekly Customer Insights",
    content_preview:
      "Key feedback from user interviews: 1. Onboarding is confusing 2. Need better mobile experience 3. Pricing concerns...",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    has_tasks: true,
    task_count: 1,
  },
  {
    id: "2",
    title: "Java Learning Path",
    content_preview:
      "Spring Boot fundamentals: - Dependency Injection - REST APIs - JPA/Hibernate - Security basics...",
    created_at: new Date(Date.now() - 604800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    has_tasks: true,
    task_count: 1,
  },
  {
    id: "3",
    title: "Investor Meeting Prep",
    content_preview:
      "Key points for Series A pitch: - Show MRR growth (40% MoM) - User retention metrics - Product roadmap...",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
    has_tasks: true,
    task_count: 1,
  },
  {
    id: "4",
    title: "Architecture Decisions",
    content_preview:
      "Multi-tenant considerations: - Row-level security - Schema per tenant - Hybrid approach...",
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 14400000).toISOString(),
    has_tasks: true,
    task_count: 1,
  },
  {
    id: "5",
    title: "Japanese Study Notes",
    content_preview:
      "Conditional forms in Japanese: - ば form (hypothetical) - たら form (after/if) - なら (if it's the case)...",
    created_at: new Date(Date.now() - 432000000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    has_tasks: false,
    task_count: 0,
  },
  {
    id: "6",
    title: "Random Ideas",
    content_preview:
      "Ideas for product improvements: - AI-powered task suggestions - Integration with calendar - Voice notes...",
    created_at: new Date(Date.now() - 518400000).toISOString(),
    updated_at: new Date(Date.now() - 345600000).toISOString(),
    has_tasks: false,
    task_count: 0,
  },
]

// Philosophical quotes for compassionate accountability
export const philosophicalQuotes = [
  {
    vi: "Vì sợ mình không phải là ngọc, nên tôi không dám khổ công mài giũa; lại vì có chút tin mình là ngọc, nên tôi không cam lòng đứng lẫn với đá sỏi.",
    en: "Because I fear I am not jade, I dare not polish myself diligently; yet because I believe I am jade, I refuse to stand among pebbles.",
  },
  {
    vi: "Mỗi bước đi nhỏ và kiên trì đều dẫn đến sự tiến bộ.",
    en: "Every small and persistent step leads to progress.",
  },
  {
    vi: "Con kiến cố gắng hết sức nhưng không thể làm lay cây đại thụ, nhưng nó muốn làm gì với cây đại thụ, đó chính là thái độ của nó.",
    en: "The ant tries its best but cannot shake the great tree, but what it wants to do with the tree—that is its attitude.",
  },
]

// Daily suggestions helper
export function getDailySuggestions(): Task[] {
  return mockTasks
    .filter((t) => t.status === "todo" || t.status === "in_progress")
    .sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
    .slice(0, 3)
}

// Get tasks by status
export function getTasksByStatus(status: Task["status"]): Task[] {
  return mockTasks.filter((t) => t.status === status)
}

// Get tasks by goal
export function getTasksByGoal(goal: string): Task[] {
  return mockTasks.filter((t) => t.goal === goal)
}

// Stats helpers
export function getTaskStats() {
  const total = mockTasks.length
  const completed = mockTasks.filter((t) => t.status === "done").length
  const inProgress = mockTasks.filter((t) => t.status === "in_progress").length
  const todo = mockTasks.filter((t) => t.status === "todo").length
  const overdue = mockTasks.filter(
    (t) =>
      t.due_date && new Date(t.due_date) < new Date() && t.status !== "done"
  ).length

  return {
    total,
    completed,
    inProgress,
    todo,
    overdue,
    completionRate: Math.round((completed / total) * 100),
  }
}
