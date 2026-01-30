"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { LogOut, Menu } from "@/lib/icons"
import { useState } from "react"

export default function AdminHeader() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <header className="bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden text-white">
            <Menu className="w-6 h-6" />
          </Button>
          <h2 className="text-xl font-semibold text-white">Admin Panel</h2>
        </div>
        <Button onClick={handleLogout} disabled={isLoading} variant="ghost" className="text-white hover:bg-white/10">
          <LogOut className="w-5 h-5 mr-2" />
          {isLoading ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </header>
  )
}
