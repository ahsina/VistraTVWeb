"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, AlertCircle, Clock, CheckCircle, Search, Filter } from "@/lib/icons"
import { format } from "@/lib/utils/date-formatter"
import { TicketChat } from "./ticket-chat"

type Ticket = {
  id: string
  user_id: string
  subject: string
  message: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  assigned_to: string | null
  created_at: string
  updated_at: string
  name: string | null
  email: string | null
}

type Stats = {
  open: number
  inProgress: number
  resolved: number
  closed: number
}

export function SupportTicketsManager({ adminId }: { adminId: string }) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [stats, setStats] = useState<Stats>({
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchTickets()
  }, [])

  useEffect(() => {
    filterTickets()
  }, [tickets, searchTerm, statusFilter, priorityFilter])

  async function fetchTickets() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      setTickets(data || [])
      calculateStats(data || [])
    } catch (error) {
      console.error("Error fetching tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  function calculateStats(ticketsData: Ticket[]) {
    setStats({
      open: ticketsData.filter((t) => t.status === "open").length,
      inProgress: ticketsData.filter((t) => t.status === "in_progress").length,
      resolved: ticketsData.filter((t) => t.status === "resolved").length,
      closed: ticketsData.filter((t) => t.status === "closed").length,
    })
  }

  function filterTickets() {
    let filtered = tickets

    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.message?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.priority === priorityFilter)
    }

    setFilteredTickets(filtered)
  }

  async function updateTicketStatus(ticketId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", ticketId)

      if (error) throw error

      await fetchTickets()
    } catch (error) {
      console.error("Error updating ticket status:", error)
    }
  }

  async function assignTicket(ticketId: string) {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({
          assigned_to: adminId,
          status: "in_progress",
          updated_at: new Date().toISOString(),
        })
        .eq("id", ticketId)

      if (error) throw error

      await fetchTickets()
      setSelectedTicket(null)
    } catch (error) {
      console.error("Error assigning ticket:", error)
    }
  }

  async function sendResponse() {
    if (!selectedTicket || !response.trim()) return

    try {
      // Here you would typically send an email or notification
      // For now, we'll just update the ticket status
      await updateTicketStatus(selectedTicket.id, "resolved")
      setResponse("")
      setSelectedTicket(null)
    } catch (error) {
      console.error("Error sending response:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      open: "destructive",
      in_progress: "secondary",
      resolved: "default",
      closed: "outline",
    }
    return (
      <Badge variant={variants[status] || "default"}>
        {status === "open" && "Ouvert"}
        {status === "in_progress" && "En cours"}
        {status === "resolved" && "Résolu"}
        {status === "closed" && "Fermé"}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-blue-500/10 text-blue-500",
      medium: "bg-yellow-500/10 text-yellow-500",
      high: "bg-orange-500/10 text-orange-500",
      urgent: "bg-red-500/10 text-red-500",
    }
    return (
      <Badge className={colors[priority] || ""}>
        {priority === "low" && "Basse"}
        {priority === "medium" && "Moyenne"}
        {priority === "high" && "Haute"}
        {priority === "urgent" && "Urgente"}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Chargement des tickets...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-rose-400 bg-clip-text text-transparent">
          Support Client
        </h1>
        <p className="text-muted-foreground mt-1">Gestion des tickets de support</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ouverts</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.open}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résolus</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fermés</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.closed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par sujet, message, utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les status</SelectItem>
                <SelectItem value="open">Ouvert</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="resolved">Résolu</SelectItem>
                <SelectItem value="closed">Fermé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <AlertCircle className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes priorités</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="high">Haute</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="low">Basse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigné à</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucun ticket trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{format(new Date(ticket.created_at), "dd MMM yyyy")}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ticket.name || "N/A"}</div>
                          <div className="text-sm text-muted-foreground">{ticket.email || "N/A"}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
                      <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>
                        {ticket.assigned_to ? (
                          <span>Assigné</span>
                        ) : (
                          <span className="text-muted-foreground">Non assigné</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedTicket(ticket)}>
                            Voir
                          </Button>
                          {!ticket.assigned_to && (
                            <Button size="sm" onClick={() => assignTicket(ticket.id)}>
                              Assigner
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Detail Dialog with Chat */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedTicket?.subject}</DialogTitle>
            <DialogDescription>
              Ticket de {selectedTicket?.name || "N/A"} -{" "}
              {selectedTicket?.created_at && format(new Date(selectedTicket.created_at), "dd MMMM yyyy à HH:mm")}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="chat" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">Chat en Direct</TabsTrigger>
              <TabsTrigger value="details">Détails</TabsTrigger>
            </TabsList>

            {/* Chat Tab with real-time messaging */}
            <TabsContent value="chat" className="flex-1 overflow-hidden">
              {selectedTicket && (
                <TicketChat
                  ticketId={selectedTicket.id}
                  adminId={adminId}
                  userName={selectedTicket.name || undefined}
                />
              )}
            </TabsContent>

            <TabsContent value="details" className="overflow-y-auto">
              <div className="space-y-4">
                <div className="flex gap-2">
                  {selectedTicket && getPriorityBadge(selectedTicket.priority)}
                  {selectedTicket && getStatusBadge(selectedTicket.status)}
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Message initial:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedTicket?.message}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Informations:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{selectedTicket?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assigné à:</span>
                      <span>
                        {selectedTicket?.assigned_to ? (
                          <span>Oui</span>
                        ) : (
                          <span className="text-muted-foreground">Non assigné</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {selectedTicket && !selectedTicket.assigned_to && (
                    <Button onClick={() => assignTicket(selectedTicket.id)}>Assigner à moi</Button>
                  )}
                  {selectedTicket && selectedTicket.status !== "in_progress" && (
                    <Button variant="outline" onClick={() => updateTicketStatus(selectedTicket.id, "in_progress")}>
                      Marquer en cours
                    </Button>
                  )}
                  {selectedTicket && selectedTicket.status !== "resolved" && (
                    <Button variant="outline" onClick={() => updateTicketStatus(selectedTicket.id, "resolved")}>
                      Marquer résolu
                    </Button>
                  )}
                  {selectedTicket && selectedTicket.status !== "closed" && (
                    <Button variant="outline" onClick={() => updateTicketStatus(selectedTicket.id, "closed")}>
                      Fermer
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <div className="text-sm text-muted-foreground">
        Affichage de {filteredTickets.length} ticket(s) sur {tickets.length} au total
      </div>
    </div>
  )
}
