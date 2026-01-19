export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          timezone: string
          theme: "light" | "dark"
          energy_preference: "morning" | "evening" | "balanced"
          weekly_goal_hours: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string
          theme?: "light" | "dark"
          energy_preference?: "morning" | "evening" | "balanced"
          weekly_goal_hours?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string
          theme?: "light" | "dark"
          energy_preference?: "morning" | "evening" | "balanced"
          weekly_goal_hours?: number
          created_at?: string
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          metadata: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          metadata?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          metadata?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          status: "todo" | "in_progress" | "done"
          priority: number
          due_date: string | null
          tags: string[]
          metadata: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          status?: "todo" | "in_progress" | "done"
          priority?: number
          due_date?: string | null
          tags?: string[]
          metadata?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          status?: "todo" | "in_progress" | "done"
          priority?: number
          due_date?: string | null
          tags?: string[]
          metadata?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
      }
      protected_slots: {
        Row: {
          id: string
          user_id: string
          title: string
          start_time: string
          end_time: string
          is_recurring: boolean
          recurrence_rule: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          start_time: string
          end_time: string
          is_recurring?: boolean
          recurrence_rule?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          start_time?: string
          end_time?: string
          is_recurring?: boolean
          recurrence_rule?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          role: "user" | "assistant"
          content: string
          metadata: Record<string, unknown>
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: "user" | "assistant"
          content: string
          metadata?: Record<string, unknown>
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: "user" | "assistant"
          content?: string
          metadata?: Record<string, unknown>
          created_at?: string
        }
      }
      weekly_reviews: {
        Row: {
          id: string
          user_id: string
          week_start: string
          reflection: string | null
          achievements: string[]
          next_week_goals: string[]
          energy_level: "low" | "medium" | "high" | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          week_start: string
          reflection?: string | null
          achievements?: string[]
          next_week_goals?: string[]
          energy_level?: "low" | "medium" | "high" | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          week_start?: string
          reflection?: string | null
          achievements?: string[]
          next_week_goals?: string[]
          energy_level?: "low" | "medium" | "high" | null
          created_at?: string
          updated_at?: string
        }
      }
      focus_sessions: {
        Row: {
          id: string
          user_id: string
          task_id: string | null
          start_time: string
          end_time: string | null
          duration_minutes: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id?: string | null
          start_time: string
          end_time?: string | null
          duration_minutes?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string | null
          start_time?: string
          end_time?: string | null
          duration_minutes?: number | null
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: Record<string, unknown>
    Functions: Record<string, unknown>
    Enums: Record<string, unknown>
    CompositeTypes: Record<string, unknown>
  }
}
