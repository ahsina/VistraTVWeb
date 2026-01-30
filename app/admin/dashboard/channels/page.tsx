import { createClient } from "@/lib/supabase/server"
import ChannelsManager from "@/components/admin/channels-manager"
import { redirect } from "next/navigation"

export default async function ChannelsPage() {
  const supabase = await createClient()

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Fetch channels
  const { data: channels, error } = await supabase
    .from("channels")
    .select("*")
    .order("display_order", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching channels:", error)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Manage Channels</h1>
      <ChannelsManager initialData={channels || []} />
    </div>
  )
}
