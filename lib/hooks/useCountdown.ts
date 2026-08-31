import { useEffect, useState } from 'react'

export function useCountdown(target: Date | string) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, done: false })

  useEffect(() => {
    const end = new Date(target).getTime()

    if (Number.isNaN(end)) return

    const tick = () => {
      const d = end - Date.now()

      if (d <= 0) {
        setT({ days: 0, hours: 0, minutes: 0, seconds: 0, done: true })
        return false
      }

      setT({
        days: Math.floor(d / 86400000),
        hours: Math.floor((d / 3600000) % 24),
        minutes: Math.floor((d / 60000) % 60),
        seconds: Math.floor((d / 1000) % 60),
        done: false
      })

      return true
    }

    if (!tick()) return

    const id = setInterval(() => {
      if (!tick()) clearInterval(id)
    }, 1000)

    return () => clearInterval(id)
  }, [target])

  return t
}
