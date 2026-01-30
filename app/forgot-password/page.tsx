"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ForgotPasswordPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setEmailSent(true)
        toast({
          title: t.passwordReset.emailSentTitle,
          description: t.passwordReset.emailSentDesc,
        })
      } else {
        toast({
          title: t.auth.registerError,
          description: t.passwordReset.emailNotFound,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t.auth.registerError,
        description: t.passwordReset.errorSending,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 bg-white/5 backdrop-blur-sm border-white/10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-white mb-4">{t.passwordReset.checkEmail}</h1>
          <p className="text-gray-300 mb-6">{t.passwordReset.checkEmailDesc}</p>
          <p className="text-sm text-gray-400 mb-8">{email}</p>

          <Link href="/login">
            <Button className="w-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90 text-white font-bold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.passwordReset.backToLogin}
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 bg-white/5 backdrop-blur-sm border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">{t.passwordReset.title}</h1>
          <p className="text-gray-300">{t.passwordReset.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-white">
              {t.auth.email}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.auth.emailPlaceholder}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90 text-white font-bold py-6"
          >
            {isLoading ? t.auth.loading : t.passwordReset.sendResetLink}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-[#00d4ff] hover:underline flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t.passwordReset.backToLogin}
          </Link>
        </div>
      </Card>
    </div>
  )
}
