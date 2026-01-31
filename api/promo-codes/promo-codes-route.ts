// app/api/promo-codes/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@/lib/supabase/admin"
import crypto from "crypto"

// Générer un code promo unique
function generatePromoCode(prefix: string = "", length: number = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = prefix
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// GET - Lister les codes promo (admin)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Vérifier admin
    const { data: adminProfile } = await supabase
      .from("admin_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (!adminProfile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let query = adminSupabase
      .from("promo_codes")
      .select(`
        *,
        promo_code_usage (
          id,
          used_at,
          user_id,
          payment_transaction_id
        )
      `)
      .order("created_at", { ascending: false })

    if (status === "active") {
      query = query.eq("is_active", true)
    } else if (status === "inactive") {
      query = query.eq("is_active", false)
    } else if (status === "expired") {
      query = query.lt("end_date", new Date().toISOString())
    }

    if (search) {
      query = query.ilike("code", `%${search}%`)
    }

    const { data, error } = await query

    if (error) throw error

    // Calculer les stats pour chaque code
    const codesWithStats = (data || []).map((code) => ({
      ...code,
      usageCount: code.promo_code_usage?.length || 0,
      remainingUses: code.max_uses ? code.max_uses - (code.promo_code_usage?.length || 0) : null,
      isExpired: code.end_date && new Date(code.end_date) < new Date(),
      isExhausted: code.max_uses && (code.promo_code_usage?.length || 0) >= code.max_uses,
    }))

    return NextResponse.json({ promoCodes: codesWithStats })
  } catch (error) {
    console.error("[v0] Error fetching promo codes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Créer un ou plusieurs codes promo
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

    // Vérifier admin
    const { data: adminProfile } = await supabase
      .from("admin_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (!adminProfile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const {
      code,
      discountType,
      discountValue,
      maxUses,
      startDate,
      endDate,
      minPurchaseAmount,
      applicablePlans,
      description,
      singleUsePerUser,
      // Pour la génération en masse
      bulkGenerate,
      bulkCount,
      bulkPrefix,
    } = body

    const createdCodes: any[] = []

    if (bulkGenerate && bulkCount > 0) {
      // Génération en masse
      const count = Math.min(bulkCount, 1000) // Max 1000 codes à la fois

      for (let i = 0; i < count; i++) {
        const generatedCode = generatePromoCode(bulkPrefix || "PROMO", 8)

        const { data, error } = await adminSupabase
          .from("promo_codes")
          .insert({
            code: generatedCode,
            discount_type: discountType,
            discount_value: discountValue,
            max_uses: maxUses || 1, // Par défaut single-use
            start_date: startDate,
            end_date: endDate,
            min_purchase_amount: minPurchaseAmount,
            applicable_plans: applicablePlans,
            description: description || `Code généré en masse - ${bulkPrefix}`,
            single_use_per_user: singleUsePerUser ?? true,
            is_active: true,
            created_by: user.id,
          })
          .select()
          .single()

        if (data) createdCodes.push(data)
      }

      return NextResponse.json({
        success: true,
        message: `${createdCodes.length} codes created`,
        codes: createdCodes,
      })
    } else {
      // Création d'un seul code
      if (!code || !discountType || !discountValue) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
      }

      // Vérifier si le code existe déjà
      const { data: existing } = await adminSupabase
        .from("promo_codes")
        .select("id")
        .eq("code", code.toUpperCase())
        .single()

      if (existing) {
        return NextResponse.json({ error: "Code already exists" }, { status: 400 })
      }

      const { data, error } = await adminSupabase
        .from("promo_codes")
        .insert({
          code: code.toUpperCase(),
          discount_type: discountType,
          discount_value: discountValue,
          max_uses: maxUses,
          start_date: startDate,
          end_date: endDate,
          min_purchase_amount: minPurchaseAmount,
          applicable_plans: applicablePlans,
          description,
          single_use_per_user: singleUsePerUser ?? false,
          is_active: true,
          created_by: user.id,
        })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({ success: true, promoCode: data })
    }
  } catch (error) {
    console.error("[v0] Error creating promo code:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Mettre à jour un code promo
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: adminProfile } = await supabase
      .from("admin_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (!adminProfile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }

    const { data, error } = await adminSupabase
      .from("promo_codes")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, promoCode: data })
  } catch (error) {
    console.error("[v0] Error updating promo code:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Supprimer un code promo
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: adminProfile } = await supabase
      .from("admin_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (!adminProfile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }

    const { error } = await adminSupabase.from("promo_codes").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting promo code:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// app/api/promo-codes/validate/route.ts
export async function validatePromoCode(request: NextRequest) {
  try {
    const { code, planId, email } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Code required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Récupérer le code
    const { data: promo, error } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single()

    if (error || !promo) {
      return NextResponse.json({ valid: false, error: "Code invalide" })
    }

    // Vérifier les dates
    const now = new Date()
    if (promo.start_date && new Date(promo.start_date) > now) {
      return NextResponse.json({ valid: false, error: "Code pas encore actif" })
    }
    if (promo.end_date && new Date(promo.end_date) < now) {
      return NextResponse.json({ valid: false, error: "Code expiré" })
    }

    // Vérifier le nombre d'utilisations
    if (promo.max_uses) {
      const { count } = await supabase
        .from("promo_code_usage")
        .select("*", { count: "exact", head: true })
        .eq("promo_code_id", promo.id)

      if ((count || 0) >= promo.max_uses) {
        return NextResponse.json({ valid: false, error: "Code épuisé" })
      }
    }

    // Vérifier l'utilisation unique par utilisateur
    if (promo.single_use_per_user && email) {
      const { data: existingUse } = await supabase
        .from("promo_code_usage")
        .select("id")
        .eq("promo_code_id", promo.id)
        .eq("email", email)
        .single()

      if (existingUse) {
        return NextResponse.json({ valid: false, error: "Vous avez déjà utilisé ce code" })
      }
    }

    // Vérifier les plans applicables
    if (promo.applicable_plans && promo.applicable_plans.length > 0 && planId) {
      if (!promo.applicable_plans.includes(planId)) {
        return NextResponse.json({ valid: false, error: "Code non applicable à ce plan" })
      }
    }

    return NextResponse.json({
      valid: true,
      discountType: promo.discount_type,
      discountValue: promo.discount_value,
      description: promo.description,
    })
  } catch (error) {
    console.error("[v0] Error validating promo code:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// app/api/promo-codes/stats/route.ts
export async function getPromoCodeStats(request: NextRequest) {
  try {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const codeId = searchParams.get("id")

    if (!codeId) {
      return NextResponse.json({ error: "Code ID required" }, { status: 400 })
    }

    // Récupérer les statistiques d'utilisation
    const { data: usage } = await adminSupabase
      .from("promo_code_usage")
      .select(`
        *,
        payment_transactions (
          final_amount,
          currency,
          status
        )
      `)
      .eq("promo_code_id", codeId)
      .order("used_at", { ascending: false })

    const stats = {
      totalUses: usage?.length || 0,
      totalRevenue: usage?.reduce((sum, u) => {
        return sum + (u.payment_transactions?.final_amount || 0)
      }, 0) || 0,
      uniqueUsers: new Set(usage?.map((u) => u.email)).size,
      usageByDay: {} as Record<string, number>,
      recentUsage: usage?.slice(0, 10) || [],
    }

    // Calculer l'utilisation par jour
    usage?.forEach((u) => {
      const day = u.used_at.split("T")[0]
      stats.usageByDay[day] = (stats.usageByDay[day] || 0) + 1
    })

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("[v0] Error fetching promo stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
