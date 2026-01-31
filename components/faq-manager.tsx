// components/admin/faq-manager.tsx
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Edit, Trash, Eye, ThumbsUp, ArrowUpDown, GripVertical } from "lucide-react"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string | null
  language: string
  display_order: number
  is_active: boolean
  view_count: number
  helpful_count: number
  created_at: string
  updated_at: string
}

interface FAQGroup {
  id: string
  category: string | null
  display_order: number
  translations: Record<string, FAQItem>
}

const languages = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
]

const categories = [
  { value: "installation", label: "Installation" },
  { value: "payment", label: "Paiement" },
  { value: "subscription", label: "Abonnement" },
  { value: "technical", label: "Technique" },
  { value: "support", label: "Support" },
  { value: "general", label: "Général" },
]

export function FAQManager() {
  const [faqGroups, setFaqGroups] = useState<FAQGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<FAQGroup | null>(null)
  const [activeTab, setActiveTab] = useState("fr")
  
  const [formData, setFormData] = useState<Record<string, { question: string; answer: string }>>({
    fr: { question: "", answer: "" },
    en: { question: "", answer: "" },
    ar: { question: "", answer: "" },
    es: { question: "", answer: "" },
    it: { question: "", answer: "" },
  })
  
  const [sharedData, setSharedData] = useState({
    category: "general",
    display_order: 0,
    is_active: true,
  })

  const supabase = createClient()

  useEffect(() => {
    fetchFAQs()
  }, [])

  async function fetchFAQs() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("faq_items")
        .select("*")
        .order("display_order", { ascending: true })

      if (error) throw error

      // Grouper par catégorie et display_order
      const grouped: Record<string, FAQGroup> = {}
      
      ;(data || []).forEach((item) => {
        const key = `${item.category || "general"}-${item.display_order}`
        if (!grouped[key]) {
          grouped[key] = {
            id: key,
            category: item.category,
            display_order: item.display_order,
            translations: {},
          }
        }
        grouped[key].translations[item.language] = item
      })

      setFaqGroups(
        Object.values(grouped).sort((a, b) => a.display_order - b.display_order)
      )
    } catch (error) {
      console.error("[v0] Error fetching FAQs:", error)
    } finally {
      setLoading(false)
    }
  }

  function openEditDialog(group: FAQGroup) {
    setEditingGroup(group)
    
    const newFormData: Record<string, { question: string; answer: string }> = {}
    languages.forEach((lang) => {
      const translation = group.translations[lang.code]
      newFormData[lang.code] = {
        question: translation?.question || "",
        answer: translation?.answer || "",
      }
    })
    
    setFormData(newFormData)
    setSharedData({
      category: group.category || "general",
      display_order: group.display_order,
      is_active: Object.values(group.translations)[0]?.is_active ?? true,
    })
    setIsDialogOpen(true)
  }

  function openCreateDialog() {
    setEditingGroup(null)
    setFormData({
      fr: { question: "", answer: "" },
      en: { question: "", answer: "" },
      ar: { question: "", answer: "" },
      es: { question: "", answer: "" },
      it: { question: "", answer: "" },
    })
    setSharedData({
      category: "general",
      display_order: faqGroups.length,
      is_active: true,
    })
    setIsDialogOpen(true)
  }

  async function saveFAQ() {
    try {
      if (editingGroup) {
        // Mettre à jour les traductions existantes
        for (const lang of languages) {
          const translation = formData[lang.code]
          const existingItem = editingGroup.translations[lang.code]

          if (existingItem) {
            await supabase
              .from("faq_items")
              .update({
                question: translation.question,
                answer: translation.answer,
                category: sharedData.category,
                display_order: sharedData.display_order,
                is_active: sharedData.is_active,
                updated_at: new Date().toISOString(),
              })
              .eq("id", existingItem.id)
          } else if (translation.question && translation.answer) {
            await supabase.from("faq_items").insert({
              question: translation.question,
              answer: translation.answer,
              language: lang.code,
              category: sharedData.category,
              display_order: sharedData.display_order,
              is_active: sharedData.is_active,
            })
          }
        }
      } else {
        // Créer de nouvelles entrées
        for (const lang of languages) {
          const translation = formData[lang.code]
          if (translation.question && translation.answer) {
            await supabase.from("faq_items").insert({
              question: translation.question,
              answer: translation.answer,
              language: lang.code,
              category: sharedData.category,
              display_order: sharedData.display_order,
              is_active: sharedData.is_active,
            })
          }
        }
      }

      setIsDialogOpen(false)
      fetchFAQs()
    } catch (error) {
      console.error("[v0] Error saving FAQ:", error)
    }
  }

  async function deleteFAQGroup(group: FAQGroup) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette FAQ dans toutes les langues ?")) {
      return
    }

    try {
      for (const translation of Object.values(group.translations)) {
        await supabase.from("faq_items").delete().eq("id", translation.id)
      }
      fetchFAQs()
    } catch (error) {
      console.error("[v0] Error deleting FAQ:", error)
    }
  }

  async function toggleActive(group: FAQGroup) {
    const newStatus = !Object.values(group.translations)[0]?.is_active
    
    try {
      for (const translation of Object.values(group.translations)) {
        await supabase
          .from("faq_items")
          .update({ is_active: newStatus })
          .eq("id", translation.id)
      }
      fetchFAQs()
    } catch (error) {
      console.error("[v0] Error toggling FAQ status:", error)
    }
  }

  const getCompletionStatus = (group: FAQGroup) => {
    const completed = languages.filter((lang) => group.translations[lang.code]).length
    return `${completed}/${languages.length}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestion FAQ</h2>
          <p className="text-gray-400">Gérez les questions fréquentes multilingues</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openCreateDialog}
              className="bg-gradient-to-r from-cyan-500 to-rose-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-white/10 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingGroup ? "Modifier la FAQ" : "Créer une FAQ"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Données partagées */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Catégorie</Label>
                  <Select
                    value={sharedData.category}
                    onValueChange={(value) =>
                      setSharedData({ ...sharedData, category: value })
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
                <div>
                  <Label className="text-white">Ordre d'affichage</Label>
                  <Input
                    type="number"
                    value={sharedData.display_order}
                    onChange={(e) =>
                      setSharedData({
                        ...sharedData,
                        display_order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={sharedData.is_active}
                    onCheckedChange={(checked) =>
                      setSharedData({ ...sharedData, is_active: checked })
                    }
                  />
                  <Label className="text-white">Actif</Label>
                </div>
              </div>

              {/* Traductions */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-white/5">
                  {languages.map((lang) => (
                    <TabsTrigger
                      key={lang.code}
                      value={lang.code}
                      className="data-[state=active]:bg-white/10"
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                      {formData[lang.code]?.question && (
                        <Badge className="ml-2 bg-green-500/20 text-green-300">✓</Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {languages.map((lang) => (
                  <TabsContent key={lang.code} value={lang.code} className="space-y-4 mt-4">
                    <div>
                      <Label className="text-white">Question ({lang.name})</Label>
                      <Input
                        value={formData[lang.code]?.question || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [lang.code]: {
                              ...formData[lang.code],
                              question: e.target.value,
                            },
                          })
                        }
                        placeholder={`Question en ${lang.name}...`}
                        className="bg-white/5 border-white/10"
                        dir={lang.code === "ar" ? "rtl" : "ltr"}
                      />
                    </div>
                    <div>
                      <Label className="text-white">Réponse ({lang.name})</Label>
                      <Textarea
                        value={formData[lang.code]?.answer || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [lang.code]: {
                              ...formData[lang.code],
                              answer: e.target.value,
                            },
                          })
                        }
                        placeholder={`Réponse en ${lang.name}...`}
                        rows={6}
                        className="bg-white/5 border-white/10"
                        dir={lang.code === "ar" ? "rtl" : "ltr"}
                      />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button
                  onClick={saveFAQ}
                  disabled={!formData.fr?.question || !formData.fr?.answer}
                  className="bg-gradient-to-r from-cyan-500 to-rose-500"
                >
                  {editingGroup ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Liste des FAQ */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-gray-400 w-12">#</TableHead>
                <TableHead className="text-gray-400">Question (FR)</TableHead>
                <TableHead className="text-gray-400">Catégorie</TableHead>
                <TableHead className="text-gray-400">Langues</TableHead>
                <TableHead className="text-gray-400 text-center">Stats</TableHead>
                <TableHead className="text-gray-400 text-center">Actif</TableHead>
                <TableHead className="text-gray-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : faqGroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                    Aucune FAQ trouvée
                  </TableCell>
                </TableRow>
              ) : (
                faqGroups.map((group, index) => {
                  const frTranslation = group.translations.fr
                  const stats = Object.values(group.translations).reduce(
                    (acc, t) => ({
                      views: acc.views + (t.view_count || 0),
                      helpful: acc.helpful + (t.helpful_count || 0),
                    }),
                    { views: 0, helpful: 0 }
                  )

                  return (
                    <TableRow key={group.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-gray-400">
                        <GripVertical className="w-4 h-4 cursor-move" />
                      </TableCell>
                      <TableCell className="text-white max-w-md truncate">
                        {frTranslation?.question || "Non traduit"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {categories.find((c) => c.value === group.category)?.label ||
                            group.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-cyan-500/20 text-cyan-300">
                          {getCompletionStatus(group)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-gray-400">
                            <Eye className="w-4 h-4" />
                            {stats.views}
                          </span>
                          <span className="flex items-center gap-1 text-green-400">
                            <ThumbsUp className="w-4 h-4" />
                            {stats.helpful}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={frTranslation?.is_active ?? true}
                          onCheckedChange={() => toggleActive(group)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(group)}
                            className="h-8 w-8"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteFAQGroup(group)}
                            className="h-8 w-8 text-red-400 hover:text-red-300"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default FAQManager
