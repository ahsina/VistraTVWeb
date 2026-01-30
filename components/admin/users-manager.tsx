"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Edit, Save, X } from "lucide-react"

type AdminProfile = {
  id: string
  email: string
  full_name: string | null
  is_admin: boolean
  created_at: string
}

export default function UsersManager({
  initialData,
}: {
  initialData: AdminProfile[]
}) {
  const [data, setData] = useState(initialData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    is_admin: true,
  })

  const handleSave = async () => {
    const supabase = createClient()

    if (editingId) {
      const { error } = await supabase
        .from("admin_profiles")
        .update({
          is_admin: formData.is_admin,
        })
        .eq("id", editingId)

      if (!error) {
        setData(data.map((item) => (item.id === editingId ? { ...item, is_admin: formData.is_admin } : item)))
        setEditingId(null)
      }
    }
  }

  const handleEdit = (item: AdminProfile) => {
    setEditingId(item.id)
    setFormData({
      is_admin: item.is_admin,
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({
      is_admin: true,
    })
  }

  return (
    <div className="space-y-6">
      {editingId && (
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Edit User Permissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_admin}
                onCheckedChange={(checked) => setFormData({ ...formData, is_admin: checked })}
              />
              <Label className="text-white">Admin Access</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {data.map((item) => (
          <Card key={item.id} className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                {item.full_name || item.email}
                {item.is_admin ? (
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Admin</span>
                ) : (
                  <span className="text-xs bg-gray-500/20 text-gray-300 px-2 py-1 rounded">No Access</span>
                )}
              </CardTitle>
              <Button
                onClick={() => handleEdit(item)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white">{item.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Created</p>
                <p className="text-white">{new Date(item.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
