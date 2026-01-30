import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/admin"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const { email, whatsapp, planId, amount, promoCode, affiliateCode } = await request.json()

    console.log("[v0] Initiating payment:", { email, whatsapp, planId, amount, promoCode, affiliateCode })

    if (!email || !whatsapp || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()

    const { data: config, error: configError } = await supabase.from("payment_gateway_config").select("*").maybeSingle()

    console.log("[v0] Payment config:", { config, configError })

    if (!config || !config.encrypted_wallet) {
      console.error("[v0] Payment gateway not configured properly")
      return NextResponse.json(
        {
          error: "Payment gateway not configured",
          details:
            "Please configure the payment gateway in Admin > Settings > Gateway Config. You need to generate an encrypted wallet from PayGate.to.",
        },
        { status: 400 },
      )
    }

    let walletAddress: string
    try {
      const wallet =
        typeof config.encrypted_wallet === "string" ? JSON.parse(config.encrypted_wallet) : config.encrypted_wallet

      walletAddress = wallet.address_in
      console.log("[v0] Extracted wallet address:", walletAddress)

      if (!walletAddress) {
        throw new Error("address_in not found in wallet")
      }
    } catch (error) {
      console.error("[v0] Failed to parse encrypted wallet:", error)
      return NextResponse.json({ error: "Invalid wallet configuration" }, { status: 500 })
    }

    const { data: subscriptionPlan, error: planError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", planId)
      .single()

    if (planError || !subscriptionPlan) {
      console.error("[v0] Subscription plan not found:", planError)
      return NextResponse.json({ error: "Subscription plan not found" }, { status: 404 })
    }

    console.log("[v0] Subscription plan found:", subscriptionPlan.name)

    let finalAmount = amount
    let discount = 0
    let promoCodeId = null

    if (promoCode) {
      const { data: promo } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode.toUpperCase())
        .eq("is_active", true)
        .single()

      if (promo) {
        const now = new Date()
        const validFrom = promo.start_date ? new Date(promo.start_date) : null
        const validUntil = promo.end_date ? new Date(promo.end_date) : null

        if ((!validFrom || now >= validFrom) && (!validUntil || now <= validUntil)) {
          if (!promo.max_uses || promo.current_uses < promo.max_uses) {
            if (!promo.min_purchase_amount || amount >= promo.min_purchase_amount) {
              promoCodeId = promo.id
              if (promo.discount_type === "percentage") {
                discount = (amount * promo.discount_value) / 100
              } else {
                discount = promo.discount_value
              }
              finalAmount = Math.max(0, amount - discount)
            }
          }
        }
      }
    }

    let affiliateId = null
    if (affiliateCode) {
      const { data: affiliate } = await supabase
        .from("affiliates")
        .select("id")
        .eq("affiliate_code", affiliateCode.toUpperCase())
        .eq("status", "active")
        .single()

      if (affiliate) {
        affiliateId = affiliate.id
      }
    }

    const transactionId = uuidv4()

    const { data: transaction, error: txError } = await supabase
      .from("payment_transactions")
      .insert({
        gateway_transaction_id: transactionId,
        amount: finalAmount,
        final_amount: finalAmount,
        discount_amount: discount,
        currency: "USD",
        status: "pending",
        email: email,
        whatsapp_phone: whatsapp,
        promo_code: promoCode || null,
        payment_method: "crypto",
        gateway_response: {
          subscription_plan_id: planId,
          subscription_plan_name: subscriptionPlan.name,
          affiliate_code: affiliateCode,
          affiliate_id: affiliateId,
          original_amount: amount,
        },
      })
      .select()
      .single()

    if (txError) {
      console.error("[v0] Failed to create transaction:", txError)
      return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
    }

    const baseUrl = "https://checkout.paygate.to/process-payment.php"

    // Build URL manually to avoid URLSearchParams encoding the already-encoded address
    const urlParams = [
      `address=${walletAddress}`, // Already encoded - don't encode again
      `amount=${finalAmount.toFixed(2)}`,
      `currency=USD`,
      `email=${encodeURIComponent(email)}`,
    ]

    // Add provider if configured (not 'auto')
    if (config.payment_provider && config.payment_provider !== "auto") {
      urlParams.push(`provider=${config.payment_provider}`)
    }

    const paymentUrl = `${baseUrl}?${urlParams.join("&")}`

    console.log("[v0] Payment URL generated:", paymentUrl)
    console.log("[v0] Transaction ID:", transactionId)

    return NextResponse.json({
      success: true,
      paymentUrl,
      transactionId: transaction.id,
      amount: finalAmount,
    })
  } catch (error) {
    console.error("[v0] Payment initiation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
