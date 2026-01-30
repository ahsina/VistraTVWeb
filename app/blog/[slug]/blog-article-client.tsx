"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import ReactMarkdown from "react-markdown"
import { Calendar, Eye, Clock, ArrowLeft, Share2, Bookmark } from "@/lib/icons"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string | null
  language: string
  tags: string[]
  published_at: string
  view_count: number
  meta_title: string
  meta_description: string
}

export default function BlogArticleClient({ slug }: { slug: string }) {
  const { language } = useLanguage()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [readingTime, setReadingTime] = useState(0)

  useEffect(() => {
    loadPost()
  }, [slug])

  const loadPost = async () => {
    try {
      const res = await fetch(`/api/blog/${slug}`)
      if (res.status === 404) {
        setNotFound(true)
        return
      }
      const data = await res.json()
      setPost(data.post)
      // Calculate reading time (average 200 words per minute)
      const wordCount = data.post.content.split(/\s+/).length
      setReadingTime(Math.ceil(wordCount / 200))
    } catch (error) {
      console.error("Error loading post:", error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 text-center py-20">
            <h1 className="text-4xl font-bold mb-4">Article non trouvé</h1>
            <p className="text-lg text-muted-foreground mb-8">Cet article n'existe pas ou n'est plus disponible.</p>
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Featured Image */}
      <div className="relative w-full bg-gradient-to-b from-muted/50 to-background">
        {post.featured_image ? (
          <div className="relative w-full h-[60vh] max-h-[600px]">
            <img
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
          </div>
        ) : (
          <div className="w-full h-[40vh] max-h-[400px] bg-gradient-to-br from-primary/10 via-primary/5 to-background"></div>
        )}
        
        {/* Article Header Overlay */}
        <div className="container mx-auto px-4 max-w-4xl relative -mt-32">
          <div className="bg-card rounded-2xl shadow-xl border border-border p-8 md:p-12">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-sm px-3 py-1">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-balance">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed text-pretty">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.published_at).toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime} min de lecture</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.view_count} vues</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-6">
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Share2 className="w-4 h-4" />
                Partager
              </button>
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Bookmark className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <main className="flex-1 py-12">
        <article className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-4xl font-bold mt-12 mb-6 text-foreground border-b border-border pb-4">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-3xl font-bold mt-10 mb-4 text-foreground">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-2xl font-semibold mt-8 mb-3 text-foreground">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-xl font-semibold mt-6 mb-2 text-foreground">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="mb-6 leading-relaxed text-lg text-foreground/90">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-outside ml-6 mb-6 space-y-3 text-lg">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-outside ml-6 mb-6 space-y-3 text-lg">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="pl-2 text-foreground/90">
                    {children}
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary bg-muted/50 pl-6 pr-4 py-4 italic my-8 rounded-r-lg">
                    <div className="text-lg text-foreground/80">{children}</div>
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-muted px-2 py-0.5 rounded text-sm font-mono text-primary border border-border">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-muted/50 p-6 rounded-xl overflow-x-auto my-8 border border-border shadow-sm">
                    <code className="text-sm font-mono">{children}</code>
                  </pre>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-8 rounded-xl border border-border shadow-sm">
                    <table className="min-w-full divide-y divide-border">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-muted/50">{children}</thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="divide-y divide-border bg-card">{children}</tbody>
                ),
                tr: ({ children }) => (
                  <tr className="transition-colors hover:bg-muted/30">{children}</tr>
                ),
                th: ({ children }) => (
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-6 py-4 text-sm text-foreground/80">{children}</td>
                ),
                a: ({ children, href }) => (
                  <a 
                    href={href} 
                    className="text-primary hover:text-primary/80 underline underline-offset-4 decoration-2 transition-colors font-medium" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => (
                  <figure className="my-10">
                    <img 
                      src={src || "/placeholder.svg"} 
                      alt={alt || ""} 
                      className="w-full rounded-2xl shadow-lg border border-border" 
                    />
                    {alt && (
                      <figcaption className="text-center text-sm text-muted-foreground mt-3 italic">
                        {alt}
                      </figcaption>
                    )}
                  </figure>
                ),
                hr: () => (
                  <hr className="my-12 border-t-2 border-border" />
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-foreground">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-foreground/90">{children}</em>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Article Footer */}
          <div className="mt-16 pt-8 border-t-2 border-border">
            <div className="flex items-center justify-between">
              <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour au blog
              </Link>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Partager</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  )
}
