export type UserProfile = {
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

export type UpdateProfileRequest = {
    full_name?: string
    timezone?: string
    theme?: "light" | "dark"
    energy_preference?: "morning" | "evening" | "balanced"
    weekly_goal_hours?: number
}

export type UserPreferences = {
    // Notification settings
    notifications_enabled: boolean
    email_notifications: boolean
    focus_reminders: boolean
    daily_planning_reminder: boolean

    // Appearance
    compact_mode: boolean
    show_quotes: boolean

    // LLM/AI settings (will be extended with BYOK)
    llm_model: string

    // Pomodoro settings
    pomodoro_work_minutes: number
    pomodoro_short_break_minutes: number
    pomodoro_long_break_minutes: number
    pomodoro_cycles_before_long_break: number
}

export type UpdatePreferencesRequest = Partial<UserPreferences>

export type ProfileResponse = {
    profile: UserProfile
}

export type PreferencesResponse = {
    preferences: UserPreferences
}

export type ErrorResponse = {
    error: string
    details?: string
}
