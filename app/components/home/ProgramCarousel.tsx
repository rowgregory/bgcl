'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IProgram } from '@/types/entities/program'
import Picture from '../common/Picture'
import Link from 'next/link'

interface CarouselProps {
  heading?: string
  subheading?: string
  title?: string
  items?: IProgram[]
}

export const ProgramCarousel: React.FC<CarouselProps> = ({
  title = 'Our Reptiles',
  heading = 'Reptiles',
  subheading = 'In Our Terrarium',
  items
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Get 5 items starting from current index
  const getVisibleItems = () => {
    const visible = []
    for (let i = 0; i < items.length; i++) {
      visible.push(items[(currentIndex + i) % items.length])
    }
    return visible
  }

  const visibleItems = getVisibleItems()

  return (
    <section className="bg-linear-to-br from-neutral-950 via-neutral-900 to-indigo-950 py-20 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-16 flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-sky-500" />
              <p className="text-sm font-semibold text-sky-400 uppercase tracking-wider">{title}</p>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white">
              {heading} <span className="font-light text-neutral-400">{subheading}</span>
            </h2>
          </div>

          {/* Dots in Header */}
          <div className="hidden md:flex gap-3">
            {items.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-sky-500' : 'bg-neutral-600'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Carousel Container */}
        <div className="space-y-8">
          {/* Carousel Wrapper */}
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-4"
                initial={false}
                animate={{ x: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {visibleItems.map((program, index) => (
                  <Link href={`/programs/${program.id}`} key={index} className="w-105 h-105 shrink-0">
                    <div className="relative h-full rounded-lg overflow-hidden border border-neutral-800">
                      <Picture
                        src={program.image}
                        alt={program.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        priority={false}
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent z-10" />

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                        <h3 className="text-2xl font-black text-white">{program.name}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </motion.div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute -left-16 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full hover:bg-neutral-800 transition-colors hidden lg:flex items-center justify-center"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-neutral-300" />
            </button>
            <button
              onClick={goToNext}
              className="absolute -right-16 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full hover:bg-neutral-800 transition-colors hidden lg:flex items-center justify-center"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-neutral-300" />
            </button>
          </div>

          {/* Dot Navigation (Mobile) */}
          <div className="flex md:hidden items-center justify-center gap-3">
            {items.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-sky-500' : 'bg-neutral-600'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
