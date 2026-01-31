import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/admin"
import crypto from "crypto"

// Webhook secret pour vérification HMAC (à configurer dans .env)
const WEBHOOK_SECRET = process.env.PAYGATE_WEBHOOK_SECRET || ""

// Types pour PayGate
interface PayGateWebhookPayload {
  transaction_id: string
  status: "completed" | "pending" | "failed" | "expired"
  amount: number
  currency: string
  email?: string
  metadata?: Record<string, unknown>
  timestamp?: number
}

// Vérification de la signature HMAC
function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature || !secret) {
    console.warn("[v0] Webhook signature verification skipped - no secret configured")
    return true // En développement, permettre sans signature
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex")

    // Comparaison timing-safe pour éviter les attaques timing
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch (error) {
    console.error("[v0] Signature verification error:", error)
    return false
  }
}

// Validation du payload
function validatePayload(data: unknown): data is PayGateWebhookPayload {
  if (!data || typeof data !== "object") return false
  const payload = data as Record<string, unknown>
  
  return (
    typeof payload.transaction_id === "string" &&
    typeof payload.status === "string" &&
    ["completed", "pending", "failed", "expired"].includes(payload.status)
  )
}

// Log webhook pour audit
async function logWebhook(
  supabase: ReturnType<typeof createClient>,
  provider: string,
  eventType: string,
  payload: unknown,
  status: "received" | "processed" | "failed",
  transactionId?: string,
  response?: string,
  ipAddress?: string
) {
  try {
    await supabase.from("webhook_logs").insert({
      provider,
      event_type: eventType,
      payload: payload as object,
      status,
      transaction_id: transactionId,
      response,
      ip_address: ipAddress,
      processed_at: status !== "received" ? new Date().toISOString() : null,
    })
  } catch (error) {
    console.error("[v0] Failed to log webhook:", error)
  }
}

