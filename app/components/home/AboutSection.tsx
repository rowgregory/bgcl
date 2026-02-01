'use client'

import { containerVariants, itemVariants } from '@/app/lib/constants/motion'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export const AboutSection = ({
  title = 'Fantastic',
  subtitle = 'Terrarium',
  description = 'Ghost pipefish yellow bass New Zealand sand diver eulachon brook lamprey driftfish, Atlantic trout. Mudfish: blue eye, arrowtooth eel french angelfish yellowfin pike unicorn fish.',
  detailedDescription = 'Rudderfish long-finned pike--razorfish menhaden paradise fish, barramundi oceanic flyingfish. Fangtooth yellowtail banded killifish seamoth triplefin blenny desert pupfish',
  stats = [
    { label: 'Poaching cases', value: '850' },
    { label: 'Rescued animals', value: '230' },
    { label: 'Volunteers', value: '160,000' }
  ],
  image = '/images/terrarium.svg',
  buttonText = 'More about',
  buttonHref = '#'
}) => {
  return (
    <section className="dark:py-20 dark:md:py-40 py-20 md:py-40 dark:px-6 dark:md:px-12 px-6 md:px-12">
      <div className="max-w-334 mx-auto">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Left Column - Image */}
          <motion.div
            className="flex justify-center lg:justify-start relative"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="w-full max-w-lg relative"
              animate={{
                y: [0, -8, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              {/* Decorative Lines */}
              <div className="absolute -inset-12 pointer-events-none">
                {/* Top line */}
                <motion.div
                  className="absolute top-0 left-1/4 w-32 h-px dark:bg-linear-to-r dark:from-transparent dark:via-sky-500 dark:to-transparent bg-linear-to-r from-transparent via-sky-600 to-transparent"
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    scaleX: [0.8, 1, 0.8]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Right line */}
                <motion.div
                  className="absolute right-0 top-1/4 w-px h-32 dark:bg-linear-to-b dark:from-transparent dark:via-indigo-500 dark:to-transparent bg-linear-to-b from-transparent via-sky-500 to-transparent"
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    scaleY: [0.8, 1, 0.8]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                />

                {/* Bottom line */}
                <motion.div
                  className="absolute bottom-0 right-1/4 w-32 h-px dark:bg-linear-to-r dark:from-transparent dark:via-sky-400 dark:to-transparent bg-linear-to-r from-transparent via-sky-600 to-transparent"
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    scaleX: [0.8, 1, 0.8]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />

                {/* Left line */}
                <motion.div
                  className="absolute left-0 top-1/3 w-px h-32 dark:bg-linear-to-b dark:from-transparent dark:via-indigo-400 dark:to-transparent bg-linear-to-b from-transparent via-sky-500 to-transparent"
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    scaleY: [0.8, 1, 0.8]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                />
              </div>

              <motion.img
                src={image}
                alt={`${title} ${subtitle}`}
                className="w-full h-full object-cover relative z-10 aspect-square rounded-lg shadow-2xl"
                whileHover={{
                  boxShadow: '0 20px 60px rgba(6, 182, 212, 0.3)'
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div className="space-y-8" variants={containerVariants}>
            {/* Header */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <motion.div
                  className="h-px w-8 dark:bg-sky-400 bg-sky-600"
                  animate={{ scaleX: [0, 1, 1] }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
                <p className="text-sm font-semibold dark:text-sky-400 text-sky-600 uppercase tracking-wider">
                  About BGCL
                </p>
              </motion.div>
              <motion.h2
                className="text-5xl md:text-6xl font-black dark:text-white text-neutral-900"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {title} <span className="font-light dark:text-neutral-400 text-neutral-600">{subtitle}</span>
              </motion.h2>
            </motion.div>

            {/* Description */}
            <motion.div
              className="space-y-4"
              variants={itemVariants}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <p className="text-lg font-bold dark:text-neutral-100 text-neutral-800 leading-relaxed">{description}</p>
              <p className="text-base dark:text-neutral-400 text-neutral-600 leading-relaxed">{detailedDescription}</p>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 py-8 dark:border-neutral-800 border-neutral-200 border-t border-b"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-sm font-bold dark:text-neutral-400 text-neutral-600">{stat.label}</p>
                  <motion.p
                    className="text-4xl md:text-5xl font-black dark:bg-linear-to-r dark:from-sky-400 dark:to-indigo-400 bg-linear-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.1 }}
                  >
                    {stat.value}
                  </motion.p>
                </motion.div>
              ))}
            </motion.div>

            {/* Button */}
            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.a
                href={buttonHref}
                className="inline-flex items-center gap-3 px-8 py-4 border-2 dark:border-sky-500 dark:text-sky-400 border-sky-600 text-sky-600 font-bold uppercase text-sm tracking-wide dark:bg-linear-to-r dark:from-sky-500/10 dark:to-indigo-500/10 bg-linear-to-r from-sky-500/20 to-sky-600/20 rounded-lg overflow-hidden relative group"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 dark:bg-linear-to-r dark:from-sky-500 dark:to-indigo-500 bg-linear-to-r from-sky-600 to-sky-700 -z-10 opacity-0 group-hover:opacity-20"
                  transition={{ duration: 0.3 }}
                />
                {buttonText}
                <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
