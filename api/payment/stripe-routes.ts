// app/api/payment/stripe/checkout/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/admin"
import { createCheckoutSession } from "@/lib/payment/stripe"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, planId, promoCode, affiliateCode } = body

    if (!email || !planId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()

    // Récupérer le plan
    const { data: plan } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", planId)
      .single()

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    // Calculer le prix final
    let finalAmount = plan.price
    if (promoCode) {
      const { data: promo } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode.toUpperCase())
        .eq("is_active", true)
        .single()

      if (promo) {
        if (promo.discount_type === "percentage") {
          finalAmount = plan.price * (1 - promo.discount_value / 100)
        } else {
          finalAmount = Math.max(0, plan.price - promo.discount_value)
        }
      }
    }

    // Créer la session Stripe
    const session = await createCheckoutSession({
      email,
      planId,
      planName: plan.name,
      amount: finalAmount,
      currency: plan.currency || "eur",
      promoCode,
      affiliateCode,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      metadata: {
        plan_id: planId,
        email,
      },
    })

    // Créer la transaction
    await supabase.from("payment_transactions").insert({
      email,
      amount: plan.price,
      final_amount: finalAmount,
      currency: plan.currency || "EUR",
      payment_method: "stripe",
      status: "pending",
      gateway_transaction_id: session.id,
      gateway_response: {
        checkout_url: session.url,
        subscription_plan_id: planId,
        promo_code: promoCode,
        affiliate_code: affiliateCode,
      },
    })

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error("[v0] Stripe checkout error:", error)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}

// app/api/payment/stripe/webhook/route.ts
import { verifyWebhookSignature, getCheckoutSession } from "@/lib/payment/stripe"
import { sendEmail } from "@/lib/email/email-service"

export async function POST(request: NextRequest) {
  const supabase = createClient()
  
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    // Vérifier la signature
    const event = verifyWebhookSignature(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    // Log le webhook
    await supabase.from("webhook_logs").insert({
      provider: "stripe",
      event_type: event.type,
      payload: event.data.object as object,
      status: "received",
    })

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any

        // Mettre à jour la transaction
        await supabase
          .from("payment_transactions")
          .update({
            status: "completed",
            gateway_response: session,
            updated_at: new Date().toISOString(),
          })
          .eq("gateway_transaction_id", session.id)

        // Créer l'abonnement
        const planId = session.metadata?.plan_id
        if (planId) {
          const { data: plan } = await supabase
            .from("subscription_plans")
            .select("*")
            .eq("id", planId)
            .single()

          if (plan) {
            const endDate = new Date()
            endDate.setMonth(endDate.getMonth() + plan.duration_months)

            await supabase.from("subscriptions").insert({
              plan_id: planId,
              status: "active",
              start_date: new Date().toISOString(),
              end_date: endDate.toISOString(),
              price: session.amount_total / 100,
              currency: session.currency.toUpperCase(),
            })

            // Envoyer email de confirmation
            await sendEmail({
              to: session.customer_email,
              template: "payment_confirmation",
              data: {
                planName: plan.name,
                endDate: endDate.toLocaleDateString("fr-FR"),
              },
            })
          }
        }

        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as any

        await supabase
          .from("payment_transactions")
          .update({
            status: "failed",
            gateway_response: paymentIntent,
            updated_at: new Date().toISOString(),
          })
          .eq("gateway_transaction_id", paymentIntent.id)

        break
      }
    }

    // Log le succès
    await supabase
      .from("webhook_logs")
      .update({ status: "processed", processed_at: new Date().toISOString() })
      .eq("event_type", event.type)
      .eq("status", "received")

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Stripe webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}

// app/api/payment/stripe/refund/route.ts
import { createRefund } from "@/lib/payment/stripe"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { transactionId, amount, reason } = body

    // Vérifier les droits admin
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

    // Récupérer la transaction
    const { data: transaction } = await supabase
      .from("payment_transactions")
      .select("*")
      .eq("id", transactionId)
      .single()

    if (!transaction || transaction.payment_method !== "stripe") {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    // Créer le remboursement
    const refund = await createRefund({
      paymentIntentId: transaction.gateway_response?.payment_intent?.id || transaction.gateway_transaction_id,
      amount,
      reason: reason || "requested_by_customer",
    })

    // Mettre à jour la transaction
    await supabase
      .from("payment_transactions")
      .update({
        status: amount ? "partially_refunded" : "refunded",
        refund_amount: amount || transaction.final_amount,
        refund_id: refund.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", transactionId)

    return NextResponse.json({ success: true, refund })
  } catch (error) {
    console.error("[v0] Refund error:", error)
    return NextResponse.json({ error: "Refund failed" }, { status: 500 })
  }
}
