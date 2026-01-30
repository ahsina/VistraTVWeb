import type { Metadata } from "next"
import { ActivityLogManager } from "@/components/admin/activity-log-manager"

export const metadata: Metadata = {
  title: "Journal d'Activité - Admin VistraTV",
  description: "Historique des actions administrateurs",
}

export default function ActivityLogPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Journal d'Activité</h2>
        <p className="text-muted-foreground">Historique complet des actions effectuées par les administrateurs</p>
      </div>
      <ActivityLogManager />
    </div>
  )
}
