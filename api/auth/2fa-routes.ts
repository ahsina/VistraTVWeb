// app/api/auth/2fa/setup/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@/lib/supabase/admin"
import { generateTOTPSecret, generateTOTPUrl, generateBackupCodes } from "@/lib/auth/two-factor"

// POST - Initialiser la configuration 2FA
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Générer le secret
    const secret = generateTOTPSecret()
    const qrCodeUrl = generateTOTPUrl(secret, user.email || "", "VistraTV")

    // Sauvegarder temporairement (non activé)
    await adminSupabase.from("user_2fa_setup").upsert({
      user_id: user.id,
      secret,
      is_enabled: false,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      secret,
      qrCodeUrl,
    })
  } catch (error) {
    console.error("[v0] 2FA setup error:", error)
    return NextResponse.json({ error: "Setup failed" }, { status: 500 })
  }
}

// app/api/auth/2fa/verify/route.ts
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Récupérer le setup
    const { data: setup } = await adminSupabase
      .from("user_2fa_setup")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (!setup) {
      return NextResponse.json({ error: "2FA not setup" }, { status: 400 })
    }

    // Vérifier le code
    const { verifyTOTP } = await import("@/lib/auth/two-factor")
    const isValid = verifyTOTP(setup.secret, code)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 })
    }

    // Générer les codes de backup
    const backupCodes = generateBackupCodes(10)

    // Activer 2FA
    await adminSupabase
      .from("user_2fa_setup")
      .update({
        is_enabled: true,
        backup_codes: backupCodes,
        enabled_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)

    // Mettre à jour le profil
    await adminSupabase
      .from("user_profiles")
      .update({ two_factor_enabled: true })
      .eq("id", user.id)

    return NextResponse.json({
      success: true,
      backupCodes,
      message: "2FA enabled successfully",
    })
  } catch (error) {
    console.error("[v0] 2FA verify error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}

// app/api/auth/2fa/validate/route.ts - Pour la connexion
export async function POST(request: NextRequest) {
  try {
    const { userId, code } = await request.json()
    const adminSupabase = createAdminClient()

    // Récupérer le setup
    const { data: setup } = await adminSupabase
      .from("user_2fa_setup")
      .select("*")
      .eq("user_id", userId)
      .eq("is_enabled", true)
      .single()

    if (!setup) {
      return NextResponse.json({ error: "2FA not enabled" }, { status: 400 })
    }

    // Vérifier le code TOTP
    const { verifyTOTP } = await import("@/lib/auth/two-factor")
    let isValid = verifyTOTP(setup.secret, code)

    // Si pas valide, vérifier les codes de backup
    if (!isValid && setup.backup_codes) {
      const backupIndex = setup.backup_codes.indexOf(code)
      if (backupIndex !== -1) {
        isValid = true
        // Supprimer le code utilisé
        const newBackupCodes = [...setup.backup_codes]
        newBackupCodes.splice(backupIndex, 1)
        await adminSupabase
          .from("user_2fa_setup")
          .update({ backup_codes: newBackupCodes })
          .eq("user_id", userId)
      }
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 })
    }

    return NextResponse.json({ success: true, valid: true })
  } catch (error) {
    console.error("[v0] 2FA validate error:", error)
    return NextResponse.json({ error: "Validation failed" }, { status: 500 })
  }
}

// app/api/auth/2fa/disable/route.ts
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Vérifier le code avant de désactiver
    const { data: setup } = await adminSupabase
      .from("user_2fa_setup")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_enabled", true)
      .single()

    if (!setup) {
      return NextResponse.json({ error: "2FA not enabled" }, { status: 400 })
    }

    const { verifyTOTP } = await import("@/lib/auth/two-factor")
    if (!verifyTOTP(setup.secret, code)) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 })
    }

    // Désactiver
    await adminSupabase
      .from("user_2fa_setup")
      .update({ is_enabled: false })
      .eq("user_id", user.id)

    await adminSupabase
      .from("user_profiles")
      .update({ two_factor_enabled: false })
      .eq("id", user.id)

    return NextResponse.json({ success: true, message: "2FA disabled" })
  } catch (error) {
    console.error("[v0] 2FA disable error:", error)
    return NextResponse.json({ error: "Disable failed" }, { status: 500 })
  }
}
