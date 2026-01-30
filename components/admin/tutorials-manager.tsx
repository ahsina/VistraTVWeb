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

type Tutorial = {
  id: string
  language: string
  device_key: string
  name: string
  description: string | null
  difficulty: string | null
  duration: string | null
  steps: any
  prerequisites: any
  faqs: any
  image_url: string | null
  display_order: number
  is_active: boolean
}

type TutorialGroup = {
  id: string
  translations: Record<string, Tutorial>
  device_key: string
  difficulty: string | null
  duration: string | null
  steps: any
  prerequisites: any
  faqs: any
  image_url: string | null
  display_order: number
  is_active: boolean
}

export function TutorialsManager() {
  const [tutorialGroups, setTutorialGroups] = useState<TutorialGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [activeTab, setActiveTab] = useState("fr")
  const [formData, setFormData] = useState<Record<string, any>>({
    fr: { name: "", description: "" },
    en: { name: "", description: "" },
    ar: { name: "", description: "" },
    device_key: "",
    difficulty: "beginner",
    duration: "",
    steps: [],
    prerequisites: [],
    faqs: [],
    image_url: "",
    display_order: 0,
    is_active: true,
  })

  useEffect(() => {
    fetchTutorials()
  }, [])

  const fetchTutorials = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase.from("tutorial_devices").select("*").order("display_order", { ascending: true })

      if (data) {
        const grouped: Record<string, TutorialGroup> = {}

        data.forEach((item) => {
          const groupKey = item.device_key || `tutorial-${item.display_order}`
          if (!grouped[groupKey]) {
            grouped[groupKey] = {
              id: groupKey,
              translations: {},
              device_key: item.device_key,
              difficulty: item.difficulty,
              duration: item.duration,
              steps: item.steps,
              prerequisites: item.prerequisites,
              faqs: item.faqs,
              image_url: item.image_url,
              display_order: item.display_order,
              is_active: item.is_active,
            }
          }
          grouped[groupKey].translations[item.language] = item
        })

        setTutorialGroups(Object.values(grouped).sort((a, b) => a.display_order - b.display_order))
      }
    } catch (error) {
      console.error("[v0] Error fetching tutorials:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCompletionStatus = (group: TutorialGroup) => {
    const completed = languages.filter((lang) => group.translations[lang.code]).length
    return { completed, total: languages.length }
  }

  const handleSave = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    setLoading(true)
    try {
      if (editingId) {
        for (const lang of languages) {
          const translation = formData[lang.code]
          const existingItem = tutorialGroups.find((g) => g.id === editingId)?.translations[lang.code]

          if (existingItem) {
            await supabase
              .from("tutorial_devices")
              .update({
                ...translation,
                device_key: formData.device_key,
                difficulty: formData.difficulty,
                duration: formData.duration,
                steps: formData.steps,
                prerequisites: formData.prerequisites,
                faqs: formData.faqs,
                image_url: formData.image_url,
                display_order: formData.display_order,
                is_active: formData.is_active,
                updated_by: user?.id,
              })
              .eq("id", existingItem.id)
          } else if (translation.name) {
            await supabase.from("tutorial_devices").insert({
              ...translation,
              language: lang.code,
              device_key: formData.device_key,
              difficulty: formData.difficulty,
              duration: formData.duration,
              steps: formData.steps,
              prerequisites: formData.prerequisites,
              faqs: formData.faqs,
              image_url: formData.image_url,
              display_order: formData.display_order,
              is_active: formData.is_active,
              updated_by: user?.id,
            })
          }
        }
      } else {
        const inserts = languages
          .filter((lang) => formData[lang.code].name)
          .map((lang) => ({
            ...formData[lang.code],
            language: lang.code,
            device_key: formData.device_key,
            difficulty: formData.difficulty,
            duration: formData.duration,
            steps: formData.steps,
            prerequisites: formData.prerequisites,
            faqs: formData.faqs,
            image_url: formData.image_url,
            display_order: formData.display_order,
            is_active: formData.is_active,
            updated_by: user?.id,
          }))

        if (inserts.length > 0) {
          await supabase.from("tutorial_devices").insert(inserts)
        }
      }

      resetForm()
      fetchTutorials()
    } catch (error) {
      console.error("[v0] Error saving tutorial:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (group: TutorialGroup) => {
    if (!confirm("Are you sure you want to delete this tutorial in all languages?")) return

    setLoading(true)
    try {
      const supabase = createClient()
      const ids = Object.values(group.translations).map((t) => t.id)

      await supabase.from("tutorial_devices").delete().in("id", ids)
      fetchTutorials()
    } catch (error) {
      console.error("[v0] Error deleting tutorial:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (group: TutorialGroup) => {
    setEditingId(group.id)
    const newFormData: any = {
      fr: { name: "", description: "" },
      en: { name: "", description: "" },
      ar: { name: "", description: "" },
      device_key: group.device_key,
      difficulty: group.difficulty || "beginner",
      duration: group.duration || "",
      steps: group.steps || [],
      prerequisites: group.prerequisites || [],
      faqs: group.faqs || [],
      image_url: group.image_url || "",
      display_order: group.display_order,
      is_active: group.is_active,
    }

    languages.forEach((lang) => {
      const translation = group.translations[lang.code]
      if (translation) {
        newFormData[lang.code] = {
          name: translation.name,
          description: translation.description || "",
        }
      }
    })

    setFormData(newFormData)
    setActiveTab("fr")
  }

  const resetForm = () => {
    setEditingId(null)
    setIsAdding(false)
    setFormData({
      fr: { name: "", description: "" },
      en: { name: "", description: "" },
      ar: { name: "", description: "" },
      device_key: "",
      difficulty: "beginner",
      duration: "",
      steps: [],
      prerequisites: [],
      faqs: [],
      image_url: "",
      display_order: 0,
      is_active: true,
    })
  }

  if (loading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {!isAdding && !editingId && (
        <Button onClick={() => setIsAdding(true)} className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
          <Plus className="w-4 h-4 mr-2" />
          Add New Tutorial
        </Button>
      )}

      {(isAdding || editingId) && (
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-white">{editingId ? "Edit Tutorial" : "Add Tutorial"}</CardTitle>
            <p className="text-sm text-gray-400">Fill in content for each language using the tabs below</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 pb-4 border-b border-white/10">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="device_key" className="text-white">
                    Device Key (Shared)
                  </Label>
                  <Input
                    id="device_key"
                    value={formData.device_key}
                    onChange={(e) => setFormData({ ...formData, device_key: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="android-tv"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="difficulty" className="text-white">
                    Difficulty (Shared)
                  </Label>
                  <Input
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="beginner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration" className="text-white">
                    Duration (Shared)
                  </Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="10 min"
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
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image_url" className="text-white">
                  Image URL (Shared)
                </Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="https://example.com/tutorial.jpg"
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
                    {formData[lang.code].name && <CheckCircle2 className="w-4 h-4 ml-2 text-green-400" />}
                  </TabsTrigger>
                ))}
              </TabsList>

              {languages.map((lang) => (
                <TabsContent key={lang.code} value={lang.code} className="space-y-4 mt-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`name-${lang.code}`} className="text-white">
                      Name ({lang.name})
                    </Label>
                    <Input
                      id={`name-${lang.code}`}
                      value={formData[lang.code].name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [lang.code]: { ...formData[lang.code], name: e.target.value },
                        })
                      }
                      className="bg-white/10 border-white/20 text-white"
                      placeholder={`Enter name in ${lang.name}`}
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
                onClick={resetForm}
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
        {tutorialGroups.map((group) => {
          const status = getCompletionStatus(group)
          const isComplete = status.completed === status.total

          return (
            <Card key={group.id} className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    {group.device_key || "Tutorial"}
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
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-400">Difficulty</p>
                    <p className="text-white">{group.difficulty}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Duration</p>
                    <p className="text-white">{group.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Order</p>
                    <p className="text-white">{group.display_order}</p>
                  </div>
                </div>
                {languages.map((lang) => {
                  const translation = group.translations[lang.code]
                  if (!translation) return null

                  return (
                    <div key={lang.code} className="border-l-2 border-white/20 pl-3">
                      <p className="text-sm text-gray-400 mb-1">
                        {lang.flag} {lang.name}
                      </p>
                      <p className="text-white font-medium">{translation.name}</p>
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
