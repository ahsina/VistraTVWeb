"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [webhookLogs, setWebhookLogs] = useState<any[]>([])
  const [activityLogs, setActivityLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchLogs()
  }, [filter])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const [logsRes, webhooksRes, activityRes] = await Promise.all([
        fetch(`/api/admin/logs?type=${filter}`),
        fetch("/api/admin/logs/webhooks"),
        fetch("/api/admin/activity-log"),
      ])

      if (logsRes.ok) setLogs(await logsRes.json())
      if (webhooksRes.ok) setWebhookLogs(await webhooksRes.json())
      if (activityRes.ok) setActivityLogs(await activityRes.json())
    } catch (error) {
      console.error("Error fetching logs:", error)
    }
    setLoading(false)
  }

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "destructive"
      case "warn":
        return "warning"
      case "info":
        return "default"
      default:
        return "secondary"
    }
  }

  const filteredLogs = logs.filter(
    (log) => search === "" || JSON.stringify(log).toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Logs Système</h1>
        <p className="text-muted-foreground mt-2">Surveillez et debuggez les événements système</p>
      </div>

      <Tabs defaultValue="errors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="errors">Erreurs</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="activity">Activité Admin</TabsTrigger>
        </TabsList>

        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Rechercher dans les logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="error">Erreurs</SelectItem>
              <SelectItem value="warn">Warnings</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchLogs} variant="outline">
            Actualiser
          </Button>
        </div>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs d'Erreurs</CardTitle>
              <CardDescription>Erreurs et warnings système</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Chargement...</p>
              ) : filteredLogs.length === 0 ? (
                <p className="text-muted-foreground">Aucun log trouvé</p>
              ) : (
                <div className="space-y-3">
                  {filteredLogs.map((log: any) => (
                    <div key={log.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={getLogLevelColor(log.level) as any}>{log.level}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="font-medium">{log.message}</p>
                      {log.metadata && (
                        <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs Webhooks</CardTitle>
              <CardDescription>Historique des callbacks PayGate.to</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Chargement...</p>
              ) : webhookLogs.length === 0 ? (
                <p className="text-muted-foreground">Aucun webhook trouvé</p>
              ) : (
                <div className="space-y-3">
                  {webhookLogs.map((log: any) => (
                    <div key={log.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge>{log.provider}</Badge>
                          <Badge variant="outline">{log.event}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span>
                          <strong>Status:</strong> {log.status}
                        </span>
                        <span>
                          <strong>Temps:</strong> {log.processing_time_ms}ms
                        </span>
                      </div>
                      {log.payload && (
                        <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activité Admin</CardTitle>
              <CardDescription>Actions effectuées par les administrateurs</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Chargement...</p>
              ) : activityLogs.length === 0 ? (
                <p className="text-muted-foreground">Aucune activité trouvée</p>
              ) : (
                <div className="space-y-3">
                  {activityLogs.map((log: any) => (
                    <div key={log.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{log.action}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">
                        <strong>Admin:</strong> {log.admin_email}
                      </p>
                      <p className="text-sm">
                        <strong>Entity:</strong> {log.entity_type} ({log.entity_id})
                      </p>
                      {log.metadata && (
                        <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
