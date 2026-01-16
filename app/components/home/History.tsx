'use client'

import { motion } from 'framer-motion'

export const HistorySection = () => {
  const historyImages = [
    {
      src: 'https://cdn.prod.website-files.com/67ca71addbada9cbbd57ace7/67ca72481e4ae8c5331ef3a0_club.jpg',
      alt: 'Club Building',
      gridSpan: 'lg:col-span-2'
    },
    {
      src: 'https://cdn.prod.website-files.com/67ca71addbada9cbbd57ace7/67ca723fe76f5441716e1e97_boxing.jpg',
      alt: 'Boxing Program',
      gridSpan: 'lg:col-span-1'
    },
    {
      src: 'https://cdn.prod.website-files.com/67ca71addbada9cbbd57ace7/67ca71ef75314df465ef53b9_bowling.jpg',
      alt: 'Bowling Activity',
      gridSpan: 'lg:col-span-1'
    },
    {
      src: 'https://cdn.prod.website-files.com/67ca71addbada9cbbd57ace7/67ca71e2c493e82886f0cb7e_basketball.jpg',
      alt: 'Basketball',
      gridSpan: 'lg:col-span-1'
    },
    {
      src: 'https://cdn.prod.website-files.com/67ca71addbada9cbbd57ace7/67ca71d653102c830fda2567_billiards.jpg',
      alt: 'Billiards Room',
      gridSpan: 'lg:col-span-1'
    },
    {
      src: 'https://cdn.prod.website-files.com/67ca71addbada9cbbd57ace7/67ca71cb8702b909d763e30f_hockey.jpg',
      alt: 'Hockey Program',
      gridSpan: 'lg:col-span-2'
    }
  ]

  return (
    <section className="dark:bg-neutral-950 bg-white py-20 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="h-px w-8 dark:bg-sky-500 bg-sky-600"
              animate={{ scaleX: [0, 1, 1] }}
              transition={{ duration: 0.8 }}
              style={{ originX: 0 }}
            />
            <p className="text-sm font-semibold dark:text-sky-400 text-sky-600 uppercase tracking-wider">Our Journey</p>
          </div>
          <h2 className="text-5xl md:text-6xl font-black dark:text-white text-neutral-900 mb-6">
            History of <span className="font-light dark:text-neutral-400 text-neutral-600">BGCL</span>
          </h2>
          <div className="space-y-4 max-w-4xl">
            <p className="text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
              In 1889, the Boys Club of Lynn was formed which made it one of the first twenty clubs across America to be
              established. Evolving into the 1930's, our building that resides at 25 North Common Street opened its
              doors to our club members. Transitioning into 1991, the Boys Club then changed its name to the Boys &
              Girls Club of Lynn.
            </p>

            <p className="text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
              Presently, the Boys & Girls Club of Lynn has a 50/50 female to male ratio that serves all youth ages 5-18
              years old. We serve over 1,500 members and have more than 250 children walk through our doors on a daily
              basis. Most recently, our building underwent a $6.4 million renovation to enhance and modernize its
              amenities for our members to truly experience a state of the art facility.
            </p>

            <p className="text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
              In June of 2025, we will be embarking on our Phase 2 Capital project. This will be an $18 million project
              with a 14-month renovation that will unveil our new and improved facility by September 2026. Due to the
              growth and success of our programs, we have reached capacity. This improvement will enable us to flourish,
              increase enrollment, and eliminate our waitlists.
            </p>

            <p className="text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
              In addition, we will have the opportunity to expand our network allowing more community partners to
              utilize the new and improved amenities within our facility. The following upgrades will impact the Drop-In
              Center, Kids Club, and Teen Center. Such amenities will include a new pool, new game room, updated gym,
              larger Planet Fitness gym, enhanced dance studio space, a Commercial Kitchen, 2 new Licensed OST
              classrooms, a Teen wing including a Keystone room, as well as a new gymnasium for our younger members
              including a theater space.
            </p>

            <p className="text-lg dark:text-sky-400 text-sky-600 font-semibold leading-relaxed">
              To learn more about our Capital Campaign project,{' '}
              <a href="/capitalcampaign" className="hover:underline">
                visit our Capital Campaign page
              </a>
              .
            </p>
          </div>
        </motion.div>

        {/* Image Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-max"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          {historyImages.map((image, index) => (
            <motion.div
              key={index}
              className={`${image.gridSpan} rounded-xl overflow-hidden dark:border-neutral-800 border-neutral-200 border group cursor-pointer`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative h-64 lg:h-80 overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay on hover */}
                <motion.div
                  className="absolute inset-0 dark:bg-black/50 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <motion.div animate={{ scale: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                    <div className="w-12 h-12 rounded-full dark:bg-sky-500 bg-sky-600 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Label on image */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 dark:bg-linear-to-t dark:from-black/90 bg-linear-to-t from-neutral-900/90 p-4"
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="dark:text-sky-400 text-sky-300 font-bold text-sm">{image.alt}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 dark:border-t dark:border-neutral-800 border-t border-neutral-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div className="text-center space-y-2" whileHover={{ scale: 1.05 }}>
            <p className="text-5xl font-black dark:text-sky-500 text-sky-600">1889</p>
            <p className="dark:text-neutral-400 text-neutral-600 text-sm">Club Founded</p>
            <p className="dark:text-neutral-500 text-neutral-500 text-xs">One of the first twenty clubs in America</p>
          </motion.div>

          <motion.div className="text-center space-y-2" whileHover={{ scale: 1.05 }}>
            <p className="text-5xl font-black dark:text-sky-500 text-sky-600">1,500+</p>
            <p className="dark:text-neutral-400 text-neutral-600 text-sm">Members Today</p>
            <p className="dark:text-neutral-500 text-neutral-500 text-xs">Ages 5-18 with 50/50 gender ratio</p>
          </motion.div>

          <motion.div className="text-center space-y-2" whileHover={{ scale: 1.05 }}>
            <p className="text-5xl font-black dark:text-sky-500 text-sky-600">$18M</p>
            <p className="dark:text-neutral-400 text-neutral-600 text-sm">Phase 2 Capital Project</p>
            <p className="dark:text-neutral-500 text-neutral-500 text-xs">Opening September 2026</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
