// middleware.ts - Version améliorée avec protection complète
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

// Routes qui nécessitent une authentification utilisateur
const PROTECTED_USER_ROUTES = [
  "/dashboard",
  "/affiliate",
]

// Routes qui nécessitent une authentification admin
const PROTECTED_ADMIN_ROUTES = [
  "/admin/dashboard",
]

// Routes d'authentification (rediriger si déjà connecté)
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/admin/login",
  "/admin/sign-up",
]

// Routes API publiques (pas besoin d'auth)
const PUBLIC_API_ROUTES = [
  "/api/auth",
  "/api/content",
  "/api/channels",
  "/api/pricing",
  "/api/support",
  "/api/payment/webhook",
  "/api/analytics/track",
  "/api/promo-codes/validate",
  "/api/cron",
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

  console.log("[v0] Middleware running for path:", pathname)

  // Create response and Supabase client
  let response = NextResponse.next({
    request: { headers: request.headers },
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
              request: { headers: request.headers },
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

  // ========================================
  // API ROUTES PROTECTION
  // ========================================
  if (pathname.startsWith("/api/")) {
    // Check if it's a public API route
    const isPublicApi = PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route))
    
    if (isPublicApi) {
      return response
    }

    // Protected API routes require authentication
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Admin API routes require admin role
    if (pathname.startsWith("/api/admin/")) {
      const { data: adminProfile } = await supabase
        .from("admin_profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()

      if (!adminProfile?.is_admin) {
        return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
      }
    }

    return response
  }

  // ========================================
  // AUTH ROUTES (redirect if already logged in)
  // ========================================
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))
  
  if (isAuthRoute && user) {
    // User is already logged in
    if (pathname.startsWith("/admin/")) {
      // Check if user is admin before redirecting to admin dashboard
      const { data: adminProfile } = await supabase
        .from("admin_profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()

      if (adminProfile?.is_admin) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url))
      }
      // Not an admin, redirect to home
      return NextResponse.redirect(new URL("/", request.url))
    }
    // Regular user, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // ========================================
  // PROTECTED ADMIN ROUTES
  // ========================================
  const isAdminRoute = PROTECTED_ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )

  if (isAdminRoute) {
    if (!user) {
      console.log("[v0] No user found, redirecting to /admin/login")
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
      console.log("[v0] User is not admin, redirecting to home")
      return NextResponse.redirect(new URL("/", request.url))
    }

    console.log("[v0] Admin access granted for:", user.email)
    return response
  }

  // ========================================
  // PROTECTED USER ROUTES
  // ========================================
  const isProtectedUserRoute = PROTECTED_USER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )

  if (isProtectedUserRoute) {
    if (!user) {
      console.log("[v0] No user found, redirecting to /login")
      const redirectUrl = new URL("/login", request.url)
      redirectUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(redirectUrl)
    }

    console.log("[v0] User access granted for:", user.email)
    return response
  }

  // ========================================
  // PUBLIC ROUTES - Allow access
  // ========================================
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
