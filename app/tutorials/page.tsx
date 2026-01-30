import TutorialsClient from "./tutorials-client" // Fixed import path to match actual file name

export const metadata = {
  title: "Tutoriels - VistraTV | Guides d'installation par appareil",
  description:
    "Guides d'installation détaillés pour configurer VistraTV sur tous vos appareils : Smart TV, Android, iOS, Fire Stick, et plus encore.",
  keywords: "tutoriels IPTV, guide installation, configuration IPTV, smart TV, android box, fire stick, apple tv",
  openGraph: {
    title: "Tutoriels VistraTV - Guides d'installation",
    description: "Configurez VistraTV facilement sur tous vos appareils avec nos guides détaillés",
    type: "website",
  },
}

export default function TutorialsPage() {
  return <TutorialsClient />
}
