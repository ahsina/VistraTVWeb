"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Loader2 } from "@/lib/icons"
import { useToast } from "@/hooks/use-toast"

export default function XtreamImportDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    xtreamUrl: "",
    username: "",
    password: "",
  })
  const { toast } = useToast()

  const handleImport = async () => {
    if (!formData.xtreamUrl || !formData.username || !formData.password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/admin/channels/import-xtream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to import")
      }

      toast({
        title: "Importation réussie",
        description: `${data.imported} chaînes importées depuis Xtream IPTV`,
      })

      setOpen(false)
      setFormData({ xtreamUrl: "", username: "", password: "" })

      // Refresh the page to show new channels
      window.location.reload()
    } catch (error) {
      console.error("[v0] Import error:", error)
      toast({
        title: "Erreur d'importation",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Importer depuis Xtream IPTV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Importer depuis Xtream IPTV</DialogTitle>
          <DialogDescription>
            Entrez vos identifiants Xtream IPTV pour importer automatiquement toutes les chaînes
            (nom, catégorie, logo uniquement - pas d'URLs de stream)
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="xtreamUrl">URL Xtream</Label>
            <Input
              id="xtreamUrl"
              placeholder="http://example.com:8000"
              value={formData.xtreamUrl}
              onChange={(e) => setFormData({ ...formData, xtreamUrl: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Format: http://domain:port (sans slash final)
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input
              id="username"
              placeholder="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleImport} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importation...
              </>
            ) : (
              "Importer les chaînes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
