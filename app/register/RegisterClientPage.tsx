"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useToast } from "@/components/ui/toast"
import { FadeIn } from "@/components/animations/FadeIn"
import { PasswordStrengthIndicator, validatePassword } from "@/components/ui/password-strength"
import { Turnstile, useTurnstile } from "@/components/ui/turnstile"
import { validateEmail, validateName } from "@/lib/utils/validation"

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAA..."

export default function RegisterClientPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null)
  
  // Validation errors
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [termsError, setTermsError] = useState("")
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const { addToast } = useToast()
  
  // Turnstile CAPTCHA
  const turnstile = useTurnstile()

  // Detect affiliate code from URL
  useEffect(() => {
    const refCode = searchParams.get("ref")
    if (refCode) {
      setAffiliateCode(refCode)
      sessionStorage.setItem("affiliate_code", refCode)
      
      // Track affiliate click
      fetch("/api/affiliate/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ affiliateCode: refCode }),
      }).catch(console.error)
    }
  }, [searchParams])

  // Validate name
  const handleNameChange = (value: string) => {
    setName(value)
    if (value) {
      const validation = validateName(value)
      setNameError(validation.error || "")
    } else {
      setNameError("")
    }
  }

  // Validate email
  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (value) {
      const validation = validateEmail(value)
      setEmailError(validation.error || "")
    } else {
      setEmailError("")
    }
  }

  // Validate password
  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (value) {
      const validation = validatePassword(value)
      setPasswordErrors(validation.errors)
    } else {
      setPasswordErrors([])
    }
    
    // Check confirm password match
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Les mots de passe ne correspondent pas")
    } else {
      setConfirmPasswordError("")
    }
  }

  // Validate confirm password
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    if (value && value !== password) {
      setConfirmPasswordError("Les mots de passe ne correspondent pas")
    } else {
      setConfirmPasswordError("")
    }
  }

  // Validate entire form
  const validateForm = (): boolean => {
    let isValid = true

    // Validate name
    const nameValidation = validateName(name)
    if (!nameValidation.isValid) {
      setNameError(nameValidation.error || "Nom requis")
      isValid = false
    }

    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || "Email requis")
      isValid = false
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      setPasswordErrors(passwordValidation.errors)
      isValid = false
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError("Les mots de passe ne correspondent pas")
      isValid = false
    }

    // Validate terms
    if (!acceptTerms) {
      setTermsError("Vous devez accepter les conditions générales")
      isValid = false
    }

    // Validate Turnstile
    if (!turnstile.isVerified) {
      addToast("Veuillez compléter la vérification de sécurité", "error")
      isValid = false
    }

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

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
        setIsLoading(false)
        return
      }

      // Register user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          affiliateCode,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        addToast(
          t.auth?.registerSuccess || "Compte créé avec succès ! Bienvenue sur VistraTV.",
          "success"
        )
        
        // Redirect to dashboard or login
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        // Handle specific errors without revealing if email exists
        if (data.error?.includes("email")) {
          addToast("Cette adresse email est déjà utilisée ou invalide.", "error")
        } else {
          addToast(data.error || "Erreur lors de la création du compte", "error")
        }
      }
    } catch (error) {
      console.error("[v0] Registration error:", error)
      addToast("Erreur lors de la création du compte. Veuillez réessayer.", "error")
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
              {t.auth?.register || "Créer un compte"}
            </h1>
            <p className="text-gray-400">
              {t.auth?.registerSubtitle || "Rejoignez VistraTV dès maintenant"}
            </p>
          </div>

          {affiliateCode && (
            <div className="mb-6 p-3 bg-[#00d4ff]/10 border border-[#00d4ff]/30 rounded-lg">
              <p className="text-sm text-[#00d4ff] text-center">
                ✨ Inscription via parrainage:{" "}
                <span className="font-bold">{affiliateCode}</span>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white flex items-center gap-2">
                <User className="w-4 h-4" />
                {t.auth?.fullName || "Nom complet"}
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Jean Dupont"
                className={`bg-white/10 border-white/20 text-white placeholder:text-gray-500 ${
                  nameError ? "border-red-500" : ""
                }`}
              />
              {nameError && <p className="text-red-400 text-sm">{nameError}</p>}
            </div>

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
                className={`bg-white/10 border-white/20 text-white placeholder:text-gray-500 ${
                  emailError ? "border-red-500" : ""
                }`}
              />
              {emailError && <p className="text-red-400 text-sm">{emailError}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {t.auth?.password || "Mot de passe"}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="••••••••"
                  className={`bg-white/10 border-white/20 text-white placeholder:text-gray-500 pr-10 ${
                    passwordErrors.length > 0 ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <PasswordStrengthIndicator password={password} showRequirements={true} />
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {t.auth?.confirmPassword || "Confirmer le mot de passe"}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  placeholder="••••••••"
                  className={`bg-white/10 border-white/20 text-white placeholder:text-gray-500 pr-10 ${
                    confirmPasswordError ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPasswordError && <p className="text-red-400 text-sm">{confirmPasswordError}</p>}
            </div>

            {/* Terms & Conditions */}
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
                <Label htmlFor="terms" className="text-sm text-gray-300 cursor-pointer">
                  J'accepte les{" "}
                  <Link href="/terms" className="text-[#00d4ff] hover:underline" target="_blank">
                    Conditions Générales
                  </Link>{" "}
                  et la{" "}
                  <Link href="/privacy" className="text-[#00d4ff] hover:underline" target="_blank">
                    Politique de Confidentialité
                  </Link>
                </Label>
                {termsError && <p className="text-red-400 text-sm mt-1">{termsError}</p>}
              </div>
            </div>

            {/* Turnstile CAPTCHA */}
            <div className="flex justify-center">
              <Turnstile
                siteKey={TURNSTILE_SITE_KEY}
                onVerify={turnstile.handleVerify}
                onError={turnstile.handleError}
                onExpire={turnstile.handleExpire}
                theme="dark"
              />
            </div>
            {turnstile.error && (
              <p className="text-red-400 text-sm text-center">
                Erreur de vérification. Veuillez rafraîchir la page.
              </p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !turnstile.isVerified}
              className="w-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90 text-white font-bold py-6 disabled:opacity-50"
            >
              {isLoading ? "Création en cours..." : t.auth?.register || "Créer mon compte"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {t.auth?.hasAccount || "Déjà un compte ?"}{" "}
              <Link href="/login" className="text-[#00d4ff] hover:underline font-medium">
                {t.auth?.login || "Se connecter"}
              </Link>
            </p>
          </div>
        </Card>
      </FadeIn>
    </div>
  )
}
