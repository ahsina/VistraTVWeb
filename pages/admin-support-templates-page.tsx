// app/admin/dashboard/support/templates/page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SupportResponseTemplates } from "@/components/admin/support-response-templates"

export default async function SupportTemplatesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return (
    <div className="p-8">
      <SupportResponseTemplates />
    </div>
  )
}
