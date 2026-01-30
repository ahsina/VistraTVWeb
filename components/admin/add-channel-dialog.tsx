"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export function AddChannelDialog({ onChannelAdded }: { onChannelAdded: () => void }) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    stream_url: "",
    category: "Sports",
    quality: "HD",
    status: "active",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setOpen(false)
        setFormData({ name: "", logo: "", stream_url: "", category: "Sports", quality: "HD", status: "active" })
        onChannelAdded()
      }
    } catch (error) {
      console.error("[v0] Error adding channel:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          {t.admin?.channels?.addChannel || "Ajouter Chaîne"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.admin?.channels?.addChannel || "Ajouter Chaîne"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label htmlFor="stream_url">Stream URL</Label>
            <Input
              id="stream_url"
              value={formData.stream_url}
              onChange={(e) => setFormData({ ...formData, stream_url: e.target.value })}
              required
              placeholder="https://stream.example.com/channel"
            />
          </div>
          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Cinema">Cinema</SelectItem>
                <SelectItem value="Series">Series</SelectItem>
                <SelectItem value="Documentary">Documentary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="quality">Qualité</Label>
            <Select value={formData.quality} onValueChange={(value) => setFormData({ ...formData, quality: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HD">HD</SelectItem>
                <SelectItem value="Full HD">Full HD</SelectItem>
                <SelectItem value="4K">4K</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Ajout en cours..." : "Ajouter"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
