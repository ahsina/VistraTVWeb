"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, User, UserCog } from "@/lib/icons"
import { format } from "@/lib/utils/date-formatter"
import { useLanguage } from "@/lib/i18n/LanguageContext"

type Message = {
  id: string
  ticket_id: string
  sender_id: string | null
  sender_type: "user" | "admin"
  message: string
  is_read: boolean
  created_at: string
}

type SupportChatPanelProps = {
  ticketId: string
  userId: string
  userName?: string
}

export function SupportChatPanel({ ticketId, userId, userName }: SupportChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const { t } = useLanguage()

  useEffect(() => {
    console.log("[v0] Chat panel mounted for ticket:", ticketId)
    fetchMessages()
    const unsubscribe = subscribeToMessages()
    return unsubscribe
  }, [ticketId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function fetchMessages() {
    try {
      console.log("[v0] Fetching messages for ticket:", ticketId)
      setLoading(true)
      const { data, error } = await supabase
        .from("ticket_messages")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true })

      if (error) throw error

      console.log("[v0] Fetched messages:", data?.length || 0)
      setMessages(data || [])
      markMessagesAsRead()
    } catch (error) {
      console.error("[v0] Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  async function markMessagesAsRead() {
    try {
      await supabase
        .from("ticket_messages")
        .update({ is_read: true })
        .eq("ticket_id", ticketId)
        .eq("sender_type", "admin")
        .eq("is_read", false)
    } catch (error) {
      console.error("[v0] Error marking messages as read:", error)
    }
  }

  function subscribeToMessages() {
    console.log("[v0] Subscribing to realtime messages for ticket:", ticketId)
    const channel = supabase
      .channel(`ticket-${ticketId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ticket_messages",
          filter: `ticket_id=eq.${ticketId}`,
        },
        (payload) => {
          console.log("[v0] New message received via realtime:", payload)
          const newMsg = payload.new as Message
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) {
              console.log("[v0] Message already exists, skipping")
              return prev
            }
            console.log("[v0] Adding new message to list")
            return [...prev, newMsg]
          })
          if (newMsg.sender_type === "admin") {
            markMessagesAsRead()
          }
        },
      )
      .subscribe((status) => {
        console.log("[v0] Realtime subscription status:", status)
      })

    return () => {
      console.log("[v0] Unsubscribing from realtime")
      supabase.removeChannel(channel)
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || sending) return

    const messageText = newMessage.trim()
    const tempId = `temp-${Date.now()}`

    const optimisticMessage: Message = {
      id: tempId,
      ticket_id: ticketId,
      sender_id: userId === "anonymous" ? null : userId,
      sender_type: "user",
      message: messageText,
      is_read: false,
      created_at: new Date().toISOString(),
    }

    try {
      console.log("[v0] Sending message:", messageText)
      setSending(true)

      setMessages((prev) => [...prev, optimisticMessage])
      setNewMessage("")

      const response = await fetch("/api/support/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket_id: ticketId,
          sender_id: userId,
          sender_type: "user",
          message: messageText,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to send message")
      }

      const result = await response.json()
      console.log("[v0] Message sent successfully:", result)

      setMessages((prev) => prev.map((m) => (m.id === tempId ? result.message : m)))
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
      setNewMessage(messageText) // Restore message text
      alert("Erreur lors de l'envoi du message. Veuillez réessayer.")
    } finally {
      setSending(false)
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">{t.support?.chat?.loading || "Chargement..."}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {t.support?.chat?.noMessages || "Aucun message. Commencez la conversation!"}
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender_type === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {msg.sender_type === "admin" ? <UserCog className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>

              <div className={`flex flex-col ${msg.sender_type === "user" ? "items-end" : "items-start"} flex-1`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">
                    {msg.sender_type === "admin"
                      ? t.support?.chat?.support || "Support"
                      : userName || t.support?.chat?.you || "Vous"}
                  </span>
                  <span className="text-xs text-muted-foreground">{format(new Date(msg.created_at))}</span>
                </div>

                <Card
                  className={`max-w-[85%] ${
                    msg.sender_type === "user" ? "bg-gradient-to-r from-cyan-500/10 to-rose-500/10" : "bg-muted"
                  }`}
                >
                  <CardContent className="p-3">
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder={t.support?.chat?.yourMessage || "Votre message..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            disabled={sending}
          />
          <Button onClick={sendMessage} disabled={!newMessage.trim() || sending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{t.support?.chat?.pressEnter || "Entrée pour envoyer"}</p>
      </div>
    </div>
  )
}
