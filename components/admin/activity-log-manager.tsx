"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "@/lib/utils/date-formatter"
import { CalendarIcon, Search } from "lucide-react"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"

interface ActivityLog {
  id: string
  admin_email: string
  action: string
  resource_type: string
  resource_id: string | null
  details: any
  ip_address: string | null
  created_at: string
}

export function ActivityLogManager() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()

  useEffect(() => {
    fetchLogs()
  }, [dateFrom, dateTo])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      let url = "/api/admin/activity-log?"
      if (dateFrom) url += `from=${dateFrom.toISOString()}&`
      if (dateTo) url += `to=${dateTo.toISOString()}`

      const response = await fetch(url)
      const data = await response.json()
      setLogs(data.logs || [])
    } catch (error) {
      console.error("Error fetching activity logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter(
    (log) =>
      log.admin_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource_type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getActionBadgeColor = (action: string) => {
    if (action.includes("create")) return "bg-green-500/10 text-green-500"
    if (action.includes("update")) return "bg-blue-500/10 text-blue-500"
    if (action.includes("delete")) return "bg-red-500/10 text-red-500"
    return "bg-gray-500/10 text-gray-500"
  }

  if (loading) {
    return <LoadingSkeleton type="table" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des Actions</CardTitle>
        <CardDescription>{filteredLogs.length} entrée(s) trouvée(s)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par email, action ou ressource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full sm:w-[200px]")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom) : "Date début"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full sm:w-[200px]")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo) : "Date fin"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
            </PopoverContent>
          </Popover>

          {(dateFrom || dateTo || searchTerm) && (
            <Button
              variant="ghost"
              onClick={() => {
                setDateFrom(undefined)
                setDateTo(undefined)
                setSearchTerm("")
              }}
            >
              Réinitialiser
            </Button>
          )}
        </div>

        {/* Logs List */}
        <div className="space-y-2">
          {filteredLogs.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">Aucune activité trouvée</div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className={getActionBadgeColor(log.action)}>{log.action}</Badge>
                    <span className="text-sm font-medium">{log.resource_type}</span>
                    {log.resource_id && (
                      <span className="text-xs text-muted-foreground">ID: {log.resource_id.slice(0, 8)}...</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Par <span className="font-medium">{log.admin_email}</span>
                    {log.ip_address && <span className="ml-2">depuis {log.ip_address}</span>}
                  </div>
                  {log.details && Object.keys(log.details).length > 0 && (
                    <details className="text-xs text-muted-foreground">
                      <summary className="cursor-pointer hover:underline">Voir les détails</summary>
                      <pre className="mt-2 rounded bg-muted p-2 overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(new Date(log.created_at))}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
