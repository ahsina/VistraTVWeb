import type React from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-main">
      {/* Blur circles */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-pink-500/30 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 left-0 w-[400px] h-[400px] bg-blue-500/30 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
