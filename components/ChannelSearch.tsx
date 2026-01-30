"use client"

import { useState, useEffect } from "react"
import { Search, X } from "@/lib/icons"
import { useLanguage } from "@/lib/i18n/LanguageContext"

interface Channel {
  id: string
  name: string
  logo_url: string
  category: string
}

export function ChannelSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    if (isOpen && channels.length === 0) {
      fetchChannels()
    }
  }, [isOpen])

  const fetchChannels = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/channels")
      const data = await response.json()
      setChannels(data.channels || [])
    } catch (error) {
      console.error("[v0] Error fetching channels:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredChannels = channels.filter((channel) => channel.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:inline">{t.search?.placeholder || "Rechercher une chaîne"}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-2xl bg-[#0a0d2c] rounded-2xl shadow-2xl border border-white/10">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-white/60" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.search?.placeholder || "Rechercher une chaîne..."}
                  className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5 text-white/60" />
                </button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-4">
              {loading ? (
                <p className="text-center text-white/60 py-8">Chargement...</p>
              ) : filteredChannels.length > 0 ? (
                <div className="space-y-2">
                  {filteredChannels.map((channel) => (
                    <button
                      key={channel.id}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      <img
                        src={channel.logo_url || "/placeholder.svg"}
                        alt={channel.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <div>
                        <p className="text-white font-medium">{channel.name}</p>
                        <p className="text-white/60 text-sm">{channel.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-white/60 py-8">{t.search?.noResults || "Aucun résultat trouvé"}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
