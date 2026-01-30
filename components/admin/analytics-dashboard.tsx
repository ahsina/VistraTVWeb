"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Users, TrendingUp, CreditCard, Film, Tv, UserCheck, AlertCircle, Download } from "@/lib/icons"
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "@/lib/utils/date-formatter"

type AnalyticsData = {
  totalUsers: number
  activeSubscriptions: number
  totalRevenue: number
  monthlyRevenue: number
  averageRevenuePerUser: number
  conversionRate: number
  churnRate: number
  totalContent: number
  totalChannels: number
  openTickets: number
  revenueGrowth: number
  userGrowth: number
}

type ChartData = {
  date: string
  revenue: number
  users: number
  subscriptions: number
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageRevenuePerUser: 0,
    conversionRate: 0,
    churnRate: 0,
    totalContent: 0,
    totalChannels: 0,
    openTickets: 0,
    revenueGrowth: 0,
    userGrowth: 0,
  })
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [period, setPeriod] = useState("30days")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  async function fetchAnalytics() {
    try {
      setLoading(true)

      // Fetch all data in parallel
      const [usersResult, subscriptionsResult, paymentsResult, contentResult, channelsResult, ticketsResult] =
        await Promise.all([
          supabase.from("user_profiles").select("*", { count: "exact" }),
          supabase.from("subscriptions").select("*", { count: "exact" }).eq("status", "active"),
          supabase.from("payments").select("*").eq("status", "completed"),
          supabase.from("content").select("*", { count: "exact" }),
          supabase.from("channels").select("*", { count: "exact" }),
          supabase.from("support_tickets").select("*", { count: "exact" }).eq("status", "open"),
        ])

      const totalUsers = usersResult.count || 0
      const activeSubscriptions = subscriptionsResult.count || 0
      const payments = paymentsResult.data || []
      const totalContent = contentResult.count || 0
      const totalChannels = channelsResult.count || 0
      const openTickets = ticketsResult.count || 0

      // Calculate revenue
      const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)

      const firstDayOfMonth = startOfMonth(new Date())
      const monthlyRevenue = payments
        .filter((p) => new Date(p.created_at) >= firstDayOfMonth)
        .reduce((sum, p) => sum + p.amount, 0)

      // Calculate growth rates
      const lastMonth = subMonths(new Date(), 1)
      const lastMonthStart = startOfMonth(lastMonth)
      const lastMonthEnd = endOfMonth(lastMonth)

      const lastMonthRevenue = payments
        .filter((p) => {
          const date = new Date(p.created_at)
          return date >= lastMonthStart && date <= lastMonthEnd
        })
        .reduce((sum, p) => sum + p.amount, 0)

      const revenueGrowth = lastMonthRevenue > 0 ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

      // Calculate other metrics
      const averageRevenuePerUser = totalUsers > 0 ? totalRevenue / totalUsers : 0
      const conversionRate = totalUsers > 0 ? (activeSubscriptions / totalUsers) * 100 : 0

      setAnalytics({
        totalUsers,
        activeSubscriptions,
        totalRevenue,
        monthlyRevenue,
        averageRevenuePerUser,
        conversionRate,
        churnRate: 0, // Would need historical data
        totalContent,
        totalChannels,
        openTickets,
        revenueGrowth,
        userGrowth: 0, // Would need historical data
      })

      // Generate chart data
      generateChartData(payments, period)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  function generateChartData(payments: any[], periodType: string) {
    const days = periodType === "7days" ? 7 : periodType === "30days" ? 30 : 90
    const data: ChartData[] = []

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dateStr = format(date, "yyyy-MM-dd")

      const dayPayments = payments.filter((p) => format(new Date(p.created_at), "yyyy-MM-dd") === dateStr)

      data.push({
        date: format(date, "dd MMM"),
        revenue: dayPayments.reduce((sum, p) => sum + p.amount, 0),
        users: 0, // Would need to track daily signups
        subscriptions: 0, // Would need to track daily subscriptions
      })
    }

    setChartData(data)
  }

  function exportReport() {
    const reportData = [
      ["Métrique", "Valeur"],
      ["Utilisateurs Total", analytics.totalUsers.toString()],
      ["Abonnements Actifs", analytics.activeSubscriptions.toString()],
      ["Revenu Total", `${analytics.totalRevenue.toFixed(2)} MAD`],
      ["Revenu Mensuel", `${analytics.monthlyRevenue.toFixed(2)} MAD`],
      ["ARPU", `${analytics.averageRevenuePerUser.toFixed(2)} MAD`],
      ["Taux de Conversion", `${analytics.conversionRate.toFixed(2)}%`],
      ["Croissance Revenus", `${analytics.revenueGrowth.toFixed(2)}%`],
      ["Contenu Total", analytics.totalContent.toString()],
      ["Chaînes Total", analytics.totalChannels.toString()],
      ["Tickets Ouverts", analytics.openTickets.toString()],
    ]

    const csvContent = reportData.map((row) => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `rapport_analytics_${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Chargement des analytics...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-rose-400 bg-clip-text text-transparent">
            Analytics & Rapports
          </h1>
          <p className="text-muted-foreground mt-1">Vue d'ensemble des performances de la plateforme</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 derniers jours</SelectItem>
              <SelectItem value="30days">30 derniers jours</SelectItem>
              <SelectItem value="90days">90 derniers jours</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalRevenue.toFixed(2)} MAD</div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.revenueGrowth > 0 ? "+" : ""}
              {analytics.revenueGrowth.toFixed(1)}% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Total inscrits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abonnements Actifs</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground mt-1">Taux: {analytics.conversionRate.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ARPU</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageRevenuePerUser.toFixed(2)} MAD</div>
            <p className="text-xs text-muted-foreground mt-1">Revenu moyen par utilisateur</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution du Revenu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-end justify-between gap-2">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gradient-to-t from-cyan-500 to-rose-500 rounded-t-md relative group">
                  <div
                    className="w-full"
                    style={{
                      height: `${
                        chartData.length > 0 ? (data.revenue / Math.max(...chartData.map((d) => d.revenue))) * 250 : 0
                      }px`,
                    }}
                  />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border rounded px-2 py-1 text-xs whitespace-nowrap">
                    {data.revenue.toFixed(0)} MAD
                  </div>
                </div>
                <div className="text-xs text-muted-foreground transform -rotate-45 origin-top-left mt-2">
                  {data.date}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu Mensuel</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.monthlyRevenue.toFixed(2)} MAD</div>
            <p className="text-xs text-muted-foreground mt-1">Mois en cours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contenu</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalContent}</div>
            <p className="text-xs text-muted-foreground mt-1">Films et séries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chaînes Live</CardTitle>
            <Tv className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalChannels}</div>
            <p className="text-xs text-muted-foreground mt-1">Total disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Visiteurs → Abonnés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Ouverts</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.openTickets}</div>
            <p className="text-xs text-muted-foreground mt-1">Support en attente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Croissance Revenus</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.revenueGrowth > 0 ? "+" : ""}
              {analytics.revenueGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs mois dernier</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
