"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, MousePointerClick, Eye } from "@/lib/icons"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function AdvancedAnalyticsDashboard() {
  const [period, setPeriod] = useState(7)
  const [loading, setLoading] = useState(true)
  const [funnelData, setFunnelData] = useState<any[]>([])
  const [engagementData, setEngagementData] = useState<any[]>([])
  const [topPages, setTopPages] = useState<any[]>([])

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      // Fetch funnel data
      const funnelResponse = await fetch(`/api/admin/analytics/funnel?days=${period}`)
      const funnelResult = await funnelResponse.json()
      setFunnelData(funnelResult)

      // Fetch engagement data
      const engagementResponse = await fetch(`/api/admin/analytics/engagement?days=${period}`)
      const engagementResult = await engagementResponse.json()
      setEngagementData(engagementResult)

      // Fetch top pages
      const pagesResponse = await fetch(`/api/admin/analytics/pages`)
      const pagesResult = await pagesResponse.json()
      setTopPages(pagesResult)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const conversionRate =
    funnelData.length > 0
      ? (
          (funnelData.reduce((sum, d) => sum + Number.parseInt(d.completed_purchase || 0), 0) /
            funnelData.reduce((sum, d) => sum + Number.parseInt(d.viewed_pricing || 0), 0)) *
          100
        ).toFixed(2)
      : 0

  const totalSessions = engagementData.reduce((sum, d) => sum + Number.parseInt(d.total_sessions || 0), 0)
  const avgScrollDepth = (
    engagementData.reduce((sum, d) => sum + Number.parseFloat(d.avg_scroll_depth || 0), 0) / engagementData.length
  ).toFixed(1)

  const COLORS = ["#00d4ff", "#e94b87", "#3b82f6", "#8b5cf6", "#ec4899"]

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button
          variant={period === 7 ? "default" : "outline"}
          onClick={() => setPeriod(7)}
          className="bg-white/10 border-white/20"
        >
          7 jours
        </Button>
        <Button
          variant={period === 30 ? "default" : "outline"}
          onClick={() => setPeriod(30)}
          className="bg-white/10 border-white/20"
        >
          30 jours
        </Button>
        <Button
          variant={period === 90 ? "default" : "outline"}
          onClick={() => setPeriod(90)}
          className="bg-white/10 border-white/20"
        >
          90 jours
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Sessions Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalSessions}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Taux de Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{conversionRate}%</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <MousePointerClick className="w-4 h-4" />
              Scroll Moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{avgScrollDepth}%</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Pages Populaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{topPages.length}</div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-gray-400 mt-4">Chargement des analytics...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Funnel de Conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={funnelData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                    <Bar dataKey="viewed_pricing" fill="#00d4ff" name="Vues Tarifs" />
                    <Bar dataKey="clicked_subscribe" fill="#e94b87" name="Clics Abonnement" />
                    <Bar dataKey="reached_checkout" fill="#3b82f6" name="Checkout" />
                    <Bar dataKey="completed_purchase" fill="#22c55e" name="Achats" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Engagement Utilisateur</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="total_sessions" stroke="#00d4ff" name="Sessions" />
                    <Line type="monotone" dataKey="total_interactions" stroke="#e94b87" name="Interactions" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Pages les Plus Visitées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPages.slice(0, 10).map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-white font-medium">{page.page}</div>
                      <div className="text-sm text-gray-400">{page.views} vues</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white">{page.unique_sessions} sessions uniques</div>
                      {page.avg_time_on_page && (
                        <div className="text-sm text-gray-400">{page.avg_time_on_page.toFixed(0)}s moyenne</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
