// components/admin/blog-editor.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Eye,
  Save,
  Clock,
  Globe,
  Search,
  X,
  Plus,
} from "lucide-react"

interface BlogPost {
  id?: string
  slug: string
  title: string
  excerpt: string
  content: string
  featured_image: string
  category: string
  tags: string[]
  language: string
  status: "draft" | "published" | "scheduled"
  published_at: string | null
  scheduled_at: string | null
  meta_title: string
  meta_description: string
}

interface BlogEditorProps {
  postId?: string
  onSave?: (post: BlogPost) => void
}

const categories = [
  "Actualités",
  "Tutoriels",
  "Guides",
  "Nouveautés",
  "Offres",
  "Tech",
]

const languages = [
  { code: "fr", name: "Français" },
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
  { code: "es", name: "Español" },
  { code: "it", name: "Italiano" },
]

export function BlogEditor({ postId, onSave }: BlogEditorProps) {
  const [post, setPost] = useState<BlogPost>({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    featured_image: "",
    category: "Actualités",
    tags: [],
    language: "fr",
    status: "draft",
    published_at: null,
    scheduled_at: null,
    meta_title: "",
    meta_description: "",
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [autoSlug, setAutoSlug] = useState(true)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (postId) {
      fetchPost()
    }
  }, [postId])

  // Génération automatique du slug
  useEffect(() => {
    if (autoSlug && !postId) {
      const slug = post.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
      setPost((prev) => ({ ...prev, slug }))
    }
  }, [post.title, autoSlug, postId])

  async function fetchPost() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", postId)
        .single()

      if (error) throw error
      if (data) {
        setPost(data)
        setAutoSlug(false)
      }
    } catch (error) {
      console.error("[v0] Error fetching post:", error)
    } finally {
      setLoading(false)
    }
  }

  async function savePost(publish: boolean = false) {
    try {
      setSaving(true)

      const postData = {
        ...post,
        status: publish ? "published" : post.status,
        published_at: publish ? new Date().toISOString() : post.published_at,
        updated_at: new Date().toISOString(),
      }

      if (postId) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", postId)

        if (error) throw error
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        const { data, error } = await supabase
          .from("blog_posts")
          .insert({
            ...postData,
            author_id: user?.id,
          })
          .select()
          .single()

        if (error) throw error
        if (data) {
          router.push(`/admin/dashboard/blog/edit/${data.id}`)
        }
      }

      onSave?.(postData)
    } catch (error) {
      console.error("[v0] Error saving post:", error)
    } finally {
      setSaving(false)
    }
  }

  const addTag = () => {
    if (newTag && !post.tags.includes(newTag)) {
      setPost((prev) => ({ ...prev, tags: [...prev.tags, newTag] }))
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setPost((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }

  // Toolbar actions
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
  }

  const insertImage = () => {
    const url = prompt("URL de l'image:")
    if (url) {
      setPost((prev) => ({
        ...prev,
        content: prev.content + `\n![Image](${url})\n`,
      }))
    }
  }

  const insertLink = () => {
    const url = prompt("URL du lien:")
    const text = prompt("Texte du lien:")
    if (url && text) {
      setPost((prev) => ({
        ...prev,
        content: prev.content + `[${text}](${url})`,
      }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {postId ? "Modifier l'article" : "Nouvel article"}
          </h1>
          <p className="text-gray-400">
            {post.status === "draft" ? "Brouillon" : post.status === "published" ? "Publié" : "Programmé"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setPreview(!preview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {preview ? "Éditer" : "Aperçu"}
          </Button>
          <Button
            variant="outline"
            onClick={() => savePost(false)}
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
          <Button
            onClick={() => savePost(true)}
            disabled={saving}
            className="bg-gradient-to-r from-cyan-500 to-rose-500"
          >
            {post.status === "published" ? "Mettre à jour" : "Publier"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Titre */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <Input
                value={post.title}
                onChange={(e) => setPost((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Titre de l'article..."
                className="text-2xl font-bold bg-transparent border-0 focus-visible:ring-0 text-white placeholder:text-gray-500 p-0"
              />
            </CardContent>
          </Card>

          {/* Éditeur */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="border-b border-white/10 py-2">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => execCommand("bold")} className="h-8 w-8">
                  <Bold className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => execCommand("italic")} className="h-8 w-8">
                  <Italic className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => execCommand("underline")} className="h-8 w-8">
                  <Underline className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-white/20 mx-1" />
                <Button variant="ghost" size="icon" onClick={() => execCommand("formatBlock", "h1")} className="h-8 w-8">
                  <Heading1 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => execCommand("formatBlock", "h2")} className="h-8 w-8">
                  <Heading2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => execCommand("formatBlock", "h3")} className="h-8 w-8">
                  <Heading3 className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-white/20 mx-1" />
                <Button variant="ghost" size="icon" onClick={() => execCommand("insertUnorderedList")} className="h-8 w-8">
                  <List className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => execCommand("insertOrderedList")} className="h-8 w-8">
                  <ListOrdered className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => execCommand("formatBlock", "blockquote")} className="h-8 w-8">
                  <Quote className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-white/20 mx-1" />
                <Button variant="ghost" size="icon" onClick={insertLink} className="h-8 w-8">
                  <Link className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={insertImage} className="h-8 w-8">
                  <Image className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => execCommand("formatBlock", "pre")} className="h-8 w-8">
                  <Code className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {preview ? (
                <div
                  className="prose prose-invert max-w-none p-6 min-h-[400px]"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <Textarea
                  value={post.content}
                  onChange={(e) => setPost((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Commencez à écrire votre article... (Markdown supporté)"
                  className="min-h-[400px] bg-transparent border-0 focus-visible:ring-0 text-white placeholder:text-gray-500 resize-none p-6"
                />
              )}
            </CardContent>
          </Card>

          {/* Extrait */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Extrait</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={post.excerpt}
                onChange={(e) => setPost((prev) => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Résumé de l'article (affiché dans les listes)..."
                rows={3}
                className="bg-white/5 border-white/10"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Paramètres */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Paramètres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Slug */}
              <div>
                <Label className="text-white">URL (slug)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={post.slug}
                    onChange={(e) => {
                      setAutoSlug(false)
                      setPost((prev) => ({ ...prev, slug: e.target.value }))
                    }}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  /blog/{post.slug || "..."}
                </p>
              </div>

              {/* Catégorie */}
              <div>
                <Label className="text-white">Catégorie</Label>
                <Select
                  value={post.category}
                  onValueChange={(value) => setPost((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Langue */}
              <div>
                <Label className="text-white">Langue</Label>
                <Select
                  value={post.language}
                  onValueChange={(value) => setPost((prev) => ({ ...prev, language: value }))}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div>
                <Label className="text-white">Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-white/10">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-1">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nouveau tag..."
                    className="bg-white/5 border-white/10"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button variant="outline" size="icon" onClick={addTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image mise en avant */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Image mise en avant</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={post.featured_image}
                onChange={(e) => setPost((prev) => ({ ...prev, featured_image: e.target.value }))}
                placeholder="URL de l'image..."
                className="bg-white/5 border-white/10"
              />
              {post.featured_image && (
                <img
                  src={post.featured_image}
                  alt="Preview"
                  className="mt-2 rounded-lg max-h-40 object-cover w-full"
                />
              )}
            </CardContent>
          </Card>

          {/* SEO */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Search className="w-5 h-5" />
                SEO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Titre SEO</Label>
                <Input
                  value={post.meta_title}
                  onChange={(e) => setPost((prev) => ({ ...prev, meta_title: e.target.value }))}
                  placeholder={post.title || "Titre pour les moteurs de recherche"}
                  className="bg-white/5 border-white/10"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {(post.meta_title || post.title).length}/60 caractères
                </p>
              </div>
              <div>
                <Label className="text-white">Meta description</Label>
                <Textarea
                  value={post.meta_description}
                  onChange={(e) => setPost((prev) => ({ ...prev, meta_description: e.target.value }))}
                  placeholder={post.excerpt || "Description pour les moteurs de recherche"}
                  rows={3}
                  className="bg-white/5 border-white/10"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {(post.meta_description || post.excerpt).length}/160 caractères
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Programmation */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Programmation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Date de publication</Label>
                <Input
                  type="datetime-local"
                  value={post.scheduled_at?.substring(0, 16) || ""}
                  onChange={(e) => setPost((prev) => ({
                    ...prev,
                    scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : null,
                    status: e.target.value ? "scheduled" : prev.status,
                  }))}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BlogEditor
