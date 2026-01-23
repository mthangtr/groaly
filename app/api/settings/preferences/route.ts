import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { PreferencesResponse, ErrorResponse, UpdatePreferencesRequest, UserPreferences } from "@/types/settings"

/**
 * GET /api/settings/preferences
 * Returns the current user's preferences
 */
export async function GET(): Promise<NextResponse<PreferencesResponse | ErrorResponse>> {
    try {
        const supabase = await createClient()

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        // Fetch user preferences from database
        const { data: userData, error: fetchError } = await supabase
            .from("users")
            .select(`
        notifications_enabled,
        email_notifications,
        focus_reminders,
        daily_planning_reminder,
        compact_mode,
        show_quotes,
        llm_model,
        pomodoro_work_minutes,
        pomodoro_short_break_minutes,
        pomodoro_long_break_minutes,
        pomodoro_cycles_before_long_break
      `)
            .eq("id", user.id)
            .single()

        if (fetchError) {
            console.error("Error fetching preferences:", fetchError)
            return NextResponse.json(
                { error: "Failed to fetch preferences", details: fetchError.message },
                { status: 500 }
            )
        }

        if (!userData) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        const preferences: UserPreferences = {
            notifications_enabled: userData.notifications_enabled ?? true,
            email_notifications: userData.email_notifications ?? true,
            focus_reminders: userData.focus_reminders ?? true,
            daily_planning_reminder: userData.daily_planning_reminder ?? false,
            compact_mode: userData.compact_mode ?? false,
            show_quotes: userData.show_quotes ?? true,
            llm_model: userData.llm_model ?? "anthropic/claude-haiku-4.5",
            pomodoro_work_minutes: userData.pomodoro_work_minutes ?? 25,
            pomodoro_short_break_minutes: userData.pomodoro_short_break_minutes ?? 5,
            pomodoro_long_break_minutes: userData.pomodoro_long_break_minutes ?? 15,
            pomodoro_cycles_before_long_break: userData.pomodoro_cycles_before_long_break ?? 4,
        }

        return NextResponse.json({ preferences })
    } catch (error) {
        console.error("Unexpected error in GET /api/settings/preferences:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

/**
 * PATCH /api/settings/preferences
 * Updates the current user's preferences
 */
export async function PATCH(
    request: NextRequest
): Promise<NextResponse<PreferencesResponse | ErrorResponse>> {
    try {
        const supabase = await createClient()

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        // Parse and validate request body
        const body = await request.json() as UpdatePreferencesRequest

        // Validate allowed preference fields
        const allowedFields: (keyof UserPreferences)[] = [
            "notifications_enabled",
            "email_notifications",
            "focus_reminders",
            "daily_planning_reminder",
            "compact_mode",
            "show_quotes",
            "llm_model",
            "pomodoro_work_minutes",
            "pomodoro_short_break_minutes",
            "pomodoro_long_break_minutes",
            "pomodoro_cycles_before_long_break",
        ]

        const updates: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(body)) {
            if (allowedFields.includes(key as keyof UserPreferences)) {
                // Validate pomodoro settings (must be positive integers)
                if (key.startsWith("pomodoro_") && typeof value === "number") {
                    if (value <= 0 || value > 300) {
                        return NextResponse.json(
                            { error: `Invalid value for ${key}: must be between 1 and 300 minutes` },
                            { status: 400 }
                        )
                    }
                }
                updates[key] = value
            }
        }

        // If no valid fields to update
        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                { error: "No valid fields to update" },
                { status: 400 }
            )
        }

        // Add updated_at timestamp
        updates.updated_at = new Date().toISOString()

        // Update preferences in database
        const { data: userData, error: updateError } = await supabase
            .from("users")
            .update(updates)
            .eq("id", user.id)
            .select(`
        notifications_enabled,
        email_notifications,
        focus_reminders,
        daily_planning_reminder,
        compact_mode,
        show_quotes,
        llm_model,
        pomodoro_work_minutes,
        pomodoro_short_break_minutes,
        pomodoro_long_break_minutes,
        pomodoro_cycles_before_long_break
      `)
            .single()

        if (updateError) {
            console.error("Error updating preferences:", updateError)
            return NextResponse.json(
                { error: "Failed to update preferences", details: updateError.message },
                { status: 500 }
            )
        }

        if (!userData) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        const preferences: UserPreferences = {
            notifications_enabled: userData.notifications_enabled ?? true,
            email_notifications: userData.email_notifications ?? true,
            focus_reminders: userData.focus_reminders ?? true,
            daily_planning_reminder: userData.daily_planning_reminder ?? false,
            compact_mode: userData.compact_mode ?? false,
            show_quotes: userData.show_quotes ?? true,
            llm_model: userData.llm_model ?? "anthropic/claude-haiku-4.5",
            pomodoro_work_minutes: userData.pomodoro_work_minutes ?? 25,
            pomodoro_short_break_minutes: userData.pomodoro_short_break_minutes ?? 5,
            pomodoro_long_break_minutes: userData.pomodoro_long_break_minutes ?? 15,
            pomodoro_cycles_before_long_break: userData.pomodoro_cycles_before_long_break ?? 4,
        }

        return NextResponse.json({ preferences })
    } catch (error) {
        console.error("Unexpected error in PATCH /api/settings/preferences:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
