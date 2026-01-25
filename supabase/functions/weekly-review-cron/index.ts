import "jsr:@supabase/functions-js/edge-runtime.d.ts"

/**
 * Weekly Review Cron Job
 * 
 * Scheduled to run every Sunday at 8 PM (configured in Supabase dashboard)
 * Generates weekly reviews for all active users
 * 
 * Schedule (cron syntax): 0 20 * * 0 (Every Sunday at 8 PM UTC)
 * Note: Adjust for user timezone in production
 */

Deno.serve(async (req: Request) => {
  try {
    const authHeader = req.headers.get("Authorization")
    
    // Verify this is a scheduled call (has special auth token)
    // In production, check against CRON_SECRET env var
    const cronSecret = Deno.env.get("CRON_SECRET")
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    // Get Supabase URL and service role key (has admin access)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables")
    }

    // Import Supabase client
    const { createClient } = await import("jsr:@supabase/supabase-js@2")
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Calculate last week's Monday (week to review)
    const today = new Date()
    const lastMonday = new Date(today)
    lastMonday.setDate(today.getDate() - ((today.getDay() + 6) % 7) - 7) // Go back to last Monday
    const weekStart = lastMonday.toISOString().split("T")[0]

    console.log(`Generating weekly reviews for week starting ${weekStart}`)

    // Get all active users (who have tasks)
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email, timezone")
      .not("id", "is", null)

    if (usersError) {
      throw new Error(`Failed to fetch users: ${usersError.message}`)
    }

    const results = {
      success: 0,
      skipped: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Generate review for each user
    for (const user of users || []) {
      try {
        // Check if user has tasks for this week
        const weekEnd = new Date(lastMonday)
        weekEnd.setDate(weekEnd.getDate() + 7)
        const weekEndStr = weekEnd.toISOString().split("T")[0]

        const { data: tasks, error: tasksError } = await supabase
          .from("tasks")
          .select("id")
          .eq("user_id", user.id)
          .or(`created_at.gte.${weekStart},created_at.lt.${weekEndStr}`)
          .limit(1)

        if (tasksError) {
          console.error(`Error checking tasks for user ${user.email}:`, tasksError)
          results.failed++
          results.errors.push(`${user.email}: ${tasksError.message}`)
          continue
        }

        if (!tasks || tasks.length === 0) {
          console.log(`Skipping user ${user.email} - no tasks this week`)
          results.skipped++
          continue
        }

        // Call the generate API internally (using service role)
        const appUrl = Deno.env.get("APP_URL") || "http://localhost:3000"
        const generateResponse = await fetch(
          `${appUrl}/api/weekly-reviews/generate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({
              week_start: weekStart,
              user_id: user.id, // Pass user_id for service role auth
            }),
          }
        )

        if (!generateResponse.ok) {
          const error = await generateResponse.text()
          console.error(`Failed to generate review for ${user.email}:`, error)
          results.failed++
          results.errors.push(`${user.email}: ${error}`)
          continue
        }

        console.log(`✓ Generated review for ${user.email}`)
        results.success++
      } catch (error) {
        console.error(`Error processing user ${user.email}:`, error)
        results.failed++
        results.errors.push(`${user.email}: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    console.log(`Completed: ${results.success} success, ${results.skipped} skipped, ${results.failed} failed`)

    return new Response(
      JSON.stringify({
        week_start: weekStart,
        total_users: users?.length || 0,
        ...results,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    console.error("Cron job error:", error)
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }
})
