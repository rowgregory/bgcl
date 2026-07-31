import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Picture from '../_shared/Picture'

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

export default function FacilitySection({ facility }) {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <section aria-labelledby="facility-heading" className="px-4 sm:px-6 py-8 sm:py-12 md:py-16">
      <div className="max-w-334 mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <motion.div
            aria-hidden="true"
            className="h-px w-6 sm:w-8 dark:bg-sky-500 bg-sky-600"
            animate={{ scaleX: [0, 1, 1] }}
            transition={{ duration: 0.8 }}
            style={{ originX: 0 }}
          />
          <p className="text-xs sm:text-sm font-semibold dark:text-sky-400 text-sky-600 uppercase tracking-wider">
            {facility?.subheading}
          </p>
        </div>

        <h2
          id="facility-heading"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 mb-4 sm:mb-6"
        >
          {facility?.heading1}
          <span className="font-light dark:text-neutral-400 text-neutral-600">{facility?.heading2}</span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-start">
          {/* Text Content */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
                {facility?.paragraph1}
              </p>
              <p className="text-base sm:text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
                {facility?.paragraph2}
              </p>
              <p className="text-base sm:text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
                {facility?.paragraph3}
              </p>
              <p className="text-base sm:text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
                {facility?.paragraph4}
              </p>

              <Link
                href="/contact?subject=tour"
                className="relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-sky-500 to-sky-600 text-white font-semibold rounded-2xl transition-all overflow-hidden h-15 hover:from-sky-600 hover:to-sky-700 duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                Schedule a Tour
              </Link>
            </div>
          </motion.div>

          {/* Image Carousel */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:sticky lg:top-8"
          >
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-neutral-800 p-2 sm:p-3 md:p-4">
              {/* Carousel */}
              <div
                role="region"
                aria-label="Facility image carousel"
                aria-roledescription="carousel"
                className="relative aspect-4/3 rounded-lg sm:rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-700"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImage}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full"
                    role="img"
                    aria-roledescription="slide"
                    aria-label={`Image ${currentImage + 1} of ${images.length}: ${images[currentImage].alt}`}
                  >
                    <Picture
                      src={images[currentImage].url}
                      alt={images[currentImage].alt}
                      className="w-full h-full object-cover"
                      priority={currentImage === 0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  aria-label={`Previous image - go to image ${currentImage === 0 ? images.length : currentImage} of ${images.length}`}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <ChevronLeft
                    aria-hidden="true"
                    className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-neutral-800 dark:text-neutral-200"
                  />
                </button>
                <button
                  onClick={nextImage}
                  aria-label={`Next image - go to image ${currentImage + 2 > images.length ? 1 : currentImage + 2} of ${images.length}`}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <ChevronRight
                    aria-hidden="true"
                    className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-neutral-800 dark:text-neutral-200"
                  />
                </button>
              </div>

              {/* Dots Indicator */}
              <div
                role="tablist"
                aria-label="Facility images"
                className="flex justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4"
              >
                {images.map((image, index) => (
                  <button
                    key={index}
                    role="tab"
                    onClick={() => setCurrentImage(index)}
                    aria-selected={index === currentImage}
                    aria-label={`Image ${index + 1}: ${image.alt}`}
                    className={`h-2 sm:h-2.5 md:h-3 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                      index === currentImage
                        ? 'bg-sky-600 dark:bg-sky-500 w-6 sm:w-7 md:w-8'
                        : 'bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500 w-2 sm:w-2.5 md:w-3'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
