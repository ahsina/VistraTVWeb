// app/api/auth/register/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, affiliateCode } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      )
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins une majuscule" },
        { status: 400 }
      )
    }
    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins une minuscule" },
        { status: 400 }
      )
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins un chiffre" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for now
      user_metadata: {
        name,
        affiliate_code: affiliateCode || null,
      },
    })

    if (authError) {
      console.error("[v0] Auth error:", authError)
      // Generic error message to not reveal if email exists
      return NextResponse.json(
        { error: "Impossible de créer le compte. Veuillez réessayer." },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Erreur lors de la création du compte" },
        { status: 500 }
      )
    }

    // Create user profile
    const { error: profileError } = await supabase.from("user_profiles").insert({
      id: authData.user.id,
      email,
      name,
      language: "fr",
      created_at: new Date().toISOString(),
    })

    if (profileError) {
      console.error("[v0] Profile creation error:", profileError)
      // Don't fail registration if profile creation fails
    }

    // Track affiliate referral if code provided
    if (affiliateCode) {
      try {
        const { data: affiliate } = await supabase
          .from("affiliates")
          .select("id")
          .eq("affiliate_code", affiliateCode)
          .eq("status", "active")
          .maybeSingle()

        if (affiliate) {
          // Mark any pending clicks as converted
          await supabase
            .from("affiliate_clicks")
            .update({ 
              converted: true, 
              converted_at: new Date().toISOString(),
              converted_user_id: authData.user.id
            })
            .eq("affiliate_id", affiliate.id)
            .eq("converted", false)
            .order("created_at", { ascending: false })
            .limit(1)
        }
      } catch (error) {
        console.error("[v0] Affiliate tracking error:", error)
      }
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(email, name)
    } catch (error) {
      console.error("[v0] Welcome email error:", error)
      // Don't fail registration if email fails
    }

    console.log("[v0] User registered successfully:", email)

    return NextResponse.json({
      success: true,
      message: "Compte créé avec succès",
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json(
      { error: "Erreur serveur. Veuillez réessayer." },
      { status: 500 }
    )
  }
}

// Send welcome email
async function sendWelcomeEmail(email: string, name: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vistratv.com"
  
  const response = await fetch(`${appUrl}/api/email/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: email,
      template: "welcome",
      data: {
        name: name || "Cher client",
        email,
        loginUrl: `${appUrl}/login`,
        tutorialsUrl: `${appUrl}/tutorials`,
        supportUrl: `${appUrl}/support`,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to send welcome email")
  }

  return response.json()
}
