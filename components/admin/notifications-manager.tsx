"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, AlertTriangle, Info, XCircle } from "@/lib/icons"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  priority: string
  is_read: boolean
  link?: string
  created_at: string
}

export default function NotificationsManager({
  initialNotifications,
}: {
  initialNotifications: Notification[]
}) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const markAsRead = async (id: string) => {
    const response = await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_read: true }),
    })

    if (response.ok) {
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
    }
  }

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)

    await Promise.all(
      unreadIds.map((id) =>
        fetch("/api/admin/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, is_read: true }),
        }),
      ),
    )

    setNotifications(notifications.map((n) => ({ ...n, is_read: true })))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "success":
        return <Check className="w-5 h-5 text-green-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.is_read) : notifications

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="bg-white/10 border-white/20"
          >
            Toutes ({notifications.length})
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
            className="bg-white/10 border-white/20"
          >
            <Bell className="w-4 h-4 mr-2" />
            Non lues ({unreadCount})
          </Button>
        </div>

        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline" className="bg-white/10 border-white/20">
            <Check className="w-4 h-4 mr-2" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Aucune notification</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`bg-white/5 border-white/10 transition-all ${
                !notification.is_read ? "border-l-4 border-l-blue-500" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        {notification.title}
                        {!notification.is_read && (
                          <Badge variant="default" className="bg-blue-500">
                            Nouveau
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={
                            notification.priority === "high"
                              ? "border-red-500 text-red-500"
                              : "border-gray-500 text-gray-400"
                          }
                        >
                          {notification.priority === "high" ? "Urgent" : "Normal"}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(notification.created_at).toLocaleString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  {!notification.is_read && (
                    <Button
                      onClick={() => markAsRead(notification.id)}
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-white"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{notification.message}</p>
                {notification.link && (
                  <Button asChild size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700">
                    <a href={notification.link}>Voir les détails</a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
