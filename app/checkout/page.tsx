"use client"
import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Lock, Check, Tag, Phone, Mail } from "@/lib/icons"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { PaymentModal } from "@/components/payment-modal"

export default function CheckoutPage() {
  const { t } = useLanguage()
  const [planId, setPlanId] = useState<string | null>(null)
  const [planDetails, setPlanDetails] = useState<any>(null)
  const [email, setEmail] = useState("")
  const [whatsappPhone, setWhatsappPhone] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState<any>(null)
  const [promoError, setPromoError] = useState("")
  const [isValidatingPromo, setIsValidatingPromo] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null)
  const [isLoadingPlan, setIsLoadingPlan] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState("")
  const [transactionId, setTransactionId] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const planIdFromUrl = urlParams.get("planId")
      const refCode = urlParams.get("ref") || sessionStorage.getItem("affiliate_code")

      if (planIdFromUrl) {
        setPlanId(planIdFromUrl)
        setIsLoadingPlan(true)
        fetch(`/api/pricing`)
          .then((res) => res.json())
          .then((plans) => {
            const plan = plans.find((p: any) => p.id === planIdFromUrl)
            if (plan) {
              setPlanDetails(plan)
            } else {
              console.error("[v0] Plan not found:", planIdFromUrl)
            }
          })
          .catch((error) => {
            console.error("[v0] Error fetching plan:", error)
          })
          .finally(() => {
            setIsLoadingPlan(false)
          })
      } else {
        setIsLoadingPlan(false)
      }

      if (refCode) {
        setAffiliateCode(refCode)
        sessionStorage.setItem("affiliate_code", refCode)
      }
    }
  }, [])

  const basePrice = planDetails?.price || 29
  const tax = basePrice * 0.1 // 10% tax
  const discountAmount = promoApplied?.discountAmount || 0
  const finalPrice = promoApplied?.finalPrice || basePrice
  const total = finalPrice + tax

  const handleApplyPromo = async () => {
    setIsValidatingPromo(true)
    setPromoError("")

    try {
      const response = await fetch("/api/promo-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode, planPrice: basePrice }),
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        setPromoApplied(data)
      } else {
        setPromoError(data.error || "Code invalide")
      }
    } catch (error) {
      setPromoError("Erreur de validation")
    } finally {
      setIsValidatingPromo(false)
    }
  }

  const handleRemovePromo = () => {
    setPromoApplied(null)
    setPromoCode("")
    setPromoError("")
  }

  const handlePayment = async () => {
    if (!email || !whatsappPhone) {
      alert(t.checkout.fillAllFields || "Veuillez remplir tous les champs")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert("Veuillez entrer une adresse email valide")
      return
    }

    if (whatsappPhone.length < 8) {
      alert("Veuillez entrer un numéro WhatsApp valide")
      return
    }

    if (!planId) {
      alert("Veuillez sélectionner un plan d'abonnement")
      return
    }

    setIsProcessing(true)

    try {
      console.log("[v0] Initiating payment with PayGate.to")

      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          whatsapp: whatsappPhone,
          planId: planId,
          amount: total,
          promoCode: promoApplied?.promoCode?.code,
          affiliateCode,
        }),
      })

      const data = await response.json()

      if (response.ok && data.paymentUrl) {
        console.log("[v0] Opening payment modal with PayGate.to")
        setPaymentUrl(data.paymentUrl)
        setTransactionId(data.transactionId)
        setShowPaymentModal(true)
      } else {
        console.error("[v0] Payment error:", data.error)
        alert(data.error || "Erreur lors du paiement")
      }
    } catch (error) {
      console.error("[v0] Payment error:", error)
      alert("Erreur lors du traitement du paiement")
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentSuccess = () => {
    console.log("[v0] Payment successful, redirecting to success page")
    setShowPaymentModal(false)
    window.location.href = `/payment/success?transaction=${transactionId}`
  }

  const handlePaymentFailure = () => {
    console.log("[v0] Payment failed, redirecting to failure page")
    setShowPaymentModal(false)
    window.location.href = `/payment/failure?transaction=${transactionId}`
  }

  const handleModalClose = () => {
    const confirmClose = confirm(
      "Êtes-vous sûr de vouloir fermer cette fenêtre ? Votre paiement pourrait ne pas être finalisé.",
    )
    if (confirmClose) {
      setShowPaymentModal(false)
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-4 text-balance">
              {t.checkout.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 text-pretty">{t.checkout.subtitle}</p>
          </div>

          {isLoadingPlan ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-white mt-4">Chargement du plan...</p>
            </div>
          ) : !planId ? (
            <div className="text-center py-20">
              <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10 max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4">Aucun plan sélectionné</h2>
                <p className="text-gray-300 mb-6">
                  Veuillez sélectionner un plan d'abonnement depuis la page d'accueil
                </p>
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]"
                >
                  Retour à l'accueil
                </Button>
              </Card>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {/* Plan Selection */}
                <Card className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border-white/10">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#00d4ff]" />
                    {t.checkout.selectedPlan}
                  </h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-[#00d4ff]/20 to-[#e94b87]/20 rounded-lg border border-[#00d4ff]/30 gap-3 sm:gap-0">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">{planDetails?.name || "Premium"}</h3>
                      <p className="text-sm sm:text-base text-gray-300">
                        {planDetails?.description || "2 Connexions • 4K Quality • +15K Chaînes"}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-2xl sm:text-3xl font-black text-white">${basePrice}</p>
                      <p className="text-sm sm:text-base text-gray-400">
                        /{planDetails?.duration_months ? `${planDetails.duration_months} mois` : "mois"}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Promo Code */}
                <Card className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border-white/10">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-[#00d4ff]" />
                    <span className="text-base sm:text-2xl">Code Promotionnel</span>
                  </h2>
                  {!promoApplied ? (
                    <div className="flex flex-col xs:flex-row gap-2">
                      <Input
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="ENTREZ VOTRE CODE"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 font-mono text-sm sm:text-base"
                      />
                      <Button
                        onClick={handleApplyPromo}
                        disabled={!promoCode || isValidatingPromo}
                        className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87] whitespace-nowrap text-sm sm:text-base"
                      >
                        Appliquer
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-green-300 font-bold">Code appliqué: {promoApplied.promoCode.code}</p>
                        <p className="text-sm text-gray-300">Réduction de ${discountAmount.toFixed(2)}</p>
                      </div>
                      <Button onClick={handleRemovePromo} variant="ghost" size="sm" className="text-white">
                        Retirer
                      </Button>
                    </div>
                  )}
                  {promoError && <p className="text-red-400 text-sm mt-2">{promoError}</p>}
                </Card>

                {/* Contact Information - Simplified to email and WhatsApp only */}
                <Card className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border-white/10">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Informations de Contact</h2>

                  {affiliateCode && (
                    <div className="mb-4 p-3 bg-[#00d4ff]/10 border border-[#00d4ff]/30 rounded-lg">
                      <p className="text-sm text-[#00d4ff]">
                        ✨ Vous bénéficiez d'un parrainage avec le code:{" "}
                        <span className="font-bold">{affiliateCode}</span>
                      </p>
                    </div>
                  )}

                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault()
                      handlePayment()
                    }}
                  >
                    <div>
                      <Label htmlFor="email" className="text-white flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {t.checkout.email}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                      />
                      <p className="text-sm text-gray-400 mt-1">Pour recevoir vos identifiants d'accès</p>
                    </div>

                    <div>
                      <Label htmlFor="whatsapp" className="text-white flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Numéro WhatsApp
                      </Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        value={whatsappPhone}
                        onChange={(e) => setWhatsappPhone(e.target.value)}
                        placeholder="+33 6 12 34 56 78"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                      />
                      <p className="text-sm text-gray-400 mt-1">Nous vous enverrons les détails d'accès par WhatsApp</p>
                    </div>
                  </form>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border-white/10 lg:sticky lg:top-24">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">{t.checkout.orderSummary}</h2>

                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="flex justify-between text-sm sm:text-base text-gray-300">
                      <span>{planDetails?.name || "Premium Plan"}</span>
                      <span>${basePrice.toFixed(2)}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-green-400">
                        <span>Réduction ({promoApplied.promoCode.code})</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm sm:text-base text-gray-300">
                      <span>{t.checkout.tax}</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator className="bg-white/20" />
                    <div className="flex justify-between text-white text-lg sm:text-xl font-bold">
                      <span>{t.checkout.total}</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing || !email || !whatsappPhone}
                    className="w-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90 text-white font-bold py-4 sm:py-6 text-base sm:text-lg"
                  >
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {isProcessing ? "Redirection vers PayGate.to..." : t.checkout.completePayment}
                  </Button>

                  <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                      <Check className="w-4 h-4 text-[#00d4ff]" />
                      <span>{t.checkout.securePayment}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                      <Check className="w-4 h-4 text-[#00d4ff]" />
                      <span>{t.checkout.cancelAnytime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                      <Check className="w-4 h-4 text-[#00d4ff]" />
                      <span>{t.checkout.instantAccess}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs sm:text-sm text-gray-500 text-center mb-2">
                        Paiement sécurisé par PayGate.to
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 text-center">
                        Carte bancaire • Apple Pay • Google Pay • Crypto
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        paymentUrl={paymentUrl}
        transactionId={transactionId}
        onSuccess={handlePaymentSuccess}
        onFailure={handlePaymentFailure}
        onClose={handleModalClose}
      />
    </>
  )
}
