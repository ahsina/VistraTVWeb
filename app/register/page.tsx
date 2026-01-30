import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "S'abonner - VistraTV",
  description: "Abonnez-vous à VistraTV et profitez de milliers de chaînes TV en direct.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function RegisterPage() {
  redirect("/subscriptions")
}
