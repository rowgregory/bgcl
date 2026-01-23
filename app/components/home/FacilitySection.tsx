import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MotionLink } from '../common/MotionLink'

const images = [
  {
    url: '/images/facility-1.jpg',
    alt: 'Children using interactive displays',
    caption: 'Technology Center'
  },
  {
    url: '/images/facility-2.jpg',
    alt: 'Dance Studio',
    caption: 'Dance Studio'
  },
  {
    url: '/images/facility-3.jpg',
    alt: 'STEAM Lab',
    caption: 'STEAM Lab'
  },
  {
    url: '/images/facility-4.jpg',
    alt: 'Gaming Room',
    caption: 'Gaming Room'
  }
]

export default function FacilitySection({ pageContent }) {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <motion.div
            className="h-px w-6 sm:w-8 dark:bg-sky-500 bg-sky-600"
            animate={{ scaleX: [0, 1, 1] }}
            transition={{ duration: 0.8 }}
            style={{ originX: 0 }}
          />
          <p className="text-xs sm:text-sm font-semibold dark:text-sky-400 text-sky-600 uppercase tracking-wider">
            {pageContent?.facility?.subheading}
          </p>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 mb-4 sm:mb-6">
          {pageContent?.facility?.heading1}
          <span className="font-light dark:text-neutral-400 text-neutral-600">{pageContent?.facility?.heading2}</span>
        </h2>
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-start">
          {/* Text Content */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
                {pageContent?.facility?.paragraph1}
              </p>

              <p className="text-base sm:text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
                {pageContent?.facility?.paragraph2}
              </p>

              <p className="text-base sm:text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
                {pageContent?.facility?.paragraph3}
              </p>
              <MotionLink
                href="/contact?subject=tour"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block"
              >
                <button className="w-full sm:w-auto bg-white dark:bg-neutral-800 border-2 border-sky-600 dark:border-sky-500 text-sky-600 dark:text-sky-400 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-sky-50 dark:hover:bg-neutral-700">
                  Schedule a Tour
                </button>
              </MotionLink>
            </div>
          </motion.div>

          {/* Image Carousel */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:sticky lg:top-8"
          >
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-neutral-800 p-2 sm:p-3 md:p-4">
              {/* Carousel */}
              <div className="relative aspect-4/3 rounded-lg sm:rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    src={images[currentImage].url}
                    alt={images[currentImage].alt}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-neutral-800 dark:text-neutral-200" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-neutral-800 dark:text-neutral-200" />
                </button>

                {/* Caption */}
                {/* <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/70 dark:bg-black/80 backdrop-blur-sm text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full max-w-[90%]">
                  <motion.p
                    key={currentImage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-medium text-xs sm:text-sm md:text-base text-center"
                  >
                    {images[currentImage].caption}
                  </motion.p>
                </div> */}
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`h-2 sm:h-2.5 md:h-3 rounded-full transition-all duration-300 ${
                      index === currentImage
                        ? 'bg-sky-600 dark:bg-sky-500 w-6 sm:w-7 md:w-8'
                        : 'bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500 w-2 sm:w-2.5 md:w-3'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
