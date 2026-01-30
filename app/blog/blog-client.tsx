"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye, ArrowRight } from "@/lib/icons"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image: string | null
  language: string
  tags: string[]
  published_at: string
  view_count: number
}

export default function BlogClient() {
  const { language } = useLanguage()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [language])

  const loadPosts = async () => {
    try {
      const res = await fetch(`/api/blog?language=${language}`)
      const data = await res.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error("Error loading posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateReadingTime = (content: string) => {
    const wordCount = content?.split(/\s+/).length || 0
    return Math.ceil(wordCount / 200)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/5 via-background to-background border-b border-border">
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-balance">Blog VistraTV</h1>
            <p className="text-lg sm:text-xl text-muted-foreground text-pretty">
              Découvrez nos derniers articles, guides et actualités sur le streaming IPTV
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Aucun article disponible</h2>
                <p className="text-muted-foreground">Les articles seront bientôt disponibles. Revenez plus tard!</p>
              </div>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {posts[0] && (
                <Link href={`/blog/${posts[0].slug}`} className="block mb-8 sm:mb-12">
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50">
                    <div className="grid md:grid-cols-2 gap-0">
                      {posts[0].featured_image && (
                        <div className="relative h-[250px] sm:h-[300px] md:h-auto">
                          <img
                            src={posts[0].featured_image || "/placeholder.svg"}
                            alt={posts[0].title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-primary text-primary-foreground">Article vedette</Badge>
                          </div>
                        </div>
                      )}
                      <CardContent className="p-6 sm:p-8 flex flex-col justify-center">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {posts[0].tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 line-clamp-2 text-balance">
                          {posts[0].title}
                        </h2>
                        <p className="text-muted-foreground mb-4 sm:mb-6 line-clamp-3 text-base sm:text-lg">
                          {posts[0].excerpt}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(posts[0].published_at).toLocaleDateString("fr-FR")}
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            {posts[0].view_count} vues
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all text-sm sm:text-base">
                          Lire l'article
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              )}

              {/* Other Posts Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {posts.slice(1).map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border hover:border-primary/50 overflow-hidden group">
                      {post.featured_image && (
                        <div className="relative h-48 sm:h-56 overflow-hidden">
                          <img
                            src={post.featured_image || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent className="pt-5 sm:pt-6 pb-5 sm:pb-6 px-5 sm:px-6">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 2).map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs sm:text-sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground pt-3 sm:pt-4 border-t border-border">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            {new Date(post.published_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                            })}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            {post.view_count}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
