"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useToast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Lock, Check, Tag, Phone, Mail, ShieldCheck, AlertCircle } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { PaymentModal } from "@/components/payment-modal"
import { Turnstile, useTurnstile } from "@/components/ui/turnstile"
import { validateEmail, validateWhatsApp } from "@/lib/utils/validation"
import Link from "next/link"

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAA..."

export default function CheckoutPage() {
  const { t } = useLanguage()
  const { addToast } = useToast()
  
  // Form state
  const [planId, setPlanId] = useState<string | null>(null)
  const [planDetails, setPlanDetails] = useState<any>(null)
  const [email, setEmail] = useState("")
  const [whatsappPhone, setWhatsappPhone] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState<any>(null)
  const [promoError, setPromoError] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  
  // Validation errors
  const [emailError, setEmailError] = useState("")
  const [whatsappError, setWhatsappError] = useState("")
  const [termsError, setTermsError] = useState("")
  
  // Loading states
  const [isValidatingPromo, setIsValidatingPromo] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoadingPlan, setIsLoadingPlan] = useState(true)
  
  // Payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState("")
  const [transactionId, setTransactionId] = useState("")
  
  // Affiliate
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null)
  
  // Turnstile CAPTCHA
  const turnstile = useTurnstile()

  // Load plan from URL
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
              addToast("Plan non trouvé", "error")
            }
          })
          .catch((error) => {
            console.error("[v0] Error fetching plan:", error)
            addToast("Erreur lors du chargement du plan", "error")
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
  }, [addToast])

  // Calculate prices
  const basePrice = planDetails?.price || 29
  const tax = basePrice * 0.1 // 10% tax
  const discountAmount = promoApplied?.discountAmount || 0
  const finalPrice = promoApplied?.finalPrice || basePrice
  const total = finalPrice + tax

  // Validate email on change
  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (value) {
      const validation = validateEmail(value)
      setEmailError(validation.error || "")
    } else {
      setEmailError("")
    }
  }

  // Validate WhatsApp on change
  const handleWhatsAppChange = (value: string) => {
    setWhatsappPhone(value)
    if (value) {
      const validation = validateWhatsApp(value)
      setWhatsappError(validation.error || "")
    } else {
      setWhatsappError("")
    }
  }

  // Apply promo code
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
        addToast(`Code promo appliqué: -${data.discountAmount.toFixed(2)}€`, "success")
      } else {
        setPromoError(data.error || "Code invalide")
        addToast(data.error || "Code promo invalide", "error")
      }
    } catch (error) {
      setPromoError("Erreur de validation")
      addToast("Erreur lors de la validation du code", "error")
    } finally {
      setIsValidatingPromo(false)
    }
  }

  // Remove promo code
  const handleRemovePromo = () => {
    setPromoApplied(null)
    setPromoCode("")
    setPromoError("")
    addToast("Code promo retiré", "info")
  }

  // Validate form before payment
  const validateForm = (): boolean => {
    let isValid = true

    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || "Email invalide")
      isValid = false
    }

    // Validate WhatsApp
    const whatsappValidation = validateWhatsApp(whatsappPhone)
    if (!whatsappValidation.isValid) {
      setWhatsappError(whatsappValidation.error || "Numéro invalide")
      isValid = false
    }

    // Validate terms acceptance
    if (!acceptTerms) {
      setTermsError("Vous devez accepter les conditions générales")
      isValid = false
    } else {
      setTermsError("")
    }

    // Validate Turnstile
    if (!turnstile.isVerified) {
      addToast("Veuillez compléter la vérification de sécurité", "error")
      isValid = false
    }

    // Validate plan
    if (!planId) {
      addToast("Veuillez sélectionner un plan d'abonnement", "error")
      isValid = false
    }

    return isValid
  }

  // Process payment
  const handlePayment = async () => {
    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    try {
      // Verify Turnstile token server-side
      const verifyResponse = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstile.token }),
      })

      if (!verifyResponse.ok) {
        addToast("Erreur de vérification de sécurité. Veuillez réessayer.", "error")
        turnstile.reset()
        setIsProcessing(false)
        return
      }

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
        addToast(data.error || "Erreur lors de l'initiation du paiement", "error")
      }
    } catch (error) {
      console.error("[v0] Payment error:", error)
      addToast("Erreur lors du traitement du paiement. Veuillez réessayer.", "error")
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
    addToast("Êtes-vous sûr de vouloir annuler le paiement ?", "warning")
    // Use a custom modal instead of confirm()
    setShowPaymentModal(false)
  }

  // Render loading state
  if (isLoadingPlan) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white mt-4">Chargement du plan...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // Render no plan selected
  if (!planId) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] flex items-center justify-center px-4">
          <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10 text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">Aucun plan sélectionné</h1>
            <p className="text-gray-300 mb-6">Veuillez sélectionner un plan d'abonnement avant de procéder au paiement.</p>
            <Link href="/subscriptions">
              <Button className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
                Voir les plans
              </Button>
            </Link>
          </Card>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-4 text-balance">
              {t.checkout?.title || "Finaliser votre commande"}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 text-pretty">
              {t.checkout?.subtitle || "Paiement sécurisé et rapide"}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Plan Summary */}
              <Card className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border-white/10">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Check className="w-6 h-6 text-[#00d4ff]" />
                  Plan sélectionné
                </h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-white">{planDetails?.name || "Premium"}</p>
                    <p className="text-gray-400">
                      {planDetails?.duration_months === 1
                        ? "1 mois"
                        : `${planDetails?.duration_months} mois`}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-[#00d4ff]">{basePrice.toFixed(2)}€</p>
                </div>
              </Card>

              {/* Promo Code */}
              <Card className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border-white/10">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#00d4ff]" />
                  Code Promotionnel
                </h2>
                {!promoApplied ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="ENTREZ VOTRE CODE"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 font-mono"
                    />
                    <Button
                      onClick={handleApplyPromo}
                      disabled={!promoCode || isValidatingPromo}
                      className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87] whitespace-nowrap"
                    >
                      {isValidatingPromo ? "Vérification..." : "Appliquer"}
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-green-300 font-bold">Code appliqué: {promoApplied.promoCode.code}</p>
                      <p className="text-sm text-gray-300">Réduction de {discountAmount.toFixed(2)}€</p>
                    </div>
                    <Button onClick={handleRemovePromo} variant="ghost" size="sm" className="text-white hover:text-red-400">
                      Retirer
                    </Button>
                  </div>
                )}
                {promoError && <p className="text-red-400 text-sm mt-2">{promoError}</p>}
              </Card>

              {/* Contact Information */}
              <Card className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border-white/10">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Informations de Contact</h2>

                {affiliateCode && (
                  <div className="mb-4 p-3 bg-[#00d4ff]/10 border border-[#00d4ff]/30 rounded-lg">
                    <p className="text-sm text-[#00d4ff]">
                      ✨ Vous bénéficiez d'un parrainage avec le code:{" "}
                      <span className="font-bold">{affiliateCode}</span>
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-white flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="votre@email.com"
                      className={`bg-white/10 border-white/20 text-white placeholder:text-gray-500 ${
                        emailError ? "border-red-500" : ""
                      }`}
                    />
                    {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
                    <p className="text-sm text-gray-400 mt-1">Pour recevoir vos identifiants d'accès</p>
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <Label htmlFor="whatsapp" className="text-white flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Numéro WhatsApp *
                    </Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={whatsappPhone}
                      onChange={(e) => handleWhatsAppChange(e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                      className={`bg-white/10 border-white/20 text-white placeholder:text-gray-500 ${
                        whatsappError ? "border-red-500" : ""
                      }`}
                    />
                    {whatsappError && <p className="text-red-400 text-sm mt-1">{whatsappError}</p>}
                    <p className="text-sm text-gray-400 mt-1">
                      Nous vous enverrons les détails d'accès par WhatsApp (format: +33612345678)
                    </p>
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <div className="pt-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) => {
                          setAcceptTerms(checked as boolean)
                          if (checked) setTermsError("")
                        }}
                        className="mt-1 border-white/30 data-[state=checked]:bg-[#00d4ff] data-[state=checked]:border-[#00d4ff]"
                      />
                      <div className="flex-1">
                        <Label htmlFor="terms" className="text-white cursor-pointer">
                          J'accepte les{" "}
                          <Link href="/terms" className="text-[#00d4ff] hover:underline" target="_blank">
                            Conditions Générales de Vente
                          </Link>{" "}
                          et la{" "}
                          <Link href="/privacy" className="text-[#00d4ff] hover:underline" target="_blank">
                            Politique de Confidentialité
                          </Link>{" "}
                          *
                        </Label>
                        {termsError && <p className="text-red-400 text-sm mt-1">{termsError}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Turnstile CAPTCHA */}
                  <div className="pt-4">
                    <Turnstile
                      siteKey={TURNSTILE_SITE_KEY}
                      onVerify={turnstile.handleVerify}
                      onError={turnstile.handleError}
                      onExpire={turnstile.handleExpire}
                      theme="dark"
                    />
                    {turnstile.error && (
                      <p className="text-red-400 text-sm mt-2">
                        Erreur de vérification. Veuillez rafraîchir la page.
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border-white/10 lg:sticky lg:top-24">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                  Récapitulatif
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>{planDetails?.name || "Premium Plan"}</span>
                    <span>{basePrice.toFixed(2)}€</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-green-400">
                      <span>Réduction ({promoApplied.promoCode.code})</span>
                      <span>-{discountAmount.toFixed(2)}€</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-300">
                    <span>TVA (10%)</span>
                    <span>{tax.toFixed(2)}€</span>
                  </div>
                  <Separator className="bg-white/20" />
                  <div className="flex justify-between text-white text-xl font-bold">
                    <span>Total</span>
                    <span>{total.toFixed(2)}€</span>
                  </div>
                </div>

                {/* Security badges */}
                <div className="mb-6 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <ShieldCheck className="w-5 h-5" />
                    <span>Paiement 100% sécurisé</span>
                  </div>
                </div>

                {/* Pay Button */}
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || !email || !whatsappPhone || !acceptTerms || !turnstile.isVerified}
                  className="w-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90 text-white font-bold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock className="w-5 h-5 mr-2" />
                  {isProcessing ? "Traitement en cours..." : `Payer ${total.toFixed(2)}€`}
                </Button>

                <p className="text-xs text-gray-400 text-center mt-4">
                  En cliquant sur "Payer", vous acceptez nos conditions de vente.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          url={paymentUrl}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
          onClose={handleModalClose}
        />
      )}

      <Footer />
    </>
  )
}
