"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, DollarSign, Users, CreditCard } from "@/lib/icons"
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

export default function RevenueAnalytics() {
  const [data, setData] = useState<any[]>([])
  const [period, setPeriod] = useState(30)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [period])

  const fetchData = async () => {
    setLoading(true)
    const response = await fetch(`/api/admin/analytics/revenue?days=${period}`)
    const result = await response.json()
    setData(result)
    setLoading(false)
  }

  const totalRevenue = data.reduce((sum, d) => sum + Number.parseFloat(d.total_revenue || 0), 0)
  const totalTransactions = data.reduce((sum, d) => sum + Number.parseInt(d.transactions || 0), 0)
  const avgTransaction = totalRevenue / totalTransactions || 0
  const uniqueCustomers = data.reduce((sum, d) => sum + Number.parseInt(d.unique_customers || 0), 0)

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
              <DollarSign className="w-4 h-4" />
              Revenus Totaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalTransactions}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Panier Moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${avgTransaction.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Clients Uniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{uniqueCustomers}</div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-gray-400 mt-4">Chargement des données...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Évolution des Revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="total_revenue" stroke="#00d4ff" name="Revenus ($)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Transactions par Jour</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Bar dataKey="transactions" fill="#e94b87" name="Transactions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
