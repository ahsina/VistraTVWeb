"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"

interface TimeLeft {
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer({ endDate }: { endDate?: Date } = {}) {
  const { t } = useLanguage()
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const targetDate = endDate || new Date(Date.now() + 24 * 60 * 60 * 1000)

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  return (
    <div className="flex items-center gap-2 sm:gap-4 justify-center">
      <div className="text-center">
        <div className="bg-gradient-to-br from-cyan-500 to-pink-500 rounded-lg p-2 sm:p-3 min-w-[50px] sm:min-w-[70px]">
          <div className="text-xl sm:text-2xl font-bold text-white">{String(timeLeft.hours).padStart(2, "0")}</div>
        </div>
        <div className="text-[10px] sm:text-xs text-gray-400 mt-1">{t.marketing.hours}</div>
      </div>
      <div className="text-xl sm:text-2xl text-white">:</div>
      <div className="text-center">
        <div className="bg-gradient-to-br from-cyan-500 to-pink-500 rounded-lg p-2 sm:p-3 min-w-[50px] sm:min-w-[70px]">
          <div className="text-xl sm:text-2xl font-bold text-white">{String(timeLeft.minutes).padStart(2, "0")}</div>
        </div>
        <div className="text-[10px] sm:text-xs text-gray-400 mt-1">{t.marketing.minutes}</div>
      </div>
      <div className="text-xl sm:text-2xl text-white">:</div>
      <div className="text-center">
        <div className="bg-gradient-to-br from-cyan-500 to-pink-500 rounded-lg p-2 sm:p-3 min-w-[50px] sm:min-w-[70px]">
          <div className="text-xl sm:text-2xl font-bold text-white">{String(timeLeft.seconds).padStart(2, "0")}</div>
        </div>
        <div className="text-[10px] sm:text-xs text-gray-400 mt-1">{t.marketing.seconds}</div>
      </div>
    </div>
  )
}
