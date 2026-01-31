// app/api/verify-turnstile/route.ts
import { type NextRequest, NextResponse } from "next/server"

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY

interface TurnstileVerifyResponse {
  success: boolean
  "error-codes"?: string[]
  challenge_ts?: string
  hostname?: string
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token manquant" },
        { status: 400 }
      )
    }

    if (!TURNSTILE_SECRET_KEY) {
      console.error("[Turnstile] Secret key not configured")
      // In development, allow bypass
      if (process.env.NODE_ENV === "development") {
        console.warn("[Turnstile] Bypassing verification in development mode")
        return NextResponse.json({ success: true })
      }
      return NextResponse.json(
        { success: false, error: "Configuration error" },
        { status: 500 }
      )
    }

    // Get client IP
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown"

    // Verify with Cloudflare
    const formData = new URLSearchParams()
    formData.append("secret", TURNSTILE_SECRET_KEY)
    formData.append("response", token)
    formData.append("remoteip", ip)

    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }
    )

    const result: TurnstileVerifyResponse = await verifyResponse.json()

    if (result.success) {
      return NextResponse.json({ 
        success: true,
        hostname: result.hostname,
        timestamp: result.challenge_ts
      })
    } else {
      console.error("[Turnstile] Verification failed:", result["error-codes"])
      return NextResponse.json(
        { 
          success: false, 
          error: "Vérification échouée",
          codes: result["error-codes"]
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("[Turnstile] Verification error:", error)
    return NextResponse.json(
      { success: false, error: "Erreur de vérification" },
      { status: 500 }
    )
  }
}
