'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Picture from './common/Picture'
import ActionButton from './common/ActionButton'

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
        }, 400)
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
    window.open('https://www.sqysh.io/quote?lead_source=bgcl', '_blank', 'noopener,noreferrer')
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-130 overflow-hidden"
          >
            {/* Status Indicator - Mobile optimized */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-3 left-3 sm:top-6 sm:left-6 flex items-center space-x-2 sm:space-x-3 bg-black/20 backdrop-blur-md rounded-full px-3 py-1.5 sm:px-4 sm:py-2 border border-teal-500/30"
            >
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full animate-pulse"></div>
              <span className="text-teal-300 text-xs sm:text-sm font-medium">Sqysh</span>
            </motion.div>

            {/* Close Button - Mobile optimized */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleClose}
              className="absolute top-3 right-3 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 bg-black/20 backdrop-blur-md rounded-full border border-neutral-600/30 flex items-center justify-center text-neutral-300 hover:text-white hover:border-neutral-400/50 transition-all z-10 touch-manipulation"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>

            {/* Desktop Layout */}
            <div className="relative hidden md:block">
              {/* Sqysh Character - slides in from right */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
                className="absolute left-0 top-180 h-full flex flex-col justify-end pointer-events-none"
              >
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/boys-and-girls-club-of-l-a2ad0.firebasestorage.app/o/images%2Fsqysh.png?alt=media&token=648c6114-3c33-47c1-a379-9518662c808a"
                  alt="Sqysh"
                  className="w-full object-contain h-150"
                />
              </motion.div>

              {/* Speech Bubble Dialog - Desktop */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
                className="absolute left-80 top-30 w-96"
              >
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-teal-600/30 shadow-2xl p-6">
                  {/* Text with typewriter effect */}
                  <p className="text-xl font-bold text-white mb-6">
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
                      <ActionButton
                        onClick={() => handleYes()}
                        title="Yes"
                        description={`You want your site to be sqysh'd`}
                        dotColor="bg-teal-500"
                      />
                      <ActionButton
                        onClick={handleClose}
                        title="No"
                        description={`This site is dope, but maybe another time.`}
                        dotColor="bg-gray-500"
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Character Info Badge - Desktop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute right-20 top-20 bg-black/30 backdrop-blur-lg rounded-2xl px-4 py-3 border border-teal-500/20"
              >
                <h3 className="text-teal-300 font-semibold text-lg">Sqysh</h3>
                <p className="text-neutral-400 text-sm">Software Developer</p>
                <a
                  href="https://www.sqysh.io/quote?lead_source=bgcl"
                  className="text-neutral-400 text-sm hover:text-teal-400 transition-colors"
                >
                  www.sqysh.io
                </a>
              </motion.div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden h-full flex flex-col">
              {/* Sqysh Character - Mobile (bottom) */}
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xs pointer-events-none"
              >
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/boys-and-girls-club-of-l-a2ad0.firebasestorage.app/o/images%2Fsqysh.png?alt=media&token=648c6114-3c33-47c1-a379-9518662c808a"
                  alt="Sqysh"
                  className="w-full object-contain h-48 xs:h-56"
                />
              </motion.div>

              {/* Speech Bubble Dialog - Mobile (top/center) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
                className="absolute top-16 left-3 right-3 xs:left-4 xs:right-4 sm:left-6 sm:right-6 sm:max-w-md sm:mx-auto"
              >
                <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-teal-600/30 shadow-2xl p-4 xs:p-5 sm:p-6">
                  {/* Character Info - Mobile (inside bubble) */}
                  <div className="mb-4 pb-4 border-b border-teal-500/20">
                    <h3 className="text-teal-300 font-semibold text-base xs:text-lg">Sqysh</h3>
                    <p className="text-neutral-400 text-xs xs:text-sm">Software Developer</p>
                    <a
                      href="https://www.sqysh.io/quote?lead_source=bgcl"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 text-xs xs:text-sm hover:text-teal-400 transition-colors underline"
                    >
                      www.sqysh.io
                    </a>
                  </div>

                  {/* Text with typewriter effect */}
                  <p className="text-base xs:text-lg sm:text-xl font-bold text-white mb-4 xs:mb-5 sm:mb-6 min-h-10">
                    {displayedText}
                    {isTyping && <span className="inline-block w-1.5 h-5 xs:w-2 xs:h-6 bg-white ml-1 animate-pulse" />}
                  </p>

                  {/* Buttons - show after typing finishes */}
                  {showButtons && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-2 xs:gap-3"
                    >
                      <ActionButton
                        onClick={() => handleYes()}
                        title="Yes"
                        description={`Yes, I want my site to be sqysh'd`}
                        dotColor="bg-teal-500"
                      />
                      <ActionButton
                        onClick={handleClose}
                        title="No"
                        description={`This site is dope, but maybe another time.`}
                        dotColor="bg-gray-500"
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
