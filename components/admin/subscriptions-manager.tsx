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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash, DollarSign } from "lucide-react"

const languages = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
]

type SubscriptionPlan = {
  id: string
  language: string
  name: string
  description: string | null
  price: number
  currency: string
  duration_months: number
  features: any
  is_active: boolean
  display_order: number
}

type GroupedPlan = {
  planKey: string
  price: number
  currency: string
  duration_months: number
  features: any
  is_active: boolean
  display_order: number
  translations: {
    [key: string]: {
      id: string
      name: string
      description: string | null
    }
  }
}

export default function SubscriptionsManager({
  initialData,
}: {
  initialData: SubscriptionPlan[]
}) {
  const [data, setData] = useState(initialData)
  const [groupedPlans, setGroupedPlans] = useState<GroupedPlan[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlanKey, setEditingPlanKey] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("fr")
  const [formData, setFormData] = useState({
    price: 0,
    currency: "EUR",
    duration_months: 1,
    features: "[]",
    is_active: true,
    display_order: 0,
    translations: {
      fr: { name: "", description: "" },
      en: { name: "", description: "" },
      ar: { name: "", description: "" },
    },
  })

  useEffect(() => {
    const grouped = data.reduce((acc: { [key: string]: GroupedPlan }, plan) => {
      // Create a unique key based on price, duration, and display order
      const key = `${plan.price}-${plan.duration_months}-${plan.display_order}`

      if (!acc[key]) {
        acc[key] = {
          planKey: key,
          price: plan.price,
          currency: plan.currency,
          duration_months: plan.duration_months,
          features: plan.features,
          is_active: plan.is_active,
          display_order: plan.display_order,
          translations: {},
        }
      }

      acc[key].translations[plan.language] = {
        id: plan.id,
        name: plan.name,
        description: plan.description || "",
      }

      return acc
    }, {})

    setGroupedPlans(Object.values(grouped).sort((a, b) => a.display_order - b.display_order))
  }, [data])

  const handleSave = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const updates = []

    for (const [lang, translation] of Object.entries(formData.translations)) {
      if (!translation.name.trim()) continue

      const saveData = {
        language: lang,
        name: translation.name,
        description: translation.description || null,
        price: formData.price,
        currency: formData.currency,
        duration_months: formData.duration_months,
        features: JSON.parse(formData.features),
        is_active: formData.is_active,
        display_order: formData.display_order,
        updated_by: user?.id,
      }

      if (editingPlanKey) {
        const existingPlan = data.find(
          (p) => p.language === lang && `${p.price}-${p.duration_months}-${p.display_order}` === editingPlanKey,
        )

        if (existingPlan) {
          updates.push(supabase.from("subscription_plans").update(saveData).eq("id", existingPlan.id))
        } else {
          updates.push(supabase.from("subscription_plans").insert(saveData).select())
        }
      } else {
        updates.push(supabase.from("subscription_plans").insert(saveData).select())
      }
    }

    await Promise.all(updates)

    // Refresh data
    const { data: refreshedData } = await supabase.from("subscription_plans").select("*").order("display_order")

    if (refreshedData) {
      setData(refreshedData)
    }

    handleCloseDialog()
  }

  const handleDelete = async (planKey: string) => {
    if (!confirm("Voulez-vous supprimer ce plan dans toutes les langues ?")) return

    const supabase = createClient()
    const idsToDelete = data
      .filter((p) => `${p.price}-${p.duration_months}-${p.display_order}` === planKey)
      .map((p) => p.id)

    await Promise.all(idsToDelete.map((id) => supabase.from("subscription_plans").delete().eq("id", id)))

    setData(data.filter((p) => !idsToDelete.includes(p.id)))
  }

  const handleEdit = (plan: GroupedPlan) => {
    setEditingPlanKey(plan.planKey)
    setFormData({
      price: plan.price,
      currency: plan.currency,
      duration_months: plan.duration_months,
      features: JSON.stringify(plan.features, null, 2),
      is_active: plan.is_active,
      display_order: plan.display_order,
      translations: {
        fr: plan.translations.fr || { name: "", description: "" },
        en: plan.translations.en || { name: "", description: "" },
        ar: plan.translations.ar || { name: "", description: "" },
      },
    })
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingPlanKey(null)
    setActiveTab("fr")
    setFormData({
      price: 0,
      currency: "EUR",
      duration_months: 1,
      features: "[]",
      is_active: true,
      display_order: 0,
      translations: {
        fr: { name: "", description: "" },
        en: { name: "", description: "" },
        ar: { name: "", description: "" },
      },
    })
  }

  const getAvailableLanguages = (plan: GroupedPlan) => {
    return Object.keys(plan.translations)
  }

  const getCompletionPercentage = (plan: GroupedPlan) => {
    const total = languages.length
    const completed = Object.values(plan.translations).filter((t) => t.name.trim()).length
    return Math.round((completed / total) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Plans d'abonnement</h2>
          <p className="text-gray-400 mt-1">
            {groupedPlans.length} plan{groupedPlans.length > 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un plan
        </Button>
      </div>

      <div className="grid gap-4">
        {groupedPlans.map((plan) => {
          const availableLangs = getAvailableLanguages(plan)
          const completion = getCompletionPercentage(plan)

          return (
            <Card key={plan.planKey} className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="space-y-2">
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-cyan-400" />
                    {plan.translations.fr?.name || plan.translations.en?.name || "Plan sans nom"}
                    {!plan.is_active && (
                      <Badge variant="destructive" className="ml-2">
                        Inactif
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="flex gap-2">
                    {availableLangs.map((lang) => (
                      <Badge key={lang} variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                        {languages.find((l) => l.code === lang)?.flag} {lang.toUpperCase()}
                      </Badge>
                    ))}
                    <Badge
                      variant={completion === 100 ? "default" : "outline"}
                      className={
                        completion === 100
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                      }
                    >
                      {completion}% complet
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(plan)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(plan.planKey)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:bg-red-500/10"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Prix</p>
                    <p className="text-white font-semibold">
                      {plan.price} {plan.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Durée</p>
                    <p className="text-white">{plan.duration_months} mois</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl bg-gradient-to-br from-gray-900 to-gray-800 border-white/10 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              {editingPlanKey ? "Modifier le plan" : "Ajouter un plan"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price" className="text-white">
                  Prix
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="currency" className="text-white">
                  Devise
                </Label>
                <Input
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration" className="text-white">
                  Durée (Mois)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_months}
                  onChange={(e) => setFormData({ ...formData, duration_months: Number.parseInt(e.target.value) })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="display_order" className="text-white">
                  Ordre d'affichage
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
              <Label htmlFor="features" className="text-white">
                Fonctionnalités (JSON Array)
              </Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="bg-white/10 border-white/20 text-white font-mono text-sm"
                placeholder='["Fonctionnalité 1", "Fonctionnalité 2"]'
                rows={4}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label className="text-white">Actif</Label>
            </div>

            <div className="border-t border-white/10 pt-4">
              <Label className="text-white mb-4 block">Traductions</Label>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 bg-white/5">
                  {languages.map((lang) => (
                    <TabsTrigger
                      key={lang.code}
                      value={lang.code}
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00d4ff] data-[state=active]:to-[#e94b87]"
                    >
                      {lang.flag} {lang.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {languages.map((lang) => (
                  <TabsContent key={lang.code} value={lang.code} className="space-y-4 mt-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`name-${lang.code}`} className="text-white">
                        Nom du plan
                      </Label>
                      <Input
                        id={`name-${lang.code}`}
                        value={formData.translations[lang.code].name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            translations: {
                              ...formData.translations,
                              [lang.code]: {
                                ...formData.translations[lang.code],
                                name: e.target.value,
                              },
                            },
                          })
                        }
                        className="bg-white/10 border-white/20 text-white"
                        placeholder={`Nom en ${lang.name}`}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`description-${lang.code}`} className="text-white">
                        Description
                      </Label>
                      <Textarea
                        id={`description-${lang.code}`}
                        value={formData.translations[lang.code].description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            translations: {
                              ...formData.translations,
                              [lang.code]: {
                                ...formData.translations[lang.code],
                                description: e.target.value,
                              },
                            },
                          })
                        }
                        className="bg-white/10 border-white/20 text-white"
                        placeholder={`Description en ${lang.name}`}
                        rows={4}
                      />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-white/10">
              <Button
                onClick={handleCloseDialog}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                Annuler
              </Button>
              <Button onClick={handleSave} className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
