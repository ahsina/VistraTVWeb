"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

function ResetPasswordForm() {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    setToken(tokenParam)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: t.auth.registerError,
        description: t.auth.passwordMismatch,
        variant: "destructive",
      })
      return
    }

    if (!token) {
      toast({
        title: t.auth.registerError,
        description: t.passwordReset.invalidToken,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      if (response.ok) {
        setResetSuccess(true)
        toast({
          title: t.passwordReset.successTitle,
          description: t.passwordReset.successDesc,
        })
        setTimeout(() => router.push("/login"), 3000)
      } else {
        toast({
          title: t.auth.registerError,
          description: t.passwordReset.resetFailed,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t.auth.registerError,
        description: t.passwordReset.resetFailed,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 bg-white/5 backdrop-blur-sm border-white/10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-white mb-4">{t.passwordReset.successTitle}</h1>
          <p className="text-gray-300 mb-8">{t.passwordReset.redirecting}</p>

          <Link href="/login">
            <Button className="w-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90 text-white font-bold">
              {t.auth.loginButton}
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
          <h1 className="text-4xl font-black text-white mb-2">{t.passwordReset.resetTitle}</h1>
          <p className="text-gray-300">{t.passwordReset.resetSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="password" className="text-white">
              {t.auth.password}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.auth.passwordPlaceholder}
                className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-white">
              {t.auth.confirmPassword}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t.auth.passwordPlaceholder}
                className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90 text-white font-bold py-6"
          >
            {isLoading ? t.auth.loading : t.passwordReset.resetPassword}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
