// app/api/auth/verify-email/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/email/email-service"
import crypto from "crypto"

// Générer un token de vérification
function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

// POST - Envoyer un email de vérification
export async function POST(request: NextRequest) {
  try {
    const { email, userId } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    const supabase = createClient()

    // Générer le token
    const token = generateVerificationToken()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // Expire dans 24h

    // Sauvegarder le token
    await supabase.from("email_verifications").upsert({
      email,
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString(),
      verified: false,
    })

    // Envoyer l'email
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

    await sendEmail({
      to: email,
      template: "email_verification",
      data: {
        verifyUrl,
        expiresIn: "24 heures",
      },
    })

    return NextResponse.json({ success: true, message: "Verification email sent" })
  } catch (error) {
    console.error("[v0] Error sending verification email:", error)
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
  }
}

// GET - Vérifier le token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 })
    }

    const supabase = createClient()

    // Chercher le token
    const { data: verification, error } = await supabase
      .from("email_verifications")
      .select("*")
      .eq("token", token)
      .eq("verified", false)
      .single()

    if (error || !verification) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Vérifier l'expiration
    if (new Date(verification.expires_at) < new Date()) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 })
    }

    // Marquer comme vérifié
    await supabase
      .from("email_verifications")
      .update({ verified: true, verified_at: new Date().toISOString() })
      .eq("id", verification.id)

    // Mettre à jour le profil utilisateur
    if (verification.user_id) {
      await supabase
        .from("user_profiles")
        .update({ email_verified: true })
        .eq("id", verification.user_id)
    }

    return NextResponse.json({ success: true, email: verification.email })
  } catch (error) {
    console.error("[v0] Error verifying email:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
