"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Save, Eye, Trash2, RefreshCw, Send, Image as ImageIcon, Table } from "@/lib/icons"
import Link from "next/link"
import ReactMarkdown from "react-markdown"

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  language: string
  status: string
  tags: string[]
  created_at: string
  published_at: string | null
  view_count: number
  admin_profiles?: {
    full_name: string
  }
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  // État pour la création
  const [prompt, setPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [language, setLanguage] = useState("fr")
  const [editMode, setEditMode] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [generatingImage, setGeneratingImage] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const res = await fetch("/api/admin/blog")
      const data = await res.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error("Error loading posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateContent = async () => {
    if (!prompt.trim()) return

    setGenerating(true)
    try {
      const res = await fetch("/api/admin/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, language }),
      })

      const data = await res.json()

      if (data.success) {
        setGeneratedContent(data.content)
        setTitle(data.title)
        setExcerpt(data.excerpt)
        setTags(data.tags)
        setEditMode(true)
      } else {
        alert("Erreur: " + data.error)
      }
    } catch (error) {
      console.error("Error generating content:", error)
      alert("Erreur lors de la génération")
    } finally {
      setGenerating(false)
    }
  }

  const savePost = async (status: "draft" | "published") => {
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: generatedContent,
          excerpt,
          tags,
          language,
          status,
          meta_title: title,
          meta_description: excerpt,
        }),
      })

      const data = await res.json()

      if (data.post) {
        alert(`Article ${status === "published" ? "publié" : "sauvegardé"} avec succès!`)
        loadPosts()
        resetForm()
      }
    } catch (error) {
      console.error("Error saving post:", error)
      alert("Erreur lors de la sauvegarde")
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article?")) return

    try {
      await fetch(`/api/admin/blog/${id}`, { method: "DELETE" })
      loadPosts()
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const resetForm = () => {
    setPrompt("")
    setGeneratedContent("")
    setTitle("")
    setExcerpt("")
    setTags([])
    setEditMode(false)
  }

  const insertTable = () => {
    const tableMarkdown = `

| Colonne 1 | Colonne 2 | Colonne 3 |
|-----------|-----------|-----------|
| Donnée 1  | Donnée 2  | Donnée 3  |
| Donnée 4  | Donnée 5  | Donnée 6  |

`
    setGeneratedContent(generatedContent + tableMarkdown)
  }

  const generateImage = async () => {
    const imagePrompt = prompt(`Décrivez l'image que vous souhaitez générer:`)
    if (!imagePrompt) return

    setGeneratingImage(true)
    try {
      // TODO: Implémenter la génération d'image avec une API comme DALL-E ou Stable Diffusion
      alert("Génération d'images à venir prochainement!")
    } finally {
      setGeneratingImage(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion du Blog</h1>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList>
          <TabsTrigger value="create">
            <Sparkles className="w-4 h-4 mr-2" />
            Créer avec IA
          </TabsTrigger>
          <TabsTrigger value="posts">Articles ({posts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          {!editMode ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Générer un article avec l'IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Langue</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="it">Italiano</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="he">עברית</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Décrivez le sujet de l'article</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: Écris un article sur les avantages de l'IPTV par rapport à la télévision traditionnelle..."
                    rows={4}
                  />
                </div>

                <Button onClick={generateContent} disabled={generating || !prompt.trim()} className="w-full" size="lg">
                  {generating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Générer l'article
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contenu généré - Modifier avant publication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Titre</label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Extrait (résumé)</label>
                    <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">Contenu (Markdown)</label>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={insertTable}>
                          <Table className="w-4 h-4 mr-1" />
                          Insérer tableau
                        </Button>
                        <Button size="sm" variant="outline" onClick={generateImage} disabled={generatingImage}>
                          <ImageIcon className="w-4 h-4 mr-1" />
                          {generatingImage ? "Génération..." : "Générer image"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowPreview(!showPreview)}>
                          <Eye className="w-4 h-4 mr-1" />
                          {showPreview ? "Édition" : "Prévisualisation"}
                        </Button>
                      </div>
                    </div>

                    {showPreview ? (
                      <div className="border rounded-md p-4 bg-background min-h-[500px] prose prose-sm max-w-none">
                        <ReactMarkdown>{generatedContent}</ReactMarkdown>
                      </div>
                    ) : (
                      <Textarea
                        value={generatedContent}
                        onChange={(e) => setGeneratedContent(e.target.value)}
                        rows={20}
                        className="font-mono text-sm"
                        placeholder="# Titre de l'article

Votre contenu en markdown...

## Section 1

Texte avec **gras** et *italique*

- Liste à puces
- Item 2

## Section 2

| Colonne 1 | Colonne 2 |
|-----------|-----------|
| Donnée    | Donnée    |
"
                      />
                    )}

                    <details className="text-xs text-muted-foreground">
                      <summary className="cursor-pointer">Aide Markdown</summary>
                      <div className="mt-2 space-y-1">
                        <p>
                          <code># Titre</code> - Titre principal
                        </p>
                        <p>
                          <code>## Sous-titre</code> - Sous-titre
                        </p>
                        <p>
                          <code>**gras**</code> - Texte en gras
                        </p>
                        <p>
                          <code>*italique*</code> - Texte en italique
                        </p>
                        <p>
                          <code>- item</code> - Liste à puces
                        </p>
                        <p>
                          <code>[lien](url)</code> - Lien hypertexte
                        </p>
                        <p>
                          <code>![alt](url)</code> - Image
                        </p>
                      </div>
                    </details>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => savePost("draft")} variant="outline">
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder brouillon
                    </Button>
                    <Button onClick={() => savePost("published")}>
                      <Send className="w-4 h-4 mr-2" />
                      Publier maintenant
                    </Button>
                    <Button onClick={resetForm} variant="ghost">
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="posts">
          {loading ? (
            <div className="text-center py-12">Chargement...</div>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Aucun article pour le moment</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{post.title}</h3>
                          <Badge variant={post.status === "published" ? "default" : "secondary"}>{post.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{post.excerpt?.substring(0, 150)}...</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          <span>{post.language.toUpperCase()}</span>
                          <span>{post.view_count} vues</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/blog/${post.slug}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deletePost(post.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
