"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Play } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LoadingSpinner from "@/components/ui/loading"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

interface Channel {
  id: string
  name: string
  logo: string
  category: string
  quality: string
  viewers: number
}

export default function BrowseChannelsClientPage() {
  const { t } = useLanguage()
  const [channels, setChannels] = useState<Channel[]>([])
  const [filteredChannels, setFilteredChannels] = useState<Channel[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchChannels()
  }, [])

  useEffect(() => {
    filterChannels()
  }, [searchQuery, selectedCategory, channels])

  const fetchChannels = async () => {
    try {
      const response = await fetch("/api/channels")
      const data = await response.json()
      setChannels(data)
      setFilteredChannels(data)
    } catch (error) {
      console.error("Error fetching channels:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterChannels = () => {
    let filtered = channels

    if (searchQuery) {
      filtered = filtered.filter((channel) => channel.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((channel) => channel.category === selectedCategory)
    }

    setFilteredChannels(filtered)
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
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 text-balance">
              {t.browse.channelsTitle}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 text-pretty">{t.browse.channelsSubtitle}</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 sm:mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder={t.browse.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-500"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.browse.allCategories}</SelectItem>
                <SelectItem value="sports">{t.channelShowcase.categories.sports}</SelectItem>
                <SelectItem value="cinema">{t.channelShowcase.categories.cinema}</SelectItem>
                <SelectItem value="series">{t.channelShowcase.categories.series}</SelectItem>
                <SelectItem value="documentary">{t.channelShowcase.categories.documentary}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-gray-300">
            {t.browse.resultsCount.replace("{count}", filteredChannels.length.toString())}
          </div>

          {/* Channels Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredChannels.map((channel) => (
              <Card
                key={channel.id}
                className="group bg-white/5 backdrop-blur-sm border-white/10 hover:border-[#00d4ff]/50 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
              >
                <div className="aspect-square bg-gradient-to-br from-[#00d4ff]/20 to-[#e94b87]/20 flex items-center justify-center p-6 relative">
                  <img
                    src={channel.logo || "/placeholder.svg?height=100&width=100"}
                    alt={channel.name}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
                      <Play className="w-4 h-4 mr-2" />
                      {t.browse.watch}
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold text-sm mb-1 truncate">{channel.name}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="px-2 py-1 bg-[#00d4ff]/20 rounded text-[#00d4ff]">{channel.quality}</span>
                    <span>{channel.viewers?.toLocaleString()} viewers</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredChannels.length === 0 && (
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
