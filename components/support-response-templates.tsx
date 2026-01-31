// components/admin/support-response-templates.tsx
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash, Copy, FileText, Search } from "lucide-react"

interface ResponseTemplate {
  id: string
  name: string
  category: string | null
  content: string
  language: string
  shortcut: string | null
  usage_count: number
  is_active: boolean
  created_at: string
}

interface SupportResponseTemplatesProps {
  onSelectTemplate?: (content: string) => void
  showSelector?: boolean
}

const categories = [
  { value: "general", label: "Général" },
  { value: "technical", label: "Technique" },
  { value: "billing", label: "Facturation" },
  { value: "resolution", label: "Résolution" },
  { value: "info", label: "Demande d'info" },
  { value: "followup", label: "Suivi" },
]

export function SupportResponseTemplates({
  onSelectTemplate,
  showSelector = false,
}: SupportResponseTemplatesProps) {
  const [templates, setTemplates] = useState<ResponseTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<ResponseTemplate | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  
  const [formData, setFormData] = useState({
    name: "",
    category: "general",
    content: "",
    language: "fr",
    shortcut: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchTemplates()
  }, [])

  async function fetchTemplates() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("support_response_templates")
        .select("*")
        .eq("is_active", true)
        .order("usage_count", { ascending: false })

      if (error) throw error
      setTemplates(data || [])
    } catch (error) {
      console.error("[v0] Error fetching templates:", error)
    } finally {
      setLoading(false)
    }
  }

  async function saveTemplate() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const templateData = {
        name: formData.name,
        category: formData.category,
        content: formData.content,
        language: formData.language,
        shortcut: formData.shortcut || null,
        is_active: true,
        created_by: user?.id,
      }

      if (editingTemplate) {
        await supabase
          .from("support_response_templates")
          .update(templateData)
          .eq("id", editingTemplate.id)
      } else {
        await supabase
          .from("support_response_templates")
          .insert(templateData)
      }

      setIsDialogOpen(false)
      resetForm()
      fetchTemplates()
    } catch (error) {
      console.error("[v0] Error saving template:", error)
    }
  }

  async function deleteTemplate(id: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce template ?")) return

    try {
      await supabase
        .from("support_response_templates")
        .update({ is_active: false })
        .eq("id", id)

      fetchTemplates()
    } catch (error) {
      console.error("[v0] Error deleting template:", error)
    }
  }

  async function useTemplate(template: ResponseTemplate) {
    // Incrémenter le compteur d'utilisation
    await supabase
      .from("support_response_templates")
      .update({ usage_count: template.usage_count + 1 })
      .eq("id", template.id)

    if (onSelectTemplate) {
      onSelectTemplate(template.content)
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      category: "general",
      content: "",
      language: "fr",
      shortcut: "",
    })
    setEditingTemplate(null)
  }

  function openEditDialog(template: ResponseTemplate) {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      category: template.category || "general",
      content: template.content,
      language: template.language,
      shortcut: template.shortcut || "",
    })
    setIsDialogOpen(true)
  }

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      searchQuery === "" ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.shortcut && t.shortcut.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory =
      selectedCategory === "all" || t.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Mode sélecteur (pour utilisation dans le chat)
  if (showSelector) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher un template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px] bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => useTemplate(template)}
              className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">{template.name}</span>
                {template.shortcut && (
                  <Badge variant="outline" className="text-xs">
                    {template.shortcut}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                {template.content}
              </p>
            </button>
          ))}
          {filteredTemplates.length === 0 && (
            <p className="text-gray-400 text-center py-4">Aucun template trouvé</p>
          )}
        </div>
      </div>
    )
  }

  // Mode gestion complète
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Templates de Réponse</h2>
          <p className="text-gray-400">Gérez vos réponses prédéfinies pour le support</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-gradient-to-r from-cyan-500 to-rose-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Template
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-white/10 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingTemplate ? "Modifier le template" : "Créer un template"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Nom</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: Salutation"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <Label className="text-white">Catégorie</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white">Raccourci (optionnel)</Label>
                <Input
                  value={formData.shortcut}
                  onChange={(e) =>
                    setFormData({ ...formData, shortcut: e.target.value })
                  }
                  placeholder="Ex: /hello"
                  className="bg-white/5 border-white/10"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Tapez ce raccourci dans le chat pour insérer le template
                </p>
              </div>

              <div>
                <Label className="text-white">Contenu</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Contenu du template..."
                  rows={10}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={saveTemplate}
                  disabled={!formData.name || !formData.content}
                  className="bg-gradient-to-r from-cyan-500 to-rose-500"
                >
                  {editingTemplate ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px] bg-white/5 border-white/10">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">
                      {template.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {categories.find((c) => c.value === template.category)?.label ||
                          template.category}
                      </Badge>
                      {template.shortcut && (
                        <Badge className="bg-cyan-500/20 text-cyan-300 text-xs">
                          {template.shortcut}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(template.content)
                      }}
                      className="h-8 w-8"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(template)}
                      className="h-8 w-8"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTemplate(template.id)}
                      className="h-8 w-8 text-red-400 hover:text-red-300"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm line-clamp-4">
                  {template.content}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Utilisé {template.usage_count} fois
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default SupportResponseTemplates
