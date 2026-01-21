'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function BrochureDisplayer({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return prevIndex === images.length - 1 ? 0 : prevIndex + 1
      } else {
        return prevIndex === 0 ? images.length - 1 : prevIndex - 1
      }
    })
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
        <p className="text-neutral-500 dark:text-neutral-400">No images to display</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-20">
      {/* Main Display Area */}
      <div className="relative bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden shadow-xl aspect-3/4 md:aspect-video">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x)

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1)
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1)
              }
            }}
            className="absolute w-full h-full object-contain cursor-grab active:cursor-grabbing"
            alt={`Brochure page ${currentIndex + 1}`}
          />
        </AnimatePresence>

        {/* Navigation Arrows (Desktop) */}
        <button
          onClick={() => paginate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/90 dark:bg-neutral-800/90 text-neutral-800 dark:text-neutral-200 shadow-lg hover:bg-white dark:hover:bg-neutral-700 transition-all hover:scale-110"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => paginate(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/90 dark:bg-neutral-800/90 text-neutral-800 dark:text-neutral-200 shadow-lg hover:bg-white dark:hover:bg-neutral-700 transition-all hover:scale-110"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-6 flex items-center justify-center gap-4">
        {/* Previous Button */}
        <button
          onClick={() => paginate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white transition-colors shadow-md"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Indicators */}
        <div className="flex items-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              className={`transition-all ${
                index === currentIndex
                  ? 'w-8 h-3 bg-sky-500 dark:bg-sky-600'
                  : 'w-3 h-3 bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500'
              } rounded-full`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => paginate(1)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white transition-colors shadow-md"
          aria-label="Next"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Page Counter */}
      <div className="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
        Page {currentIndex + 1} of {images.length}
      </div>
    </div>
  )
}
