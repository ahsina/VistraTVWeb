// lib/marketing/ab-testing.ts
// Système de A/B Testing

import { createClient } from "@/lib/supabase/admin"
import crypto from "crypto"

interface ABTest {
  id: string
  name: string
  description: string
  status: "draft" | "active" | "paused" | "completed"
  variants: ABVariant[]
  traffic_allocation: number // Pourcentage du trafic pour le test
  start_date: string | null
  end_date: string | null
  winner_variant_id: string | null
  created_at: string
}

interface ABVariant {
  id: string
  test_id: string
  name: string
  weight: number // Pourcentage (ex: 50)
  content: Record<string, any>
  views: number
  conversions: number
  revenue: number
}

interface ABAssignment {
  testId: string
  variantId: string
  variant: ABVariant
}

// Obtenir une variante pour un utilisateur
export async function getVariantForUser(
  testId: string,
  userId: string | null,
  sessionId: string
): Promise<ABAssignment | null> {
  const supabase = createClient()

  // Récupérer le test
  const { data: test } = await supabase
    .from("ab_tests")
    .select("*, ab_variants(*)")
    .eq("id", testId)
    .eq("status", "active")
    .single()

  if (!test || !test.ab_variants.length) return null

  // Vérifier si une assignation existe déjà
  const identifier = userId || sessionId
  const { data: existingAssignment } = await supabase
    .from("ab_test_assignments")
    .select("variant_id")
    .eq("test_id", testId)
    .eq("identifier", identifier)
    .single()

  if (existingAssignment) {
    const variant = test.ab_variants.find((v: ABVariant) => v.id === existingAssignment.variant_id)
    return variant ? { testId, variantId: variant.id, variant } : null
  }

  // Vérifier l'allocation de trafic
  const random = Math.random() * 100
  if (random > test.traffic_allocation) {
    return null // Pas dans le test
  }

  // Assigner une variante basée sur les poids
  const variant = selectVariant(test.ab_variants)

  // Sauvegarder l'assignation
  await supabase.from("ab_test_assignments").insert({
    test_id: testId,
    variant_id: variant.id,
    identifier,
    user_id: userId,
    session_id: sessionId,
  })

  // Incrémenter les vues
  await supabase.rpc("increment_ab_variant_views", { variant_id: variant.id })

  return { testId, variantId: variant.id, variant }
}

// Sélectionner une variante basée sur les poids
function selectVariant(variants: ABVariant[]): ABVariant {
  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0)
  let random = Math.random() * totalWeight
  
  for (const variant of variants) {
    random -= variant.weight
    if (random <= 0) return variant
  }
  
  return variants[0]
}

// Enregistrer une conversion
export async function trackConversion(
  testId: string,
  identifier: string,
  value: number = 0
): Promise<void> {
  const supabase = createClient()

  // Récupérer l'assignation
  const { data: assignment } = await supabase
    .from("ab_test_assignments")
    .select("variant_id, converted")
    .eq("test_id", testId)
    .eq("identifier", identifier)
    .single()

  if (!assignment || assignment.converted) return

  // Marquer comme converti
  await supabase
    .from("ab_test_assignments")
    .update({ converted: true, conversion_value: value, converted_at: new Date().toISOString() })
    .eq("test_id", testId)
    .eq("identifier", identifier)

  // Mettre à jour les stats de la variante
  await supabase.rpc("increment_ab_variant_conversions", {
    variant_id: assignment.variant_id,
    revenue: value,
  })
}

