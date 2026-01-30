"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useToast } from "@/components/ui/toast"

export default function RegisterClientPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const { addToast } = useToast()

  const affiliateCode = searchParams.get("ref")

  useEffect(() => {
    // Track affiliate click if ref parameter exists
    if (affiliateCode) {
      fetch("/api/affiliate/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ affiliateCode }),
      }).catch(() => {
        // Silent fail - don't block registration if tracking fails
      })

      // Store in session for later use during checkout
      sessionStorage.setItem("affiliate_ref", affiliateCode)
    }
  }, [affiliateCode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      addToast(t.auth?.passwordMismatch || "Les mots de passe ne correspondent pas", "error")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (response.ok) {
        addToast(t.auth?.registerSuccess || "Compte créé avec succès !", "success")
        router.push("/login")
      } else {
        addToast(t.auth?.registerError || "Une erreur est survenue", "error")
      }
    } catch (error) {
      addToast(t.auth?.registerError || "Une erreur est survenue", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background blur circles */}
      <div className="blur-circle blur-circle-purple w-[600px] h-[600px] top-0 right-0" />
      <div className="blur-circle blur-circle-pink w-[500px] h-[500px] bottom-0 left-0" />
      <div className="blur-circle blur-circle-blue w-[400px] h-[400px] top-1/2 right-1/4" />

      {/* Main gradient background */}
      <div className="fixed inset-0 bg-gradient-main -z-10" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
            {t.auth?.registerTitle || "Inscription"}
          </h1>
          <p className="text-white/60 mt-2">{t.auth?.registerSubtitle || "Créez votre compte VistraTV"}</p>
          {affiliateCode && (
            <p className="text-cyan-400 text-sm mt-2">Vous avez été invité par un partenaire VistraTV</p>
          )}
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">{t.auth?.name || "Nom complet"}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#00d4ff] transition-colors"
                  placeholder={t.auth?.namePlaceholder || "John Doe"}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">{t.auth?.email || "Email"}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#00d4ff] transition-colors"
                  placeholder={t.auth?.emailPlaceholder || "votre@email.com"}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">{t.auth?.password || "Mot de passe"}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#00d4ff] transition-colors"
                  placeholder={t.auth?.passwordPlaceholder || "••••••••"}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                {t.auth?.confirmPassword || "Confirmer le mot de passe"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#00d4ff] transition-colors"
                  placeholder={t.auth?.passwordPlaceholder || "••••••••"}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="text-sm text-white/60">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-1 rounded border-white/20" required />
                <span>
                  {t.auth?.agreeTerms || "J'accepte les"}{" "}
                  <Link href="/terms" className="text-[#00d4ff] hover:text-[#e94b87] transition-colors">
                    {t.auth?.terms || "conditions générales"}
                  </Link>{" "}
                  {t.auth?.and || "et la"}{" "}
                  <Link href="/privacy" className="text-[#00d4ff] hover:text-[#e94b87] transition-colors">
                    {t.auth?.privacy || "politique de confidentialité"}
                  </Link>
                </span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90 text-white font-bold py-3 rounded-lg transition-opacity"
            >
              {isLoading ? t.auth?.loading || "Chargement..." : t.auth?.registerButton || "S'inscrire"}
            </Button>
          </form>

          <div className="mt-6 text-center text-white/60 text-sm">
            {t.auth?.hasAccount || "Vous avez déjà un compte ?"}{" "}
            <Link href="/login" className="text-[#00d4ff] hover:text-[#e94b87] transition-colors font-medium">
              {t.auth?.loginLink || "Se connecter"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
