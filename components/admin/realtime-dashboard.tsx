"use client"

import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Users, TrendingUp, DollarSign, ShoppingCart, AlertCircle } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function RealtimeDashboard() {
  const { data, error, mutate } = useSWR("/api/admin/dashboard-stats", fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  })

  useEffect(() => {
    // Initial fetch
    mutate()
  }, [mutate])

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p>Erreur de chargement des statistiques</p>
        </div>
      </Card>
    )
  }

  if (!data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-20 bg-muted rounded" />
          </Card>
        ))}
      </div>
    )
  }

  const stats = [
    {
      title: "Utilisateurs Totaux",
      value: data.totalUsers?.toLocaleString() || "0",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Abonnements Actifs",
      value: data.activeSubscriptions?.toLocaleString() || "0",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "Revenu Total",
      value: `${data.totalRevenue?.toFixed(2) || "0"} USD`,
      icon: DollarSign,
      color: "text-yellow-500",
    },
    {
      title: "Revenu Aujourd'hui",
      value: `${data.todayRevenue?.toFixed(2) || "0"} USD`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Paiements en Attente",
      value: data.pendingPayments?.toLocaleString() || "0",
      icon: AlertCircle,
      color: "text-orange-500",
    },
    {
      title: "Paniers Abandonnés",
      value: data.abandonedCarts?.toLocaleString() || "0",
      icon: ShoppingCart,
      color: "text-red-500",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tableau de Bord Temps Réel</h2>
        <p className="text-sm text-muted-foreground">
          Dernière mise à jour: {new Date(data.lastUpdated).toLocaleTimeString()}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 bg-muted rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
