import type React from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CookieConsent } from "@/components/CookieConsent"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log("[v0] MainLayout rendering")

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CookieConsent />
    </>
  )
}
