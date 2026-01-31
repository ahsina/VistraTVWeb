// components/admin/logs-dashboard.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Bug,
  Search,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Webhook,
  Mail,
  Activity,
} from "lucide-react"

interface SystemLog {
  id: string
  level: string
  category: string
  message: string
  stack_trace: string | null
  metadata: Record<string, unknown> | null
  user_id: string | null
  ip_address: string | null
  created_at: string
}

interface WebhookLog {
  id: string
  provider: string
  event_type: string
  payload: Record<string, unknown>
  status: string
  response: string | null
  transaction_id: string | null
  ip_address: string | null
  processed_at: string | null
  created_at: string
}

interface EmailLog {
  id: string
  recipient: string
  subject: string
  status: string
  error_message: string | null
  template: string | null
  created_at: string
}

const levelIcons: Record<string, React.ReactNode> = {
  error: <AlertCircle className="w-4 h-4 text-red-500" />,
  warn: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
  info: <Info className="w-4 h-4 text-blue-500" />,
  debug: <Bug className="w-4 h-4 text-gray-500" />,
}

const levelColors: Record<string, string> = {
  error: "bg-red-500/20 text-red-300 border-red-500/30",
  warn: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  info: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  debug: "bg-gray-500/20 text-gray-300 border-gray-500/30",
}

const statusColors: Record<string, string> = {
  sent: "bg-green-500/20 text-green-300",
  processed: "bg-green-500/20 text-green-300",
  received: "bg-blue-500/20 text-blue-300",
  pending: "bg-yellow-500/20 text-yellow-300",
  failed: "bg-red-500/20 text-red-300",
  error: "bg-red-500/20 text-red-300",
}

