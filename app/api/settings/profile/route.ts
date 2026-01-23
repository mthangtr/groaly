import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { ProfileResponse, ErrorResponse, UpdateProfileRequest } from "@/types/settings"

/**
 * GET /api/settings/profile
 * Returns the current user's profile information
 */
export async function GET(): Promise<NextResponse<ProfileResponse | ErrorResponse>> {
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

        // Fetch user profile from database
        const { data: profile, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single()

        if (profileError) {
            console.error("Error fetching profile:", profileError)
            return NextResponse.json(
                { error: "Failed to fetch profile", details: profileError.message },
                { status: 500 }
            )
        }

        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ profile })
    } catch (error) {
        console.error("Unexpected error in GET /api/settings/profile:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

/**
 * PATCH /api/settings/profile
 * Updates the current user's profile information
 */
export async function PATCH(
    request: NextRequest
): Promise<NextResponse<ProfileResponse | ErrorResponse>> {
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
        const body = await request.json() as UpdateProfileRequest

        // Validate allowed fields
        const allowedFields = [
            "full_name",
            "timezone",
            "theme",
            "energy_preference",
            "weekly_goal_hours",
        ]

        const updates: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(body)) {
            if (allowedFields.includes(key)) {
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

        // Update profile in database
        const { data: profile, error: updateError } = await supabase
            .from("users")
            .update(updates)
            .eq("id", user.id)
            .select()
            .single()

        if (updateError) {
            console.error("Error updating profile:", updateError)
            return NextResponse.json(
                { error: "Failed to update profile", details: updateError.message },
                { status: 500 }
            )
        }

        // If updating email, also update in auth.users via Supabase auth
        if (body.full_name) {
            const { error: authUpdateError } = await supabase.auth.updateUser({
                data: {
                    full_name: body.full_name,
                },
            })

            if (authUpdateError) {
                console.error("Error updating auth user metadata:", authUpdateError)
                // Don't fail the request, just log the error
            }
        }

        return NextResponse.json({ profile })
    } catch (error) {
        console.error("Unexpected error in PATCH /api/settings/profile:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
