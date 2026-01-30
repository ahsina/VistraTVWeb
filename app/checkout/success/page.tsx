"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Download, Play } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function CheckoutSuccessPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full p-8 bg-white/5 backdrop-blur-sm border-white/10 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-black text-white mb-4">{t.checkoutSuccess.title}</h1>
        <p className="text-xl text-gray-300 mb-8">{t.checkoutSuccess.subtitle}</p>

        <div className="bg-gradient-to-r from-[#00d4ff]/20 to-[#e94b87]/20 rounded-lg p-6 mb-8 border border-[#00d4ff]/30">
          <h2 className="text-2xl font-bold text-white mb-2">Premium Plan</h2>
          <p className="text-gray-300 mb-4">{t.checkoutSuccess.confirmationEmail}</p>
          <p className="text-sm text-gray-400">Order #: 123456789</p>
        </div>

        <div className="space-y-4">
          <Link href="/dashboard">
            <Button className="w-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90 text-white font-bold py-6 text-lg">
              <Play className="w-5 h-5 mr-2" />
              {t.checkoutSuccess.goToDashboard}
            </Button>
          </Link>

          <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 py-6 bg-transparent">
            <Download className="w-5 h-5 mr-2" />
            {t.checkoutSuccess.downloadApp}
          </Button>
        </div>

        <p className="mt-8 text-sm text-gray-400">
          {t.checkoutSuccess.needHelp}{" "}
          <Link href="/support" className="text-[#00d4ff] hover:underline">
            {t.checkoutSuccess.contactSupport}
          </Link>
        </p>
      </Card>
    </div>
  )
}
