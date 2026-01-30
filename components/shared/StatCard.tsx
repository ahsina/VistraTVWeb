interface StatCardProps {
  value: string
  label: string
  icon?: string
}

export function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {icon ? (
        <div className="text-6xl font-extrabold text-white mb-2">{icon}</div>
      ) : (
        <div className="text-[56px] font-extrabold text-white leading-none mb-2">{value}</div>
      )}
      <div className="text-base text-white/80">{label}</div>
    </div>
  )
}
