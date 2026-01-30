"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { Copy, DollarSign, TrendingUp, Users, CheckCircle, ExternalLink, Gift } from "@/lib/icons"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

type Affiliate = {
  id: string
  user_id: string | null
  affiliate_code: string
  email: string
  full_name: string
  commission_rate: number
  status: "pending" | "active" | "suspended" | "rejected"
  total_earnings: number
  pending_earnings: number
  paid_earnings: number
  total_referrals: number
  created_at: string
}

type Referral = {
  id: string
  subscription_amount: number
  commission_amount: number
  commission_status: "pending" | "approved" | "paid" | "cancelled"
  created_at: string
}

type Click = {
  id: string
  converted: boolean
  created_at: string
}

export default function AffiliateClientDashboard({
  affiliate,
  referrals,
  clicks,
  userEmail,
}: {
  affiliate: Affiliate | null
  referrals: Referral[]
  clicks: Click[]
  userEmail: string
}) {
  const [isApplying, setIsApplying] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    payment_method: "",
    payment_details: "",
  })

  const affiliateLink = affiliate
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/register?ref=${affiliate.affiliate_code}`
    : ""

  const conversionRate = clicks.length > 0 ? (clicks.filter((c) => c.converted).length / clicks.length) * 100 : 0

  const handleApply = async () => {
    setIsApplying(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const code = `${formData.full_name.split(" ")[0].toUpperCase()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    await supabase.from("affiliates").insert({
      user_id: user?.id,
      affiliate_code: code,
      email: userEmail,
      full_name: formData.full_name,
      payment_method: formData.payment_method,
      payment_details: formData.payment_details ? JSON.parse(formData.payment_details) : null,
      status: "pending",
    })

    window.location.reload()
  }

  const copyLink = () => {
    navigator.clipboard.writeText(affiliateLink)
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

  if (!affiliate) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Gift className="w-6 h-6 text-cyan-400" />
                  Devenir Affilié VistraTV
                </CardTitle>
                <p className="text-gray-400">
                  Gagnez des commissions en recommandant VistraTV à vos amis et votre audience
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 p-4 bg-gradient-to-r from-cyan-500/10 to-rose-500/10 rounded-lg border border-white/10">
                  <h3 className="text-white font-semibold">Avantages du programme:</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Jusqu'à 20% de commission sur chaque vente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Dashboard complet pour suivre vos statistiques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Paiements mensuels directement sur votre compte</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Lien de parrainage personnalisé</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="full_name" className="text-white">
                      Nom complet *
                    </Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="payment_method" className="text-white">
                      Méthode de paiement préférée
                    </Label>
                    <Input
                      id="payment_method"
                      value={formData.payment_method}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="PayPal, Virement bancaire, etc."
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="payment_details" className="text-white">
                      Détails de paiement (JSON)
                    </Label>
                    <Textarea
                      id="payment_details"
                      value={formData.payment_details}
                      onChange={(e) => setFormData({ ...formData, payment_details: e.target.value })}
                      className="bg-white/10 border-white/20 text-white font-mono text-sm"
                      placeholder='{"email": "your@paypal.com"}'
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleApply}
                    disabled={!formData.full_name || isApplying}
                    className="w-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87]"
                  >
                    Postuler au programme
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Affilié</h1>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(affiliate.status)}>{affiliate.status}</Badge>
              {affiliate.status === "pending" && (
                <p className="text-gray-400 text-sm">Votre demande est en cours de révision</p>
              )}
            </div>
          </div>

          {affiliate.status === "active" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="bg-white/5 backdrop-blur-md border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-400">Total des gains</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-green-400" />
                      {affiliate.total_earnings.toFixed(2)} €
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-md border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-400">En attente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-yellow-300">{affiliate.pending_earnings.toFixed(2)} €</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-md border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-400">Parrainages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-white flex items-center gap-2">
                      <Users className="w-6 h-6 text-cyan-400" />
                      {affiliate.total_referrals}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-md border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-400">Taux de conversion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-purple-400" />
                      {conversionRate.toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/5 backdrop-blur-md border-white/10 mb-8">
                <CardHeader>
                  <CardTitle className="text-white">Votre lien de parrainage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={affiliateLink}
                      readOnly
                      className="bg-white/10 border-white/20 text-white font-mono"
                    />
                    <Button onClick={copyLink} className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
                      <Copy className="w-4 h-4 mr-2" />
                      Copier
                    </Button>
                  </div>
                  <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <p className="text-sm text-cyan-300">
                      <strong>Code affilié:</strong>{" "}
                      <code className="font-mono font-bold">{affiliate.affiliate_code}</code>
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Taux de commission: <strong>{affiliate.commission_rate}%</strong>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="referrals" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/5">
                  <TabsTrigger value="referrals">Parrainages ({referrals.length})</TabsTrigger>
                  <TabsTrigger value="clicks">Clics ({clicks.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="referrals" className="space-y-4 mt-4">
                  {referrals.map((referral) => (
                    <Card key={referral.id} className="bg-white/5 backdrop-blur-md border-white/10">
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
                    <Card className="bg-white/5 backdrop-blur-md border-white/10">
                      <CardContent className="p-8 text-center">
                        <p className="text-gray-400">Aucun parrainage pour le moment</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Partagez votre lien pour commencer à gagner des commissions
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="clicks" className="space-y-4 mt-4">
                  <div className="grid gap-2">
                    {clicks.slice(0, 20).map((click) => (
                      <Card key={click.id} className="bg-white/5 backdrop-blur-md border-white/10">
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <ExternalLink className="w-4 h-4 text-gray-400" />
                              <p className="text-sm text-gray-300">{new Date(click.created_at).toLocaleString()}</p>
                            </div>
                            {click.converted ? (
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Converti</Badge>
                            ) : (
                              <Badge variant="outline" className="border-gray-500/30 text-gray-400">
                                Visite
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {clicks.length === 0 && (
                      <Card className="bg-white/5 backdrop-blur-md border-white/10">
                        <CardContent className="p-8 text-center">
                          <p className="text-gray-400">Aucun clic enregistré</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}

          {affiliate.status === "rejected" && (
            <Card className="bg-red-500/10 border-red-500/30">
              <CardContent className="p-8 text-center">
                <p className="text-red-300 text-lg">Votre demande d'affiliation a été rejetée</p>
                <p className="text-gray-400 mt-2">Veuillez contacter le support pour plus d'informations</p>
              </CardContent>
            </Card>
          )}

          {affiliate.status === "suspended" && (
            <Card className="bg-orange-500/10 border-orange-500/30">
              <CardContent className="p-8 text-center">
                <p className="text-orange-300 text-lg">Votre compte affilié est temporairement suspendu</p>
                <p className="text-gray-400 mt-2">Veuillez contacter le support pour plus d'informations</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
