import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { code, planPrice } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Code required" }, { status: 400 })
    }

    // Fetch the promo code
    const { data: promoCode, error } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .maybeSingle()

    if (error || !promoCode) {
      return NextResponse.json({ error: "Code promo invalide" }, { status: 404 })
    }

    // Check if code is active
    if (!promoCode.is_active) {
      return NextResponse.json({ error: "Ce code n'est plus actif" }, { status: 400 })
    }

    // Check date validity
    const now = new Date()
    if (new Date(promoCode.start_date) > now) {
      return NextResponse.json({ error: "Ce code n'est pas encore valide" }, { status: 400 })
    }
    if (promoCode.end_date && new Date(promoCode.end_date) < now) {
      return NextResponse.json({ error: "Ce code a expiré" }, { status: 400 })
    }

    // Check max uses
    if (promoCode.max_uses && promoCode.current_uses >= promoCode.max_uses) {
      return NextResponse.json({ error: "Ce code a atteint sa limite d'utilisation" }, { status: 400 })
    }

    // Check minimum purchase amount
    if (promoCode.min_purchase_amount > planPrice) {
      return NextResponse.json(
        {
          error: `Montant minimum d'achat: ${promoCode.min_purchase_amount} ${promoCode.currency}`,
        },
        { status: 400 },
      )
    }

    // Calculate discount
    let discountAmount = 0
    if (promoCode.discount_type === "percentage") {
      discountAmount = (planPrice * promoCode.discount_value) / 100
    } else {
      discountAmount = promoCode.discount_value
    }

    const finalPrice = Math.max(0, planPrice - discountAmount)

    return NextResponse.json({
      valid: true,
      promoCode: {
        id: promoCode.id,
        code: promoCode.code,
        discount_type: promoCode.discount_type,
        discount_value: promoCode.discount_value,
      },
      discountAmount,
      finalPrice,
    })
  } catch (error) {
    console.error("[v0] Promo code validation error:", error)
    return NextResponse.json({ error: "Erreur de validation" }, { status: 500 })
  }
}
