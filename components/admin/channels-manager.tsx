"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Save, X, Trash2 } from 'lucide-react'
import XtreamImportDialog from "./xtream-import-dialog"

const languages = [
  { code: "fr", name: "Français" },
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
  { code: "es", name: "Español" },
  { code: "it", name: "Italiano" },
]

type Channel = {
  id: string
  language: string
  name: string
  description: string | null
  logo_url: string | null
  category: string | null
  display_order: number
}

export default function ChannelsManager({ initialData }: { initialData: Channel[] }) {
  const [data, setData] = useState(initialData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    language: "fr",
    name: "",
    description: "",
    logo_url: "",
    category: "",
    display_order: 0,
  })

  const handleSave = async () => {
    const supabase = createClient()

    if (editingId) {
      const { error } = await supabase.from("channels").update(formData).eq("id", editingId)

      if (!error) {
        setData(data.map((item) => (item.id === editingId ? { ...item, ...formData } : item)))
        setEditingId(null)
      }
    } else {
      const { data: newData, error } = await supabase.from("channels").insert(formData).select().single()

      if (!error && newData) {
        setData([...data, newData])
        setIsAdding(false)
        resetForm()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this channel?")) return

    const supabase = createClient()
    const { error } = await supabase.from("channels").delete().eq("id", id)

    if (!error) {
      setData(data.filter((item) => item.id !== id))
    }
  }

  const handleEdit = (item: Channel) => {
    setEditingId(item.id)
    setFormData({
      language: item.language,
      name: item.name,
      description: item.description || "",
      logo_url: item.logo_url || "",
      category: item.category || "",
      display_order: item.display_order,
    })
  }

  const resetForm = () => {
    setEditingId(null)
    setIsAdding(false)
    setFormData({
      language: "fr",
      name: "",
      description: "",
      logo_url: "",
      category: "",
      display_order: 0,
    })
  }

  return (
    <div className="space-y-6">
      {!isAdding && !editingId && (
        <div className="flex gap-2">
          <XtreamImportDialog />
          <Button onClick={() => setIsAdding(true)} className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
            <Plus className="w-4 h-4 mr-2" />
            Add Channel
          </Button>
        </div>
      )}

      {(isAdding || editingId) && (
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-white">{editingId ? "Edit Channel" : "Add Channel"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="language" className="text-white">
                Language
              </Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name" className="text-white">
                Channel Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-white">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category" className="text-white">
                Category
              </Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="logo_url" className="text-white">
                Logo URL
              </Label>
              <Input
                id="logo_url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="display_order" className="text-white">
                Display Order
              </Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) || 0 })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
                <Save className="w-4 h-4 mr-2" />
                Save
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
        {data.map((item) => (
          <Card key={item.id} className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">{item.name}</CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(item)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(item.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-400">Language</p>
                <p className="text-white">{languages.find((l) => l.code === item.language)?.name}</p>
              </div>
              {item.description && (
                <div>
                  <p className="text-sm text-gray-400">Description</p>
                  <p className="text-white">{item.description}</p>
                </div>
              )}
              {item.category && (
                <div>
                  <p className="text-sm text-gray-400">Category</p>
                  <p className="text-white">{item.category}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-400">Order</p>
                <p className="text-white">{item.display_order}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
