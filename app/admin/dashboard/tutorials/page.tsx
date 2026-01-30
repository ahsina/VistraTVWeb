import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TutorialsManager } from "@/components/admin/tutorials-manager"

export default async function TutorialsPage() {
  const supabase = await createClient()

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Manage Tutorials</h1>
      <TutorialsManager />
    </div>
  )
}
