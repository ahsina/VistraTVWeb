// components/affiliate/affiliate-dashboard.tsx
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import {
  DollarSign,
  Users,
  MousePointerClick,
  TrendingUp,
  Copy,
  ExternalLink,
  Download,
  Calendar,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface AffiliateData {
  id: string
  name: string
  email: string
  affiliate_code: string
  commission_rate: number
  status: string
  total_referrals: number
  total_earnings: number
  pending_earnings: number
  paid_earnings: number
  created_at: string
}

interface Referral {
  id: string
  referred_email: string
  status: string
  commission_amount: number
  commission_paid: boolean
  created_at: string
}

interface Click {
  id: string
  ip_address: string
  referrer: string
  converted: boolean
  created_at: string
}

interface Payout {
  id: string
  amount: number
  status: string
  payment_method: string
  created_at: string
  paid_at: string | null
}

interface ChartData {
  date: string
  clicks: number
  conversions: number
  earnings: number
}

export function AffiliateDashboard() {
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [clicks, setClicks] = useState<Click[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState("30d")
  const [copied, setCopied] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [dateRange])

  async function fetchData() {
    try {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Récupérer les données affilié
      const { data: affData } = await supabase
        .from("affiliates")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (!affData) return

      setAffiliate(affData)

      // Calculer la date de début selon le filtre
      const startDate = new Date()
      switch (dateRange) {
        case "7d":
          startDate.setDate(startDate.getDate() - 7)
          break
        case "30d":
          startDate.setDate(startDate.getDate() - 30)
          break
        case "90d":
          startDate.setDate(startDate.getDate() - 90)
          break
        case "1y":
          startDate.setFullYear(startDate.getFullYear() - 1)
          break
      }

      // Récupérer les referrals
      const { data: refData } = await supabase
        .from("affiliate_referrals")
        .select("*")
        .eq("affiliate_id", affData.id)
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false })

      setReferrals(refData || [])

      // Récupérer les clics
      const { data: clickData } = await supabase
        .from("affiliate_clicks")
        .select("*")
        .eq("affiliate_id", affData.id)
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false })

      setClicks(clickData || [])

      // Récupérer les payouts
      const { data: payoutData } = await supabase
        .from("affiliate_payouts")
        .select("*")
        .eq("affiliate_id", affData.id)
        .order("created_at", { ascending: false })

      setPayouts(payoutData || [])

      // Générer les données du graphique
      generateChartData(clickData || [], refData || [], startDate)
    } catch (error) {
      console.error("[v0] Error fetching affiliate data:", error)
    } finally {
      setLoading(false)
    }
  }

  function generateChartData(clicks: Click[], referrals: Referral[], startDate: Date) {
    const data: Record<string, ChartData> = {}
    const now = new Date()

    // Initialiser les jours
    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0]
      data[dateStr] = { date: dateStr, clicks: 0, conversions: 0, earnings: 0 }
    }

    // Compter les clics
    clicks.forEach((click) => {
      const dateStr = click.created_at.split("T")[0]
      if (data[dateStr]) {
        data[dateStr].clicks++
        if (click.converted) data[dateStr].conversions++
      }
    })

    // Ajouter les gains
    referrals.forEach((ref) => {
      const dateStr = ref.created_at.split("T")[0]
      if (data[dateStr]) {
        data[dateStr].earnings += ref.commission_amount
      }
    })

    setChartData(Object.values(data))
  }

  const copyLink = () => {
    if (!affiliate) return
    const link = `${window.location.origin}/register?ref=${affiliate.affiliate_code}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const stats = {
    totalClicks: clicks.length,
    totalConversions: referrals.filter((r) => r.status === "completed").length,
    conversionRate: clicks.length > 0 
      ? ((referrals.filter((r) => r.status === "completed").length / clicks.length) * 100).toFixed(1)
      : "0",
    pendingEarnings: affiliate?.pending_earnings || 0,
    paidEarnings: affiliate?.paid_earnings || 0,
    totalEarnings: affiliate?.total_earnings || 0,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
      </div>
    )
  }

  if (!affiliate) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-8 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold text-white mb-2">
            Rejoignez notre programme affilié
          </h3>
          <p className="text-gray-400 mb-6">
            Gagnez des commissions en recommandant VistraTV
          </p>
          <Button className="bg-gradient-to-r from-cyan-500 to-rose-500">
            Postuler maintenant
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec lien de parrainage */}
      <Card className="bg-gradient-to-r from-cyan-500/10 to-rose-500/10 border-white/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Bienvenue, {affiliate.name || affiliate.email}
              </h2>
              <p className="text-gray-400">
                Commission: <span className="text-cyan-400 font-bold">{affiliate.commission_rate}%</span> par vente
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/5 rounded-lg px-4 py-2 flex items-center gap-2">
                <code className="text-cyan-400">{affiliate.affiliate_code}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyLink}
                  className="h-8 w-8"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={copyLink}
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
              >
                {copied ? "Copié !" : "Copier le lien"}
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Clics</p>
                <p className="text-3xl font-bold text-white">{stats.totalClicks}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <MousePointerClick className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Conversions</p>
                <p className="text-3xl font-bold text-white">{stats.totalConversions}</p>
                <p className="text-xs text-gray-500">Taux: {stats.conversionRate}%</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">En attente</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.pendingEarnings.toFixed(2)}€</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total gagné</p>
                <p className="text-3xl font-bold text-green-400">{stats.totalEarnings.toFixed(2)}€</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Performance</CardTitle>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px] bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">90 derniers jours</SelectItem>
              <SelectItem value="1y">Cette année</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="date"
                  stroke="#666"
                  tick={{ fill: "#666" }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                />
                <YAxis stroke="#666" tick={{ fill: "#666" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1147",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString("fr-FR")}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#00d4ff"
                  fillOpacity={1}
                  fill="url(#colorClicks)"
                  name="Clics"
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#4ade80"
                  fillOpacity={1}
                  fill="url(#colorEarnings)"
                  name="Gains (€)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tabs pour détails */}
      <Tabs defaultValue="referrals" className="space-y-4">
        <TabsList className="bg-white/5">
          <TabsTrigger value="referrals">Parrainages ({referrals.length})</TabsTrigger>
          <TabsTrigger value="clicks">Clics ({clicks.length})</TabsTrigger>
          <TabsTrigger value="payouts">Paiements ({payouts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="referrals">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-400">Email</TableHead>
                    <TableHead className="text-gray-400">Statut</TableHead>
                    <TableHead className="text-gray-400">Commission</TableHead>
                    <TableHead className="text-gray-400">Payé</TableHead>
                    <TableHead className="text-gray-400">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((ref) => (
                    <TableRow key={ref.id} className="border-white/10">
                      <TableCell className="text-white">{ref.referred_email}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            ref.status === "completed"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-yellow-500/20 text-yellow-300"
                          }
                        >
                          {ref.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-green-400 font-medium">
                        {ref.commission_amount.toFixed(2)}€
                      </TableCell>
                      <TableCell>
                        {ref.commission_paid ? (
                          <Badge className="bg-green-500/20 text-green-300">Oui</Badge>
                        ) : (
                          <Badge className="bg-gray-500/20 text-gray-300">Non</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {new Date(ref.created_at).toLocaleDateString("fr-FR")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clicks">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-400">IP</TableHead>
                    <TableHead className="text-gray-400">Source</TableHead>
                    <TableHead className="text-gray-400">Converti</TableHead>
                    <TableHead className="text-gray-400">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clicks.slice(0, 50).map((click) => (
                    <TableRow key={click.id} className="border-white/10">
                      <TableCell className="text-white font-mono text-sm">
                        {click.ip_address?.substring(0, 10)}...
                      </TableCell>
                      <TableCell className="text-gray-400 max-w-xs truncate">
                        {click.referrer || "Direct"}
                      </TableCell>
                      <TableCell>
                        {click.converted ? (
                          <Badge className="bg-green-500/20 text-green-300">Oui</Badge>
                        ) : (
                          <Badge className="bg-gray-500/20 text-gray-300">Non</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {new Date(click.created_at).toLocaleString("fr-FR")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-400">Montant</TableHead>
                    <TableHead className="text-gray-400">Méthode</TableHead>
                    <TableHead className="text-gray-400">Statut</TableHead>
                    <TableHead className="text-gray-400">Demandé le</TableHead>
                    <TableHead className="text-gray-400">Payé le</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.map((payout) => (
                    <TableRow key={payout.id} className="border-white/10">
                      <TableCell className="text-green-400 font-bold">
                        {payout.amount.toFixed(2)}€
                      </TableCell>
                      <TableCell className="text-white">{payout.payment_method}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            payout.status === "paid"
                              ? "bg-green-500/20 text-green-300"
                              : payout.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-red-500/20 text-red-300"
                          }
                        >
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {new Date(payout.created_at).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {payout.paid_at
                          ? new Date(payout.paid_at).toLocaleDateString("fr-FR")
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AffiliateDashboard
