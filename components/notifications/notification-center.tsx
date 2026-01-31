// components/notifications/notification-center.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bell,
  Check,
  CheckCheck,
  X,
  CreditCard,
  Ticket,
  Users,
  AlertTriangle,
  Info,
  Gift,
  Settings,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  priority: "low" | "normal" | "high" | "urgent"
  link: string | null
  is_read: boolean
  created_at: string
}

const notificationIcons: Record<string, React.ReactNode> = {
  payment_completed: <CreditCard className="w-4 h-4 text-green-400" />,
  payment_failed: <CreditCard className="w-4 h-4 text-red-400" />,
  new_ticket: <Ticket className="w-4 h-4 text-purple-400" />,
  ticket_reply: <Ticket className="w-4 h-4 text-blue-400" />,
  new_user: <Users className="w-4 h-4 text-cyan-400" />,
  new_affiliate: <Users className="w-4 h-4 text-orange-400" />,
  error_alert: <AlertTriangle className="w-4 h-4 text-red-400" />,
  promo_used: <Gift className="w-4 h-4 text-pink-400" />,
  system: <Info className="w-4 h-4 text-gray-400" />,
  default: <Bell className="w-4 h-4 text-gray-400" />,
}

const priorityColors: Record<string, string> = {
  low: "border-l-gray-500",
  normal: "border-l-blue-500",
  high: "border-l-orange-500",
  urgent: "border-l-red-500",
}

interface NotificationCenterProps {
  isAdmin?: boolean
}

export function NotificationCenter({ isAdmin = false }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const supabase = createClient()

  const fetchNotifications = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const table = isAdmin ? "admin_notifications" : "user_notifications"
      const filterField = isAdmin ? "admin_id" : "user_id"

      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20)

      if (error) throw error

      setNotifications(data || [])
      setUnreadCount((data || []).filter((n) => !n.is_read).length)
    } catch (error) {
      console.error("[v0] Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }, [isAdmin, supabase])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Realtime subscription
  useEffect(() => {
    const table = isAdmin ? "admin_notifications" : "user_notifications"

    const channel = supabase
      .channel(`${table}-realtime`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table },
        (payload) => {
          const newNotif = payload.new as Notification
          setNotifications((prev) => [newNotif, ...prev])
          setUnreadCount((prev) => prev + 1)

          // Play sound for urgent notifications
          if (newNotif.priority === "urgent" || newNotif.priority === "high") {
            playNotificationSound()
          }

          // Show browser notification
          showBrowserNotification(newNotif)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isAdmin, supabase])

  const playNotificationSound = () => {
    try {
      const audio = new Audio("/sounds/notification.mp3")
      audio.volume = 0.5
      audio.play().catch(() => {})
    } catch (error) {
      // Ignore audio errors
    }
  }

  const showBrowserNotification = (notif: Notification) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notif.title, {
        body: notif.message,
        icon: "/favicon.ico",
      })
    }
  }

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      return permission === "granted"
    }
    return false
  }

  const markAsRead = async (id: string) => {
    try {
      const table = isAdmin ? "admin_notifications" : "user_notifications"

      await supabase
        .from(table)
        .update({ is_read: true })
        .eq("id", id)

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("[v0] Error marking as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const table = isAdmin ? "admin_notifications" : "user_notifications"
      const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)

      if (unreadIds.length === 0) return

      await supabase
        .from(table)
        .update({ is_read: true })
        .in("id", unreadIds)

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("[v0] Error marking all as read:", error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const table = isAdmin ? "admin_notifications" : "user_notifications"

      await supabase.from(table).delete().eq("id", id)

      setNotifications((prev) => prev.filter((n) => n.id !== id))
      setUnreadCount((prev) =>
        notifications.find((n) => n.id === id && !n.is_read) ? prev - 1 : prev
      )
    } catch (error) {
      console.error("[v0] Error deleting notification:", error)
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "À l'instant"
    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`
    return date.toLocaleDateString("fr-FR")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-96 p-0 bg-gray-900 border-white/10"
        align="end"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-semibold text-white">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-gray-400 hover:text-white"
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Tout lire
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={requestNotificationPermission}
              className="h-8 w-8"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <Bell className="w-8 h-8 mb-2" />
              <p>Aucune notification</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 hover:bg-white/5 transition-colors border-l-2 ${
                    priorityColors[notif.priority]
                  } ${!notif.is_read ? "bg-white/5" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {notificationIcons[notif.type] || notificationIcons.default}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium ${!notif.is_read ? "text-white" : "text-gray-300"}`}>
                          {notif.title}
                        </p>
                        <div className="flex items-center gap-1 shrink-0">
                          {!notif.is_read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => markAsRead(notif.id)}
                              className="h-6 w-6"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notif.id)}
                            className="h-6 w-6 text-gray-500 hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(notif.created_at)}
                        </span>
                        {notif.link && (
                          <Link
                            href={notif.link}
                            onClick={() => {
                              markAsRead(notif.id)
                              setOpen(false)
                            }}
                            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            Voir
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-2 border-t border-white/10">
          <Link
            href={isAdmin ? "/admin/dashboard/notifications" : "/dashboard/notifications"}
            onClick={() => setOpen(false)}
          >
            <Button variant="ghost" className="w-full text-sm">
              Voir toutes les notifications
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default NotificationCenter
