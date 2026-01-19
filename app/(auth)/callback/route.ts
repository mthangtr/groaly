import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirect to dashboard or next page after successful auth
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // Return to login if code exchange failed
  return NextResponse.redirect(new URL("/login?error=auth_failed", request.url))
}
