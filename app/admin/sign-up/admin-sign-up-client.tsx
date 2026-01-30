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

export default function AdminSignUpClient() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  console.log("[v0] AdminSignUpClient rendered")

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    console.log("[v0] ===== SIGN UP ATTEMPT STARTED =====")
    console.log("[v0] Attempting sign up with email:", email)
    console.log("[v0] Full name:", fullName)

    if (password !== repeatPassword) {
      console.log("[v0] Password mismatch detected")
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      console.log("[v0] Calling supabase.auth.signUp...")
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/admin/dashboard`,
          data: {
            full_name: fullName,
          },
        },
      })

      console.log("[v0] Sign up response received")
      console.log("[v0] User created:", data.user?.id)
      console.log("[v0] User email:", data.user?.email)
      console.log("[v0] Email confirmed:", data.user?.email_confirmed_at)

      if (error) {
        console.log("[v0] Sign up error:", error.message)
        throw error
      }

      console.log("[v0] Sign up successful, redirecting to success page...")
      console.log("[v0] User will need to confirm email before accessing admin panel")

      router.push("/admin/sign-up-success")
    } catch (error: unknown) {
      console.log("[v0] ===== SIGN UP FAILED =====")
      console.log("[v0] Sign up error:", error)
      console.log("[v0] Error type:", typeof error)
      if (error instanceof Error) {
        console.log("[v0] Error message:", error.message)
        console.log("[v0] Error stack:", error.stack)
      }
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
      console.log("[v0] ===== SIGN UP ATTEMPT ENDED =====")
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
            <CardTitle className="text-2xl text-white">Admin Sign Up</CardTitle>
            <CardDescription className="text-gray-300">Create a new admin account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="fullName" className="text-white">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
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
                <div className="grid gap-2">
                  <Label htmlFor="repeat-password" className="text-white">
                    Repeat Password
                  </Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm text-gray-300">
                Already have an account?{" "}
                <Link href="/admin/login" className="text-[#00d4ff] hover:underline">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
