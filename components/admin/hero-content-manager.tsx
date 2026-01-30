"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Save, X, AlertCircle, CheckCircle2 } from "lucide-react"

const languages = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
]

type HeroContent = {
  id: string
  language: string
  title: string
  subtitle: string | null
  cta_text: string | null
  cta_link: string | null
  background_image: string | null
}

type HeroGroup = {
  id: string
  translations: Record<string, HeroContent>
  background_image: string | null
}

export default function HeroContentManager({ initialData }: { initialData: HeroContent[] }) {
  const [heroGroups, setHeroGroups] = useState<HeroGroup[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [activeTab, setActiveTab] = useState("fr")
  const [formData, setFormData] = useState<Record<string, any>>({
    fr: { title: "", subtitle: "", cta_text: "", cta_link: "" },
    en: { title: "", subtitle: "", cta_text: "", cta_link: "" },
    ar: { title: "", subtitle: "", cta_text: "", cta_link: "" },
    background_image: "",
  })

  useEffect(() => {
    const grouped: Record<string, HeroGroup> = {}

    initialData.forEach((item) => {
      const groupKey = item.background_image || "default"
      if (!grouped[groupKey]) {
        grouped[groupKey] = {
          id: groupKey,
          translations: {},
          background_image: item.background_image,
        }
      }
      grouped[groupKey].translations[item.language] = item
    })

    setHeroGroups(Object.values(grouped))
  }, [initialData])

  const getCompletionStatus = (group: HeroGroup) => {
    const completed = languages.filter((lang) => group.translations[lang.code]).length
    return { completed, total: languages.length }
  }

  const handleSave = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (editingId) {
      for (const lang of languages) {
        const translation = formData[lang.code]
        const existingItem = heroGroups.find((g) => g.id === editingId)?.translations[lang.code]

        if (existingItem) {
          await supabase
            .from("hero_content")
            .update({
              ...translation,
              background_image: formData.background_image,
              updated_by: user?.id,
            })
            .eq("id", existingItem.id)
        } else if (translation.title) {
          await supabase.from("hero_content").insert({
            ...translation,
            language: lang.code,
            background_image: formData.background_image,
            updated_by: user?.id,
          })
        }
      }

      // Refresh data
      const { data: refreshedData } = await supabase.from("hero_content").select("*")
      if (refreshedData) {
        const grouped: Record<string, HeroGroup> = {}
        refreshedData.forEach((item) => {
          const groupKey = item.background_image || "default"
          if (!grouped[groupKey]) {
            grouped[groupKey] = {
              id: groupKey,
              translations: {},
              background_image: item.background_image,
            }
          }
          grouped[groupKey].translations[item.language] = item
        })
        setHeroGroups(Object.values(grouped))
      }

      setEditingId(null)
    } else {
      const inserts = languages
        .filter((lang) => formData[lang.code].title)
        .map((lang) => ({
          ...formData[lang.code],
          language: lang.code,
          background_image: formData.background_image,
          updated_by: user?.id,
        }))

      if (inserts.length > 0) {
        await supabase.from("hero_content").insert(inserts)

        // Refresh data
        const { data: refreshedData } = await supabase.from("hero_content").select("*")
        if (refreshedData) {
          const grouped: Record<string, HeroGroup> = {}
          refreshedData.forEach((item) => {
            const groupKey = item.background_image || "default"
            if (!grouped[groupKey]) {
              grouped[groupKey] = {
                id: groupKey,
                translations: {},
                background_image: item.background_image,
              }
            }
            grouped[groupKey].translations[item.language] = item
          })
          setHeroGroups(Object.values(grouped))
        }
      }

      setIsAdding(false)
      setFormData({
        fr: { title: "", subtitle: "", cta_text: "", cta_link: "" },
        en: { title: "", subtitle: "", cta_text: "", cta_link: "" },
        ar: { title: "", subtitle: "", cta_text: "", cta_link: "" },
        background_image: "",
      })
    }
  }

  const handleEdit = (group: HeroGroup) => {
    setEditingId(group.id)
    const newFormData: any = {
      fr: { title: "", subtitle: "", cta_text: "", cta_link: "" },
      en: { title: "", subtitle: "", cta_text: "", cta_link: "" },
      ar: { title: "", subtitle: "", cta_text: "", cta_link: "" },
      background_image: group.background_image || "",
    }

    languages.forEach((lang) => {
      const translation = group.translations[lang.code]
      if (translation) {
        newFormData[lang.code] = {
          title: translation.title,
          subtitle: translation.subtitle || "",
          cta_text: translation.cta_text || "",
          cta_link: translation.cta_link || "",
        }
      }
    })

    setFormData(newFormData)
    setActiveTab("fr")
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsAdding(false)
    setFormData({
      fr: { title: "", subtitle: "", cta_text: "", cta_link: "" },
      en: { title: "", subtitle: "", cta_text: "", cta_link: "" },
      ar: { title: "", subtitle: "", cta_text: "", cta_link: "" },
      background_image: "",
    })
  }

  return (
    <div className="space-y-6">
      {!isAdding && !editingId && (
        <Button onClick={() => setIsAdding(true)} className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
          <Plus className="w-4 h-4 mr-2" />
          Add New Hero Content
        </Button>
      )}

      {(isAdding || editingId) && (
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-white">{editingId ? "Edit Hero Content" : "Add Hero Content"}</CardTitle>
            <p className="text-sm text-gray-400">Fill in content for each language using the tabs below</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2 pb-4 border-b border-white/10">
              <Label htmlFor="background_image" className="text-white">
                Background Image URL (Shared)
              </Label>
              <Input
                id="background_image"
                value={formData.background_image}
                onChange={(e) => setFormData({ ...formData, background_image: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="https://example.com/hero-bg.jpg"
              />
            </div>

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
                  <div className="grid gap-2">
                    <Label htmlFor={`title-${lang.code}`} className="text-white">
                      Title ({lang.name})
                    </Label>
                    <Input
                      id={`title-${lang.code}`}
                      value={formData[lang.code].title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [lang.code]: { ...formData[lang.code], title: e.target.value },
                        })
                      }
                      className="bg-white/10 border-white/20 text-white"
                      placeholder={`Enter title in ${lang.name}`}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`subtitle-${lang.code}`} className="text-white">
                      Subtitle ({lang.name})
                    </Label>
                    <Textarea
                      id={`subtitle-${lang.code}`}
                      value={formData[lang.code].subtitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [lang.code]: { ...formData[lang.code], subtitle: e.target.value },
                        })
                      }
                      className="bg-white/10 border-white/20 text-white"
                      placeholder={`Enter subtitle in ${lang.name}`}
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`cta_text-${lang.code}`} className="text-white">
                      CTA Button Text ({lang.name})
                    </Label>
                    <Input
                      id={`cta_text-${lang.code}`}
                      value={formData[lang.code].cta_text}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [lang.code]: { ...formData[lang.code], cta_text: e.target.value },
                        })
                      }
                      className="bg-white/10 border-white/20 text-white"
                      placeholder={`e.g., "Start Free Trial" in ${lang.name}`}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`cta_link-${lang.code}`} className="text-white">
                      CTA Link ({lang.name})
                    </Label>
                    <Input
                      id={`cta_link-${lang.code}`}
                      value={formData[lang.code].cta_link}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [lang.code]: { ...formData[lang.code], cta_link: e.target.value },
                        })
                      }
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="/pricing"
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="flex gap-2 pt-4 border-t border-white/10">
              <Button onClick={handleSave} className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
                <Save className="w-4 h-4 mr-2" />
                Save All Languages
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {heroGroups.map((group) => {
          const status = getCompletionStatus(group)
          const isComplete = status.completed === status.total

          return (
            <Card key={group.id} className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-white">Hero Content</CardTitle>
                  <div className="flex gap-1">
                    {languages.map((lang) => (
                      <Badge
                        key={lang.code}
                        variant={group.translations[lang.code] ? "default" : "outline"}
                        className={
                          group.translations[lang.code]
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                        }
                      >
                        {lang.flag} {lang.code.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                  {isComplete ? (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Complete
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {status.completed}/{status.total} Languages
                    </Badge>
                  )}
                </div>
                <Button
                  onClick={() => handleEdit(group)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {languages.map((lang) => {
                  const translation = group.translations[lang.code]
                  if (!translation) return null

                  return (
                    <div key={lang.code} className="border-l-2 border-white/20 pl-3">
                      <p className="text-sm text-gray-400 mb-1">
                        {lang.flag} {lang.name}
                      </p>
                      <p className="text-white font-medium">{translation.title}</p>
                      {translation.subtitle && <p className="text-gray-300 text-sm mt-1">{translation.subtitle}</p>}
                      {translation.cta_text && (
                        <p className="text-sm text-cyan-400 mt-1">
                          {translation.cta_text} → {translation.cta_link}
                        </p>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
