// components/admin/admin-header.tsx
// VERSION CORRIGÉE avec GlobalSearch et NotificationCenter intégrés
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { LogOut, Menu, Search, Bell } from "lucide-react"
import { GlobalSearch, useGlobalSearchShortcut } from "@/components/admin/global-search"
import { NotificationCenter } from "@/components/notifications/notification-center"

export default function AdminHeader() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Hook pour ouvrir la recherche avec Cmd+K
  useGlobalSearchShortcut(() => setSearchOpen(true))

  const handleLogout = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <>
      <header className="bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Menu mobile + Title */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden text-white">
              <Menu className="w-6 h-6" />
            </Button>
            <h2 className="text-xl font-semibold text-white">Admin Panel</h2>
          </div>

          {/* Right side - Search, Notifications, Logout */}
          <div className="flex items-center gap-2">
            {/* Bouton recherche globale */}
            <Button
              variant="ghost"
              onClick={() => setSearchOpen(true)}
              className="text-gray-400 hover:text-white hover:bg-white/10 gap-2"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Rechercher...</span>
              <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-white/20 bg-white/5 px-1.5 font-mono text-[10px] text-gray-400">
                ⌘K
              </kbd>
            </Button>

            {/* Centre de notifications */}
            <NotificationCenter isAdmin={true} />

            {/* Bouton logout */}
            <Button 
              onClick={handleLogout} 
              disabled={isLoading} 
              variant="ghost" 
              className="text-white hover:bg-white/10"
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">
                {isLoading ? "Déconnexion..." : "Déconnexion"}
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Dialog de recherche globale */}
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}