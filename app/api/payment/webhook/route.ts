import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/admin"
import { logWebhook } from "@/lib/logging/logger"

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  try {
    const { searchParams } = new URL(request.url)

    // PayGate.to sends these parameters in the callback
    const invoice = searchParams.get("invoice") // Our transaction ID
    const status = searchParams.get("status") // Payment status
    const amount = searchParams.get("amount")
    const currency = searchParams.get("currency")
    const hash = searchParams.get("hash") // Security hash

    console.log("[v0] PayGate.to webhook received:", {
      invoice,
      status,
      amount,
      currency,
    })

    const supabase = createClient()
    await logWebhook({
      supabase,
      provider: "paygate",
      event: "payment_callback",
      payload: {
        invoice,
        status,
        amount,
        currency,
        hash,
      },
      processingTime: Date.now() - startTime,
    })

    if (!invoice || !status) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Find the transaction by gateway_transaction_id (our invoice ID)
    const { data: transaction, error: txError } = await supabase
      .from("payment_transactions")
      .select("*")
      .eq("gateway_transaction_id", invoice)
      .single()

    if (txError || !transaction) {
      console.error("[v0] Transaction not found:", invoice)
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    // Map PayGate status to our status
    let newStatus = "pending"
    if (status === "paid" || status === "completed") {
      newStatus = "completed"
    } else if (status === "failed" || status === "cancelled") {
      newStatus = "failed"
    }

    console.log("[v0] Updating transaction status:", { invoice, newStatus })

    // Update transaction status
    const { error: updateError } = await supabase
      .from("payment_transactions")
      .update({
        status: newStatus,
        gateway_response: {
          ...transaction.gateway_response,
          callback_status: status,
          callback_amount: amount,
          callback_currency: currency,
          callback_timestamp: new Date().toISOString(),
        },
      })
      .eq("id", transaction.id)

    if (updateError) {
      console.error("[v0] Failed to update transaction:", updateError)
      return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 })
    }

    // If payment is completed, create subscription
    if (newStatus === "completed") {
      const planId = transaction.gateway_response?.subscription_plan_id

      if (planId) {
        const { data: plan } = await supabase
          .from("subscription_plans")
          .select("duration_months")
          .eq("id", planId)
          .single()

        if (plan) {
          const startDate = new Date()
          const endDate = new Date()
          endDate.setMonth(endDate.getMonth() + (plan.duration_months || 1))

          await supabase.from("subscriptions").insert({
            email: transaction.email,
            whatsapp_phone: transaction.whatsapp_phone,
            subscription_plan_id: planId,
            payment_transaction_id: transaction.id,
            status: "active",
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
          })

          console.log("[v0] Subscription created for:", transaction.email)
        }
      }

      // Update promo code usage
      if (transaction.promo_code) {
        await supabase.rpc("increment_promo_usage", {
          promo_code_value: transaction.promo_code,
        })
      }

      // Process affiliate commission
      const affiliateId = transaction.gateway_response?.affiliate_id
      if (affiliateId) {
        const { data: affiliate } = await supabase
          .from("affiliates")
          .select("*")
          .eq("id", affiliateId)
          .eq("status", "active")
          .single()

        if (affiliate) {
          const commissionAmount = (transaction.final_amount * affiliate.commission_rate) / 100

          await supabase.from("referrals").insert({
            affiliate_id: affiliate.id,
            referred_email: transaction.email,
            payment_transaction_id: transaction.id,
            status: "completed",
            commission_amount: commissionAmount,
            commission_paid: false,
          })

          await supabase
            .from("affiliates")
            .update({
              total_referrals: affiliate.total_referrals + 1,
              total_earnings: affiliate.total_earnings + commissionAmount,
            })
            .eq("id", affiliate.id)

          console.log("[v0] Affiliate commission processed:", commissionAmount)
        }
      }
    }

    return NextResponse.json({ success: true, status: newStatus })
  } catch (error) {
    console.error("[v0] Payment webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
