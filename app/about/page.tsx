import type { Metadata } from "next"
import AboutClientPage from "./about-client"

export const metadata: Metadata = {
  title: "À Propos - VistraTV | Leader du Streaming IPTV depuis 2018",
  description:
    "Découvrez VistraTV, leader du streaming IPTV depuis 2018. Plus de 50,000 clients satisfaits, 10,000+ chaînes, support 24/7. Notre mission et nos valeurs.",
  keywords: "à propos VistraTV, entreprise IPTV, histoire VistraTV, mission VistraTV",
}

export default function AboutPage() {
  return <AboutClientPage />
}
