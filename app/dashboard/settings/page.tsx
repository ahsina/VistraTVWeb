"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { User, Lock, Bell, Globe } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useToast } from "@/components/ui/toast"
import Link from "next/link"
import LoadingSpinner from "@/components/ui/loading"

export default function SettingsPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notifications, setNotifications] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { t, language, setLanguage } = useLanguage()
  const { addToast } = useToast()

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")

      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }

      const data = await response.json()
      setName(data.name || "")
      setEmail(data.email || "")
      setPhone(data.phone || "")
    } catch (error) {
      console.error("[v0] Error fetching profile:", error)
      addToast(t.dashboard?.fetchError || "Error loading profile", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      })

      if (response.ok) {
        addToast(t.dashboard?.profileUpdated || "Profile updated successfully", "success")
      } else {
        throw new Error("Update failed")
      }
    } catch (error) {
      console.error("[v0] Error updating profile:", error)
      addToast(t.dashboard?.updateError || "Error updating profile", "error")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/dashboard" className="text-[#00d4ff] hover:text-[#e94b87] transition-colors">
            ← {t.dashboard?.backToDashboard || "Back to Dashboard"}
          </Link>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#e94b87] mt-4">
            {t.dashboard?.settings || "Settings"}
          </h1>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <User className="h-6 w-6" />
              {t.dashboard?.profileInfo || "Profile Information"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">{t.auth?.name || "Full Name"}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#00d4ff] transition-colors"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">{t.auth?.email || "Email"}</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/60 cursor-not-allowed"
                />
                <p className="text-sm text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#00d4ff] transition-colors"
                />
              </div>
              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90"
              >
                {isSaving ? "Saving..." : t.dashboard?.saveChanges || "Save Changes"}
              </Button>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6" />
              {t.dashboard?.security || "Security"}
            </h2>
            <div className="space-y-4">
              <Button
                onClick={() => {}}
                variant="outline"
                className="w-full justify-start border-white/20 text-white hover:bg-white/10"
              >
                {t.dashboard?.changePassword || "Change Password"}
              </Button>
              <Button
                onClick={() => {}}
                variant="outline"
                className="w-full justify-start border-white/20 text-white hover:bg-white/10"
              >
                {t.dashboard?.enable2FA || "Enable 2FA"}
              </Button>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="h-6 w-6" />
              {t.dashboard?.language || "Language"}
            </h2>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00d4ff] transition-colors"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="es">Español</option>
              <option value="it">Italiano</option>
            </select>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Bell className="h-6 w-6" />
              {t.dashboard?.notifications || "Notifications"}
            </h2>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-white">{t.dashboard?.emailNotifications || "Email Notifications"}</span>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="rounded border-white/20"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
