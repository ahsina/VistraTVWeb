"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Trash2, Gift, Edit } from "@/lib/icons"
import { Badge } from "@/components/ui/badge"

const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
]

export function ExitPopupManager() {
  const [popups, setPopups] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<any[] | null>(null)
  const [selectedLang, setSelectedLang] = useState("fr")
  const [formData, setFormData] = useState({
    fr: { title: "", description: "", cta_text: "" },
    en: { title: "", description: "", cta_text: "" },
    ar: { title: "", description: "", cta_text: "" },
  })
  const [sharedData, setSharedData] = useState({
    event_name: "",
    cta_link: "/pricing",
    discount_code: "",
    discount_percentage: 0,
    image_url: "",
    start_date: "",
    end_date: "",
    show_countdown: true,
    background_color: "#1a1a1a",
    text_color: "#ffffff",
    is_active: true,
  })

  const supabase = createClient()

  useEffect(() => {
    fetchPopups()
  }, [])

  const fetchPopups = async () => {
    const { data } = await supabase.from("exit_popups").select("*").order("created_at", { ascending: false })

    if (data) {
      // Group by event_name
      const grouped = data.reduce((acc: any, popup: any) => {
        if (!acc[popup.event_name]) acc[popup.event_name] = []
        acc[popup.event_name].push(popup)
        return acc
      }, {})

      setPopups(Object.values(grouped))
    }
  }

  const openEditDialog = (group: any[]) => {
    setEditingGroup(group)

    // Populate form data from existing translations
    const newFormData = {
      fr: { title: "", description: "", cta_text: "" },
      en: { title: "", description: "", cta_text: "" },
      ar: { title: "", description: "", cta_text: "" },
    }

    group.forEach((popup) => {
      if (popup.language in newFormData) {
        newFormData[popup.language as keyof typeof newFormData] = {
          title: popup.title || "",
          description: popup.description || "",
          cta_text: popup.cta_text || "",
        }
      }
    })

    setFormData(newFormData)

    // Populate shared data from first popup in group
    const first = group[0]
    setSharedData({
      event_name: first.event_name || "",
      cta_link: first.cta_link || "/pricing",
      discount_code: first.discount_code || "",
      discount_percentage: first.discount_percentage || 0,
      image_url: first.image_url || "",
      start_date: first.start_date ? new Date(first.start_date).toISOString().slice(0, 16) : "",
      end_date: first.end_date ? new Date(first.end_date).toISOString().slice(0, 16) : "",
      show_countdown: first.show_countdown ?? true,
      background_color: first.background_color || "#1a1a1a",
      text_color: first.text_color || "#ffffff",
      is_active: first.is_active ?? true,
    })

    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (editingGroup) {
      // Update existing popups
      for (const existingPopup of editingGroup) {
        const lang = existingPopup.language
        const translation = formData[lang as keyof typeof formData]

        if (translation && translation.title && translation.description) {
          await supabase
            .from("exit_popups")
            .update({
              ...translation,
              ...sharedData,
              language: lang,
              discount_percentage: sharedData.discount_percentage || null,
              discount_code: sharedData.discount_code || null,
              image_url: sharedData.image_url || null,
            })
            .eq("id", existingPopup.id)
        }
      }
    } else {
      // Create new popups
      const translations = Object.entries(formData).map(([lang, data]) => ({
        ...data,
        ...sharedData,
        language: lang,
        discount_percentage: sharedData.discount_percentage || null,
        discount_code: sharedData.discount_code || null,
        image_url: sharedData.image_url || null,
      }))

      for (const translation of translations) {
        if (translation.title && translation.description) {
          await supabase.from("exit_popups").insert(translation)
        }
      }
    }

    setIsDialogOpen(false)
    setEditingGroup(null)
    fetchPopups()
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      fr: { title: "", description: "", cta_text: "" },
      en: { title: "", description: "", cta_text: "" },
      ar: { title: "", description: "", cta_text: "" },
    })
    setSharedData({
      event_name: "",
      cta_link: "/pricing",
      discount_code: "",
      discount_percentage: 0,
      image_url: "",
      start_date: "",
      end_date: "",
      show_countdown: true,
      background_color: "#1a1a1a",
      text_color: "#ffffff",
      is_active: true,
    })
    setEditingGroup(null)
  }

  const deletePopupGroup = async (group: any[]) => {
    for (const popup of group) {
      await supabase.from("exit_popups").delete().eq("id", popup.id)
    }
    fetchPopups()
  }

  const getEventEmoji = (eventName: string) => {
    const emojiMap: Record<string, string> = {
      "Black Friday": "🛍️",
      Christmas: "🎄",
      "New Year": "🎆",
      Halloween: "🎃",
      Easter: "🐰",
      Valentine: "💕",
    }
    return emojiMap[eventName] || "🎉"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Exit Popups</h3>
          <p className="text-gray-400">Create event-based exit intent popups (Black Friday, Christmas, etc.)</p>
        </div>
        <Button
          onClick={() => {
            setEditingGroup(null)
            resetForm()
            setIsDialogOpen(true)
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Exit Popup
        </Button>
      </div>

      <div className="grid gap-4">
        {popups.map((group, idx) => (
          <Card key={idx} className="p-6 bg-gray-800/50 border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getEventEmoji(group[0].event_name)}</span>
                <div>
                  <h4 className="text-lg font-semibold text-white">{group[0].event_name}</h4>
                  <div className="flex gap-2 mt-1">
                    {group.map((popup: any) => (
                      <Badge key={popup.id} variant="outline" className="bg-cyan-500/10 text-cyan-400">
                        {popup.language.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => openEditDialog(group)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deletePopupGroup(group)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-white font-semibold">{group[0].title}</p>
              <p className="text-gray-400 text-sm">{group[0].description}</p>

              {group[0].discount_percentage && (
                <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30">
                  <Gift className="w-3 h-3 mr-1" />
                  {group[0].discount_percentage}% OFF
                </Badge>
              )}

              <div className="flex gap-4 text-sm text-gray-500 pt-2">
                <span>
                  {new Date(group[0].start_date).toLocaleDateString()} →{" "}
                  {new Date(group[0].end_date).toLocaleDateString()}
                </span>
                {group[0].discount_code && <span>Code: {group[0].discount_code}</span>}
                <span className={group[0].is_active ? "text-green-400" : "text-red-400"}>
                  {group[0].is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setEditingGroup(null)
            resetForm()
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">{editingGroup ? "Edit Exit Popup" : "Create Exit Popup"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Event Name */}
            <div>
              <Label className="text-gray-300">Event Name</Label>
              <Input
                value={sharedData.event_name}
                onChange={(e) => setSharedData({ ...sharedData, event_name: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="e.g., Black Friday, Christmas, New Year"
              />
            </div>

            {/* Translations */}
            <Tabs value={selectedLang} onValueChange={setSelectedLang}>
              <TabsList>
                {LANGUAGES.map((lang) => (
                  <TabsTrigger key={lang.code} value={lang.code}>
                    {lang.flag} {lang.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {LANGUAGES.map((lang) => (
                <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Title</Label>
                    <Input
                      value={formData[lang.code as keyof typeof formData].title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [lang.code]: { ...formData[lang.code as keyof typeof formData], title: e.target.value },
                        })
                      }
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Description</Label>
                    <Textarea
                      value={formData[lang.code as keyof typeof formData].description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [lang.code]: {
                            ...formData[lang.code as keyof typeof formData],
                            description: e.target.value,
                          },
                        })
                      }
                      className="bg-gray-800 border-gray-700 text-white"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">CTA Button Text</Label>
                    <Input
                      value={formData[lang.code as keyof typeof formData].cta_text}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [lang.code]: { ...formData[lang.code as keyof typeof formData], cta_text: e.target.value },
                        })
                      }
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">CTA Link</Label>
                <Input
                  value={sharedData.cta_link}
                  onChange={(e) => setSharedData({ ...sharedData, cta_link: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Discount Code (Optional)</Label>
                <Input
                  value={sharedData.discount_code}
                  onChange={(e) => setSharedData({ ...sharedData, discount_code: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Discount Percentage</Label>
                <Input
                  type="number"
                  value={sharedData.discount_percentage}
                  onChange={(e) =>
                    setSharedData({ ...sharedData, discount_percentage: Number.parseInt(e.target.value) })
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="e.g., 50"
                />
              </div>
              <div>
                <Label className="text-gray-300">Image URL (Optional)</Label>
                <Input
                  value={sharedData.image_url}
                  onChange={(e) => setSharedData({ ...sharedData, image_url: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Start Date</Label>
                <Input
                  type="datetime-local"
                  value={sharedData.start_date}
                  onChange={(e) => setSharedData({ ...sharedData, start_date: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">End Date</Label>
                <Input
                  type="datetime-local"
                  value={sharedData.end_date}
                  onChange={(e) => setSharedData({ ...sharedData, end_date: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Background Color</Label>
                <Input
                  type="color"
                  value={sharedData.background_color}
                  onChange={(e) => setSharedData({ ...sharedData, background_color: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white h-10"
                />
              </div>
              <div>
                <Label className="text-gray-300">Text Color</Label>
                <Input
                  type="color"
                  value={sharedData.text_color}
                  onChange={(e) => setSharedData({ ...sharedData, text_color: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white h-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={sharedData.show_countdown}
                  onCheckedChange={(checked) => setSharedData({ ...sharedData, show_countdown: checked })}
                />
                <Label className="text-gray-300">Show Countdown Timer</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={sharedData.is_active}
                  onCheckedChange={(checked) => setSharedData({ ...sharedData, is_active: checked })}
                />
                <Label className="text-gray-300">Active</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false)
                setEditingGroup(null)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>{editingGroup ? "Update Popup" : "Save Popup"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
