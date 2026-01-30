import type React from "react"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Minimal layout for /admin routes
  // Authentication is handled by middleware and individual pages
  return <>{children}</>
}
