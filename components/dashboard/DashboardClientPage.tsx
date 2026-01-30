"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CreditCard, Settings, LogOut, Tv, Calendar, Download } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { LoadingPage } from "@/components/ui/loading"
import { redirect } from "next/navigation"

interface Subscription {
  id: string
  plan: string
  status: "active" | "cancelled" | "expired"
  startDate: string
  endDate: string
  price: number
  autoRenew: boolean
}

interface Payment {
  id: string
  date: string
  amount: number
  status: "completed" | "pending" | "failed"
  method: string
}

export function DashboardClientPage() {
  redirect("/support")

  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const [subRes, payRes] = await Promise.all([fetch("/api/user/subscription"), fetch("/api/user/payments")])

      if (subRes.ok) {
        const subData = await subRes.json()
        setSubscription(subData)
      }

      if (payRes.ok) {
        const payData = await payRes.json()
        setPayments(payData)
      }
    } catch (error) {
      console.error("[v0] Error fetching user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm(t.dashboard?.confirmCancel || "Êtes-vous sûr de vouloir annuler votre abonnement ?")) {
      return
    }

    try {
      const response = await fetch("/api/user/subscription/cancel", {
        method: "POST",
      })

      if (response.ok) {
        fetchUserData()
      }
    } catch (error) {
      console.error("[v0] Error cancelling subscription:", error)
    }
  }

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
              {t.dashboard?.title || "Mon Tableau de Bord"}
            </h1>
            <p className="text-white/60 mt-2">{t.dashboard?.subtitle || "Gérez votre abonnement et vos paramètres"}</p>
          </div>
          <Button
            onClick={() => router.push("/logout")}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t.dashboard?.logout || "Déconnexion"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
                <Tv className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-sm">{t.dashboard?.currentPlan || "Plan Actuel"}</p>
                <p className="text-white text-xl font-bold">{subscription?.plan || "Premium"}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">{t.dashboard?.status || "Statut"}</span>
                <span
                  className={`font-medium ${subscription?.status === "active" ? "text-green-400" : "text-red-400"}`}
                >
                  {subscription?.status === "active"
                    ? t.dashboard?.active || "Actif"
                    : t.dashboard?.inactive || "Inactif"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">{t.dashboard?.nextBilling || "Prochaine facturation"}</span>
                <span className="text-white">{subscription?.endDate || "01/02/2025"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-[#e94b87] to-[#ff6b35]">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-sm">{t.dashboard?.monthlyPayment || "Paiement Mensuel"}</p>
                <p className="text-white text-xl font-bold">${subscription?.price || "29"}/mo</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">{t.dashboard?.autoRenew || "Renouvellement auto"}</span>
                <span className="text-white">
                  {subscription?.autoRenew ? t.dashboard?.enabled || "Activé" : t.dashboard?.disabled || "Désactivé"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">{t.dashboard?.paymentMethod || "Méthode de paiement"}</span>
                <span className="text-white">•••• 4242</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#0099ff]">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-sm">{t.dashboard?.memberSince || "Membre depuis"}</p>
                <p className="text-white text-xl font-bold">{subscription?.startDate || "Jan 2024"}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">{t.dashboard?.totalPaid || "Total payé"}</span>
                <span className="text-white">$348</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">{t.dashboard?.invoices || "Factures"}</span>
                <span className="text-white">12</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">{t.dashboard?.recentPayments || "Paiements Récents"}</h2>
            <div className="space-y-3">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-white/60" />
                      <div>
                        <p className="text-white font-medium">${payment.amount}</p>
                        <p className="text-white/60 text-sm">{payment.date}</p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        payment.status === "completed"
                          ? "text-green-400"
                          : payment.status === "pending"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {payment.status === "completed"
                        ? t.dashboard?.completed || "Complété"
                        : payment.status === "pending"
                          ? t.dashboard?.pending || "En attente"
                          : t.dashboard?.failed || "Échoué"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-white/60">
                  {t.dashboard?.noPayments || "Aucun paiement récent"}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">{t.dashboard?.quickActions || "Actions Rapides"}</h2>
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/subscriptions")}
                className="w-full justify-start bg-white/5 hover:bg-white/10 text-white border border-white/10"
              >
                <Tv className="h-5 w-5 mr-3" />
                {t.dashboard?.changePlan || "Changer de Plan"}
              </Button>
              <Button
                onClick={() => router.push("/dashboard/settings")}
                className="w-full justify-start bg-white/5 hover:bg-white/10 text-white border border-white/10"
              >
                <Settings className="h-5 w-5 mr-3" />
                {t.dashboard?.accountSettings || "Paramètres du Compte"}
              </Button>
              <Button
                onClick={() => router.push("/dashboard/invoices")}
                className="w-full justify-start bg-white/5 hover:bg-white/10 text-white border border-white/10"
              >
                <Download className="h-5 w-5 mr-3" />
                {t.dashboard?.downloadInvoices || "Télécharger les Factures"}
              </Button>
              {subscription?.status === "active" && (
                <Button
                  onClick={handleCancelSubscription}
                  variant="outline"
                  className="w-full justify-start border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  {t.dashboard?.cancelSubscription || "Annuler l'Abonnement"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
