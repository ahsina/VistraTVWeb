"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2 } from "lucide-react"

interface Content {
  id: string
  title: string
  description: string | null
  type: string
  category: string | null
  language: string
  poster: string | null
  video_url: string | null
  duration: string | null
  year: number | null
  rating: number | null
  is_active: boolean
  display_order: number
  created_at: string
}

interface ContentGroup {
  poster: string | null
  video_url: string | null
  duration: string | null
  year: number | null
  rating: number | null
  type: string
  category: string | null
  is_active: boolean
  display_order: number
  translations: Record<string, { id?: string; title: string; description: string }>
}

const languages = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
]

interface AddContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onContentAdded: () => void
  editingContentGroup: ContentGroup | null
}

export default function AddContentDialog({
  open,
  onOpenChange,
  onContentAdded,
  editingContentGroup,
}: AddContentDialogProps) {
  const [activeTab, setActiveTab] = useState("fr")
  const [formData, setFormData] = useState<any>({
    fr: { title: "", description: "" },
    en: { title: "", description: "" },
    ar: { title: "", description: "" },
    type: "movie",
    category: "",
    poster: "",
    video_url: "",
    duration: "",
    year: "",
    rating: "",
    is_active: true,
    display_order: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editingContentGroup) {
      setFormData({
        fr: editingContentGroup.translations.fr || { title: "", description: "" },
        en: editingContentGroup.translations.en || { title: "", description: "" },
        ar: editingContentGroup.translations.ar || { title: "", description: "" },
        type: editingContentGroup.type,
        category: editingContentGroup.category || "",
        poster: editingContentGroup.poster || "",
        video_url: editingContentGroup.video_url || "",
        duration: editingContentGroup.duration || "",
        year: editingContentGroup.year?.toString() || "",
        rating: editingContentGroup.rating?.toString() || "",
        is_active: editingContentGroup.is_active,
        display_order: editingContentGroup.display_order,
      })
    } else {
      setFormData({
        fr: { title: "", description: "" },
        en: { title: "", description: "" },
        ar: { title: "", description: "" },
        type: "movie",
        category: "",
        poster: "",
        video_url: "",
        duration: "",
        year: "",
        rating: "",
        is_active: true,
        display_order: 0,
      })
    }
  }, [editingContentGroup, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const operations = languages.map(async (lang) => {
        const translation = formData[lang.code]
        if (!translation.title) return null

        const payload = {
          ...translation,
          language: lang.code,
          type: formData.type,
          category: formData.category,
          poster: formData.poster,
          video_url: formData.video_url,
          duration: formData.duration,
          year: formData.year ? Number.parseInt(formData.year) : null,
          rating: formData.rating ? Number.parseFloat(formData.rating) : null,
          is_active: formData.is_active,
          display_order: formData.display_order,
        }

        const existingId = editingContentGroup?.translations[lang.code]?.id

        if (existingId) {
          return fetch(`/api/admin/content/${existingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        } else {
          return fetch("/api/admin/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        }
      })

      await Promise.all(operations.filter(Boolean))
      onContentAdded()
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving content:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-white/10 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingContentGroup ? "Edit Content" : "Add New Content"}</DialogTitle>
          <p className="text-sm text-gray-400">Fill in content for each language using the tabs below</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 pb-4 border-b border-white/10">
            <h3 className="text-sm font-medium text-gray-300">Shared Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type *</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="movie">Movie</option>
                  <option value="series">Series</option>
                  <option value="vod">VOD</option>
                </select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Action, Drama..."
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="poster">Poster URL</Label>
                <Input
                  id="poster"
                  value={formData.poster}
                  onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                  placeholder="https://..."
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="video_url">Video URL</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://..."
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="2h 30m"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2024"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  placeholder="7.5"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="display_order">Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="is_active">Active (visible to users)</Label>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">Translations</h3>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 bg-white/10">
                {languages.map((lang) => (
                  <TabsTrigger
                    key={lang.code}
                    value={lang.code}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00d4ff] data-[state=active]:to-[#e94b87]"
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                    {formData[lang.code].title && <CheckCircle2 className="w-4 h-4 ml-2 text-green-400" />}
                  </TabsTrigger>
                ))}
              </TabsList>

              {languages.map((lang) => (
                <TabsContent key={lang.code} value={lang.code} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor={`title-${lang.code}`}>Title ({lang.name}) *</Label>
                    <Input
                      id={`title-${lang.code}`}
                      value={formData[lang.code].title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [lang.code]: { ...formData[lang.code], title: e.target.value },
                        })
                      }
                      placeholder={`Enter title in ${lang.name}`}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`description-${lang.code}`}>Description ({lang.name})</Label>
                    <Textarea
                      id={`description-${lang.code}`}
                      value={formData[lang.code].description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [lang.code]: { ...formData[lang.code], description: e.target.value },
                        })
                      }
                      placeholder={`Enter description in ${lang.name}`}
                      rows={4}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90"
            >
              {isSubmitting ? "Saving..." : editingContentGroup ? "Update All Languages" : "Add Content"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
