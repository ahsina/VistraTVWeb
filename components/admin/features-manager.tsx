"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Save, X, Trash, AlertCircle, CheckCircle2 } from "lucide-react"

const languages = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
]

type Feature = {
  id: string
  language: string
  title: string
  description: string | null
  icon_name: string | null
  display_order: number
  is_active: boolean
}

type FeatureGroup = {
  id: string
  translations: Record<string, Feature>
  icon_name: string | null
  display_order: number
  is_active: boolean
}

export default function FeaturesManager({ initialData }: { initialData: Feature[] }) {
  const [featureGroups, setFeatureGroups] = useState<FeatureGroup[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [activeTab, setActiveTab] = useState("fr")
  const [formData, setFormData] = useState<Record<string, any>>({
    fr: { title: "", description: "" },
    en: { title: "", description: "" },
    ar: { title: "", description: "" },
    icon_name: "Tv",
    display_order: 0,
    is_active: true,
  })

  useEffect(() => {
    const grouped: Record<string, FeatureGroup> = {}

    initialData.forEach((item) => {
      const groupKey = `${item.display_order}-${item.icon_name || "default"}`
      if (!grouped[groupKey]) {
        grouped[groupKey] = {
          id: groupKey,
          translations: {},
          icon_name: item.icon_name,
          display_order: item.display_order,
          is_active: item.is_active,
        }
      }
      grouped[groupKey].translations[item.language] = item
    })

    setFeatureGroups(Object.values(grouped).sort((a, b) => a.display_order - b.display_order))
  }, [initialData])

  const getCompletionStatus = (group: FeatureGroup) => {
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
        const existingItem = featureGroups.find((g) => g.id === editingId)?.translations[lang.code]

        if (existingItem) {
          await supabase
            .from("features")
            .update({
              ...translation,
              icon_name: formData.icon_name,
              display_order: formData.display_order,
              is_active: formData.is_active,
              updated_by: user?.id,
            })
            .eq("id", existingItem.id)
        } else if (translation.title) {
          await supabase.from("features").insert({
            ...translation,
            language: lang.code,
            icon_name: formData.icon_name,
            display_order: formData.display_order,
            is_active: formData.is_active,
            updated_by: user?.id,
          })
        }
      }

      // Refresh data
      const { data: refreshedData } = await supabase.from("features").select("*")
      if (refreshedData) {
        const grouped: Record<string, FeatureGroup> = {}
        refreshedData.forEach((item) => {
          const groupKey = `${item.display_order}-${item.icon_name || "default"}`
          if (!grouped[groupKey]) {
            grouped[groupKey] = {
              id: groupKey,
              translations: {},
              icon_name: item.icon_name,
              display_order: item.display_order,
              is_active: item.is_active,
            }
          }
          grouped[groupKey].translations[item.language] = item
        })
        setFeatureGroups(Object.values(grouped).sort((a, b) => a.display_order - b.display_order))
      }

      setEditingId(null)
    } else {
      const inserts = languages
        .filter((lang) => formData[lang.code].title)
        .map((lang) => ({
          ...formData[lang.code],
          language: lang.code,
          icon_name: formData.icon_name,
          display_order: formData.display_order,
          is_active: formData.is_active,
          updated_by: user?.id,
        }))

      if (inserts.length > 0) {
        await supabase.from("features").insert(inserts)

        // Refresh data
        const { data: refreshedData } = await supabase.from("features").select("*")
        if (refreshedData) {
          const grouped: Record<string, FeatureGroup> = {}
          refreshedData.forEach((item) => {
            const groupKey = `${item.display_order}-${item.icon_name || "default"}`
            if (!grouped[groupKey]) {
              grouped[groupKey] = {
                id: groupKey,
                translations: {},
                icon_name: item.icon_name,
                display_order: item.display_order,
                is_active: item.is_active,
              }
            }
            grouped[groupKey].translations[item.language] = item
          })
          setFeatureGroups(Object.values(grouped).sort((a, b) => a.display_order - b.display_order))
        }
      }

      setIsAdding(false)
      setFormData({
        fr: { title: "", description: "" },
        en: { title: "", description: "" },
        ar: { title: "", description: "" },
        icon_name: "Tv",
        display_order: 0,
        is_active: true,
      })
    }
  }

  const handleDelete = async (group: FeatureGroup) => {
    if (!confirm("Are you sure you want to delete this feature in all languages?")) return

    const supabase = createClient()
    const ids = Object.values(group.translations).map((t) => t.id)

    const { error } = await supabase.from("features").delete().in("id", ids)

    if (!error) {
      setFeatureGroups(featureGroups.filter((g) => g.id !== group.id))
    }
  }

  const handleEdit = (group: FeatureGroup) => {
    setEditingId(group.id)
    const newFormData: any = {
      fr: { title: "", description: "" },
      en: { title: "", description: "" },
      ar: { title: "", description: "" },
      icon_name: group.icon_name || "Tv",
      display_order: group.display_order,
      is_active: group.is_active,
    }

    languages.forEach((lang) => {
      const translation = group.translations[lang.code]
      if (translation) {
        newFormData[lang.code] = {
          title: translation.title,
          description: translation.description || "",
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
      fr: { title: "", description: "" },
      en: { title: "", description: "" },
      ar: { title: "", description: "" },
      icon_name: "Tv",
      display_order: 0,
      is_active: true,
    })
  }

  return (
    <div className="space-y-6">
      {!isAdding && !editingId && (
        <Button onClick={() => setIsAdding(true)} className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
          <Plus className="w-4 h-4 mr-2" />
          Add New Feature
        </Button>
      )}

      {(isAdding || editingId) && (
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-white">{editingId ? "Edit Feature" : "Add Feature"}</CardTitle>
            <p className="text-sm text-gray-400">Fill in content for each language using the tabs below</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 pb-4 border-b border-white/10">
              <div className="grid gap-2">
                <Label htmlFor="icon_name" className="text-white">
                  Icon Name (Shared)
                </Label>
                <Input
                  id="icon_name"
                  value={formData.icon_name}
                  onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Tv"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="display_order" className="text-white">
                  Display Order (Shared)
                </Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label className="text-white">Active</Label>
              </div>
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
                    <Label htmlFor={`description-${lang.code}`} className="text-white">
                      Description ({lang.name})
                    </Label>
                    <Textarea
                      id={`description-${lang.code}`}
                      value={formData[lang.code].description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [lang.code]: { ...formData[lang.code], description: e.target.value },
                        })
                      }
                      className="bg-white/10 border-white/20 text-white"
                      placeholder={`Enter description in ${lang.name}`}
                      rows={4}
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
        {featureGroups.map((group) => {
          const status = getCompletionStatus(group)
          const isComplete = status.completed === status.total

          return (
            <Card key={group.id} className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    Feature #{group.display_order}
                    {!group.is_active && (
                      <Badge variant="outline" className="bg-red-500/20 text-red-300">
                        Inactive
                      </Badge>
                    )}
                  </CardTitle>
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
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(group)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(group)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:bg-red-500/10"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
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
                      {translation.description && (
                        <p className="text-gray-300 text-sm mt-1">{translation.description}</p>
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
