import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const adminSupabase = createAdminClient()
    const body = await request.json()
    const { planId, paymentMethod, billingInfo, promoCodeId, affiliateCode } = body

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", planId)
      .single()

    if (planError || !plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    let finalAmount = plan.price
    let promoCodeData = null

    if (promoCodeId) {
      const { data: promoCode } = await adminSupabase.from("promo_codes").select("*").eq("id", promoCodeId).single()

      if (promoCode) {
        promoCodeData = promoCode
        if (promoCode.discount_type === "percentage") {
          finalAmount = plan.price * (1 - promoCode.discount_value / 100)
        } else {
          finalAmount = Math.max(0, plan.price - promoCode.discount_value)
        }

        // Update promo code usage
        await adminSupabase
          .from("promo_codes")
          .update({ current_uses: promoCode.current_uses + 1 })
          .eq("id", promoCodeId)
      }
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert([
        {
          user_id: user.id,
          amount: finalAmount,
          currency: "USD",
          status: "completed",
          payment_method: paymentMethod?.type || "card",
          billing_email: billingInfo?.email || user.email,
          billing_address: billingInfo?.address,
          billing_city: billingInfo?.city,
          billing_zip: billingInfo?.zip,
        },
      ])
      .select()
      .single()

    if (paymentError) {
      console.error("[v0] Error creating payment:", paymentError)
      return NextResponse.json({ error: "Payment failed" }, { status: 500 })
    }

    // Create subscription
    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1)

    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .insert([
        {
          user_id: user.id,
          plan_id: planId,
          status: "active",
          price: finalAmount,
          currency: "USD",
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        },
      ])
      .select()
      .single()

    if (subscriptionError) {
      console.error("[v0] Error creating subscription:", subscriptionError)
      return NextResponse.json({ error: "Subscription creation failed" }, { status: 500 })
    }

    if (promoCodeId && promoCodeData) {
      const discountAmount =
        promoCodeData.discount_type === "percentage"
          ? (plan.price * promoCodeData.discount_value) / 100
          : promoCodeData.discount_value

      await adminSupabase.from("promo_code_usage").insert({
        promo_code_id: promoCodeId,
        user_id: user.id,
        subscription_id: subscription.id,
        discount_amount: discountAmount,
      })
    }

    if (affiliateCode) {
      const { data: affiliate } = await adminSupabase
        .from("affiliates")
        .select("*")
        .eq("affiliate_code", affiliateCode)
        .eq("status", "active")
        .maybeSingle()

      if (affiliate) {
        const commissionAmount = (finalAmount * affiliate.commission_rate) / 100

        await adminSupabase.from("affiliate_referrals").insert({
          affiliate_id: affiliate.id,
          referred_user_id: user.id,
          subscription_id: subscription.id,
          subscription_amount: finalAmount,
          commission_amount: commissionAmount,
          commission_status: "pending",
          payment_id: payment.id,
        })

        // Update affiliate stats
        await adminSupabase
          .from("affiliates")
          .update({
            total_referrals: affiliate.total_referrals + 1,
            total_earnings: affiliate.total_earnings + commissionAmount,
            pending_earnings: affiliate.pending_earnings + commissionAmount,
          })
          .eq("id", affiliate.id)

        // Mark click as converted
        await adminSupabase
          .from("affiliate_clicks")
          .update({ converted: true, converted_at: new Date().toISOString() })
          .eq("affiliate_id", affiliate.id)
          .eq("converted", false)
          .order("created_at", { ascending: false })
          .limit(1)
      }
    }

    return NextResponse.json(
      {
        success: true,
        payment,
        subscription,
        message: "Checkout successful",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Checkout error:", error)
    return NextResponse.json({ error: "Failed to process checkout" }, { status: 500 })
  }
}
