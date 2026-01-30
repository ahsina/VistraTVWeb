"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, RefreshCw, ExternalLink, Clock, Download } from "lucide-react"
import { toast } from "sonner"

interface AbandonedPayment {
  id: string
  email: string
  whatsapp_phone: string | null
  reminder_count: number
  last_reminder_sent_at: string | null
  status: string
  created_at: string
  abandoned_at: string
  subscription_plan_name: string
  amount: number
  currency: string
  payment_url: string
}

export function AbandonedPaymentsManager() {
  const [abandonedPayments, setAbandonedPayments] = useState<AbandonedPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")
  const [detecting, setDetecting] = useState(false)

  const fetchAbandonedPayments = async (status = "pending") => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/abandoned-payments?status=${status}`)
      const data = await response.json()

      if (response.ok) {
        setAbandonedPayments(data.abandonedPayments || [])
      } else {
        toast.error(data.error || "Failed to fetch abandoned payments")
      }
    } catch (error) {
      console.error("[v0] Error fetching abandoned payments:", error)
      toast.error("Failed to fetch abandoned payments")
    } finally {
      setLoading(false)
    }
  }

  const detectAbandonedPayments = async () => {
    try {
      setDetecting(true)
      const response = await fetch("/api/admin/abandoned-payments/detect", {
        method: "POST",
      })
      const data = await response.json()

      if (response.ok) {
        toast.success(`${data.created} nouveaux paiements abandonnés détectés`)
        fetchAbandonedPayments(activeTab)
      } else {
        toast.error(data.error || "Failed to detect abandoned payments")
      }
    } catch (error) {
      console.error("[v0] Error detecting abandoned payments:", error)
      toast.error("Failed to detect abandoned payments")
    } finally {
      setDetecting(false)
    }
  }

  const sendReminder = async (reminderId: string) => {
    try {
      const response = await fetch("/api/admin/abandoned-payments/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reminderId }),
      })
      const data = await response.json()

      if (response.ok) {
        toast.success("Reminder envoyé avec succès")
        fetchAbandonedPayments(activeTab)
      } else {
        toast.error(data.error || "Failed to send reminder")
      }
    } catch (error) {
      console.error("[v0] Error sending reminder:", error)
      toast.error("Failed to send reminder")
    }
  }

  const exportEmails = async (type: "all" | "unconverted") => {
    try {
      const response = await fetch(`/api/admin/abandoned-payments/export?type=${type}`)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `emails-${type}-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success(`Export réussi: ${type === "all" ? "tous les emails" : "emails non convertis"}`)
      } else {
        toast.error("Échec de l'export")
      }
    } catch (error) {
      console.error("[v0] Error exporting emails:", error)
      toast.error("Échec de l'export")
    }
  }

  useEffect(() => {
    fetchAbandonedPayments(activeTab)
  }, [activeTab])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR")
  }

  const getTimeSinceAbandoned = (abandonedAt: string) => {
    const now = new Date()
    const abandoned = new Date(abandonedAt)
    const diffMs = now.getTime() - abandoned.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`
    } else if (diffHours > 0) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`
    } else {
      return "Récent"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-muted-foreground">Suivez et convertissez les clients qui ont abandonné leur paiement</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => exportEmails("unconverted")} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter non convertis
          </Button>
          <Button onClick={() => exportEmails("all")} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter tous les emails
          </Button>
          <Button onClick={detectAbandonedPayments} disabled={detecting}>
            <RefreshCw className={`mr-2 h-4 w-4 ${detecting ? "animate-spin" : ""}`} />
            Détecter les abandons
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="converted">Convertis</TabsTrigger>
          <TabsTrigger value="expired">Expirés</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">Chargement...</p>
              </CardContent>
            </Card>
          ) : abandonedPayments.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">Aucun paiement abandonné trouvé</p>
              </CardContent>
            </Card>
          ) : (
            abandonedPayments.map((payment) => (
              <Card key={payment.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{payment.email}</CardTitle>
                      <CardDescription>
                        {payment.subscription_plan_name} - {payment.amount} {payment.currency}
                      </CardDescription>
                    </div>
                    <Badge variant={payment.status === "pending" ? "secondary" : "default"}>{payment.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Abandonné</p>
                      <p className="font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {getTimeSinceAbandoned(payment.abandoned_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Reminders envoyés</p>
                      <p className="font-medium">{payment.reminder_count}</p>
                    </div>
                    {payment.whatsapp_phone && (
                      <div>
                        <p className="text-muted-foreground">WhatsApp</p>
                        <p className="font-medium">{payment.whatsapp_phone}</p>
                      </div>
                    )}
                    {payment.last_reminder_sent_at && (
                      <div>
                        <p className="text-muted-foreground">Dernier reminder</p>
                        <p className="font-medium">{formatDate(payment.last_reminder_sent_at)}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => sendReminder(payment.id)} size="sm" variant="default">
                      <Mail className="mr-2 h-4 w-4" />
                      Envoyer Reminder
                    </Button>
                    {payment.payment_url && (
                      <Button asChild size="sm" variant="outline">
                        <a href={payment.payment_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Voir le paiement
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
