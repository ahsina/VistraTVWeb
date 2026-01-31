// components/dashboard/user-subscription-card.tsx
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  History,
} from "lucide-react"
import Link from "next/link"

interface Subscription {
  id: string
  status: string
  start_date: string
  end_date: string
  price: number
  currency: string
  subscription_plans: {
    name: string
    description: string
    features: string[]
    duration_months: number
  }
}

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  created_at: string
}

export function UserSubscriptionCard() {
  const { t, locale } = useLanguage()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchSubscriptionData()
  }, [])

  async function fetchSubscriptionData() {
    try {
      setLoading(true)
      
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Récupérer l'abonnement actif
      const { data: subData } = await supabase
        .from("subscriptions")
        .select(`
          *,
          subscription_plans (
            name,
            description,
            features,
            duration_months
          )
        `)
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      setSubscription(subData)

      // Récupérer l'historique des paiements
      const { data: paymentData } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      setPayments(paymentData || [])
    } catch (error) {
      console.error("[v0] Error fetching subscription:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-white/10 rounded w-1/4"></div>
            <div className="h-20 bg-white/10 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculs pour la barre de progression
  const now = new Date()
  const endDate = subscription ? new Date(subscription.end_date) : null
  const startDate = subscription ? new Date(subscription.start_date) : null
  
  let daysRemaining = 0
  let totalDays = 0
  let progressPercent = 0

  if (subscription && startDate && endDate) {
    totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    progressPercent = Math.min(100, ((totalDays - daysRemaining) / totalDays) * 100)
  }

  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0
  const isExpired = daysRemaining === 0 && subscription

  const statusConfig = {
    active: {
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      label: "Actif",
    },
    expired: {
      icon: XCircle,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      label: "Expiré",
    },
    expiring: {
      icon: AlertTriangle,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      label: "Expire bientôt",
    },
  }

  const currentStatus = isExpired ? "expired" : isExpiringSoon ? "expiring" : "active"
  const StatusIcon = statusConfig[currentStatus].icon

  return (
    <div className="space-y-6">
      {/* Carte d'abonnement principale */}
      <Card className="bg-gradient-to-br from-cyan-500/10 to-rose-500/10 border-white/10 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Mon Abonnement</CardTitle>
            {subscription && (
              <Badge className={`${statusConfig[currentStatus].bgColor} ${statusConfig[currentStatus].color}`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig[currentStatus].label}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {subscription ? (
            <>
              {/* Info du plan */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">
                    {subscription.subscription_plans?.name || "Plan Premium"}
                  </h3>
                  <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-rose-400 bg-clip-text text-transparent">
                    {subscription.price} {subscription.currency}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  {subscription.subscription_plans?.description}
                </p>
              </div>

              {/* Barre de progression */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Temps restant</span>
                  <span className={`font-medium ${statusConfig[currentStatus].color}`}>
                    {daysRemaining} jours restants
                  </span>
                </div>
                <Progress
                  value={progressPercent}
                  className="h-2 bg-white/10"
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Début: {startDate?.toLocaleDateString(locale)}
                  </span>
                  <span>
                    Fin: {endDate?.toLocaleDateString(locale)}
                  </span>
                </div>
              </div>

              {/* Alerte si expire bientôt */}
              {isExpiringSoon && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-yellow-300 font-medium">
                        Votre abonnement expire dans {daysRemaining} jours
                      </p>
                      <p className="text-yellow-400/70 text-sm">
                        Renouvelez maintenant pour éviter toute interruption
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex gap-3">
                <Button
                  asChild
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-rose-500"
                >
                  <Link href="/subscriptions">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {isExpired ? "Renouveler" : "Changer de plan"}
                  </Link>
                </Button>
                <Button variant="outline" asChild className="border-white/20">
                  <Link href="/dashboard/billing">
                    <History className="w-4 h-4 mr-2" />
                    Historique
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            // Pas d'abonnement
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Aucun abonnement actif
              </h3>
              <p className="text-gray-400 mb-6">
                Souscrivez à un plan pour accéder à tout notre contenu
              </p>
              <Button asChild className="bg-gradient-to-r from-cyan-500 to-rose-500">
                <Link href="/subscriptions">Voir les offres</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historique des paiements récents */}
      {payments.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Paiements récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <div>
                    <p className="text-white font-medium">
                      {payment.amount} {payment.currency}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(payment.created_at).toLocaleDateString(locale)}
                    </p>
                  </div>
                  <Badge
                    className={
                      payment.status === "completed"
                        ? "bg-green-500/20 text-green-300"
                        : payment.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-red-500/20 text-red-300"
                    }
                  >
                    {payment.status === "completed"
                      ? "Complété"
                      : payment.status === "pending"
                      ? "En attente"
                      : "Échoué"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default UserSubscriptionCard
