"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Database, Users, CreditCard, Tv, Archive } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type ExportType = "users" | "subscriptions" | "payments" | "channels" | "full"

export default function DataExportManager() {
  const [loading, setLoading] = useState<ExportType | null>(null)
  const { toast } = useToast()

  const handleExport = async (type: ExportType) => {
    setLoading(type)
    try {
      const response = await fetch("/api/admin/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      })

      if (!response.ok) throw new Error("Export failed")

      const { data, filename } = await response.json()

      // Create download
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Export réussi",
        description: `Les données ont été exportées dans ${filename}`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les données",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const exports = [
    {
      type: "users" as ExportType,
      title: "Utilisateurs",
      description: "Exporter tous les utilisateurs et leurs profils",
      icon: Users,
    },
    {
      type: "subscriptions" as ExportType,
      title: "Abonnements",
      description: "Exporter tous les abonnements actifs et historiques",
      icon: Database,
    },
    {
      type: "payments" as ExportType,
      title: "Paiements",
      description: "Exporter toutes les transactions de paiement",
      icon: CreditCard,
    },
    {
      type: "channels" as ExportType,
      title: "Chaînes",
      description: "Exporter toutes les chaînes et leur contenu",
      icon: Tv,
    },
    {
      type: "full" as ExportType,
      title: "Backup Complet",
      description: "Exporter toutes les données de la plateforme",
      icon: Archive,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exports.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.type} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
              <Button onClick={() => handleExport(item.type)} disabled={loading !== null} className="w-full">
                {loading === item.type ? (
                  "Export en cours..."
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </>
                )}
              </Button>
            </Card>
          )
        })}
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-2">À propos des exports</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Les données sont exportées au format JSON</li>
          <li>• Les exports incluent toutes les données non sensibles</li>
          <li>• Les mots de passe ne sont jamais inclus dans les exports</li>
          <li>• Utilisez le backup complet pour sauvegarder régulièrement</li>
        </ul>
      </Card>
    </div>
  )
}
