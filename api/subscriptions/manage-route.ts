// app/api/subscriptions/manage/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/email/email-service"

// GET - Récupérer l'abonnement actuel de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Récupérer l'abonnement actif
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select(`
        *,
        subscription_plans (
          id,
          name,
          price,
          currency,
          duration_months,
          features,
          channels_count,
          max_devices
        )
      `)
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    // Récupérer tous les plans disponibles
    const { data: plans } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true)
      .order("price", { ascending: true })

    return NextResponse.json({
      currentSubscription: subscription || null,
      availablePlans: plans || [],
    })
  } catch (error) {
    console.error("[v0] Error fetching subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Demander un upgrade/downgrade
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

    const { newPlanId, action } = await request.json()

    if (!newPlanId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Récupérer l'abonnement actuel
    const { data: currentSubscription } = await adminSupabase
      .from("subscriptions")
      .select("*, subscription_plans(*)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single()

    if (!currentSubscription) {
      return NextResponse.json({ error: "No active subscription" }, { status: 400 })
    }

    // Récupérer le nouveau plan
    const { data: newPlan } = await adminSupabase
      .from("subscription_plans")
      .select("*")
      .eq("id", newPlanId)
      .single()

    if (!newPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    const currentPlan = currentSubscription.subscription_plans
    const isUpgrade = newPlan.price > currentPlan.price

    // Calculer le prorata
    const now = new Date()
    const endDate = new Date(currentSubscription.end_date)
    const startDate = new Date(currentSubscription.start_date)
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    const prorataRatio = remainingDays / totalDays
    const unusedValue = currentPlan.price * prorataRatio
    const newPlanDailyRate = newPlan.price / (newPlan.duration_months * 30)
    const newPlanRemainingCost = newPlanDailyRate * remainingDays

    let amountDue = 0
    let credit = 0

    if (isUpgrade) {
      // Upgrade: payer la différence
      amountDue = Math.max(0, newPlanRemainingCost - unusedValue)
    } else {
      // Downgrade: crédit pour le prochain renouvellement
      credit = Math.max(0, unusedValue - newPlanRemainingCost)
    }

    // Créer une demande de changement
    const { data: changeRequest, error } = await adminSupabase
      .from("subscription_change_requests")
      .insert({
        user_id: user.id,
        current_subscription_id: currentSubscription.id,
        current_plan_id: currentPlan.id,
        new_plan_id: newPlanId,
        action,
        amount_due: amountDue,
        credit_amount: credit,
        status: amountDue > 0 ? "pending_payment" : "approved",
        effective_date: action === "immediate" ? now.toISOString() : endDate.toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    // Si pas de paiement requis, appliquer immédiatement
    if (amountDue === 0 && action === "immediate") {
      await applySubscriptionChange(adminSupabase, changeRequest.id)
    }

    // Récupérer le profil pour l'email
    const { data: profile } = await adminSupabase
      .from("user_profiles")
      .select("email")
      .eq("id", user.id)
      .single()

    if (profile?.email) {
      await sendEmail({
        to: profile.email,
        template: "subscription_change_requested",
        data: {
          currentPlan: currentPlan.name,
          newPlan: newPlan.name,
          isUpgrade,
          amountDue: amountDue.toFixed(2),
          credit: credit.toFixed(2),
          effectiveDate: new Date(changeRequest.effective_date).toLocaleDateString("fr-FR"),
        },
      })
    }

    return NextResponse.json({
      success: true,
      changeRequest: {
        id: changeRequest.id,
        isUpgrade,
        amountDue,
        credit,
        effectiveDate: changeRequest.effective_date,
        status: changeRequest.status,
        paymentRequired: amountDue > 0,
        paymentUrl: amountDue > 0 ? `/checkout/upgrade?request=${changeRequest.id}` : null,
      },
    })
  } catch (error) {
    console.error("[v0] Error processing subscription change:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Fonction helper pour appliquer le changement d'abonnement
async function applySubscriptionChange(supabase: any, requestId: string) {
  const { data: request } = await supabase
    .from("subscription_change_requests")
    .select("*, subscription_plans:new_plan_id(*)")
    .eq("id", requestId)
    .single()

  if (!request) return

  const newPlan = request.subscription_plans
  const now = new Date()
  const newEndDate = new Date()
  newEndDate.setMonth(newEndDate.getMonth() + newPlan.duration_months)

  // Mettre à jour l'abonnement actuel
  await supabase
    .from("subscriptions")
    .update({
      plan_id: request.new_plan_id,
      price: newPlan.price,
      currency: newPlan.currency,
      updated_at: now.toISOString(),
    })
    .eq("id", request.current_subscription_id)

  // Marquer la demande comme appliquée
  await supabase
    .from("subscription_change_requests")
    .update({ status: "applied", applied_at: now.toISOString() })
    .eq("id", requestId)
}

// DELETE - Annuler l'abonnement
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

    const { searchParams } = new URL(request.url)
    const immediate = searchParams.get("immediate") === "true"
    const reason = searchParams.get("reason") || ""

    // Récupérer l'abonnement actif
    const { data: subscription } = await adminSupabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single()

    if (!subscription) {
      return NextResponse.json({ error: "No active subscription" }, { status: 400 })
    }

    if (immediate) {
      // Annulation immédiate
      await adminSupabase
        .from("subscriptions")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason,
        })
        .eq("id", subscription.id)
    } else {
      // Annulation à la fin de la période
      await adminSupabase
        .from("subscriptions")
        .update({
          auto_renew: false,
          cancellation_scheduled: true,
          cancellation_reason: reason,
        })
        .eq("id", subscription.id)
    }

    // Email de confirmation
    const { data: profile } = await adminSupabase
      .from("user_profiles")
      .select("email")
      .eq("id", user.id)
      .single()

    if (profile?.email) {
      await sendEmail({
        to: profile.email,
        template: "subscription_cancelled",
        data: {
          immediate,
          endDate: new Date(subscription.end_date).toLocaleDateString("fr-FR"),
          reason,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: immediate
        ? "Subscription cancelled immediately"
        : "Subscription will be cancelled at the end of the current period",
    })
  } catch (error) {
    console.error("[v0] Error cancelling subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
