"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, Tag, Copy, TrendingUp } from "@/lib/icons"

type PromoCode = {
  id: string
  code: string
  discount_type: "percentage" | "fixed"
  discount_value: number
  currency: string
  max_uses: number | null
  current_uses: number
  start_date: string
  end_date: string | null
  is_active: boolean
  applies_to: string[]
  min_purchase_amount: number
  description: string | null
  created_at: string
}

export default function PromoCodesManager({ initialData }: { initialData: PromoCode[] }) {
  const [data, setData] = useState(initialData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: 0,
    currency: "EUR",
    max_uses: null as number | null,
    start_date: new Date().toISOString().slice(0, 16),
    end_date: null as string | null,
    is_active: true,
    applies_to: ["all"],
    min_purchase_amount: 0,
    description: "",
  })

  const refreshData = async () => {
    const supabase = createClient()
    const { data: refreshedData } = await supabase
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false })

    if (refreshedData) {
      setData(refreshedData)
    }
  }

  const handleSave = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const saveData = {
      ...formData,
      code: formData.code.toUpperCase(),
      created_by: user?.id,
    }

    if (editingId) {
      await supabase.from("promo_codes").update(saveData).eq("id", editingId)
    } else {
      await supabase.from("promo_codes").insert(saveData)
    }

    await refreshData()
    handleCloseDialog()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce code promo ?")) return

    const supabase = createClient()
    await supabase.from("promo_codes").delete().eq("id", id)
    setData(data.filter((p) => p.id !== id))
  }

  const handleEdit = (promo: PromoCode) => {
    setEditingId(promo.id)
    setFormData({
      code: promo.code,
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      currency: promo.currency,
      max_uses: promo.max_uses,
      start_date: new Date(promo.start_date).toISOString().slice(0, 16),
      end_date: promo.end_date ? new Date(promo.end_date).toISOString().slice(0, 16) : null,
      is_active: promo.is_active,
      applies_to: promo.applies_to,
      min_purchase_amount: promo.min_purchase_amount,
      description: promo.description || "",
    })
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingId(null)
    setFormData({
      code: "",
      discount_type: "percentage",
      discount_value: 0,
      currency: "EUR",
      max_uses: null,
      start_date: new Date().toISOString().slice(0, 16),
      end_date: null,
      is_active: true,
      applies_to: ["all"],
      min_purchase_amount: 0,
      description: "",
    })
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  const isExpired = (promo: PromoCode) => {
    if (!promo.end_date) return false
    return new Date(promo.end_date) < new Date()
  }

  const isMaxedOut = (promo: PromoCode) => {
    if (!promo.max_uses) return false
    return promo.current_uses >= promo.max_uses
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Codes Promotionnels</h2>
          <p className="text-gray-400 mt-1">
            {data.length} code{data.length > 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
          <Plus className="w-4 h-4 mr-2" />
          Créer un code
        </Button>
      </div>

      <div className="grid gap-4">
        {data.map((promo) => {
          const expired = isExpired(promo)
          const maxedOut = isMaxedOut(promo)
          const canBeUsed = promo.is_active && !expired && !maxedOut

          return (
            <Card key={promo.id} className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="space-y-2">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Tag className="w-5 h-5 text-cyan-400" />
                    <code className="font-mono text-lg">{promo.code}</code>
                    <Button
                      onClick={() => copyToClipboard(promo.code)}
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-gray-400 hover:text-white"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    {canBeUsed ? (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Actif</Badge>
                    ) : (
                      <Badge variant="destructive">Inactif</Badge>
                    )}
                    {expired && <Badge variant="destructive">Expiré</Badge>}
                    {maxedOut && <Badge variant="destructive">Limite atteinte</Badge>}
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {promo.discount_type === "percentage"
                        ? `${promo.discount_value}%`
                        : `${promo.discount_value} ${promo.currency}`}
                    </Badge>
                  </div>
                  {promo.description && <p className="text-sm text-gray-400">{promo.description}</p>}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(promo)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(promo.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Utilisations</p>
                    <p className="text-white font-semibold flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      {promo.current_uses} / {promo.max_uses || "∞"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Date de début</p>
                    <p className="text-white">{new Date(promo.start_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Date de fin</p>
                    <p className="text-white">
                      {promo.end_date ? new Date(promo.end_date).toLocaleDateString() : "Aucune"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Minimum d'achat</p>
                    <p className="text-white">
                      {promo.min_purchase_amount > 0 ? `${promo.min_purchase_amount} ${promo.currency}` : "Aucun"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-900 to-gray-800 border-white/10 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              {editingId ? "Modifier le code promo" : "Créer un code promo"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="code" className="text-white">
                  Code *
                </Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="bg-white/10 border-white/20 text-white font-mono"
                  placeholder="BLACKFRIDAY2024"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="discount_type" className="text-white">
                  Type de réduction *
                </Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value: "percentage" | "fixed") => setFormData({ ...formData, discount_type: value })}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                    <SelectItem value="fixed">Montant fixe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="discount_value" className="text-white">
                  Valeur de réduction *
                </Label>
                <Input
                  id="discount_value"
                  type="number"
                  step="0.01"
                  value={formData.discount_value || 0}
                  onChange={(e) => {
                    const value = Number.parseFloat(e.target.value)
                    setFormData({ ...formData, discount_value: isNaN(value) ? 0 : value })
                  }}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="max_uses" className="text-white">
                  Nombre max d'utilisations (0 = illimité)
                </Label>
                <Input
                  id="max_uses"
                  type="number"
                  value={formData.max_uses ?? ""}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value)
                    setFormData({ ...formData, max_uses: e.target.value && !isNaN(value) ? value : null })
                  }}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="min_purchase" className="text-white">
                  Montant minimum d'achat
                </Label>
                <Input
                  id="min_purchase"
                  type="number"
                  step="0.01"
                  value={formData.min_purchase_amount || 0}
                  onChange={(e) => {
                    const value = Number.parseFloat(e.target.value)
                    setFormData({ ...formData, min_purchase_amount: isNaN(value) ? 0 : value })
                  }}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date" className="text-white">
                  Date de début *
                </Label>
                <Input
                  id="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="end_date" className="text-white">
                  Date de fin (optionnelle)
                </Label>
                <Input
                  id="end_date"
                  type="datetime-local"
                  value={formData.end_date || ""}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value || null })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-white">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Description du code promo..."
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label className="text-white">Actif</Label>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-white/10">
              <Button
                onClick={handleCloseDialog}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                Annuler
              </Button>
              <Button onClick={handleSave} className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
