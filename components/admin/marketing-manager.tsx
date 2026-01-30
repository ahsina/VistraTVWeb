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
import { AlertCircle, Eye, ShoppingCart, Plus, Edit, Trash2, Gift } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ExitPopupManager } from "./exit-popup-manager"

const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
]

export function MarketingManager() {
  const [activeTab, setActiveTab] = useState("urgency")
  const supabase = createClient()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Marketing Components</h2>
        <p className="text-gray-400">Manage urgency banners, live viewers, recent purchases, and exit popups</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="urgency">
            <AlertCircle className="w-4 h-4 mr-2" />
            Urgency Banners
          </TabsTrigger>
          <TabsTrigger value="viewers">
            <Eye className="w-4 h-4 mr-2" />
            Live Viewers
          </TabsTrigger>
          <TabsTrigger value="purchases">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Recent Purchases
          </TabsTrigger>
          <TabsTrigger value="exit-popup">
            <Gift className="w-4 h-4 mr-2" />
            Exit Popups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="urgency">
          <UrgencyBannersManager supabase={supabase} />
        </TabsContent>

        <TabsContent value="viewers">
          <LiveViewersManager supabase={supabase} />
        </TabsContent>

        <TabsContent value="purchases">
          <RecentPurchasesManager supabase={supabase} />
        </TabsContent>

        <TabsContent value="exit-popup">
          <ExitPopupManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Urgency Banners Manager
function UrgencyBannersManager({ supabase }: any) {
  const [banners, setBanners] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<any>(null)
  const [selectedLang, setSelectedLang] = useState("fr")
  const [formData, setFormData] = useState({
    fr: { title: "", message: "" },
    en: { title: "", message: "" },
    ar: { title: "", message: "" },
  })
  const [endDate, setEndDate] = useState("")
  const [spotsRemaining, setSpotsRemaining] = useState(50)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    const { data } = await supabase.from("urgency_banners").select("*").order("display_order")

    if (data) {
      const grouped = data.reduce((acc: any, banner: any) => {
        const key = `${banner.end_date}_${banner.spots_remaining}`
        if (!acc[key]) acc[key] = []
        acc[key].push(banner)
        return acc
      }, {})

      setBanners(Object.values(grouped))
    }
  }

  const handleSave = async () => {
    const translations = Object.entries(formData).map(([lang, data]) => ({
      ...data,
      language: lang,
      end_date: endDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      spots_remaining: spotsRemaining,
      is_active: isActive,
    }))

    for (const translation of translations) {
      if (translation.title && translation.message) {
        await supabase.from("urgency_banners").insert(translation)
      }
    }

    setIsDialogOpen(false)
    fetchBanners()
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      fr: { title: "", message: "" },
      en: { title: "", message: "" },
      ar: { title: "", message: "" },
    })
    setEndDate("")
    setSpotsRemaining(50)
    setIsActive(true)
  }

  const deleteBannerGroup = async (group: any[]) => {
    for (const banner of group) {
      await supabase.from("urgency_banners").delete().eq("id", banner.id)
    }
    fetchBanners()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-gray-400">Manage urgency banners with countdown timers</p>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Banner
        </Button>
      </div>

      <div className="grid gap-4">
        {banners.map((group, idx) => (
          <Card key={idx} className="p-6 bg-gray-800/50 border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-2">
                {group.map((banner: any) => (
                  <Badge key={banner.id} variant="outline" className="bg-cyan-500/10 text-cyan-400">
                    {banner.language.toUpperCase()}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => deleteBannerGroup(group)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-white font-semibold">{group[0].title}</p>
              <p className="text-gray-400 text-sm">{group[0].message}</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>Ends: {new Date(group[0].end_date).toLocaleString()}</span>
                <span>Spots: {group[0].spots_remaining}</span>
                <span className={group[0].is_active ? "text-green-400" : "text-red-400"}>
                  {group[0].is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Add Urgency Banner</DialogTitle>
          </DialogHeader>

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
                  <Label className="text-gray-300">Message</Label>
                  <Textarea
                    value={formData[lang.code as keyof typeof formData].message}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [lang.code]: { ...formData[lang.code as keyof typeof formData], message: e.target.value },
                      })
                    }
                    className="bg-gray-800 border-gray-700 text-white"
                    rows={3}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">End Date</Label>
              <Input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Spots Remaining</Label>
              <Input
                type="number"
                value={spotsRemaining}
                onChange={(e) => setSpotsRemaining(Number.parseInt(e.target.value))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label className="text-gray-300">Active</Label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Banner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Live Viewers Manager
function LiveViewersManager({ supabase }: any) {
  const [configs, setConfigs] = useState<any[]>([])
  const [editingConfig, setEditingConfig] = useState<any>(null)

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    const { data } = await supabase.from("live_viewers_config").select("*").order("language")

    if (data) setConfigs(data)
  }

  const updateConfig = async (config: any) => {
    await supabase.from("live_viewers_config").update(config).eq("id", config.id)

    fetchConfigs()
    setEditingConfig(null)
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-400">Configure live viewers counter for each language</p>

      <div className="grid gap-4">
        {configs.map((config) => (
          <Card key={config.id} className="p-6 bg-gray-800/50 border-gray-700">
            {editingConfig?.id === config.id ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Label</Label>
                  <Input
                    value={editingConfig.label}
                    onChange={(e) => setEditingConfig({ ...editingConfig, label: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Min Viewers</Label>
                    <Input
                      type="number"
                      value={editingConfig.min_viewers}
                      onChange={(e) =>
                        setEditingConfig({ ...editingConfig, min_viewers: Number.parseInt(e.target.value) })
                      }
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Max Viewers</Label>
                    <Input
                      type="number"
                      value={editingConfig.max_viewers}
                      onChange={(e) =>
                        setEditingConfig({ ...editingConfig, max_viewers: Number.parseInt(e.target.value) })
                      }
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => updateConfig(editingConfig)}>Save</Button>
                  <Button variant="outline" onClick={() => setEditingConfig(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400">
                      {config.language.toUpperCase()}
                    </Badge>
                    <Badge variant={config.is_active ? "default" : "secondary"}>
                      {config.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-white font-semibold">{config.label}</p>
                  <p className="text-gray-400 text-sm">
                    Range: {config.min_viewers} - {config.max_viewers}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setEditingConfig(config)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

// Recent Purchases Manager
function RecentPurchasesManager({ supabase }: any) {
  const [purchases, setPurchases] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedLang, setSelectedLang] = useState("fr")
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    plan_name: "",
    time_ago: "",
    language: "fr",
    is_active: true,
  })

  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    const { data } = await supabase.from("recent_purchases").select("*").order("display_order")

    if (data) setPurchases(data)
  }

  const handleSave = async () => {
    await supabase.from("recent_purchases").insert({
      ...formData,
      language: selectedLang,
    })

    setIsDialogOpen(false)
    fetchPurchases()
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      plan_name: "",
      time_ago: "",
      language: "fr",
      is_active: true,
    })
  }

  const deletePurchase = async (id: string) => {
    await supabase.from("recent_purchases").delete().eq("id", id)
    fetchPurchases()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-gray-400">Manage recent purchase notifications</p>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Purchase
        </Button>
      </div>

      <div className="grid gap-4">
        {purchases.map((purchase) => (
          <Card key={purchase.id} className="p-6 bg-gray-800/50 border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400">
                    {purchase.language.toUpperCase()}
                  </Badge>
                  <Badge variant={purchase.is_active ? "default" : "secondary"}>
                    {purchase.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-white font-semibold">{purchase.name}</p>
                <p className="text-cyan-400 text-sm">{purchase.plan_name} Plan</p>
                <p className="text-gray-400 text-sm">
                  {purchase.location} • {purchase.time_ago}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => deletePurchase(purchase.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Add Recent Purchase</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Language</Label>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full bg-gray-800 border-gray-700 text-white rounded-md p-2"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-gray-300">Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="e.g., Mohammed A."
              />
            </div>

            <div>
              <Label className="text-gray-300">Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="e.g., Paris, France"
              />
            </div>

            <div>
              <Label className="text-gray-300">Plan Name</Label>
              <Input
                value={formData.plan_name}
                onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="e.g., Premium"
              />
            </div>

            <div>
              <Label className="text-gray-300">Time Ago</Label>
              <Input
                value={formData.time_ago}
                onChange={(e) => setFormData({ ...formData, time_ago: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="e.g., 2 min"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Add Purchase</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