export function LogsDashboard() {
  const [activeTab, setActiveTab] = useState("system")
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([])
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([])
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([])
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [selectedLog, setSelectedLog] = useState<SystemLog | WebhookLog | EmailLog | null>(null)
  
  // Filtres
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<string>("24h")

  const supabase = createClient()

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true)
      const now = new Date()
      let startDate = new Date()

      switch (dateRange) {
        case "1h":
          startDate.setHours(now.getHours() - 1)
          break
        case "24h":
          startDate.setDate(now.getDate() - 1)
          break
        case "7d":
          startDate.setDate(now.getDate() - 7)
          break
        case "30d":
          startDate.setDate(now.getDate() - 30)
          break
      }

      // System Logs
      let systemQuery = supabase
        .from("system_logs")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false })
        .limit(100)

      if (levelFilter !== "all") {
        systemQuery = systemQuery.eq("level", levelFilter)
      }
      if (categoryFilter !== "all") {
        systemQuery = systemQuery.eq("category", categoryFilter)
      }

      const { data: sysData } = await systemQuery
      setSystemLogs(sysData || [])

      // Webhook Logs
      const { data: webhookData } = await supabase
        .from("webhook_logs")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false })
        .limit(100)

      setWebhookLogs(webhookData || [])

      // Email Logs
      const { data: emailData } = await supabase
        .from("email_logs")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false })
        .limit(100)

      setEmailLogs(emailData || [])
    } catch (error) {
      console.error("[v0] Error fetching logs:", error)
    } finally {
      setLoading(false)
    }
  }, [dateRange, levelFilter, categoryFilter])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(fetchLogs, 10000) // Toutes les 10 secondes
    return () => clearInterval(interval)
  }, [autoRefresh, fetchLogs])

  // Realtime subscriptions
  useEffect(() => {
    const systemChannel = supabase
      .channel("system-logs-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "system_logs" },
        (payload) => {
          setSystemLogs((prev) => [payload.new as SystemLog, ...prev.slice(0, 99)])
        }
      )
      .subscribe()

    const webhookChannel = supabase
      .channel("webhook-logs-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "webhook_logs" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setWebhookLogs((prev) => [payload.new as WebhookLog, ...prev.slice(0, 99)])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(systemChannel)
      supabase.removeChannel(webhookChannel)
    }
  }, [])

  const filteredSystemLogs = systemLogs.filter((log) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      log.message.toLowerCase().includes(query) ||
      log.category.toLowerCase().includes(query) ||
      (log.metadata && JSON.stringify(log.metadata).toLowerCase().includes(query))
    )
  })

  const exportLogs = () => {
    let data: unknown[]
    let filename: string

    switch (activeTab) {
      case "system":
        data = filteredSystemLogs
        filename = "system_logs"
        break
      case "webhook":
        data = webhookLogs
        filename = "webhook_logs"
        break
      case "email":
        data = emailLogs
        filename = "email_logs"
        break
      default:
        return
    }

    const csv = convertToCSV(data)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  const convertToCSV = (data: unknown[]) => {
    if (data.length === 0) return ""
    const headers = Object.keys(data[0] as object)
    const rows = data.map((row) =>
      headers.map((h) => JSON.stringify((row as Record<string, unknown>)[h] ?? "")).join(",")
    )
    return [headers.join(","), ...rows].join("\n")
  }

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(date))
  }

  // Statistiques
  const errorCount = systemLogs.filter((l) => l.level === "error").length
  const warnCount = systemLogs.filter((l) => l.level === "warn").length
  const webhookFailedCount = webhookLogs.filter((l) => l.status === "failed").length
  const emailFailedCount = emailLogs.filter((l) => l.status === "failed" || l.status === "error").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Journal d'Activité</h1>
          <p className="text-gray-400">Surveillance en temps réel des logs système</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "bg-green-600" : ""}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
            Auto-refresh
          </Button>
          <Button variant="outline" size="sm" onClick={fetchLogs}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Rafraîchir
          </Button>
          <Button variant="outline" size="sm" onClick={exportLogs}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-300">Erreurs</p>
                <p className="text-2xl font-bold text-red-400">{errorCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-300">Warnings</p>
                <p className="text-2xl font-bold text-yellow-400">{warnCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300">Webhooks échoués</p>
                <p className="text-2xl font-bold text-purple-400">{webhookFailedCount}</p>
              </div>
              <Webhook className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/10 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-300">Emails échoués</p>
                <p className="text-2xl font-bold text-orange-400">{emailFailedCount}</p>
              </div>
              <Mail className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10"
          />
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[150px] bg-white/5 border-white/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Dernière heure</SelectItem>
            <SelectItem value="24h">24 heures</SelectItem>
            <SelectItem value="7d">7 jours</SelectItem>
            <SelectItem value="30d">30 jours</SelectItem>
          </SelectContent>
        </Select>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[150px] bg-white/5 border-white/10">
            <SelectValue placeholder="Niveau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les niveaux</SelectItem>
            <SelectItem value="error">Erreurs</SelectItem>
            <SelectItem value="warn">Warnings</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="debug">Debug</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px] bg-white/5 border-white/10">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="payment">Paiement</SelectItem>
            <SelectItem value="auth">Authentification</SelectItem>
            <SelectItem value="api">API</SelectItem>
            <SelectItem value="cron">Cron</SelectItem>
            <SelectItem value="database">Database</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/5">
          <TabsTrigger value="system" className="data-[state=active]:bg-white/10">
            <Activity className="w-4 h-4 mr-2" />
            Système ({systemLogs.length})
          </TabsTrigger>
          <TabsTrigger value="webhook" className="data-[state=active]:bg-white/10">
            <Webhook className="w-4 h-4 mr-2" />
            Webhooks ({webhookLogs.length})
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-white/10">
            <Mail className="w-4 h-4 mr-2" />
            Emails ({emailLogs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="mt-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400">Niveau</TableHead>
                    <TableHead className="text-gray-400">Catégorie</TableHead>
                    <TableHead className="text-gray-400">Message</TableHead>
                    <TableHead className="text-gray-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSystemLogs.map((log) => (
                    <TableRow key={log.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-gray-300 text-sm">
                        {formatDate(log.created_at)}
                      </TableCell>
                      <TableCell>
                        <Badge className={levelColors[log.level]}>
                          <span className="flex items-center gap-1">
                            {levelIcons[log.level]}
                            {log.level}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">{log.category}</TableCell>
                      <TableCell className="text-gray-300 max-w-md truncate">
                        {log.message}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhook" className="mt-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400">Provider</TableHead>
                    <TableHead className="text-gray-400">Event</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Transaction</TableHead>
                    <TableHead className="text-gray-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhookLogs.map((log) => (
                    <TableRow key={log.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-gray-300 text-sm">
                        {formatDate(log.created_at)}
                      </TableCell>
                      <TableCell className="text-gray-300">{log.provider}</TableCell>
                      <TableCell className="text-gray-300">{log.event_type}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[log.status] || "bg-gray-500/20"}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300 font-mono text-xs">
                        {log.transaction_id?.substring(0, 8) || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="mt-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400">Destinataire</TableHead>
                    <TableHead className="text-gray-400">Sujet</TableHead>
                    <TableHead className="text-gray-400">Template</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailLogs.map((log) => (
                    <TableRow key={log.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-gray-300 text-sm">
                        {formatDate(log.created_at)}
                      </TableCell>
                      <TableCell className="text-gray-300">{log.recipient}</TableCell>
                      <TableCell className="text-gray-300 max-w-xs truncate">
                        {log.subject}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {log.template || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[log.status] || "bg-gray-500/20"}>
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="bg-gray-900 border-white/10 max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Détails du log</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <pre className="bg-black/30 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                {JSON.stringify(selectedLog, null, 2)}
              </pre>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LogsDashboard