// Calculer les résultats du test
export async function calculateTestResults(testId: string): Promise<{
  variants: Array<{
    id: string
    name: string
    views: number
    conversions: number
    conversionRate: number
    revenue: number
    revenuePerVisitor: number
    isWinner: boolean
    confidence: number
  }>
  isSignificant: boolean
  recommendedWinner: string | null
}> {
  const supabase = createClient()

  const { data: test } = await supabase
    .from("ab_tests")
    .select("*, ab_variants(*)")
    .eq("id", testId)
    .single()

  if (!test) throw new Error("Test not found")

  const variants = test.ab_variants.map((v: ABVariant) => ({
    id: v.id,
    name: v.name,
    views: v.views,
    conversions: v.conversions,
    conversionRate: v.views > 0 ? (v.conversions / v.views) * 100 : 0,
    revenue: v.revenue,
    revenuePerVisitor: v.views > 0 ? v.revenue / v.views : 0,
    isWinner: false,
    confidence: 0,
  }))

  // Trouver le meilleur performeur
  let maxConversionRate = 0
  let winnerIndex = 0

  variants.forEach((v, i) => {
    if (v.conversionRate > maxConversionRate) {
      maxConversionRate = v.conversionRate
      winnerIndex = i
    }
  })

  // Calculer la signification statistique (simplified)
  // Pour un vrai test, utiliser une bibliothèque de stats appropriée
  const control = variants[0]
  const treatment = variants[winnerIndex]

  const pooledRate = (control.conversions + treatment.conversions) / (control.views + treatment.views)
  const se = Math.sqrt(pooledRate * (1 - pooledRate) * (1 / control.views + 1 / treatment.views))
  const z = se > 0 ? Math.abs(control.conversionRate / 100 - treatment.conversionRate / 100) / se : 0
  
  // Z-score de 1.96 = 95% de confiance
  const confidence = Math.min(99.9, (1 - 2 * (1 - normalCDF(z))) * 100)
  const isSignificant = confidence >= 95

  variants[winnerIndex].isWinner = isSignificant
  variants[winnerIndex].confidence = confidence

  return {
    variants,
    isSignificant,
    recommendedWinner: isSignificant ? variants[winnerIndex].id : null,
  }
}

// Fonction CDF normale (approximation)
function normalCDF(z: number): number {
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  const sign = z < 0 ? -1 : 1
  z = Math.abs(z) / Math.sqrt(2)

  const t = 1.0 / (1.0 + p * z)
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z)

  return 0.5 * (1.0 + sign * y)
}

// ============================================================================
// MARKETING CAMPAIGNS
// ============================================================================

interface Campaign {
  id: string
  name: string
  type: "email" | "push" | "sms" | "whatsapp"
  status: "draft" | "scheduled" | "sending" | "completed" | "paused"
  audience: {
    type: "all" | "segment" | "custom"
    filters?: Record<string, any>
    userIds?: string[]
  }
  content: {
    subject?: string
    body: string
    template?: string
  }
  schedule: {
    type: "immediate" | "scheduled" | "recurring"
    sendAt?: string
    recurringPattern?: string
  }
  stats: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    converted: number
  }
}

export async function createCampaign(campaign: Partial<Campaign>): Promise<Campaign> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("marketing_campaigns")
    .insert({
      ...campaign,
      status: campaign.schedule?.type === "immediate" ? "sending" : "draft",
      stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, converted: 0 },
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function scheduleCampaign(campaignId: string, sendAt: Date): Promise<void> {
  const supabase = createClient()

  await supabase
    .from("marketing_campaigns")
    .update({
      status: "scheduled",
      "schedule.sendAt": sendAt.toISOString(),
    })
    .eq("id", campaignId)
}

export async function getAudienceCount(audience: Campaign["audience"]): Promise<number> {
  const supabase = createClient()

  if (audience.type === "all") {
    const { count } = await supabase
      .from("user_profiles")
      .select("*", { count: "exact", head: true })

    return count || 0
  }

  if (audience.type === "custom" && audience.userIds) {
    return audience.userIds.length
  }

  if (audience.type === "segment" && audience.filters) {
    let query = supabase.from("user_profiles").select("*", { count: "exact", head: true })

    // Appliquer les filtres
    if (audience.filters.subscriptionStatus) {
      query = query.eq("subscription_status", audience.filters.subscriptionStatus)
    }
    if (audience.filters.language) {
      query = query.eq("language", audience.filters.language)
    }
    if (audience.filters.registeredAfter) {
      query = query.gte("created_at", audience.filters.registeredAfter)
    }
    if (audience.filters.hasNoSubscription) {
      query = query.is("subscription_status", null)
    }

    const { count } = await query
    return count || 0
  }

  return 0
}

export default {
  getVariantForUser,
  trackConversion,
  calculateTestResults,
  createCampaign,
  scheduleCampaign,
  getAudienceCount,
}
