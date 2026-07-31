import { useEffect, useState } from 'react'

export function useCountdown(target) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, done: false })
  useEffect(() => {
    const end = new Date(target).getTime()

    const tick = () => {
      const d = Math.max(0, end - Date.now())
      if (d <= 0) return setT((p) => ({ ...p, done: true }))
      setT({
        days: Math.floor(d / 86400000),
        hours: Math.floor((d / 3600000) % 24),
        minutes: Math.floor((d / 60000) % 60),
        seconds: Math.floor((d / 1000) % 60),
        done: false
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])
  return t
}
