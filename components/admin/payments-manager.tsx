"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, TrendingUp, CreditCard, Download, Search, Filter } from "@/lib/icons"
import { format } from "@/lib/utils/date-formatter"

type Payment = {
  id: string
  user_id: string
  subscription_id: string
  amount: number
  currency: string
  payment_method: string
  status: "pending" | "completed" | "failed" | "refunded"
  transaction_id: string
  created_at: string
}

type Stats = {
  totalRevenue: number
  monthlyRevenue: number
  successfulPayments: number
  failedPayments: number
}

export function PaymentsManager() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    successfulPayments: 0,
    failedPayments: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [methodFilter, setMethodFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchPayments()
  }, [])

  useEffect(() => {
    filterPayments()
  }, [payments, searchTerm, statusFilter, methodFilter])

  async function fetchPayments() {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("payments").select("*").order("created_at", { ascending: false })

      if (error) throw error

      setPayments(data || [])
      calculateStats(data || [])
    } catch (error) {
      console.error("Error fetching payments:", error)
    } finally {
      setLoading(false)
    }
  }

  function calculateStats(paymentsData: Payment[]) {
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const totalRevenue = paymentsData.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)

    const monthlyRevenue = paymentsData
      .filter((p) => p.status === "completed" && new Date(p.created_at) >= firstDayOfMonth)
      .reduce((sum, p) => sum + p.amount, 0)

    const successfulPayments = paymentsData.filter((p) => p.status === "completed").length

    const failedPayments = paymentsData.filter((p) => p.status === "failed").length

    setStats({
      totalRevenue,
      monthlyRevenue,
      successfulPayments,
      failedPayments,
    })
  }

  function filterPayments() {
    let filtered = payments

    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.user_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((payment) => payment.status === statusFilter)
    }

    if (methodFilter !== "all") {
      filtered = filtered.filter((payment) => payment.payment_method === methodFilter)
    }

    setFilteredPayments(filtered)
  }

  function exportToCSV() {
    const headers = ["Date", "Transaction ID", "User ID", "Montant", "Méthode", "Status"]

    const rows = filteredPayments.map((payment) => [
      format(new Date(payment.created_at), "dd/MM/yyyy HH:mm"),
      payment.transaction_id,
      payment.user_id,
      `${payment.amount} ${payment.currency}`,
      payment.payment_method,
      payment.status,
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `paiements_${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
      refunded: "outline",
    }
    return (
      <Badge variant={variants[status] || "default"}>
        {status === "completed" && "Complété"}
        {status === "pending" && "En attente"}
        {status === "failed" && "Échoué"}
        {status === "refunded" && "Remboursé"}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Chargement des paiements...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-rose-400 bg-clip-text text-transparent">
            Gestion des Paiements
          </h1>
          <p className="text-muted-foreground mt-1">Historique complet et statistiques des paiements</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exporter CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} MAD</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu ce Mois</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyRevenue.toFixed(2)} MAD</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements Réussis</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successfulPayments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements Échoués</CardTitle>
            <CreditCard className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failedPayments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par User ID, transaction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les status</SelectItem>
                <SelectItem value="completed">Complété</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="failed">Échoué</SelectItem>
                <SelectItem value="refunded">Remboursé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <CreditCard className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes méthodes</SelectItem>
                <SelectItem value="credit_card">Carte bancaire</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bank_transfer">Virement</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucun paiement trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{format(new Date(payment.created_at), "dd MMM yyyy HH:mm")}</TableCell>
                      <TableCell className="font-mono text-sm">{payment.transaction_id}</TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">{payment.user_id.slice(0, 8)}...</div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {payment.amount} {payment.currency}
                      </TableCell>
                      <TableCell className="capitalize">{payment.payment_method?.replace("_", " ")}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Affichage de {filteredPayments.length} paiement(s) sur {payments.length} au total
      </div>
    </div>
  )
}
