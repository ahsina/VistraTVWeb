export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  }

  return <div className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin`} />
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055]">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-white/60">Chargement...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
