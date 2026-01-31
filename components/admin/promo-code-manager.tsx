// components/admin/promo-code-manager.tsx
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Plus,
  Copy,
  Trash,
  Edit,
  Download,
  Tag,
  TrendingUp,
  Users,
  DollarSign,
  Percent,
  Calendar,
  Sparkles,
} from "lucide-react"

interface PromoCode {
  id: string
  code: string
  discount_type: "percentage" | "fixed"
  discount_value: number
  max_uses: number | null
  current_uses: number
  min_purchase_amount: number | null
  start_date: string | null
  end_date: string | null
  is_active: boolean
  created_at: string
  applicable_plans: string[] | null
}

interface PromoStats {
  totalCodes: number
  activeCodes: number
  totalUses: number
  totalDiscount: number
  conversionRate: number
  topCodes: Array<{ code: string; uses: number; revenue: number }>
  usageByDay: Array<{ date: string; uses: number }>
}

const COLORS = ["#00d4ff", "#e94b87", "#4ade80", "#f59e0b", "#8b5cf6"]

export function PromoCodeManager() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [stats, setStats] = useState<PromoStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false)
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null)
  
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: 10,
    max_uses: "",
    min_purchase_amount: "",
    start_date: "",
    end_date: "",
    is_active: true,
  })

  const [bulkConfig, setBulkConfig] = useState({
    prefix: "PROMO",
    count: 10,
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: 10,
    max_uses_per_code: 1,
    end_date: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchPromoCodes()
    fetchStats()
  }, [])

  async function fetchPromoCodes() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setPromoCodes(data || [])
    } catch (error) {
      console.error("[v0] Error fetching promo codes:", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchStats() {
    try {
      const { data: codes } = await supabase
        .from("promo_codes")
        .select("*")

      const { data: transactions } = await supabase
        .from("payment_transactions")
        .select("promo_code, amount, final_amount, created_at")
        .not("promo_code", "is", null)

      if (codes && transactions) {
        const totalDiscount = transactions.reduce(
          (sum, t) => sum + (t.amount - t.final_amount),
          0
        )

        // Usage par code
        const usageByCode: Record<string, { uses: number; revenue: number }> = {}
        transactions.forEach((t) => {
          if (!usageByCode[t.promo_code]) {
            usageByCode[t.promo_code] = { uses: 0, revenue: 0 }
          }
          usageByCode[t.promo_code].uses++
          usageByCode[t.promo_code].revenue += t.final_amount
        })

        // Usage par jour
        const usageByDay: Record<string, number> = {}
        transactions.forEach((t) => {
          const date = t.created_at.split("T")[0]
          usageByDay[date] = (usageByDay[date] || 0) + 1
        })

        setStats({
          totalCodes: codes.length,
          activeCodes: codes.filter((c) => c.is_active).length,
          totalUses: transactions.length,
          totalDiscount,
          conversionRate: codes.length > 0 ? (transactions.length / codes.length) * 100 : 0,
          topCodes: Object.entries(usageByCode)
            .map(([code, data]) => ({ code, ...data }))
            .sort((a, b) => b.uses - a.uses)
            .slice(0, 5),
          usageByDay: Object.entries(usageByDay)
            .map(([date, uses]) => ({ date, uses }))
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(-30),
        })
      }
    } catch (error) {
      console.error("[v0] Error fetching stats:", error)
    }
  }

  function generateRandomCode(prefix: string): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = prefix
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  async function savePromoCode() {
    try {
      const codeData = {
        code: formData.code.toUpperCase(),
        discount_type: formData.discount_type,
        discount_value: formData.discount_value,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        min_purchase_amount: formData.min_purchase_amount
          ? parseFloat(formData.min_purchase_amount)
          : null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        is_active: formData.is_active,
      }

      if (editingCode) {
        await supabase
          .from("promo_codes")
          .update(codeData)
          .eq("id", editingCode.id)
      } else {
        await supabase.from("promo_codes").insert(codeData)
      }

      setIsDialogOpen(false)
      setEditingCode(null)
      resetForm()
      fetchPromoCodes()
      fetchStats()
    } catch (error) {
      console.error("[v0] Error saving promo code:", error)
    }
  }

  async function generateBulkCodes() {
    try {
      const codes = []
      const existingCodes = new Set(promoCodes.map((c) => c.code))

      for (let i = 0; i < bulkConfig.count; i++) {
        let code
        do {
          code = generateRandomCode(bulkConfig.prefix)
        } while (existingCodes.has(code))
        existingCodes.add(code)

        codes.push({
          code,
          discount_type: bulkConfig.discount_type,
          discount_value: bulkConfig.discount_value,
          max_uses: bulkConfig.max_uses_per_code,
          current_uses: 0,
          end_date: bulkConfig.end_date || null,
          is_active: true,
        })
      }

      await supabase.from("promo_codes").insert(codes)

      setIsBulkDialogOpen(false)
      fetchPromoCodes()
      fetchStats()
    } catch (error) {
      console.error("[v0] Error generating bulk codes:", error)
    }
  }

  async function deletePromoCode(id: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce code promo ?")) return

    try {
      await supabase.from("promo_codes").delete().eq("id", id)
      fetchPromoCodes()
      fetchStats()
    } catch (error) {
      console.error("[v0] Error deleting promo code:", error)
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    try {
      await supabase
        .from("promo_codes")
        .update({ is_active: !currentStatus })
        .eq("id", id)
      fetchPromoCodes()
    } catch (error) {
      console.error("[v0] Error toggling status:", error)
    }
  }

  function resetForm() {
    setFormData({
      code: "",
      discount_type: "percentage",
      discount_value: 10,
      max_uses: "",
      min_purchase_amount: "",
      start_date: "",
      end_date: "",
      is_active: true,
    })
  }

  function openEditDialog(code: PromoCode) {
    setEditingCode(code)
    setFormData({
      code: code.code,
      discount_type: code.discount_type,
      discount_value: code.discount_value,
      max_uses: code.max_uses?.toString() || "",
      min_purchase_amount: code.min_purchase_amount?.toString() || "",
      start_date: code.start_date?.split("T")[0] || "",
      end_date: code.end_date?.split("T")[0] || "",
      is_active: code.is_active,
    })
    setIsDialogOpen(true)
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code)
  }

  function exportCodes() {
    const csv = [
      "Code,Type,Valeur,Max Uses,Uses,Actif,Date Fin",
      ...promoCodes.map((c) =>
        [
          c.code,
          c.discount_type,
          c.discount_value,
          c.max_uses || "Illimité",
          c.current_uses,
          c.is_active ? "Oui" : "Non",
          c.end_date || "Aucune",
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `promo-codes-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Codes Promo</h1>
          <p className="text-gray-400">Gérez vos codes promotionnels</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={exportCodes}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Sparkles className="w-4 h-4 mr-2" />
                Génération en masse
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Générer des codes en masse</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Préfixe</Label>
                    <Input
                      value={bulkConfig.prefix}
                      onChange={(e) =>
                        setBulkConfig({ ...bulkConfig, prefix: e.target.value.toUpperCase() })
                      }
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Nombre de codes</Label>
                    <Input
                      type="number"
                      value={bulkConfig.count}
                      onChange={(e) =>
                        setBulkConfig({ ...bulkConfig, count: parseInt(e.target.value) || 0 })
                      }
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Type de réduction</Label>
                    <Select
                      value={bulkConfig.discount_type}
                      onValueChange={(value: "percentage" | "fixed") =>
                        setBulkConfig({ ...bulkConfig, discount_type: value })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                        <SelectItem value="fixed">Montant fixe (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white">Valeur</Label>
                    <Input
                      type="number"
                      value={bulkConfig.discount_value}
                      onChange={(e) =>
                        setBulkConfig({
                          ...bulkConfig,
                          discount_value: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Utilisations max/code</Label>
                    <Input
                      type="number"
                      value={bulkConfig.max_uses_per_code}
                      onChange={(e) =>
                        setBulkConfig({
                          ...bulkConfig,
                          max_uses_per_code: parseInt(e.target.value) || 1,
                        })
                      }
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Date d'expiration</Label>
                    <Input
                      type="date"
                      value={bulkConfig.end_date}
                      onChange={(e) =>
                        setBulkConfig({ ...bulkConfig, end_date: e.target.value })
                      }
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-sm text-gray-400">
                    Aperçu: {bulkConfig.prefix}XXXXXX ({bulkConfig.count} codes de{" "}
                    {bulkConfig.discount_value}
                    {bulkConfig.discount_type === "percentage" ? "%" : "€"})
                  </p>
                </div>
                <Button
                  onClick={generateBulkCodes}
                  className="w-full bg-gradient-to-r from-cyan-500 to-rose-500"
                >
                  Générer {bulkConfig.count} codes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingCode(null)
                  resetForm()
                }}
                className="bg-gradient-to-r from-cyan-500 to-rose-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau code
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingCode ? "Modifier le code" : "Nouveau code promo"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label className="text-white">Code</Label>
                  <Input
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    placeholder="Ex: SUMMER20"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Type</Label>
                    <Select
                      value={formData.discount_type}
                      onValueChange={(value: "percentage" | "fixed") =>
                        setFormData({ ...formData, discount_type: value })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Pourcentage</SelectItem>
                        <SelectItem value="fixed">Montant fixe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white">
                      Valeur ({formData.discount_type === "percentage" ? "%" : "€"})
                    </Label>
                    <Input
                      type="number"
                      value={formData.discount_value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_value: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Utilisations max</Label>
                    <Input
                      type="number"
                      value={formData.max_uses}
                      onChange={(e) =>
                        setFormData({ ...formData, max_uses: e.target.value })
                      }
                      placeholder="Illimité"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Achat minimum (€)</Label>
                    <Input
                      type="number"
                      value={formData.min_purchase_amount}
                      onChange={(e) =>
                        setFormData({ ...formData, min_purchase_amount: e.target.value })
                      }
                      placeholder="Aucun"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Date début</Label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Date fin</Label>
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_active: checked })
                    }
                  />
                  <Label className="text-white">Actif</Label>
                </div>
                <Button onClick={savePromoCode} className="w-full bg-gradient-to-r from-cyan-500 to-rose-500">
                  {editingCode ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total codes</p>
                  <p className="text-2xl font-bold text-white">{stats.totalCodes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Codes actifs</p>
                  <p className="text-2xl font-bold text-white">{stats.activeCodes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Utilisations</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUses}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Réductions</p>
                  <p className="text-2xl font-bold text-white">{stats.totalDiscount.toFixed(0)}€</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                  <Percent className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Taux conversion</p>
                  <p className="text-2xl font-bold text-white">{stats.conversionRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="bg-white/5">
          <TabsTrigger value="list">Liste des codes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-400">Code</TableHead>
                    <TableHead className="text-gray-400">Réduction</TableHead>
                    <TableHead className="text-gray-400">Utilisations</TableHead>
                    <TableHead className="text-gray-400">Validité</TableHead>
                    <TableHead className="text-gray-400">Statut</TableHead>
                    <TableHead className="text-gray-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promoCodes.map((code) => (
                    <TableRow key={code.id} className="border-white/10">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-cyan-400 font-mono">{code.code}</code>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyCode(code.code)}
                            className="h-6 w-6"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">
                        {code.discount_value}
                        {code.discount_type === "percentage" ? "%" : "€"}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {code.current_uses}
                        {code.max_uses ? ` / ${code.max_uses}` : ""}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {code.end_date
                          ? new Date(code.end_date).toLocaleDateString("fr-FR")
                          : "Illimité"}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={code.is_active}
                          onCheckedChange={() => toggleActive(code.id, code.is_active)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(code)}
                            className="h-8 w-8"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deletePromoCode(code.id)}
                            className="h-8 w-8 text-red-400"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Usage par jour */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Utilisations par jour</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.usageByDay || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis
                        dataKey="date"
                        stroke="#666"
                        tick={{ fill: "#666" }}
                        tickFormatter={(v) =>
                          new Date(v).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
                        }
                      />
                      <YAxis stroke="#666" tick={{ fill: "#666" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1147",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="uses" fill="#00d4ff" name="Utilisations" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top codes */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Top codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.topCodes.map((code, index) => (
                    <div key={code.code} className="flex items-center gap-4">
                      <span className="text-gray-500 w-6">{index + 1}.</span>
                      <div className="flex-1">
                        <code className="text-cyan-400 font-mono">{code.code}</code>
                        <p className="text-sm text-gray-400">
                          {code.uses} utilisations • {code.revenue.toFixed(0)}€ générés
                        </p>
                      </div>
                      <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(code.uses / (stats.topCodes[0]?.uses || 1)) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PromoCodeManager
