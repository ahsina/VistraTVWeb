"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, X, Plus, ChevronLeft, Send } from "@/lib/icons"
import { SupportChatPanel } from "./support-chat-panel"
import { useLanguage } from "@/lib/i18n/LanguageContext"

type Ticket = {
  id: string
  subject: string
  status: string
  priority: string
  created_at: string
  unread_count?: number
}

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<"home" | "new" | "chat" | "live-chat">("home")
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [unreadTotal, setUnreadTotal] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)

  // New ticket form
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // Live chat
  const [liveChatTicketId, setLiveChatTicketId] = useState<string | null>(null)

  const { t, locale } = useLanguage()

  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (isOpen && userId) {
      fetchTickets()
      subscribeToTickets()
    }
  }, [isOpen, userId])

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      setUserId(user.id)
      fetchUserProfile(user.id)
    }
  }

  async function fetchUserProfile(uid: string) {
    try {
      const { data } = await supabase.from("user_profiles").select("full_name").eq("id", uid).maybeSingle()

      if (data?.full_name) {
        setName(data.full_name)
      }
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email) {
        setEmail(user.email)
      }
    } catch (error) {
      console.error("[v0] Error fetching user profile:", error)
    }
  }

  async function fetchTickets() {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("id, subject, status, priority, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Fetch unread count for each ticket
      const ticketsWithUnread = await Promise.all(
        (data || []).map(async (ticket) => {
          const { count } = await supabase
            .from("ticket_messages")
            .select("*", { count: "exact", head: true })
            .eq("ticket_id", ticket.id)
            .eq("sender_type", "admin")
            .eq("is_read", false)

          return { ...ticket, unread_count: count || 0 }
        }),
      )

      setTickets(ticketsWithUnread)
      setUnreadTotal(ticketsWithUnread.reduce((sum, t) => sum + (t.unread_count || 0), 0))
    } catch (error) {
      console.error("[v0] Error fetching tickets:", error)
    }
  }

  function subscribeToTickets() {
    if (!userId) return

    const channel = supabase
      .channel(`user-tickets-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "support_tickets",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchTickets()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  async function createTicket() {
    if (!subject.trim() || !message.trim() || !name.trim() || !email.trim()) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": `${locale},en;q=0.9`,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || t.support?.errors?.createTicket || "Erreur lors de la création du ticket")
      }

      const ticketNumber = result.data.id.substring(0, 8).toUpperCase()
      alert(
        `✅ ${t.support?.ticketCreated || "Ticket créé avec succès !"}\n\n` +
          `📋 ${t.support?.ticketNumber || "Numéro"} : #${ticketNumber}\n` +
          `⏰ ${t.support?.responseTime || "Délai de réponse"} : ${t.support?.lessThan4Hours || "moins de 4 heures"}\n` +
          `📧 ${t.support?.confirmationSent || "Un email de confirmation a été envoyé à"} ${email}\n\n` +
          `${t.support?.trackTicket || "Vous pouvez suivre votre ticket sur la page Support."}`,
      )

      setSelectedTicketId(result.data.id)
      setView("chat")
      setSubject("")
      setMessage("")
      fetchTickets()
    } catch (error: any) {
      console.error("[v0] Error creating ticket:", error)
      alert(t.support?.errors?.createTicket || "Erreur lors de la création du ticket. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  async function startLiveChat() {
    if (!name.trim() || !email.trim()) {
      alert(t.support?.errors?.nameEmailRequired || "Veuillez renseigner votre nom et email")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": `${locale},en;q=0.9`,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: t.support?.widget?.liveChat || "Chat en direct",
          message: t.support?.widget?.startChat || "Début de conversation en direct",
          priority: "high",
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || t.support?.errors?.createTicket || "Erreur lors du démarrage du chat")
      }

      setLiveChatTicketId(result.data.id)
      setView("live-chat")
      fetchTickets()
    } catch (error: any) {
      console.error("[v0] Error starting live chat:", error)
      alert(t.support?.errors?.createTicket || "Erreur lors du démarrage du chat. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  function openTicket(ticketId: string) {
    setSelectedTicketId(ticketId)
    setView("chat")
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "open":
        return "bg-green-500/10 text-green-500"
      case "in_progress":
        return "bg-blue-500/10 text-blue-500"
      case "resolved":
        return "bg-purple-500/10 text-purple-500"
      case "closed":
        return "bg-gray-500/10 text-gray-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500"
      case "low":
        return "bg-gray-500/10 text-gray-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  function getStatusLabel(status: string) {
    return t.support?.status?.[status as keyof typeof t.support.status] || status
  }

  function getPriorityLabel(priority: string) {
    return t.support?.priority?.[priority as keyof typeof t.support.priority] || priority
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-cyan-500 to-rose-500 hover:from-cyan-600 hover:to-rose-600"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="relative">
              <MessageCircle className="h-6 w-6" />
              {unreadTotal > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadTotal}
                </span>
              )}
            </div>
          )}
        </Button>
      </div>

      {/* Widget Panel */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-[400px] h-[600px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-rose-500 text-white">
            <div className="flex items-center justify-between">
              {view !== "home" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setView("home")
                    setSelectedTicketId(null)
                    setLiveChatTicketId(null)
                  }}
                  className="text-white hover:bg-white/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              <CardTitle className="flex-1 text-center">
                {view === "home" && (t.support?.title || "Support Client")}
                {view === "new" && (t.support?.newTicket || "Nouveau Ticket")}
                {view === "chat" && (t.support?.chat?.support || "Conversation")}
                {view === "live-chat" && (t.support?.widget?.liveChat || "Chat en Direct")}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden p-0">
            {view === "home" && (
              <Tabs defaultValue="live-chat" className="h-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="live-chat">{t.support?.widget?.liveChat || "Chat en Direct"}</TabsTrigger>
                  <TabsTrigger value="tickets">{t.support?.widget?.myTickets || "Mes Tickets"}</TabsTrigger>
                </TabsList>

                <TabsContent value="live-chat" className="h-[calc(100%-40px)] p-4 space-y-4">
                  <div className="text-center py-4">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 text-cyan-500" />
                    <h3 className="text-lg font-semibold mb-2">
                      {t.support?.widget?.help || "Besoin d'aide immédiate ?"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {t.support?.chat?.welcome ||
                        "Chattez en direct avec notre équipe support. Réponse rapide garantie !"}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="live-name">{t.support?.fullName || "Nom complet"} *</Label>
                      <Input
                        id="live-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.support?.fullName || "Votre nom"}
                      />
                    </div>

                    <div>
                      <Label htmlFor="live-email">{t.support?.email || "Email"} *</Label>
                      <Input
                        id="live-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.support?.emailLabel || "votre@email.com"}
                      />
                    </div>

                    <Button
                      onClick={startLiveChat}
                      disabled={loading || !name || !email}
                      className="w-full bg-gradient-to-r from-cyan-500 to-rose-500"
                    >
                      {loading ? (
                        t.support?.sending || "Connexion..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          {t.support?.widget?.startChat || "Démarrer le Chat"}
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="tickets" className="h-[calc(100%-40px)]">
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b">
                      <Button
                        onClick={() => setView("new")}
                        className="w-full bg-gradient-to-r from-cyan-500 to-rose-500"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {t.support?.newTicket || "Nouveau Ticket"}
                      </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {tickets.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>{t.support?.noTickets || "Aucun ticket pour le moment"}</p>
                          <p className="text-sm mt-1">
                            {t.support?.noTicketsDesc || "Créez un ticket pour contacter le support"}
                          </p>
                        </div>
                      ) : (
                        tickets.map((ticket) => (
                          <Card
                            key={ticket.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => openTicket(ticket.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-sm line-clamp-1">{ticket.subject}</h3>
                                {ticket.unread_count! > 0 && (
                                  <Badge variant="destructive" className="ml-2">
                                    {ticket.unread_count}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-2 items-center">
                                <Badge className={getStatusColor(ticket.status)}>{getStatusLabel(ticket.status)}</Badge>
                                <Badge className={getPriorityColor(ticket.priority)}>
                                  {getPriorityLabel(ticket.priority)}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(ticket.created_at).toLocaleDateString(
                                  locale === "ar" ? "ar-SA" : locale === "en" ? "en-US" : "fr-FR",
                                )}
                              </p>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {view === "new" && (
              <div className="h-full overflow-y-auto p-4 space-y-4">
                <div>
                  <Label htmlFor="name">{t.support?.fullName || "Nom complet"} *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.support?.fullName || "Votre nom"}
                  />
                </div>

                <div>
                  <Label htmlFor="email">{t.support?.email || "Email"} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.support?.emailLabel || "votre@email.com"}
                  />
                </div>

                <div>
                  <Label htmlFor="subject">{t.support?.subject || "Sujet"} *</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t.support?.subjectPlaceholder || "Résumez votre problème"}
                  />
                </div>

                <div>
                  <Label htmlFor="message">{t.support?.message || "Message"} *</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.support?.messagePlaceholder || "Décrivez votre problème en détail..."}
                    rows={6}
                  />
                </div>

                <Button
                  onClick={createTicket}
                  disabled={loading || !name || !email || !subject || !message}
                  className="w-full bg-gradient-to-r from-cyan-500 to-rose-500"
                >
                  {loading ? t.support?.sending || "Envoi..." : t.support?.submit || "Créer le ticket"}
                </Button>
              </div>
            )}

            {view === "chat" && selectedTicketId && userId && (
              <SupportChatPanel ticketId={selectedTicketId} userId={userId} userName={name} />
            )}

            {view === "live-chat" && liveChatTicketId && (
              <SupportChatPanel ticketId={liveChatTicketId} userId={userId || "anonymous"} userName={name} />
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}
