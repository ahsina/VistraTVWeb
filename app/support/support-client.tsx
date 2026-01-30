"use client"

import type React from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FadeIn } from "@/components/animations/FadeIn"
import { Mail, MessageCircle, Phone, Send, Plus, ArrowLeft } from "@/lib/icons"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { SupportChatPanel } from "@/components/support/support-chat-panel"

type Ticket = {
  id: string
  name: string
  email: string
  subject: string
  status: string
  priority: string
  created_at: string
  unread_count?: number
}

export default function SupportClientPage() {
  const [view, setView] = useState<"home" | "new" | "chat">("home")
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")

  // New ticket form
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [locale, setLocale] = useState("fr-FR") // Assuming locale is fetched or set somewhere

  const { t } = useLanguage()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (userId || userEmail) {
      fetchTickets()
    }
  }, [userId, userEmail])

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
      const { data } = await supabase.from("user_profiles").select("full_name, email").eq("id", uid).single()

      if (data?.full_name) {
        setUserName(data.full_name)
        setName(data.full_name)
      }
      if (data?.email) {
        setUserEmail(data.email)
        setEmail(data.email)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  async function fetchTickets() {
    try {
      let query = supabase.from("support_tickets").select("*").order("created_at", { ascending: false })

      if (userId) {
        query = query.eq("user_id", userId)
      } else if (userEmail) {
        query = query.eq("email", userEmail)
      }

      const { data, error } = await query

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
    } catch (error) {
      console.error("Error fetching tickets:", error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) return

    setIsSubmitting(true)

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
          `📧 ${t.support?.confirmationSent || "Un email de confirmation a été envoyé à"} ${email.trim()}\n\n` +
          `${t.support?.trackTicket || "Vous pouvez suivre votre ticket ci-dessous."}`,
      )

      // Open the newly created ticket
      const newTicket = result.data
      setSelectedTicket(newTicket)
      setView("chat")
      setSubject("")
      setMessage("")
      fetchTickets()
    } catch (error: any) {
      console.error("Error creating ticket:", error)
      alert(error.message || t.support?.errors?.createTicket || "Erreur lors de la création du ticket")
    } finally {
      setIsSubmitting(false)
    }
  }

  function openTicket(ticket: Ticket) {
    setSelectedTicket(ticket)
    setView("chat")
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "open":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "in_progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "resolved":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "closed":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "low":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
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
      <Header />
      <div className="relative min-h-screen py-8 sm:py-12 px-4 overflow-hidden">
        {/* Background blur circles */}
        <div className="blur-circle blur-circle-purple w-[600px] h-[600px] top-0 right-0" />
        <div className="blur-circle blur-circle-pink w-[500px] h-[500px] bottom-0 left-0" />
        <div className="blur-circle blur-circle-blue w-[400px] h-[400px] top-1/2 right-1/4" />

        {/* Main gradient background */}
        <div className="fixed inset-0 bg-gradient-main -z-10" />

        <div className="container mx-auto max-w-6xl relative z-10">
          {view === "home" && (
            <Link href="/" className="text-cyan-400 hover:text-rose-400 transition-colors mb-8 inline-block">
              ← {t.support?.backHome || "Retour à l'accueil"}
            </Link>
          )}

          {view !== "home" && (
            <Button
              variant="ghost"
              onClick={() => {
                setView("home")
                setSelectedTicket(null)
              }}
              className="text-cyan-400 hover:text-rose-400 transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.support?.back || "Retour"}
            </Button>
          )}

          {view === "home" && (
            <>
              <FadeIn direction="up" duration={0.6}>
                <div className="text-center mb-8 sm:mb-12">
                  <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-rose-400 mb-4">
                    {t.support?.title || "Centre de Support"}
                  </h1>
                  <p className="text-white/60 text-base sm:text-lg">
                    {t.support?.subtitle || "Nous sommes là pour vous aider 24/7"}
                  </p>
                </div>
              </FadeIn>

              <FadeIn direction="up" duration={0.7} delay={0.1}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                  <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center">
                    <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-cyan-500 to-rose-500 mb-4">
                      <Mail className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{t.support?.email || "Email"}</h3>
                    <p className="text-white/60 mb-4">support@vistratv.com</p>
                    <p className="text-white/80 text-sm">{t.support?.emailResponse || "Réponse sous 24h"}</p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center">
                    <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 mb-4">
                      <MessageCircle className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{t.support?.whatsapp || "WhatsApp"}</h3>
                    <p className="text-white/60 mb-4">+33 6 12 34 56 78</p>
                    <p className="text-white/80 text-sm">{t.support?.instantResponse || "Réponse instantanée"}</p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center">
                    <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 mb-4">
                      <Phone className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{t.support?.phone || "Téléphone"}</h3>
                    <p className="text-white/60 mb-4">+33 1 23 45 67 89</p>
                    <p className="text-white/80 text-sm">{t.support?.available || "Disponible 24/7"}</p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn direction="up" duration={0.7} delay={0.2}>
                <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl text-white">
                        {t.support?.myTickets || "Mes Tickets de Support"}
                      </CardTitle>
                      <Button onClick={() => setView("new")} className="bg-gradient-to-r from-cyan-500 to-rose-500">
                        <Plus className="h-4 w-4 mr-2" />
                        {t.support?.newTicket || "Nouveau Ticket"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {tickets.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageCircle className="h-16 w-16 mx-auto mb-4 text-white/20" />
                        <p className="text-white/60 mb-2">{t.support?.noTickets || "Aucun ticket pour le moment"}</p>
                        <p className="text-white/40 text-sm">
                          {t.support?.noTicketsDesc || "Créez un ticket pour contacter notre support"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {tickets.map((ticket) => (
                          <Card
                            key={ticket.id}
                            className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => openTicket(ticket)}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-white mb-2">{ticket.subject}</h3>
                                  <p className="text-sm text-white/60">
                                    Par {ticket.name} • {new Date(ticket.created_at).toLocaleDateString("fr-FR")}
                                  </p>
                                </div>
                                {ticket.unread_count! > 0 && (
                                  <Badge variant="destructive" className="ml-4">
                                    {ticket.unread_count} nouveau{ticket.unread_count! > 1 ? "x" : ""}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Badge className={getStatusColor(ticket.status)}>{getStatusLabel(ticket.status)}</Badge>
                                <Badge className={getPriorityColor(ticket.priority)}>
                                  Priorité: {getPriorityLabel(ticket.priority)}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </FadeIn>
            </>
          )}

          {view === "new" && (
            <FadeIn direction="up" duration={0.7}>
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    {t.support?.newTicket || "Créer un Nouveau Ticket"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-white">{t.support?.fullName || "Nom complet"} *</Label>
                        <Input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-white/5 border-white/10 text-white"
                          placeholder={t.support?.yourName || "Votre nom"}
                          required
                        />
                      </div>

                      <div>
                        <Label className="text-white">{t.support?.email || "Email"} *</Label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/5 border-white/10 text-white"
                          placeholder={t.support?.yourEmail || "votre@email.com"}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-white">{t.support?.subject || "Sujet"} *</Label>
                      <Input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder={t.support?.summarizeProblem || "Résumez votre problème"}
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-white">{t.support?.message || "Message"} *</Label>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder={t.support?.describeProblem || "Décrivez votre problème en détail..."}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-cyan-500 to-rose-500 text-white font-bold py-3"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isSubmitting
                        ? t.support?.submitting || "Envoi en cours..."
                        : t.support?.createTicket || "Créer le Ticket"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </FadeIn>
          )}

          {view === "chat" && selectedTicket && (
            <FadeIn direction="up" duration={0.7}>
              <Card className="bg-white/5 backdrop-blur-lg border-white/10 h-[700px] flex flex-col">
                <CardHeader className="bg-gradient-to-r from-cyan-500 to-rose-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{selectedTicket.subject}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getStatusColor(selectedTicket.status)}>
                          {getStatusLabel(selectedTicket.status)}
                        </Badge>
                        <Badge className={getPriorityColor(selectedTicket.priority)}>
                          {getPriorityLabel(selectedTicket.priority)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                  <SupportChatPanel
                    ticketId={selectedTicket.id}
                    userId={userId || "anonymous"}
                    userName={selectedTicket.name}
                  />
                </CardContent>
              </Card>
            </FadeIn>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
