// app/api/auth/oauth/[provider]/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const OAUTH_PROVIDERS = ["google", "facebook", "apple", "github"] as const
type OAuthProvider = (typeof OAUTH_PROVIDERS)[number]

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const provider = params.provider as OAuthProvider

    if (!OAUTH_PROVIDERS.includes(provider)) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const redirectTo = searchParams.get("redirect") || "/dashboard"

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?redirect=${redirectTo}`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    })

    if (error) {
      console.error("[v0] OAuth error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.redirect(data.url)
  } catch (error) {
    console.error("[v0] OAuth error:", error)
    return NextResponse.json({ error: "OAuth failed" }, { status: 500 })
  }
}

// app/api/auth/callback/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const redirect = searchParams.get("redirect") || "/dashboard"

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL(redirect, process.env.NEXT_PUBLIC_APP_URL))
}
