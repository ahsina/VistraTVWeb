"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useToast } from "@/components/ui/toast"
import { FadeIn } from "@/components/animations/FadeIn"
import { validateEmail } from "@/lib/utils/validation"

export default function LoginPageClient() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Validation
  const [emailError, setEmailError] = useState("")
  
  const router = useRouter()
  const { t } = useLanguage()
  const { addToast } = useToast()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || "Email requis")
      return
    }

    // Validate password
    if (!password) {
      addToast("Veuillez entrer votre mot de passe", "error")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password,
          rememberMe 
        }),
      })

      const data = await response.json()

      if (response.ok) {
        addToast(
          t.auth?.loginSuccess || "Connexion réussie ! Bienvenue.",
          "success"
        )
        
        // Small delay before redirect for toast to show
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 500)
      } else {
        // SECURITY: Use generic error message to not reveal if email exists
        // Never say "email not found" or "wrong password" separately
        addToast(
          "Identifiants incorrects. Vérifiez votre email et mot de passe.",
          "error"
        )
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      addToast(
        "Erreur de connexion. Veuillez réessayer.",
        "error"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] flex items-center justify-center px-4 py-12">
      <FadeIn direction="up">
        <Card className="w-full max-w-md p-8 bg-white/5 backdrop-blur-sm border-white/10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">
              {t.auth?.login || "Connexion"}
            </h1>
            <p className="text-gray-400">
              {t.auth?.loginSubtitle || "Accédez à votre espace VistraTV"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {t.auth?.email || "Email"}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="votre@email.com"
                autoComplete="email"
                className={`bg-white/10 border-white/20 text-white placeholder:text-gray-500 ${
                  emailError ? "border-red-500" : ""
                }`}
              />
              {emailError && <p className="text-red-400 text-sm">{emailError}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-white flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  {t.auth?.password || "Mot de passe"}
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#00d4ff] hover:underline"
                >
                  {t.auth?.forgotPassword || "Mot de passe oublié ?"}
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-white/30 data-[state=checked]:bg-[#00d4ff] data-[state=checked]:border-[#00d4ff]"
              />
              <Label
                htmlFor="remember"
                className="text-sm text-gray-300 cursor-pointer"
              >
                {t.auth?.rememberMe || "Se souvenir de moi"}
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90 text-white font-bold py-6 disabled:opacity-50"
            >
              {isLoading ? "Connexion..." : t.auth?.login || "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {t.auth?.noAccount || "Pas encore de compte ?"}{" "}
              <Link href="/register" className="text-[#00d4ff] hover:underline font-medium">
                {t.auth?.register || "Créer un compte"}
              </Link>
            </p>
          </div>

          {/* Security notice */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-500 text-center">
              🔒 Connexion sécurisée - Vos données sont protégées
            </p>
          </div>
        </Card>
      </FadeIn>
    </div>
  )
}
