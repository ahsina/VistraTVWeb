import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function AdminSignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-main p-6">
      {/* Blur circles */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-pink-500/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 left-0 w-[400px] h-[400px] bg-blue-500/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            </div>
            <CardTitle className="text-2xl text-white">Admin Account Created!</CardTitle>
            <CardDescription className="text-gray-300">Check your email to confirm</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-white/5 p-4 text-sm text-gray-300">
              <p className="mb-2">
                <strong className="text-white">Next Steps:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Check your email to confirm your account</li>
                <li>After confirmation, contact an administrator to grant admin privileges</li>
                <li>Once approved, you can log in to the admin dashboard</li>
              </ol>
            </div>
            <Link href="/admin/login" className="block">
              <Button className="w-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
