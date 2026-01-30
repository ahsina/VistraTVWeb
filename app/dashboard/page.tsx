import { DashboardClientPage } from "@/components/dashboard/DashboardClientPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tableau de Bord - VistraTV",
  description: "Accédez à votre tableau de bord VistraTV",
}

export default function DashboardPage() {
  return <DashboardClientPage />
}
