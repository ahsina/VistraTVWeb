// components/subscription/plan-switcher.tsx
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Check,
  AlertTriangle,
  Sparkles,
  Clock,
  CreditCard,
} from "lucide-react"

interface Plan {
  id: string
  name: string
  price: number
  currency: string
  duration_months: number
  features: string[]
  is_popular: boolean
}

interface Subscription {
  id: string
  plan_id: string
  status: string
  start_date: string
  end_date: string
  price: number
}

interface PlanSwitcherProps {
  currentSubscription?: Subscription | null
  onSwitch?: (newPlanId: string, type: "upgrade" | "downgrade") => void
}

export function PlanSwitcher({ currentSubscription, onSwitch }: PlanSwitcherProps) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [switching, setSwitching] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchPlans()
  }, [])

  async function fetchPlans() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("price")

      if (error) throw error
      setPlans(data || [])
    } catch (error) {
      console.error("[v0] Error fetching plans:", error)
    } finally {
      setLoading(false)
    }
  }

  const currentPlan = plans.find((p) => p.id === currentSubscription?.plan_id)
  const selectedPlan = plans.find((p) => p.id === selectedPlanId)

  const getSwitchType = (newPlan: Plan): "upgrade" | "downgrade" | "same" => {
    if (!currentPlan) return "upgrade"
    if (newPlan.price > currentPlan.price) return "upgrade"
    if (newPlan.price < currentPlan.price) return "downgrade"
    return "same"
  }

  const calculateProration = () => {
    if (!currentSubscription || !currentPlan || !selectedPlan) return null

    const now = new Date()
    const endDate = new Date(currentSubscription.end_date)
    const startDate = new Date(currentSubscription.start_date)

    // Jours restants
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const remainingDays = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

    // Valeur restante de l'abonnement actuel
    const dailyRate = currentPlan.price / totalDays
    const remainingValue = dailyRate * remainingDays

    // Différence de prix
    const priceDifference = selectedPlan.price - currentPlan.price

    // Montant à payer (ou crédit)
    const amountDue = priceDifference > 0 ? priceDifference - remainingValue : 0
    const credit = priceDifference < 0 ? Math.abs(priceDifference) : 0

    return {
      remainingDays,
      remainingValue: Math.round(remainingValue * 100) / 100,
      priceDifference,
      amountDue: Math.max(0, Math.round(amountDue * 100) / 100),
      credit: Math.round(credit * 100) / 100,
    }
  }

  async function handleSwitch() {
    if (!selectedPlanId || !selectedPlan) return

    setSwitching(true)

    try {
      const switchType = getSwitchType(selectedPlan)
      const proration = calculateProration()

      if (switchType === "upgrade" && proration && proration.amountDue > 0) {
        // Rediriger vers le paiement avec le montant proraté
        router.push(
          `/checkout?planId=${selectedPlanId}&upgrade=true&amount=${proration.amountDue}`
        )
      } else {
        // Downgrade ou crédit - appliquer directement
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) throw new Error("Not authenticated")

        // Calculer la nouvelle date de fin
        let newEndDate: Date
        if (switchType === "downgrade" && proration) {
          // Ajouter des jours supplémentaires basés sur le crédit
          const extraDays = Math.floor(proration.credit / (selectedPlan.price / 30))
          newEndDate = new Date(currentSubscription!.end_date)
          newEndDate.setDate(newEndDate.getDate() + extraDays)
        } else {
          newEndDate = new Date()
          newEndDate.setMonth(newEndDate.getMonth() + selectedPlan.duration_months)
        }

        // Mettre à jour l'abonnement
        await supabase
          .from("subscriptions")
          .update({
            plan_id: selectedPlanId,
            price: selectedPlan.price,
            end_date: newEndDate.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentSubscription!.id)

        // Logger le changement
        await supabase.from("subscription_changes").insert({
          subscription_id: currentSubscription!.id,
          user_id: user.id,
          old_plan_id: currentSubscription!.plan_id,
          new_plan_id: selectedPlanId,
          change_type: switchType,
          proration_amount: proration?.amountDue || 0,
          credit_amount: proration?.credit || 0,
        })

        onSwitch?.(selectedPlanId, switchType)
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error("[v0] Switch error:", error)
      alert("Erreur lors du changement de plan")
    } finally {
      setSwitching(false)
    }
  }

  const proration = selectedPlanId ? calculateProration() : null

  return (
    <div className="space-y-6">
      {/* Plan actuel */}
      {currentSubscription && currentPlan && (
        <Card className="bg-gradient-to-r from-cyan-500/10 to-rose-500/10 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Votre plan actuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">{currentPlan.name}</h3>
                <p className="text-gray-400">
                  {currentPlan.price}€/{currentPlan.duration_months} mois
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Expire le</p>
                <p className="text-white font-medium">
                  {new Date(currentSubscription.end_date).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sélection du plan */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Changer de plan</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
            </div>
          ) : (
            <RadioGroup
              value={selectedPlanId || ""}
              onValueChange={setSelectedPlanId}
              className="space-y-4"
            >
              {plans.map((plan) => {
                const switchType = getSwitchType(plan)
                const isCurrent = plan.id === currentPlan?.id

                return (
                  <div
                    key={plan.id}
                    className={`relative flex items-start gap-4 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                      selectedPlanId === plan.id
                        ? "border-cyan-500 bg-cyan-500/10"
                        : isCurrent
                        ? "border-white/20 bg-white/5"
                        : "border-white/10 hover:border-white/20"
                    }`}
                    onClick={() => !isCurrent && setSelectedPlanId(plan.id)}
                  >
                    <RadioGroupItem
                      value={plan.id}
                      id={plan.id}
                      disabled={isCurrent}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={plan.id}
                          className={`text-lg font-bold ${isCurrent ? "text-gray-400" : "text-white"}`}
                        >
                          {plan.name}
                        </Label>
                        {plan.is_popular && (
                          <Badge className="bg-rose-500/20 text-rose-300">Populaire</Badge>
                        )}
                        {isCurrent && (
                          <Badge className="bg-cyan-500/20 text-cyan-300">Actuel</Badge>
                        )}
                        {!isCurrent && switchType === "upgrade" && (
                          <Badge className="bg-green-500/20 text-green-300">
                            <ArrowUp className="w-3 h-3 mr-1" />
                            Upgrade
                          </Badge>
                        )}
                        {!isCurrent && switchType === "downgrade" && (
                          <Badge className="bg-yellow-500/20 text-yellow-300">
                            <ArrowDown className="w-3 h-3 mr-1" />
                            Downgrade
                          </Badge>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-white mt-2">
                        {plan.price}€
                        <span className="text-sm text-gray-400 font-normal">
                          /{plan.duration_months} mois
                        </span>
                      </p>
                      <ul className="mt-3 space-y-1">
                        {plan.features?.slice(0, 3).map((feature, i) => (
                          <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </RadioGroup>
          )}

          {/* Bouton de changement */}
          {selectedPlanId && selectedPlanId !== currentPlan?.id && (
            <div className="mt-6">
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="w-full bg-gradient-to-r from-cyan-500 to-rose-500"
              >
                Changer de plan
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmation */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Confirmer le changement</DialogTitle>
            <DialogDescription className="text-gray-400">
              Vous êtes sur le point de passer de{" "}
              <span className="text-white font-medium">{currentPlan?.name}</span> à{" "}
              <span className="text-white font-medium">{selectedPlan?.name}</span>
            </DialogDescription>
          </DialogHeader>

          {proration && (
            <div className="space-y-4 py-4">
              <div className="bg-white/5 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Jours restants sur votre plan actuel</span>
                  <span className="text-white">{proration.remainingDays} jours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Valeur restante</span>
                  <span className="text-white">{proration.remainingValue}€</span>
                </div>
                {proration.amountDue > 0 && (
                  <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                    <span className="text-gray-400">Montant à payer</span>
                    <span className="text-green-400 font-bold">{proration.amountDue}€</span>
                  </div>
                )}
                {proration.credit > 0 && (
                  <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                    <span className="text-gray-400">Crédit appliqué</span>
                    <span className="text-cyan-400 font-bold">{proration.credit}€</span>
                  </div>
                )}
              </div>

              {getSwitchType(selectedPlan!) === "downgrade" && (
                <div className="flex items-start gap-3 p-4 bg-yellow-500/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-yellow-300 font-medium">Attention - Downgrade</p>
                    <p className="text-yellow-400/80">
                      En passant à un plan inférieur, certaines fonctionnalités pourraient ne plus être disponibles.
                      Votre crédit sera converti en jours supplémentaires.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleSwitch}
              disabled={switching}
              className="bg-gradient-to-r from-cyan-500 to-rose-500"
            >
              {switching ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : proration?.amountDue ? (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payer {proration.amountDue}€
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Confirmer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PlanSwitcher
