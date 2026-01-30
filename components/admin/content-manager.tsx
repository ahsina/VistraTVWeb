"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Film } from "@/lib/icons"
import AddContentDialog from "./add-content-dialog"

interface Content {
  id: string
  title: string
  description: string | null
  type: string
  category: string | null
  language: string
  poster_url: string | null
  video_url: string | null
  duration_minutes: number | null
  release_year: number | null
  rating: number | null
  is_active: boolean
  created_at: string
  display_order: number
}

interface ContentManagerProps {
  initialData: Content[]
}

interface ContentGroup {
  id: string
  translations: Record<string, Content>
  type: string
  category: string | null
  poster: string | null
  video_url: string | null
  duration: string | null
  year: number | null
  rating: number | null
  is_active: boolean
  display_order: number
}

const languages = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
]

export default function ContentManager({ initialData }: ContentManagerProps) {
  const [content, setContent] = useState<Content[]>(initialData)
  const [contentGroups, setContentGroups] = useState<ContentGroup[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingContentGroup, setEditingContentGroup] = useState<ContentGroup | null>(null)

  useEffect(() => {
    const grouped: Record<string, ContentGroup> = {}

    content.forEach((item) => {
      const groupKey = `${item.poster_url}-${item.video_url}-${item.display_order}`
      if (!grouped[groupKey]) {
        grouped[groupKey] = {
          id: groupKey,
          translations: {},
          type: item.type,
          category: item.category,
          poster: item.poster_url,
          video_url: item.video_url,
          duration: item.duration_minutes ? `${item.duration_minutes} min` : null,
          year: item.release_year,
          rating: item.rating,
          is_active: item.is_active,
          display_order: item.display_order,
        }
      }
      grouped[groupKey].translations[item.language] = item
    })

    setContentGroups(Object.values(grouped).sort((a, b) => a.display_order - b.display_order))
  }, [content])

  const handleDelete = async (group: ContentGroup) => {
    if (!confirm("Are you sure you want to delete this content in all languages?")) return

    try {
      const ids = Object.values(group.translations).map((t) => t.id)
      await Promise.all(ids.map((id) => fetch(`/api/admin/content/${id}`, { method: "DELETE" })))

      // Refresh content
      const response = await fetch("/api/admin/content")
      const data = await response.json()
      setContent(data)
    } catch (error) {
      console.error("Error deleting content:", error)
    }
  }

  const handleEdit = (group: ContentGroup) => {
    setEditingContentGroup(group)
    setIsAddDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsAddDialogOpen(false)
    setEditingContentGroup(null)
  }

  const handleContentAdded = async () => {
    // Refresh content list
    const response = await fetch("/api/admin/content")
    const data = await response.json()
    setContent(data)
    handleDialogClose()
  }

  const getCompletionStatus = (group: ContentGroup) => {
    const completed = languages.filter((lang) => group.translations[lang.code]).length
    return { completed, total: languages.length }
  }

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      movie: "bg-blue-500/20 text-blue-400",
      series: "bg-purple-500/20 text-purple-400",
      vod: "bg-green-500/20 text-green-400",
    }
    return colors[type] || "bg-gray-500/20 text-gray-400"
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="all">All Types</option>
            <option value="movie">Movies</option>
            <option value="series">Series</option>
            <option value="vod">VOD</option>
          </select>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Content
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="text-sm text-gray-400">Total Content</div>
          <div className="text-2xl font-bold text-white mt-1">{content.length}</div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="text-sm text-gray-400">Movies</div>
          <div className="text-2xl font-bold text-white mt-1">{content.filter((c) => c.type === "movie").length}</div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="text-sm text-gray-400">Series</div>
          <div className="text-2xl font-bold text-white mt-1">{content.filter((c) => c.type === "series").length}</div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="text-sm text-gray-400">Active</div>
          <div className="text-2xl font-bold text-white mt-1">{content.filter((c) => c.is_active).length}</div>
        </Card>
      </div>

      {/* Content Table */}
      <Card className="bg-white/5 border-white/10">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-gray-400">Poster</TableHead>
              <TableHead className="text-gray-400">Title</TableHead>
              <TableHead className="text-gray-400">Languages</TableHead>
              <TableHead className="text-gray-400">Type</TableHead>
              <TableHead className="text-gray-400">Year</TableHead>
              <TableHead className="text-gray-400">Rating</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contentGroups.map((group) => {
              const status = getCompletionStatus(group)
              const primaryTranslation =
                group.translations.fr || group.translations.en || Object.values(group.translations)[0]

              return (
                <TableRow key={group.id} className="border-white/10 hover:bg-white/5">
                  <TableCell>
                    <div className="w-12 h-16 bg-white/10 rounded overflow-hidden flex items-center justify-center">
                      {group.poster ? (
                        <img
                          src={group.poster || "/placeholder.svg"}
                          alt={primaryTranslation?.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Film className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-white font-medium">{primaryTranslation?.title}</div>
                      {primaryTranslation?.description && (
                        <div className="text-sm text-gray-400 truncate max-w-xs">{primaryTranslation.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {languages.map((lang) => (
                        <Badge
                          key={lang.code}
                          variant={group.translations[lang.code] ? "default" : "outline"}
                          className={
                            group.translations[lang.code]
                              ? "bg-green-500/20 text-green-400 text-xs"
                              : "bg-gray-500/20 text-gray-500 text-xs"
                          }
                        >
                          {lang.flag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {status.completed}/{status.total}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeBadge(group.type)}>{group.type}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{group.year || "-"}</TableCell>
                  <TableCell className="text-gray-300">{group.rating ? `${group.rating}/10` : "-"}</TableCell>
                  <TableCell>
                    <Badge
                      className={group.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}
                    >
                      {group.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(group)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(group)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {contentGroups.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Film className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No content found</p>
          </div>
        )}
      </Card>

      <AddContentDialog
        open={isAddDialogOpen}
        onOpenChange={handleDialogClose}
        onContentAdded={handleContentAdded}
        editingContentGroup={editingContentGroup}
      />
    </div>
  )
}
