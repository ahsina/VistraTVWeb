import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Routes qui nécessitent une authentification utilisateur
const protectedUserRoutes = [
  "/dashboard",
  "/dashboard/settings",
  "/affiliate",
]

// Routes qui nécessitent une authentification admin
const protectedAdminRoutes = [
  "/admin/dashboard",
]

// Routes publiques (pas besoin d'être connecté)
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/admin/login",
  "/subscriptions",
  "/checkout",
  "/about",
  "/how-it-works",
  "/support",
  "/terms",
  "/privacy",
  "/tutorials",
  "/browse",
]

// Routes API qui ne nécessitent pas d'authentification
const publicApiRoutes = [
  "/api/auth",
  "/api/content",
  "/api/channels",
  "/api/pricing",
  "/api/support",
  "/api/payment/webhook",
  "/api/analytics/track",
  "/api/promo-codes/validate",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next()
  }

  // Create Supabase client
  let response = NextResponse.next({
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
            request.cookies.set(name, value)
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if route is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )

  const isPublicApiRoute = publicApiRoutes.some(
    (route) => pathname.startsWith(route)
  )

  // Check if route requires admin
  const isAdminRoute = protectedAdminRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )

  // Check if route requires user auth
  const isProtectedUserRoute = protectedUserRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )

  // API routes handling
  if (pathname.startsWith("/api/")) {
    if (isPublicApiRoute) {
      return response
    }

    // Protected API routes require authentication
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Admin API routes require admin role
    if (pathname.startsWith("/api/admin/")) {
      const { data: adminProfile } = await supabase
        .from("admin_profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()

      if (!adminProfile?.is_admin) {
        return NextResponse.json(
          { error: "Forbidden - Admin access required" },
          { status: 403 }
        )
      }
    }

    return response
  }

  // Public routes - allow access
  if (isPublicRoute) {
    // If user is logged in and trying to access login/register, redirect to dashboard
    if (user && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    if (user && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }
    return response
  }

  // Protected admin routes
  if (isAdminRoute) {
    if (!user) {
      const redirectUrl = new URL("/admin/login", request.url)
      redirectUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user is admin
    const { data: adminProfile } = await supabase
      .from("admin_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (!adminProfile?.is_admin) {
      // Not an admin, redirect to home
      return NextResponse.redirect(new URL("/", request.url))
    }

    return response
  }

  // Protected user routes
  if (isProtectedUserRoute) {
    if (!user) {
      const redirectUrl = new URL("/login", request.url)
      redirectUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(redirectUrl)
    }
    return response
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
