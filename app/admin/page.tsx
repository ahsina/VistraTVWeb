import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Additional logic can be added here if needed

  redirect("/admin/dashboard")
}
