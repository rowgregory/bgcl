'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Picture from './common/Picture'

interface SqyshCardProps {
  member: {
    id: string
    image: string
    name: string
    isSqysh?: boolean
  }
}

export default function SqyshCard({ member }: SqyshCardProps) {
  const [isActive, setIsActive] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showButtons, setShowButtons] = useState(false)

  const fullText = 'Interested in our services?'
  const typingSpeed = 50

  useEffect(() => {
    if (!isActive) return

    setDisplayedText('')
    setIsTyping(true)
    setShowButtons(false)

    let i = 0
    let typingText = ''

    const timer = setInterval(() => {
      if (i < fullText.length) {
        typingText += fullText.charAt(i)
        setDisplayedText(typingText)
        i++
      } else {
        setIsTyping(false)
        clearInterval(timer)
        setTimeout(() => {
          setShowButtons(true)
        }, 800)
      }
    }, typingSpeed)

    return () => {
      clearInterval(timer)
      setIsTyping(false)
    }
  }, [isActive])

  const handleCardClick = () => {
    if (member.isSqysh) {
      setIsActive(true)
    }
  }

  const handleClose = () => {
    setShowButtons(false)
    setDisplayedText('')
    setIsTyping(false)
    setIsActive(false)
  }

  const handleYes = () => {
    console.log('User clicked Yes!')
    handleClose()
  }

  return (
    <>
      <div
        onClick={handleCardClick}
        className="relative shrink-0 h-92 overflow-visible dark:bg-neutral-800 bg-neutral-100 rounded-2xl cursor-pointer group"
      >
        <Picture
          src={member.image}
          alt={member.name}
          priority={true}
          className="object-cover object-top group-hover:scale-105 transition-transform duration-300 w-full h-full rounded-2xl"
        />
      </div>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-80 overflow-hidden"
          >
            {/* Status Indicator */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-6 left-6 flex items-center space-x-3 bg-black/20 backdrop-blur-md rounded-full px-4 py-2 border border-teal-500/30"
            >
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              <span className="text-teal-300 text-sm font-medium">Sqysh</span>
            </motion.div>

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleClose}
              className="absolute top-6 right-6 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full border border-neutral-600/30 flex items-center justify-center text-neutral-300 hover:text-white hover:border-neutral-400/50 transition-all z-10"
            >
              <X className="h-5 w-5" />
            </motion.button>

            {/* Sqysh Character - slides in from right */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
              className="absolute left-0 h-full flex flex-col justify-end pointer-events-none"
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/boys-and-girls-club-of-l-a2ad0.firebasestorage.app/o/images%2Fsqysh.png?alt=media&token=648c6114-3c33-47c1-a379-9518662c808a"
                alt="Sqysh"
                className="w-full object-contain h-175"
              />
            </motion.div>

            {/* Character Info Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute top-20 left-6 bg-black/30 backdrop-blur-lg rounded-2xl px-4 py-3 border border-teal-500/20"
            >
              <h3 className="text-teal-300 font-semibold text-lg">Sqysh</h3>
              <p className="text-neutral-400 text-sm">Software Developer</p>
            </motion.div>

            {/* Speech Bubble Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
              className="absolute left-6 top-60 w-96"
            >
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-teal-600/30 shadow-2xl p-6">
                {/* Text with typewriter effect */}
                <p className="text-xl font-bold text-white mb-6 min-h-20">
                  {displayedText}
                  {isTyping && <span className="inline-block w-2 h-6 bg-white ml-1 animate-pulse" />}
                </p>

                {/* Buttons - show after typing finishes */}
                {showButtons && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-3"
                  >
                    <button
                      onClick={handleYes}
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      Yes!
                    </button>
                    <button
                      onClick={handleClose}
                      className="w-full bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      Maybe later
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
