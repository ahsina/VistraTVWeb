"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AdminLoginClient() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  console.log("[v0] AdminLoginClient rendered")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    console.log("[v0] ===== LOGIN ATTEMPT STARTED =====")
    console.log("[v0] Email:", email)
    console.log("[v0] Supabase client created:", !!supabase)

    try {
      console.log("[v0] Calling supabase.auth.signInWithPassword...")

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("[v0] Auth response received")
      console.log("[v0] Auth data:", JSON.stringify(authData, null, 2))
      console.log("[v0] Auth error:", authError)

      if (authError) {
        console.log("[v0] Auth failed with error:", authError)
        console.log("[v0] Error code:", authError.code)
        console.log("[v0] Error message:", authError.message)
        console.log("[v0] Error status:", authError.status)

        if (authError.message.includes("Invalid login credentials")) {
          throw new Error(
            "Email ou mot de passe invalide. Si vous n'avez pas de compte, veuillez d'abord vous inscrire sur /admin/sign-up.",
          )
        }
        throw authError
      }

      if (!authData.user) {
        console.log("[v0] No user in auth data!")
        throw new Error("Authentification échouée: Aucune donnée utilisateur retournée")
      }

      console.log("[v0] Auth successful!")
      console.log("[v0] User ID:", authData.user.id)
      console.log("[v0] User email:", authData.user.email)
      console.log("[v0] User created at:", authData.user.created_at)

      console.log("[v0] ===== CHECKING ADMIN PROFILE =====")
      console.log("[v0] Querying admin_profiles table for user ID:", authData.user.id)

      const profileQuery = supabase.from("admin_profiles").select("is_admin").eq("id", authData.user.id)

      console.log("[v0] Profile query built, executing...")

      const { data: profile, error: profileError } = await profileQuery.single()

      console.log("[v0] Profile query completed")
      console.log("[v0] Profile data:", JSON.stringify(profile, null, 2))
      console.log("[v0] Profile error:", profileError)

      if (profileError) {
        console.log("[v0] Profile query failed!")
        console.log("[v0] Error code:", profileError.code)
        console.log("[v0] Error message:", profileError.message)
        console.log("[v0] Error details:", profileError.details)
        console.log("[v0] Error hint:", profileError.hint)

        if (profileError.code === "PGRST116") {
          throw new Error(
            "Profil admin non trouvé. Votre compte n'a pas été configuré comme administrateur. Veuillez contacter un administrateur.",
          )
        }

        if (profileError.message.includes("schema") || profileError.message.includes("RLS")) {
          throw new Error(
            `Erreur de configuration de la base de données: ${profileError.message}. Détails: ${profileError.details || "N/A"}`,
          )
        }

        throw new Error(`Erreur profil: ${profileError.message}`)
      }

      console.log("[v0] Profile found, checking admin status...")
      console.log("[v0] is_admin value:", profile?.is_admin)

      if (!profile?.is_admin) {
        console.log("[v0] User is not an admin, signing out")
        await supabase.auth.signOut()
        throw new Error("Accès refusé. Privilèges administrateur requis.")
      }

      console.log("[v0] ===== LOGIN SUCCESSFUL =====")
      console.log("[v0] Redirecting to /admin/dashboard")
      router.push("/admin/dashboard")
      router.refresh()
    } catch (error: unknown) {
      console.log("[v0] ===== LOGIN FAILED =====")
      console.log("[v0] Error caught:", error)
      console.log("[v0] Error type:", typeof error)
      console.log("[v0] Error instanceof Error:", error instanceof Error)

      if (error instanceof Error) {
        console.log("[v0] Error message:", error.message)
        console.log("[v0] Error stack:", error.stack)
      }

      setError(error instanceof Error ? error.message : "Une erreur est survenue")
    } finally {
      setIsLoading(false)
      console.log("[v0] ===== LOGIN ATTEMPT ENDED =====")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-main p-6">
      {/* Blur circles */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-pink-500/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 left-0 w-[400px] h-[400px] bg-blue-500/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Admin Login</CardTitle>
            <CardDescription className="text-gray-300">
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@vistratv.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                {error && (
                  <div className="p-3 rounded-md bg-red-500/20 border border-red-500/50">
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm text-gray-300">
                Pas encore de compte?{" "}
                <Link href="/admin/sign-up" className="text-[#00d4ff] hover:underline">
                  Créer un compte admin
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
