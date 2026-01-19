import { SupabaseClient } from "@supabase/supabase-js"

/**
 * Ensures a user exists in public.users table
 * This is needed because foreign key constraints require user_id to exist in public.users
 * 
 * Call this function whenever you need to ensure a user record exists
 * (e.g., before creating notes, tasks, etc.)
 */
export async function ensureUserExists(
  supabase: SupabaseClient,
  userId: string,
  userEmail?: string
): Promise<void> {
  // Check if user already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .single()

  if (existingUser) {
    return // User already exists
  }

  // User doesn't exist, create it
  const { error } = await supabase
    .from("users")
    .insert({
      id: userId,
      email: userEmail || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

  if (error && error.code !== "23505") {
    // 23505 is duplicate key error (race condition), which we can ignore
    console.error("Error creating user in public.users:", error)
    throw new Error("Failed to create user record")
  }
}
