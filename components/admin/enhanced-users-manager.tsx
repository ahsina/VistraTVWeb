"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, Search, UserCheck, UserX, Download, Eye } from "@/lib/icons"
import { format } from "@/lib/utils/date-formatter"

type UserProfile = {
  id: string
  full_name: string
  email: string
  created_at: string
  language: string
  subscription_status: string
}

type UserDetails = {
  profile: UserProfile
  subscriptions: any[]
  payments: any[]
  tickets: any[]
}

export function EnhancedUsersManager() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    withSubscription: 0,
    withoutSubscription: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm])

  async function fetchUsers() {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("user_profiles").select("*").order("created_at", { ascending: false })

      if (error) throw error

      setUsers(data || [])
      calculateStats(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  function calculateStats(usersData: UserProfile[]) {
    const withSub = usersData.filter((u) => u.subscription_status === "active").length
    setStats({
      total: usersData.length,
      withSubscription: withSub,
      withoutSubscription: usersData.length - withSub,
    })
  }

  function filterUsers() {
    if (!searchTerm) {
      setFilteredUsers(users)
      return
    }

    const filtered = users.filter(
      (user) =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setFilteredUsers(filtered)
  }

  async function viewUserDetails(userId: string) {
    try {
      const [{ data: profile }, { data: subscriptions }, { data: payments }, { data: tickets }] = await Promise.all([
        supabase.from("user_profiles").select("*").eq("id", userId).single(),
        supabase.from("subscriptions").select("*, subscription_plans(name)").eq("user_id", userId),
        supabase.from("payments").select("*").eq("user_id", userId).order("payment_date", { ascending: false }),
        supabase.from("support_tickets").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      ])

      setSelectedUser({
        profile: profile!,
        subscriptions: subscriptions || [],
        payments: payments || [],
        tickets: tickets || [],
      })
    } catch (error) {
      console.error("Error fetching user details:", error)
    }
  }

  function exportUsers() {
    const headers = ["Nom", "Email", "Date Inscription", "Langue", "Status Abonnement"]
    const rows = filteredUsers.map((user) => [
      user.full_name || "N/A",
      user.email,
      format(new Date(user.created_at), "dd/MM/yyyy"),
      user.language,
      user.subscription_status || "none",
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `utilisateurs_${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Chargement des utilisateurs...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-rose-400 bg-clip-text text-transparent">
            Gestion des Utilisateurs
          </h1>
          <p className="text-muted-foreground mt-1">Vue complète de tous les utilisateurs de la plateforme</p>
        </div>
        <Button onClick={exportUsers} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avec Abonnement</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withSubscription}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sans Abonnement</CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withoutSubscription}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date Inscription</TableHead>
                  <TableHead>Langue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name || "N/A"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{format(new Date(user.created_at), "dd MMM yyyy")}</TableCell>
                      <TableCell className="uppercase">{user.language}</TableCell>
                      <TableCell>
                        {user.subscription_status === "active" ? (
                          <Badge variant="default">Actif</Badge>
                        ) : (
                          <Badge variant="secondary">Inactif</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => viewUserDetails(user.id)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedUser?.profile?.full_name}</DialogTitle>
            <DialogDescription>{selectedUser?.profile?.email}</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* Profile Info */}
              <div>
                <h4 className="font-semibold mb-2">Informations</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Inscription:</span>{" "}
                    {format(new Date(selectedUser.profile.created_at), "dd MMMM yyyy")}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Langue:</span> {selectedUser.profile.language.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Subscriptions */}
              <div>
                <h4 className="font-semibold mb-2">Abonnements ({selectedUser.subscriptions.length})</h4>
                {selectedUser.subscriptions.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.subscriptions.map((sub: any) => (
                      <div key={sub.id} className="p-3 rounded-lg bg-background/50 flex justify-between">
                        <div>
                          <p className="font-medium">{sub.subscription_plans?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Du {format(new Date(sub.start_date), "dd/MM/yyyy")} au{" "}
                            {format(new Date(sub.end_date), "dd/MM/yyyy")}
                          </p>
                        </div>
                        <Badge variant={sub.status === "active" ? "default" : "secondary"}>{sub.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun abonnement</p>
                )}
              </div>

              {/* Payments */}
              <div>
                <h4 className="font-semibold mb-2">Paiements ({selectedUser.payments.length})</h4>
                {selectedUser.payments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.payments.slice(0, 5).map((payment: any) => (
                      <div key={payment.id} className="p-3 rounded-lg bg-background/50 flex justify-between">
                        <div>
                          <p className="font-medium">
                            {payment.amount} {payment.currency}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(payment.payment_date), "dd MMMM yyyy")}
                          </p>
                        </div>
                        <Badge variant={payment.payment_status === "completed" ? "default" : "destructive"}>
                          {payment.payment_status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun paiement</p>
                )}
              </div>

              {/* Support Tickets */}
              <div>
                <h4 className="font-semibold mb-2">Tickets Support ({selectedUser.tickets.length})</h4>
                {selectedUser.tickets.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.tickets.slice(0, 3).map((ticket: any) => (
                      <div key={ticket.id} className="p-3 rounded-lg bg-background/50">
                        <p className="font-medium text-sm">{ticket.subject}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{ticket.priority}</Badge>
                          <Badge variant="secondary">{ticket.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun ticket</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="text-sm text-muted-foreground">
        Affichage de {filteredUsers.length} utilisateur(s) sur {users.length} au total
      </div>
    </div>
  )
}
