import type { Metadata } from "next"
import DataExportManager from "@/components/admin/data-export-manager"

export const metadata: Metadata = {
  title: "Export de Données - Admin VistraTV",
  description: "Exporter et sauvegarder les données de la plateforme",
}

export default function DataExportPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Export de Données</h1>
      <DataExportManager />
    </div>
  )
}
