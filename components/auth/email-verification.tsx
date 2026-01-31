// components/auth/email-verification.tsx
"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, Mail, Loader2, RefreshCw } from "lucide-react"

interface EmailVerificationProps {
  mode: "verify" | "resend"
}

export function EmailVerification({ mode }: EmailVerificationProps) {
  const [status, setStatus] = useState<"loading" | "success" | "error" | "idle">("idle")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [cooldown, setCooldown] = useState(0)

  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  useEffect(() => {
    if (mode === "verify" && token) {
      verifyToken()
    }
  }, [token, mode])

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  async function verifyToken() {
    try {
      setStatus("loading")
      const response = await fetch(`/api/auth/verify-email?token=${token}`)
      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage("Votre email a été vérifié avec succès!")
        setTimeout(() => router.push("/login"), 3000)
      } else {
        setStatus("error")
        setMessage(data.error || "Erreur lors de la vérification")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Une erreur est survenue")
    }
  }

  async function resendVerification() {
    if (cooldown > 0 || !email) return

    try {
      setStatus("loading")
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage("Un email de vérification a été envoyé!")
        setCooldown(60) // 60 secondes avant de pouvoir renvoyer
      } else {
        setStatus("error")
        setMessage(data.error || "Erreur lors de l'envoi")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Une erreur est survenue")
    }
  }

  if (mode === "verify") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] p-4">
        <Card className="w-full max-w-md bg-white/5 border-white/10">
          <CardContent className="p-8 text-center">
            {status === "loading" && (
              <>
                <Loader2 className="w-16 h-16 mx-auto mb-4 text-cyan-500 animate-spin" />
                <h2 className="text-xl font-bold text-white mb-2">Vérification en cours...</h2>
                <p className="text-gray-400">Veuillez patienter</p>
              </>
            )}
            {status === "success" && (
              <>
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h2 className="text-xl font-bold text-white mb-2">Email vérifié!</h2>
                <p className="text-gray-400 mb-4">{message}</p>
                <p className="text-sm text-gray-500">Redirection vers la connexion...</p>
              </>
            )}
            {status === "error" && (
              <>
                <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                <h2 className="text-xl font-bold text-white mb-2">Erreur</h2>
                <p className="text-gray-400 mb-4">{message}</p>
                <Button onClick={() => router.push("/resend-verification")} variant="outline">
                  Renvoyer l'email
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] p-4">
      <Card className="w-full max-w-md bg-white/5 border-white/10">
        <CardHeader className="text-center">
          <Mail className="w-12 h-12 mx-auto mb-4 text-cyan-500" />
          <CardTitle className="text-white">Vérifier votre email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-400 text-center text-sm">
            Entrez votre email pour recevoir un nouveau lien de vérification
          </p>

          <Input
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/5 border-white/10"
          />

          <Button
            onClick={resendVerification}
            disabled={status === "loading" || cooldown > 0 || !email}
            className="w-full bg-gradient-to-r from-cyan-500 to-rose-500"
          >
            {status === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : cooldown > 0 ? (
              <RefreshCw className="w-4 h-4 mr-2" />
            ) : (
              <Mail className="w-4 h-4 mr-2" />
            )}
            {cooldown > 0 ? `Réessayer dans ${cooldown}s` : "Envoyer le lien"}
          </Button>

          {status === "success" && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm text-center">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm text-center">{message}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default EmailVerification
