import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  console.log("[v0] Middleware running for path:", request.nextUrl.pathname)

  if (request.nextUrl.pathname.includes("/layout") || request.nextUrl.pathname.includes("/_next")) {
    console.log("[v0] Skipping internal Next.js request")
    return NextResponse.next()
  }

  const isAdminAuthPage =
    request.nextUrl.pathname.startsWith("/admin/login") || request.nextUrl.pathname.startsWith("/admin/sign-up")

  if (request.nextUrl.pathname.startsWith("/admin") && !isAdminAuthPage) {
    console.log("[v0] Checking admin authentication for:", request.nextUrl.pathname)
    const response = NextResponse.next()

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
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("[v0] No user found, redirecting to /admin/login")
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    console.log("[v0] User found:", user.email, "Checking admin role...")

    const { data: profile } = await supabase.from("admin_profiles").select("is_admin").eq("id", user.id).single()

    if (!profile || !profile.is_admin) {
      console.log("[v0] User is not admin, redirecting to home")
      return NextResponse.redirect(new URL("/", request.url))
    }

    console.log("[v0] User is admin, allowing access")
    return response
  }

  console.log("[v0] No middleware action needed for:", request.nextUrl.pathname)
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
