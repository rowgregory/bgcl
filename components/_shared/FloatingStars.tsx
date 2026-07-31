import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Star {
  top: number
  left: number
  duration: number
  delay: number
}

export const FloatingStars = () => {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    setStars(
      [...Array(20)].map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2
      }))
    )
  }, [])

  return (
    <>
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{
            top: `${star.top}%`,
            left: `${star.left}%`
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay
          }}
        />
      ))}
    </>
  )
}
