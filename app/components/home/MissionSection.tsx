'use client'

import { setOpenVolunteerDrawer } from '@/app/lib/store/slices/appSlice'
import { setInputs } from '@/app/lib/store/slices/formSlice'
import { store } from '@/app/lib/store/store'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Link from 'next/link'

const MissionSection = ({ pageContent }) => {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 dark:bg-neutral-950 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="dark:bg-linear-to-br dark:from-neutral-900 dark:to-neutral-800 bg-linear-to-br from-neutral-50 to-neutral-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 lg:p-16 border dark:border-neutral-700 border-neutral-200"
        >
          {/* Content */}
          <div className="text-center space-y-6 sm:space-y-8">
            {/* Heading */}
            <div className="space-y-3 sm:space-y-4">
              <p className="text-[10px] sm:text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
                {pageContent?.mission?.subheading}
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
                {pageContent?.mission?.heading}
              </h2>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl dark:text-neutral-300 text-neutral-700 leading-relaxed max-w-3xl mx-auto">
              {pageContent?.mission?.bodyText}
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4"
            >
              <button
                onClick={() => {
                  store.dispatch(setOpenVolunteerDrawer())
                  store.dispatch(setInputs({ formName: 'volunteerForm', data: { type: 'VOLUNTEER', subject: '' } }))
                }}
                className="cursor-pointer px-6 sm:px-8 py-3 sm:py-4 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-bold text-base sm:text-lg rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                {pageContent?.mission?.button1Text}
              </button>

              <Link
                href={pageContent?.mission?.button2Link}
                className="px-6 sm:px-8 py-3 sm:py-4 dark:bg-neutral-800 dark:hover:bg-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:text-white text-neutral-900 font-bold text-base sm:text-lg rounded-lg transition-colors border dark:border-neutral-600 border-neutral-300 flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {pageContent?.mission?.button2Text}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default MissionSection
