"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, User, UserCog } from "@/lib/icons"
import { format } from "@/lib/utils/date-formatter"

type Message = {
  id: string
  ticket_id: string
  sender_id: string
  sender_type: "user" | "admin"
  message: string
  is_read: boolean
  created_at: string
  sender_name?: string
}

type TicketChatProps = {
  ticketId: string
  adminId: string
  userName?: string
}

export function TicketChat({ ticketId, adminId, userName }: TicketChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchMessages()
    subscribeToMessages()
  }, [ticketId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function fetchMessages() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("ticket_messages")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true })

      if (error) throw error

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
        .eq("sender_type", "user")
        .eq("is_read", false)
    } catch (error) {
      console.error("[v0] Error marking messages as read:", error)
    }
  }

  function subscribeToMessages() {
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
          console.log("[v0] New message received:", payload)
          setMessages((prev) => [...prev, payload.new as Message])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  async function sendMessage() {
    if (!newMessage.trim()) return

    try {
      const { error } = await supabase.from("ticket_messages").insert({
        ticket_id: ticketId,
        sender_id: adminId,
        sender_type: "admin",
        message: newMessage.trim(),
      })

      if (error) throw error

      setNewMessage("")
    } catch (error) {
      console.error("[v0] Error sending message:", error)
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement des messages...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[500px]">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">Aucun message. Commencez la conversation!</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender_type === "admin" ? "flex-row-reverse" : "flex-row"}`}>
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {msg.sender_type === "admin" ? <UserCog className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>

              <div className={`flex flex-col ${msg.sender_type === "admin" ? "items-end" : "items-start"} flex-1`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">
                    {msg.sender_type === "admin" ? "Admin" : userName || "Utilisateur"}
                  </span>
                  <span className="text-xs text-muted-foreground">{format(new Date(msg.created_at), "HH:mm")}</span>
                </div>

                <Card
                  className={`max-w-[70%] ${
                    msg.sender_type === "admin" ? "bg-gradient-to-r from-cyan-500/10 to-rose-500/10" : "bg-muted"
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
            placeholder="Écrivez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Appuyez sur Entrée pour envoyer</p>
      </div>
    </div>
  )
}
