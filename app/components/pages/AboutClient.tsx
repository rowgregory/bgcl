'use client'

import Picture from '@/app/components/common/Picture'
import { motion } from 'framer-motion'
import { HistorySection } from '../home/HistorySection'
import MissionSection from '../home/MissionSection'

export default function AboutPage({ initialPageData }) {
  const sections = initialPageData?.sections
  const about = sections?.about
  const mission = sections?.mission
  const whyChooseUs = sections?.whyChooseUs
  const history = sections?.history
  const recognition = sections?.recognition

  return (
    <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
      <div className="max-w-334 mx-auto space-y-12 sm:space-y-16">
        {/* Header */}
        <motion.div
          className="space-y-4 sm:space-y-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-3 sm:space-y-4">
            <p className="text-[10px] sm:text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
              Our Purpose
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
              {about?.heading}
            </h1>
            <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">{about?.subheading}</p>
          </div>
        </motion.div>

        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6 text-neutral-700 dark:text-neutral-300"
          >
            <p className="text-base sm:text-lg leading-relaxed">{about?.paragraph1}</p>

            <p className="text-base sm:text-lg leading-relaxed">{about?.paragraph2}</p>

            <p className="text-base sm:text-lg leading-relaxed">{about?.paragraph3}</p>
          </motion.div>

          {/* Mission Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden dark:border dark:border-neutral-800 border border-neutral-200"
          >
            <Picture
              src="/images/img-1.jpg"
              alt="Our Mission"
              priority={true}
              className="object-cover w-full h-full object-top"
            />
          </motion.div>
        </div>

        <MissionSection mission={mission} />

        {/* Why Choose Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8 sm:space-y-12"
        >
          <div className="text-center space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black dark:text-white text-neutral-900 leading-tight">
              {whyChooseUs?.heading}
            </h2>
            <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl mx-auto">
              {whyChooseUs?.subheading}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden dark:border dark:border-neutral-800 border border-neutral-200"
            >
              <Picture
                src="/images/img-3.jpg"
                alt="Why Choose BGCL"
                priority={false}
                className="object-cover w-full h-full"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 sm:space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-2 sm:space-y-3"
              >
                <h3 className="text-lg sm:text-xl font-bold dark:text-white text-neutral-900">
                  {whyChooseUs?.outcomeTitle1}
                </h3>
                <p className="text-sm sm:text-base dark:text-neutral-400 text-neutral-600 leading-relaxed">
                  {whyChooseUs?.outcomeDescription1}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-2 sm:space-y-3"
              >
                <h3 className="text-lg sm:text-xl font-bold dark:text-white text-neutral-900">
                  {whyChooseUs?.outcomeTitle2}
                </h3>
                <p className="text-sm sm:text-base dark:text-neutral-400 text-neutral-600 leading-relaxed">
                  {whyChooseUs?.outcomeDescription2}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-2 sm:space-y-3"
              >
                <h3 className="text-lg sm:text-xl font-bold dark:text-white text-neutral-900">
                  {whyChooseUs?.outcomeTitle3}
                </h3>
                <p className="text-sm sm:text-base dark:text-neutral-400 text-neutral-600 leading-relaxed">
                  {whyChooseUs?.outcomeDescription3}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <HistorySection history={history} />

        {/* Accreditations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="dark:bg-neutral-800 bg-white p-6 sm:p-8 rounded-lg sm:rounded-xl dark:border dark:border-neutral-700 border border-neutral-200"
        >
          <h3 className="text-lg sm:text-xl font-bold dark:text-white text-neutral-900 mb-4 sm:mb-6">
            {recognition.heading}
          </h3>
          <p className="dark:text-neutral-300 text-neutral-700 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
            {recognition.paragraph1}
          </p>
          <div className="flex flex-wrap gap-6 sm:gap-8 items-center">
            <div className="relative w-24 h-12 sm:w-32 sm:h-16">
              <Picture
                src="https://cdn.prod.website-files.com/65e0d291ed80aa415dbb7adf/65f7b5d4bb93f0112db17054_candid-platinum-transparency.png"
                alt="Candid Platinum Seal"
                priority={false}
                className="object-contain w-full h-full"
              />
            </div>
            <div className="relative w-24 h-12 sm:w-32 sm:h-16">
              <Picture
                src="https://cdn.prod.website-files.com/65e0d291ed80aa415dbb7adf/65f7b5d402aea38a08323c87_charity-navigator.png"
                alt="Charity Navigator"
                priority={false}
                className="object-contain w-full h-full"
              />
            </div>
          </div>
          <p className="text-xs sm:text-sm dark:text-neutral-400 text-neutral-600 mt-4 sm:mt-6">
            {recognition.subheading}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
