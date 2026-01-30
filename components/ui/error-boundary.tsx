"use client"
import { Component, type ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "@/lib/icons"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("[v0] Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] flex items-center justify-center px-4">
          <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10 text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Une erreur est survenue</h2>
            <p className="text-gray-300 mb-6">Nous sommes désolés, une erreur inattendue s'est produite.</p>
            <Button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.reload()
              }}
              className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]"
            >
              Recharger la page
            </Button>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
