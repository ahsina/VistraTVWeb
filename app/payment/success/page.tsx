"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Loader2, AlertCircle, Mail, Phone, Download } from "@/lib/icons"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function PaymentSuccessPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const transactionId = searchParams.get("transaction")
  const [loading, setLoading] = useState(true)
  const [transaction, setTransaction] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [error, setError] = useState("")
  const supabase = createClient()

  useEffect(() => {
    if (transactionId) {
      checkPaymentStatus()
    } else {
      setError(t.paymentSuccess.noTransaction)
      setLoading(false)
    }
  }, [transactionId])

  const checkPaymentStatus = async () => {
    setLoading(true)

    let attempts = 0
    const maxAttempts = 15

    const checkStatus = async () => {
      const { data, error: txError } = await supabase
        .from("payment_transactions")
        .select("*")
        .eq("transaction_id", transactionId)
        .single()

      if (txError) {
        setError("Transaction introuvable")
        setLoading(false)
        return
      }

      if (data.status === "completed") {
        setTransaction(data)

        const { data: sub } = await supabase
          .from("subscriptions")
          .select("*, subscription_plans(*)")
          .eq("email", data.email)
          .eq("payment_transaction_id", data.id)
          .single()

        setSubscription(sub)
        setLoading(false)
        return
      }

      if (data.status === "failed") {
        setError("Le paiement a échoué")
        setLoading(false)
        return
      }

      attempts++
      if (attempts < maxAttempts) {
        setTimeout(checkStatus, 2000)
      } else {
        setTransaction(data)
        setLoading(false)
      }
    }

    checkStatus()
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] flex items-center justify-center px-4">
          <Card className="p-12 bg-white/5 backdrop-blur-sm border-white/10 text-center">
            <Loader2 className="w-16 h-16 text-[#00d4ff] animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">{t.paymentSuccess.verifying}</h2>
            <p className="text-gray-300">{t.paymentSuccess.pleaseWait}</p>
          </Card>
        </div>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] flex items-center justify-center px-4">
          <Card className="p-12 bg-white/5 backdrop-blur-sm border-white/10 text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">{t.paymentSuccess.error}</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <Button asChild className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
              <Link href="/checkout">{t.paymentSuccess.backToPayment}</Link>
            </Button>
          </Card>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-12 bg-white/5 backdrop-blur-sm border-white/10 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-[#00d4ff] to-[#e94b87] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Check className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-4xl font-black text-white mb-4">{t.paymentSuccess.title}</h1>
            <p className="text-xl text-gray-300 mb-8">{t.paymentSuccess.subtitle}</p>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-lg font-bold text-white mb-4">{t.paymentSuccess.transactionDetails}</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex justify-between">
                  <span>{t.paymentSuccess.transactionId}:</span>
                  <span className="font-mono text-[#00d4ff]">{transaction?.transaction_id}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.paymentSuccess.plan}:</span>
                  <span className="font-bold text-white">{subscription?.subscription_plans?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.paymentSuccess.amount}:</span>
                  <span className="font-bold text-white">
                    ${transaction?.final_amount} {transaction?.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t.paymentSuccess.duration}:</span>
                  <span className="text-white">
                    {subscription?.subscription_plans?.duration_months} {t.paymentSuccess.months}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#00d4ff]/20 to-[#e94b87]/20 border border-[#00d4ff]/30 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-white mb-4">{t.paymentSuccess.credentialsArriving}</h3>
              <p className="text-gray-300 mb-4">{t.paymentSuccess.credentialsMessage}</p>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-center gap-2 text-white bg-white/10 rounded-lg p-3">
                  <Mail className="w-5 h-5 text-[#00d4ff]" />
                  <span className="font-medium">{transaction?.email}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-white bg-white/10 rounded-lg p-3">
                  <Phone className="w-5 h-5 text-[#00d4ff]" />
                  <span className="font-medium">{transaction?.whatsapp_phone}</span>
                </div>
              </div>
              <div className="text-left space-y-2 text-sm text-gray-300">
                <p>{t.paymentSuccess.features.downloadLink}</p>
                <p>{t.paymentSuccess.features.activationCode}</p>
                <p>{t.paymentSuccess.features.installGuide}</p>
                <p>{t.paymentSuccess.features.support}</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button asChild className="w-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] py-6 text-lg">
                <Link href="/tutorials">
                  <Download className="w-5 h-5 mr-2" />
                  {t.paymentSuccess.tutorialsButton}
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-white/20 text-white bg-transparent">
                <Link href="/">{t.paymentSuccess.backHome}</Link>
              </Button>
            </div>

            <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-sm text-yellow-200">
                {t.paymentSuccess.notReceived} {t.paymentSuccess.notReceivedMessage} {transaction?.whatsapp_phone}
              </p>
            </div>

            <p className="text-sm text-gray-400 mt-6">
              {t.paymentSuccess.needHelp} <strong>support@vistratv.com</strong> {t.paymentSuccess.or}{" "}
              <Link href="/support" className="text-[#00d4ff] hover:underline">
                {t.paymentSuccess.supportPage}
              </Link>
            </p>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  )
}
