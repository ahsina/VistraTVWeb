"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Play, Star } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoadingSpinner from "@/components/ui/loading"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

interface Content {
  id: string
  title: string
  poster: string
  type: "movie" | "series"
  genre: string
  year: number
  rating: number
  duration?: string
  seasons?: number
}

export default function BrowseContentPage() {
  const { t } = useLanguage()
  const [content, setContent] = useState<Content[]>([])
  const [filteredContent, setFilteredContent] = useState<Content[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [contentType, setContentType] = useState<"all" | "movie" | "series">("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  useEffect(() => {
    filterContent()
  }, [searchQuery, selectedGenre, contentType, content])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/admin/content")
      const data = await response.json()
      setContent(data)
      setFilteredContent(data)
    } catch (error) {
      console.error("Error fetching content:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterContent = () => {
    let filtered = content

    if (contentType !== "all") {
      filtered = filtered.filter((item) => item.type === contentType)
    }

    if (searchQuery) {
      filtered = filtered.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (selectedGenre !== "all") {
      filtered = filtered.filter((item) => item.genre === selectedGenre)
    }

    setFilteredContent(filtered)
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-4 text-balance">
              {t.browse.contentTitle}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 text-pretty">{t.browse.contentSubtitle}</p>
          </div>

          <Tabs value={contentType} onValueChange={(v) => setContentType(v as any)} className="mb-6 sm:mb-8">
            <TabsList className="bg-white/10 border-white/20 w-full sm:w-auto">
              <TabsTrigger value="all" className="text-sm sm:text-base">
                {t.browse.all}
              </TabsTrigger>
              <TabsTrigger value="movie" className="text-sm sm:text-base">
                {t.browse.movies}
              </TabsTrigger>
              <TabsTrigger value="series" className="text-sm sm:text-base">
                {t.browse.series}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <Input
                type="text"
                placeholder={t.browse.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-500 text-sm sm:text-base"
              />
            </div>

            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-full sm:w-auto sm:min-w-[180px] bg-white/10 border-white/20 text-white text-sm sm:text-base">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.browse.allGenres}</SelectItem>
                <SelectItem value="action">{t.browse.genres.action}</SelectItem>
                <SelectItem value="comedy">{t.browse.genres.comedy}</SelectItem>
                <SelectItem value="drama">{t.browse.genres.drama}</SelectItem>
                <SelectItem value="thriller">{t.browse.genres.thriller}</SelectItem>
                <SelectItem value="scifi">{t.browse.genres.scifi}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-300">
            {t.browse.resultsCount.replace("{count}", filteredContent.length.toString())}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {filteredContent.map((item) => (
              <Card
                key={item.id}
                className="group bg-white/5 backdrop-blur-sm border-white/10 hover:border-[#00d4ff]/50 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
              >
                <div className="aspect-[2/3] bg-gradient-to-br from-[#00d4ff]/20 to-[#e94b87]/20 relative overflow-hidden">
                  <img
                    src={item.poster || `/placeholder.svg?height=450&width=300&query=${item.title}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-4">
                    <Button size="sm" className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87] mb-2">
                      <Play className="w-4 h-4 mr-2" />
                      {t.browse.watch}
                    </Button>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 rounded text-xs text-white">
                    {item.type === "movie" ? t.latestReleases.movie : t.latestReleases.series}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold text-sm sm:text-base mb-1 sm:mb-2 truncate">{item.title}</h3>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400">
                    <span>{item.year}</span>
                    <span>{item.type === "movie" ? item.duration : `${item.seasons} seasons`}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredContent.length === 0 && (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-400">{t.browse.noResults}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
