import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
          404
        </h1>
        <h2 className="text-3xl font-bold text-white mt-4">Page non trouvée</h2>
        <p className="text-white/60 mt-2 mb-8">Désolé, la page que vous recherchez n'existe pas.</p>
        <Link href="/">
          <Button className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90">Retour à l'accueil</Button>
        </Link>
      </div>
    </div>
  )
}
