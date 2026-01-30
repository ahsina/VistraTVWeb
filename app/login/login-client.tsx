"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useToast } from "@/components/ui/toast"
import { FadeIn } from "@/components/animations/FadeIn"

export default function LoginPageClient() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        addToast(t.auth?.loginSuccess || "Connexion réussie !", "success")
        router.push("/dashboard")
      } else {
        addToast(t.auth?.loginError || "Email ou mot de passe incorrect", "error")
      }
    } catch (error) {
      addToast(t.auth?.loginError || "Une erreur est survenue", "error")
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

      <FadeIn direction="up">
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              {t.auth?.loginTitle || "Connexion"}
            </h1>
            <p className="text-muted-foreground mt-2">{t.auth?.loginSubtitle || "Accédez à votre compte VistraTV"}</p>
          </div>

          <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-8 border border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-foreground text-sm font-medium mb-2">{t.auth?.email || "Email"}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-background/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder={t.auth?.emailPlaceholder || "votre@email.com"}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-foreground text-sm font-medium mb-2">
                  {t.auth?.password || "Mot de passe"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-background/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder={t.auth?.passwordPlaceholder || "••••••••"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  {t.auth?.rememberMe || "Se souvenir de moi"}
                </label>
                <Link href="/forgot-password" className="text-primary hover:text-accent transition-colors">
                  {t.auth?.forgotPassword || "Mot de passe oublié ?"}
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold py-3 rounded-lg transition-opacity"
              >
                {isLoading ? t.auth?.loading || "Chargement..." : t.auth?.loginButton || "Se connecter"}
              </Button>
            </form>

            <div className="mt-6 text-center text-muted-foreground text-sm">
              {t.auth?.noAccount || "Vous n'avez pas de compte ?"}{" "}
              <Link href="/register" className="text-primary hover:text-accent transition-colors font-medium">
                {t.auth?.registerLink || "S'inscrire"}
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
