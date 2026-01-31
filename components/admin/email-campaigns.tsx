// components/admin/email-campaigns.tsx
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
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
  Mail,
  Send,
  Clock,
  Users,
  Eye,
  MousePointerClick,
  Plus,
  Edit,
  Trash,
  Copy,
  Play,
  Pause,
  Calendar,
  BarChart3,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface Campaign {
  id: string
  name: string
  subject: string
  content: string
  status: "draft" | "scheduled" | "sending" | "sent" | "paused"
  audience: "all" | "active" | "expired" | "free" | "custom"
  scheduled_at: string | null
  sent_at: string | null
  total_recipients: number
  sent_count: number
  opened_count: number
  clicked_count: number
  created_at: string
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  category: string
}

const audienceOptions = [
  { value: "all", label: "Tous les utilisateurs", count: 0 },
  { value: "active", label: "Abonnés actifs", count: 0 },
  { value: "expired", label: "Abonnements expirés", count: 0 },
  { value: "free", label: "Utilisateurs gratuits", count: 0 },
  { value: "custom", label: "Liste personnalisée", count: 0 },
]

const templateCategories = [
  "Promotion",
  "Nouveautés",
  "Newsletter",
  "Rappel",
  "Anniversaire",
]

export function EmailCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [audienceCounts, setAudienceCounts] = useState<Record<string, number>>({})
  const [sendingProgress, setSendingProgress] = useState<{ id: string; progress: number } | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    content: "",
    audience: "all" as Campaign["audience"],
    scheduled_at: "",
  })

  const [templateForm, setTemplateForm] = useState({
    name: "",
    subject: "",
    content: "",
    category: "Newsletter",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchCampaigns()
    fetchTemplates()
    fetchAudienceCounts()
  }, [])

  async function fetchCampaigns() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("email_campaigns")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setCampaigns(data || [])
    } catch (error) {
      console.error("[v0] Error fetching campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchTemplates() {
    try {
      const { data } = await supabase
        .from("email_templates")
        .select("*")
        .order("name")

      setTemplates(data || [])
    } catch (error) {
      console.error("[v0] Error fetching templates:", error)
    }
  }

  async function fetchAudienceCounts() {
    try {
      const { count: all } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })

      const { count: active } = await supabase
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")

      const { count: expired } = await supabase
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "expired")

      setAudienceCounts({
        all: all || 0,
        active: active || 0,
        expired: expired || 0,
        free: (all || 0) - (active || 0),
      })
    } catch (error) {
      console.error("[v0] Error fetching audience counts:", error)
    }
  }

  async function saveCampaign() {
    try {
      const campaignData = {
        ...formData,
        scheduled_at: formData.scheduled_at || null,
        status: formData.scheduled_at ? "scheduled" : "draft",
        total_recipients: audienceCounts[formData.audience] || 0,
      }

      if (editingCampaign) {
        await supabase
          .from("email_campaigns")
          .update(campaignData)
          .eq("id", editingCampaign.id)
      } else {
        await supabase.from("email_campaigns").insert(campaignData)
      }

      setIsDialogOpen(false)
      setEditingCampaign(null)
      resetForm()
      fetchCampaigns()
    } catch (error) {
      console.error("[v0] Error saving campaign:", error)
    }
  }

  async function saveTemplate() {
    try {
      await supabase.from("email_templates").insert(templateForm)
      setIsTemplateDialogOpen(false)
      setTemplateForm({ name: "", subject: "", content: "", category: "Newsletter" })
      fetchTemplates()
    } catch (error) {
      console.error("[v0] Error saving template:", error)
    }
  }

  async function sendCampaign(campaign: Campaign) {
    if (!confirm(`Envoyer la campagne "${campaign.name}" à ${campaign.total_recipients} destinataires ?`)) {
      return
    }

    try {
      // Mettre à jour le statut
      await supabase
        .from("email_campaigns")
        .update({ status: "sending" })
        .eq("id", campaign.id)

      setSendingProgress({ id: campaign.id, progress: 0 })

      // Simuler l'envoi progressif
      const response = await fetch("/api/email/campaign/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: campaign.id }),
      })

      if (response.ok) {
        // Simuler la progression
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          setSendingProgress({ id: campaign.id, progress: i })
        }

        await supabase
          .from("email_campaigns")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
            sent_count: campaign.total_recipients,
          })
          .eq("id", campaign.id)
      }

      setSendingProgress(null)
      fetchCampaigns()
    } catch (error) {
      console.error("[v0] Error sending campaign:", error)
      setSendingProgress(null)
    }
  }

  async function pauseCampaign(id: string) {
    try {
      await supabase
        .from("email_campaigns")
        .update({ status: "paused" })
        .eq("id", id)
      fetchCampaigns()
    } catch (error) {
      console.error("[v0] Error pausing campaign:", error)
    }
  }

  async function deleteCampaign(id: string) {
    if (!confirm("Supprimer cette campagne ?")) return

    try {
      await supabase.from("email_campaigns").delete().eq("id", id)
      fetchCampaigns()
    } catch (error) {
      console.error("[v0] Error deleting campaign:", error)
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      subject: "",
      content: "",
      audience: "all",
      scheduled_at: "",
    })
  }

  function useTemplate(template: EmailTemplate) {
    setFormData({
      ...formData,
      subject: template.subject,
      content: template.content,
    })
  }

  function getStatusBadge(status: Campaign["status"]) {
    const config: Record<string, { color: string; icon: React.ReactNode }> = {
      draft: { color: "bg-gray-500/20 text-gray-300", icon: <Edit className="w-3 h-3" /> },
      scheduled: { color: "bg-blue-500/20 text-blue-300", icon: <Clock className="w-3 h-3" /> },
      sending: { color: "bg-yellow-500/20 text-yellow-300", icon: <Send className="w-3 h-3" /> },
      sent: { color: "bg-green-500/20 text-green-300", icon: <CheckCircle className="w-3 h-3" /> },
      paused: { color: "bg-orange-500/20 text-orange-300", icon: <Pause className="w-3 h-3" /> },
    }
    const { color, icon } = config[status]
    return (
      <Badge className={`${color} flex items-center gap-1`}>
        {icon}
        {status}
      </Badge>
    )
  }

  // Stats globales
  const stats = {
    totalCampaigns: campaigns.length,
    sentCampaigns: campaigns.filter((c) => c.status === "sent").length,
    totalSent: campaigns.reduce((sum, c) => sum + c.sent_count, 0),
    avgOpenRate:
      campaigns.length > 0
        ? (
            (campaigns.reduce((sum, c) => sum + (c.sent_count > 0 ? c.opened_count / c.sent_count : 0), 0) /
              campaigns.filter((c) => c.sent_count > 0).length) *
            100
          ).toFixed(1)
        : 0,
    avgClickRate:
      campaigns.length > 0
        ? (
            (campaigns.reduce((sum, c) => sum + (c.opened_count > 0 ? c.clicked_count / c.opened_count : 0), 0) /
              campaigns.filter((c) => c.opened_count > 0).length) *
            100
          ).toFixed(1)
        : 0,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Campagnes Email</h1>
          <p className="text-gray-400">Créez et gérez vos campagnes marketing</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Nouveau template
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-white/10 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Nouveau template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Nom</Label>
                    <Input
                      value={templateForm.name}
                      onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Catégorie</Label>
                    <Select
                      value={templateForm.category}
                      onValueChange={(v) => setTemplateForm({ ...templateForm, category: v })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {templateCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-white">Sujet</Label>
                  <Input
                    value={templateForm.subject}
                    onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <Label className="text-white">Contenu HTML</Label>
                  <Textarea
                    value={templateForm.content}
                    onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                    rows={10}
                    className="bg-white/5 border-white/10 font-mono text-sm"
                  />
                </div>
                <Button onClick={saveTemplate} className="w-full bg-gradient-to-r from-cyan-500 to-rose-500">
                  Sauvegarder le template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingCampaign(null)
                  resetForm()
                }}
                className="bg-gradient-to-r from-cyan-500 to-rose-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle campagne
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-white/10 max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingCampaign ? "Modifier la campagne" : "Nouvelle campagne"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label className="text-white">Nom de la campagne</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Promo Été 2026"
                    className="bg-white/5 border-white/10"
                  />
                </div>

                {/* Templates */}
                {templates.length > 0 && (
                  <div>
                    <Label className="text-white">Utiliser un template</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {templates.map((t) => (
                        <Button
                          key={t.id}
                          variant="outline"
                          size="sm"
                          onClick={() => useTemplate(t)}
                        >
                          {t.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-white">Sujet de l'email</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Ex: 🎉 -20% sur tous nos abonnements !"
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div>
                  <Label className="text-white">Contenu HTML</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={12}
                    placeholder="<h1>Titre</h1><p>Contenu...</p>"
                    className="bg-white/5 border-white/10 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Variables disponibles: {"{{name}}"}, {"{{email}}"}, {"{{unsubscribe_link}}"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Audience</Label>
                    <Select
                      value={formData.audience}
                      onValueChange={(v: Campaign["audience"]) =>
                        setFormData({ ...formData, audience: v })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {audienceOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label} ({audienceCounts[opt.value] || 0})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white">Programmer l'envoi</Label>
                    <Input
                      type="datetime-local"
                      value={formData.scheduled_at}
                      onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-sm text-gray-400">
                    Cette campagne sera envoyée à{" "}
                    <span className="text-white font-bold">
                      {audienceCounts[formData.audience] || 0}
                    </span>{" "}
                    destinataires
                    {formData.scheduled_at && (
                      <> le {new Date(formData.scheduled_at).toLocaleString("fr-FR")}</>
                    )}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      saveCampaign()
                    }}
                  >
                    Sauvegarder comme brouillon
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-rose-500"
                    onClick={saveCampaign}
                  >
                    {formData.scheduled_at ? "Programmer" : "Créer"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Mail className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-sm text-gray-400">Campagnes</p>
                <p className="text-2xl font-bold text-white">{stats.totalCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Send className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Envoyées</p>
                <p className="text-2xl font-bold text-white">{stats.sentCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Emails envoyés</p>
                <p className="text-2xl font-bold text-white">{stats.totalSent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Taux ouverture</p>
                <p className="text-2xl font-bold text-white">{stats.avgOpenRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MousePointerClick className="w-8 h-8 text-pink-400" />
              <div>
                <p className="text-sm text-gray-400">Taux clic</p>
                <p className="text-2xl font-bold text-white">{stats.avgClickRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des campagnes */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Toutes les campagnes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-gray-400">Campagne</TableHead>
                <TableHead className="text-gray-400">Statut</TableHead>
                <TableHead className="text-gray-400">Audience</TableHead>
                <TableHead className="text-gray-400">Envoyés</TableHead>
                <TableHead className="text-gray-400">Ouvertures</TableHead>
                <TableHead className="text-gray-400">Clics</TableHead>
                <TableHead className="text-gray-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id} className="border-white/10">
                  <TableCell>
                    <div>
                      <p className="text-white font-medium">{campaign.name}</p>
                      <p className="text-sm text-gray-500">{campaign.subject}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {sendingProgress?.id === campaign.id ? (
                      <div className="w-24">
                        <Progress value={sendingProgress.progress} className="h-2" />
                        <p className="text-xs text-gray-400 mt-1">{sendingProgress.progress}%</p>
                      </div>
                    ) : (
                      getStatusBadge(campaign.status)
                    )}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {campaign.total_recipients} destinataires
                  </TableCell>
                  <TableCell className="text-white">{campaign.sent_count}</TableCell>
                  <TableCell className="text-white">
                    {campaign.opened_count}
                    {campaign.sent_count > 0 && (
                      <span className="text-gray-500 text-sm ml-1">
                        ({((campaign.opened_count / campaign.sent_count) * 100).toFixed(1)}%)
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-white">
                    {campaign.clicked_count}
                    {campaign.opened_count > 0 && (
                      <span className="text-gray-500 text-sm ml-1">
                        ({((campaign.clicked_count / campaign.opened_count) * 100).toFixed(1)}%)
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {campaign.status === "draft" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => sendCampaign(campaign)}
                          className="h-8 w-8 text-green-400"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      {campaign.status === "sending" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => pauseCampaign(campaign.id)}
                          className="h-8 w-8 text-yellow-400"
                        >
                          <Pause className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingCampaign(campaign)
                          setFormData({
                            name: campaign.name,
                            subject: campaign.subject,
                            content: campaign.content,
                            audience: campaign.audience,
                            scheduled_at: campaign.scheduled_at?.substring(0, 16) || "",
                          })
                          setIsDialogOpen(true)
                        }}
                        className="h-8 w-8"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCampaign(campaign.id)}
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
    </div>
  )
}

export default EmailCampaigns