// Idempotency check - éviter le traitement en double
async function checkIdempotency(
  supabase: ReturnType<typeof createClient>,
  transactionId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("webhook_logs")
    .select("id")
    .eq("payload->transaction_id", transactionId)
    .eq("status", "processed")
    .limit(1)

  return (data?.length ?? 0) > 0
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
  
  let rawBody: string
  let payload: unknown

  try {
    // Lire le body raw pour vérification signature
    rawBody = await request.text()
    
    // Parser le JSON
    try {
      payload = JSON.parse(rawBody)
    } catch {
      // Essayer de parser comme query string (certains webhooks utilisent ce format)
      const params = new URLSearchParams(rawBody)
      payload = Object.fromEntries(params.entries())
    }

    console.log("[v0] Webhook received:", { payload, ip: ipAddress })

    // Vérifier la signature HMAC si configurée
    const signature = request.headers.get("x-paygate-signature") || 
                     request.headers.get("x-webhook-signature") ||
                     request.headers.get("x-signature")

    if (WEBHOOK_SECRET && !verifyWebhookSignature(rawBody, signature, WEBHOOK_SECRET)) {
      console.error("[v0] Invalid webhook signature")
      await logWebhook(supabase, "paygate", "invalid_signature", payload, "failed", undefined, "Invalid signature", ipAddress)
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Log la réception
    await logWebhook(supabase, "paygate", "webhook_received", payload, "received", undefined, undefined, ipAddress)

    // Valider le payload
    if (!validatePayload(payload)) {
      console.error("[v0] Invalid webhook payload")
      await logWebhook(supabase, "paygate", "invalid_payload", payload, "failed", undefined, "Invalid payload structure", ipAddress)
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    // Check idempotency
    if (await checkIdempotency(supabase, payload.transaction_id)) {
      console.log("[v0] Webhook already processed:", payload.transaction_id)
      return NextResponse.json({ success: true, message: "Already processed" })
    }

    // Chercher la transaction
    const { data: transaction, error: txError } = await supabase
      .from("payment_transactions")
      .select("*")
      .eq("gateway_transaction_id", payload.transaction_id)
      .single()

    if (txError || !transaction) {
      console.error("[v0] Transaction not found:", payload.transaction_id)
      await logWebhook(supabase, "paygate", "transaction_not_found", payload, "failed", undefined, "Transaction not found", ipAddress)
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    // Mapper le statut PayGate vers notre statut
    const statusMap: Record<string, string> = {
      completed: "completed",
      confirmed: "completed",
      success: "completed",
      pending: "pending",
      waiting: "pending",
      failed: "failed",
      error: "failed",
      expired: "expired",
      cancelled: "cancelled",
    }

    const newStatus = statusMap[payload.status.toLowerCase()] || payload.status

    // Mettre à jour la transaction
    const { error: updateError } = await supabase
      .from("payment_transactions")
      .update({
        status: newStatus,
        gateway_response: {
          ...transaction.gateway_response,
          webhook_payload: payload,
          webhook_received_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq("id", transaction.id)

    if (updateError) {
      console.error("[v0] Failed to update transaction:", updateError)
      await logWebhook(supabase, "paygate", "update_failed", payload, "failed", transaction.id, updateError.message, ipAddress)
      return NextResponse.json({ error: "Update failed" }, { status: 500 })
    }

    // Si le paiement est complété, créer l'abonnement
    if (newStatus === "completed") {
      await handleCompletedPayment(supabase, transaction)
    }

    // Log le succès
    await logWebhook(supabase, "paygate", "payment_" + newStatus, payload, "processed", transaction.id, "Success", ipAddress)

    console.log("[v0] Webhook processed successfully:", { transactionId: transaction.id, newStatus })

    return NextResponse.json({ success: true, status: newStatus })
  } catch (error) {
    console.error("[v0] Payment webhook error:", error)
    await logWebhook(supabase, "paygate", "error", payload, "failed", undefined, String(error), ipAddress)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Gérer un paiement complété
async function handleCompletedPayment(
  supabase: ReturnType<typeof createClient>,
  transaction: {
    id: string
    email: string
    final_amount: number
    promo_code?: string
    gateway_response?: {
      subscription_plan_id?: string
      affiliate_id?: string
      [key: string]: unknown
    }
  }
) {
  try {
    const planId = transaction.gateway_response?.subscription_plan_id

    if (planId) {
      // Récupérer le plan
      const { data: plan } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("id", planId)
        .single()

      if (plan) {
        // Chercher ou créer l'utilisateur
        let userId: string | null = null
        
        const { data: existingUser } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("email", transaction.email)
          .single()

        if (existingUser) {
          userId = existingUser.id
        }

        // Créer l'abonnement
        const endDate = new Date()
        endDate.setMonth(endDate.getMonth() + plan.duration_months)

        const { data: subscription, error: subError } = await supabase
          .from("subscriptions")
          .insert({
            user_id: userId,
            plan_id: plan.id,
            status: "active",
            start_date: new Date().toISOString(),
            end_date: endDate.toISOString(),
            price: transaction.final_amount,
            currency: "USD",
            payment_transaction_id: transaction.id,
          })
          .select()
          .single()

        if (subError) {
          console.error("[v0] Failed to create subscription:", subError)
        } else {
          console.log("[v0] Subscription created:", subscription.id)

          // Envoyer email de confirmation
          await sendConfirmationEmail(supabase, transaction.email, plan, subscription)
        }
      }
    }

    // Mettre à jour l'utilisation du code promo
    if (transaction.promo_code) {
      await supabase.rpc("increment_promo_usage", {
        promo_code_value: transaction.promo_code,
      })
    }

    // Traiter la commission affilié
    const affiliateId = transaction.gateway_response?.affiliate_id
    if (affiliateId) {
      await processAffiliateCommission(supabase, affiliateId as string, transaction)
    }
  } catch (error) {
    console.error("[v0] Error handling completed payment:", error)
  }
}

// Envoyer email de confirmation
async function sendConfirmationEmail(
  supabase: ReturnType<typeof createClient>,
  email: string,
  plan: { name: string; duration_months: number },
  subscription: { id: string; end_date: string }
) {
  try {
    // Appeler l'API d'envoi d'email
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        template: "payment_confirmation",
        data: {
          planName: plan.name,
          subscriptionId: subscription.id,
          endDate: new Date(subscription.end_date).toLocaleDateString("fr-FR"),
        },
      }),
    })

    if (!response.ok) {
      console.error("[v0] Failed to send confirmation email")
    }
  } catch (error) {
    console.error("[v0] Error sending confirmation email:", error)
  }
}

// Traiter la commission affilié
async function processAffiliateCommission(
  supabase: ReturnType<typeof createClient>,
  affiliateId: string,
  transaction: { id: string; final_amount: number; email: string }
) {
  try {
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
          pending_earnings: affiliate.pending_earnings + commissionAmount,
        })
        .eq("id", affiliate.id)

      console.log("[v0] Affiliate commission processed:", commissionAmount)
    }
  } catch (error) {
    console.error("[v0] Error processing affiliate commission:", error)
  }
}

// Support GET pour les health checks
export async function GET(request: NextRequest) {
  return POST(request)
}
