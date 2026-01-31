// components/admin/content-manager.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
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
import {
  GripVertical,
  Plus,
  Edit,
  Trash,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Upload,
  X,
  Save,
  Copy,
  ExternalLink,
  History,
  Undo,
  Languages,
} from "lucide-react"

interface ContentItem {
  id: string
  type: string
  title: string
  content: string
  image_url?: string
  display_order: number
  is_active: boolean
  language: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  versions?: ContentVersion[]
}

interface ContentVersion {
  id: string
  content_id: string
  title: string
  content: string
  created_at: string
  created_by: string
}

interface SortableItemProps {
  item: ContentItem
  onEdit: (item: ContentItem) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string, active: boolean) => void
}

const languages = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
]

function SortableItem({ item, onEdit, onDelete, onToggleActive }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10 ${
        isDragging ? "shadow-lg" : ""
      }`}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5 text-gray-500" />
      </button>

      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.title}
          className="w-16 h-16 rounded-lg object-cover"
        />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-white truncate">{item.title}</h3>
          <Badge variant="outline" className="shrink-0">
            {languages.find((l) => l.code === item.language)?.flag} {item.language.toUpperCase()}
          </Badge>
          {!item.is_active && (
            <Badge className="bg-gray-500/20 text-gray-400">Masqué</Badge>
          )}
        </div>
        <p className="text-sm text-gray-400 truncate mt-1">
          {item.content?.substring(0, 100)}...
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Switch
          checked={item.is_active}
          onCheckedChange={(checked) => onToggleActive(item.id, checked)}
        />
        <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(item.id)}
          className="text-red-400 hover:text-red-300"
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

interface ContentManagerProps {
  contentType: "features" | "hero_content" | "tutorial_devices" | "channels" | "faq"
  title: string
}

export function ContentManager({ contentType, title }: ContentManagerProps) {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeLanguage, setActiveLanguage] = useState("fr")
  const [showVersions, setShowVersions] = useState(false)

  const supabase = createClient()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchItems()
  }, [activeLanguage])

  async function fetchItems() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from(contentType)
        .select("*")
        .eq("language", activeLanguage)
        .order("display_order", { ascending: true })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error("[v0] Error fetching content:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)

      const newItems = arrayMove(items, oldIndex, newIndex)
      setItems(newItems)

      // Mettre à jour l'ordre dans la base de données
      const updates = newItems.map((item, index) => ({
        id: item.id,
        display_order: index,
      }))

      for (const update of updates) {
        await supabase
          .from(contentType)
          .update({ display_order: update.display_order })
          .eq("id", update.id)
      }
    }
  }

  async function handleSave(item: Partial<ContentItem>) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (editingItem) {
        // Sauvegarder la version précédente
        await supabase.from("content_versions").insert({
          content_id: editingItem.id,
          content_type: contentType,
          title: editingItem.title,
          content: editingItem.content,
          metadata: editingItem.metadata,
          created_by: user?.id,
        })

        // Mettre à jour
        const { error } = await supabase
          .from(contentType)
          .update({
            ...item,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingItem.id)

        if (error) throw error
      } else {
        // Créer nouveau
        const maxOrder = Math.max(...items.map((i) => i.display_order), -1)
        const { error } = await supabase.from(contentType).insert({
          ...item,
          display_order: maxOrder + 1,
          language: activeLanguage,
          is_active: true,
        })

        if (error) throw error
      }

      setIsDialogOpen(false)
      setEditingItem(null)
      fetchItems()
    } catch (error) {
      console.error("[v0] Error saving content:", error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return

    try {
      const { error } = await supabase.from(contentType).delete().eq("id", id)
      if (error) throw error
      fetchItems()
    } catch (error) {
      console.error("[v0] Error deleting content:", error)
    }
  }

  async function handleToggleActive(id: string, active: boolean) {
    try {
      await supabase.from(contentType).update({ is_active: active }).eq("id", id)
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_active: active } : item))
      )
    } catch (error) {
      console.error("[v0] Error toggling active:", error)
    }
  }

  async function duplicateItem(item: ContentItem) {
    try {
      const maxOrder = Math.max(...items.map((i) => i.display_order), -1)
      const { error } = await supabase.from(contentType).insert({
        ...item,
        id: undefined,
        title: `${item.title} (copie)`,
        display_order: maxOrder + 1,
        created_at: undefined,
        updated_at: undefined,
      })

      if (error) throw error
      fetchItems()
    } catch (error) {
      console.error("[v0] Error duplicating content:", error)
    }
  }

  async function restoreVersion(version: ContentVersion) {
    try {
      await supabase
        .from(contentType)
        .update({
          title: version.title,
          content: version.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", version.content_id)

      setShowVersions(false)
      fetchItems()
    } catch (error) {
      console.error("[v0] Error restoring version:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-gray-400">Glissez-déposez pour réorganiser</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Sélecteur de langue */}
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-gray-400" />
            <Select value={activeLanguage} onValueChange={setActiveLanguage}>
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => {
              setEditingItem(null)
              setIsDialogOpen(true)
            }}
            className="bg-gradient-to-r from-cyan-500 to-rose-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Liste avec drag & drop */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>Aucun contenu pour cette langue</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setEditingItem(null)
                  setIsDialogOpen(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer le premier élément
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {items.map((item) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      onEdit={(item) => {
                        setEditingItem(item)
                        setIsDialogOpen(true)
                      }}
                      onDelete={handleDelete}
                      onToggleActive={handleToggleActive}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* Dialog d'édition */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingItem ? "Modifier" : "Ajouter"} un élément
            </DialogTitle>
          </DialogHeader>
          <ContentEditForm
            item={editingItem}
            onSave={handleSave}
            onCancel={() => setIsDialogOpen(false)}
            contentType={contentType}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Formulaire d'édition
function ContentEditForm({
  item,
  onSave,
  onCancel,
  contentType,
}: {
  item: ContentItem | null
  onSave: (data: Partial<ContentItem>) => void
  onCancel: () => void
  contentType: string
}) {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    content: item?.content || "",
    image_url: item?.image_url || "",
    metadata: item?.metadata || {},
  })
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", contentType)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (data.url) {
        setFormData((prev) => ({ ...prev, image_url: data.url }))
      }
    } catch (error) {
      console.error("[v0] Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-white">Titre</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="bg-white/5 border-white/10"
        />
      </div>

      <div>
        <Label className="text-white">Contenu</Label>
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={6}
          className="bg-white/5 border-white/10"
        />
      </div>

      <div>
        <Label className="text-white">Image</Label>
        <div className="flex items-center gap-4">
          <Input
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="URL de l'image"
            className="bg-white/5 border-white/10 flex-1"
          />
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button variant="outline" disabled={uploading} asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Upload..." : "Upload"}
              </span>
            </Button>
          </label>
        </div>
        {formData.image_url && (
          <img
            src={formData.image_url}
            alt="Preview"
            className="mt-2 max-h-32 rounded-lg"
          />
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button
          onClick={() => onSave(formData)}
          className="bg-gradient-to-r from-cyan-500 to-rose-500"
        >
          <Save className="w-4 h-4 mr-2" />
          Enregistrer
        </Button>
      </div>
    </div>
  )
}

export default ContentManager
