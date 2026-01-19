import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"

export const updateSession = async (request: NextRequest) => {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session to update auth state
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes: dashboard, notes, tasks, calendar, focus, settings, kanban, table
  const protectedRoutes = [
    "/notes",
    "/tasks",
    "/dashboard",
    "/calendar",
    "/focus",
    "/settings",
    "/kanban",
    "/table",
  ]

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to notes if accessing login/auth pages with active session
  if (
    session &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/notes", request.url))
  }

  return response
}
