"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { User, Database, Key, Save } from "@/lib/icons"
import { format } from "@/lib/utils/date-formatter"

type AdminProfile = {
  id: string
  email: string
  full_name: string
  created_at: string
  is_admin: boolean
}

export function SettingsManager({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [fullName, setFullName] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const supabase = createClient()

  useEffect(() => {
    fetchProfile()
  }, [userId])

  async function fetchProfile() {
    try {
      const { data, error } = await supabase.from("admin_profiles").select("*").eq("id", userId).single()

      if (error) throw error

      setProfile(data)
      setFullName(data.full_name || "")
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  async function saveProfile() {
    if (!profile) return

    try {
      setSaving(true)
      setMessage("")

      const { error } = await supabase.from("admin_profiles").update({ full_name: fullName }).eq("id", userId)

      if (error) throw error

      setMessage("Profil mis à jour avec succès")
      await fetchProfile()
    } catch (error) {
      console.error("Error saving profile:", error)
      setMessage("Erreur lors de la mise à jour")
    } finally {
      setSaving(false)
    }
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-rose-400 bg-clip-text text-transparent">
          Paramètres
        </h1>
        <p className="text-muted-foreground mt-1">Gérez votre compte administrateur</p>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informations du Compte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom Complet</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Votre nom complet"
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile.email} disabled />
          </div>

          <div className="space-y-2">
            <Label>Compte créé le</Label>
            <Input value={format(new Date(profile.created_at), "dd MMMM yyyy à HH:mm")} disabled />
          </div>

          <div className="space-y-2">
            <Label>Rôle</Label>
            <Input value={profile.is_admin ? "Administrateur" : "Utilisateur"} disabled />
          </div>

          <Button onClick={saveProfile} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>

          {message && (
            <p className={`text-sm ${message.includes("succès") ? "text-green-500" : "text-red-500"}`}>{message}</p>
          )}
        </CardContent>
      </Card>

      {/* Database Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Informations Base de Données
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className="text-sm font-medium text-green-500">Connectée</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <span className="text-sm text-muted-foreground">Fournisseur</span>
            <span className="text-sm font-medium">Supabase</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <span className="text-sm text-muted-foreground">Région</span>
            <span className="text-sm font-medium">Europe West</span>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Clés API
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Les clés API sont configurées via les variables d'environnement Vercel
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <span className="text-sm text-muted-foreground">Supabase URL</span>
              <span className="text-sm font-medium text-green-500">Configurée</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <span className="text-sm text-muted-foreground">Supabase Anon Key</span>
              <span className="text-sm font-medium text-green-500">Configurée</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
