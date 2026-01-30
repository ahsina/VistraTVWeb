"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { UserPlus, DollarSign, Users, CheckCircle, XCircle, Clock, Pause } from "@/lib/icons"

type Affiliate = {
  id: string
  user_id: string | null
  affiliate_code: string
  email: string
  full_name: string
  commission_rate: number
  status: "pending" | "active" | "suspended" | "rejected"
  payment_method: string | null
  payment_details: any
  total_earnings: number
  pending_earnings: number
  paid_earnings: number
  total_referrals: number
  created_at: string
}

type Referral = {
  id: string
  affiliate_id: string
  referred_user_id: string | null
  subscription_amount: number
  commission_amount: number
  commission_status: "pending" | "approved" | "paid" | "cancelled"
  created_at: string
}

export default function AffiliatesManager({ initialData }: { initialData: Affiliate[] }) {
  const [data, setData] = useState(initialData)
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [payoutAmount, setPayoutAmount] = useState(0)
  const [payoutNotes, setPayoutNotes] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const refreshData = async () => {
    const supabase = createClient()
    const { data: refreshedData } = await supabase
      .from("affiliates")
      .select("*")
      .order("created_at", { ascending: false })

    if (refreshedData) {
      setData(refreshedData)
    }
  }

  const loadReferrals = async (affiliateId: string) => {
    const supabase = createClient()
    const { data: referralsData } = await supabase
      .from("affiliate_referrals")
      .select("*")
      .eq("affiliate_id", affiliateId)
      .order("created_at", { ascending: false })

    if (referralsData) {
      setReferrals(referralsData)
    }
  }

  const handleStatusChange = async (affiliateId: string, newStatus: string) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const updateData: any = { status: newStatus }
    if (newStatus === "active") {
      updateData.approved_by = user?.id
      updateData.approved_at = new Date().toISOString()
    }

    await supabase.from("affiliates").update(updateData).eq("id", affiliateId)
    await refreshData()
  }

  const handleCommissionRateChange = async (affiliateId: string, rate: number) => {
    const supabase = createClient()
    await supabase.from("affiliates").update({ commission_rate: rate }).eq("id", affiliateId)
    await refreshData()
  }

  const handleViewDetails = async (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate)
    await loadReferrals(affiliate.id)
    setIsDialogOpen(true)
  }

  const handleCreatePayout = async () => {
    if (!selectedAffiliate) return

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    await supabase.from("affiliate_payouts").insert({
      affiliate_id: selectedAffiliate.id,
      amount: payoutAmount,
      currency: "EUR",
      status: "pending",
      notes: payoutNotes,
      processed_by: user?.id,
    })

    // Update affiliate earnings
    await supabase
      .from("affiliates")
      .update({
        pending_earnings: selectedAffiliate.pending_earnings - payoutAmount,
        paid_earnings: selectedAffiliate.paid_earnings + payoutAmount,
      })
      .eq("id", selectedAffiliate.id)

    await refreshData()
    setIsPayoutDialogOpen(false)
    setPayoutAmount(0)
    setPayoutNotes("")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "suspended":
        return <Pause className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "suspended":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      case "rejected":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return ""
    }
  }

  const filteredData = filterStatus === "all" ? data : data.filter((a) => a.status === filterStatus)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestion des Affiliés</h2>
          <p className="text-gray-400 mt-1">
            {data.length} affilié{data.length > 1 ? "s" : ""}
          </p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="suspended">Suspendu</SelectItem>
            <SelectItem value="rejected">Rejeté</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredData.map((affiliate) => (
          <Card key={affiliate.id} className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-cyan-400" />
                  {affiliate.full_name}
                </CardTitle>
                <div className="flex gap-2 flex-wrap">
                  <Badge className={getStatusColor(affiliate.status)}>
                    {getStatusIcon(affiliate.status)}
                    <span className="ml-1">{affiliate.status}</span>
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    <code className="font-mono">{affiliate.affiliate_code}</code>
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {affiliate.commission_rate}% commission
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">{affiliate.email}</p>
              </div>
              <Button
                onClick={() => handleViewDetails(affiliate)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                Détails
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Parrainages</p>
                  <p className="text-white font-semibold flex items-center gap-1">
                    <Users className="w-4 h-4 text-cyan-400" />
                    {affiliate.total_referrals}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Gains totaux</p>
                  <p className="text-white font-semibold flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    {affiliate.total_earnings.toFixed(2)} €
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">En attente</p>
                  <p className="text-yellow-300 font-semibold">{affiliate.pending_earnings.toFixed(2)} €</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Payé</p>
                  <p className="text-green-300 font-semibold">{affiliate.paid_earnings.toFixed(2)} €</p>
                </div>
              </div>

              {affiliate.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleStatusChange(affiliate.id, "active")}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approuver
                  </Button>
                  <Button onClick={() => handleStatusChange(affiliate.id, "rejected")} size="sm" variant="destructive">
                    <XCircle className="w-4 h-4 mr-1" />
                    Rejeter
                  </Button>
                </div>
              )}

              {affiliate.status === "active" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleStatusChange(affiliate.id, "suspended")}
                    size="sm"
                    variant="outline"
                    className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
                  >
                    <Pause className="w-4 h-4 mr-1" />
                    Suspendre
                  </Button>
                </div>
              )}

              {affiliate.status === "suspended" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleStatusChange(affiliate.id, "active")}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Réactiver
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl bg-gradient-to-br from-gray-900 to-gray-800 border-white/10 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Détails de l'affilié</DialogTitle>
          </DialogHeader>

          {selectedAffiliate && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/5">
                <TabsTrigger value="info">Informations</TabsTrigger>
                <TabsTrigger value="referrals">Parrainages ({referrals.length})</TabsTrigger>
                <TabsTrigger value="payouts">Paiements</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-400">Nom complet</Label>
                    <p className="text-white font-medium">{selectedAffiliate.full_name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Email</Label>
                    <p className="text-white font-medium">{selectedAffiliate.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Code affilié</Label>
                    <p className="text-white font-mono">{selectedAffiliate.affiliate_code}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Statut</Label>
                    <Badge className={getStatusColor(selectedAffiliate.status)}>{selectedAffiliate.status}</Badge>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="text-white">Taux de commission (%)</Label>
                  <Input
                    type="number"
                    value={selectedAffiliate.commission_rate}
                    onChange={(e) =>
                      handleCommissionRateChange(selectedAffiliate.id, Number.parseFloat(e.target.value))
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                {selectedAffiliate.payment_method && (
                  <div className="grid gap-2">
                    <Label className="text-gray-400">Méthode de paiement</Label>
                    <p className="text-white">{selectedAffiliate.payment_method}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="referrals" className="space-y-4">
                <div className="space-y-2">
                  {referrals.map((referral) => (
                    <Card key={referral.id} className="bg-white/5">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-white font-medium">
                              Abonnement: {referral.subscription_amount.toFixed(2)} €
                            </p>
                            <p className="text-sm text-gray-400">
                              Commission: {referral.commission_amount.toFixed(2)} €
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(referral.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(referral.commission_status)}>
                            {referral.commission_status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {referrals.length === 0 && (
                    <p className="text-center text-gray-400 py-8">Aucun parrainage pour le moment</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="payouts" className="space-y-4">
                <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Total gagné</p>
                    <p className="text-xl font-bold text-white">{selectedAffiliate.total_earnings.toFixed(2)} €</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">En attente</p>
                    <p className="text-xl font-bold text-yellow-300">
                      {selectedAffiliate.pending_earnings.toFixed(2)} €
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Payé</p>
                    <p className="text-xl font-bold text-green-300">{selectedAffiliate.paid_earnings.toFixed(2)} €</p>
                  </div>
                </div>

                {selectedAffiliate.pending_earnings > 0 && (
                  <Button
                    onClick={() => {
                      setPayoutAmount(selectedAffiliate.pending_earnings)
                      setIsPayoutDialogOpen(true)
                    }}
                    className="w-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87]"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Créer un paiement
                  </Button>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-gray-900 to-gray-800 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Créer un paiement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label className="text-white">Montant (€)</Label>
              <Input
                type="number"
                step="0.01"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(Number.parseFloat(e.target.value))}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-white">Notes</Label>
              <Textarea
                value={payoutNotes}
                onChange={(e) => setPayoutNotes(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => setIsPayoutDialogOpen(false)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                Annuler
              </Button>
              <Button onClick={handleCreatePayout} className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
                Confirmer le paiement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
