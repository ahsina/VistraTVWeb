import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Connexion - VistraTV",
  description: "Accédez à vos chaînes VistraTV avec vos identifiants reçus par email.",
  robots: {
    index: false,
    follow: true,
  },
}

export default function LoginPage() {
  redirect("/admin/login")
}
