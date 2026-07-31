'use client'

import { IProgram } from '@/types/entities/program'
import { motion } from 'framer-motion'
import { ArrowRight, Download } from 'lucide-react'
import Link from 'next/link'
import Picture from '../../../components/_shared/Picture'
import { containerVariants, itemVariants } from '@/lib/constants/motion'
import { IClubResource } from '@/types/entities/club-resource'

export const ProgramsClient = ({
  programs,
  resources,
  pageData
}: {
  programs: IProgram[]
  resources: IClubResource[]
  pageData: any
}) => {
  const t = pageData.sections.programs
  return (
    <main id="main-content" className="py-12 sm:py-16 md:py-20">
      <div className="max-w-334 mx-auto space-y-12 sm:space-y-16 px-4 sm:px-6 md:px-12">
        {/* Header */}
        <motion.div
          className="space-y-4 sm:space-y-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-3 sm:space-y-4">
            <p className="text-[10px] sm:text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
              {t.eyebrow}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
              {t.heading}
            </h1>
            <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">{t.subheading}</p>
          </div>
        </motion.div>

        {/* Programs Grid */}
        {programs.length === 0 ? (
          <div role="status" className="text-center py-12 sm:py-20">
            <p className="dark:text-neutral-400 text-neutral-600 text-base sm:text-lg">
              No programs available at the moment.
            </p>
          </div>
        ) : (
          <ul
            aria-label="Available programs"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 list-none p-0"
          >
            {programs.map((program: IProgram, index: number) => (
              <motion.li
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/programs/${program.id}`}
                  aria-label={`${program.name} - ${program.descriptions[0] ?? ''} - Learn more`}
                  className="group h-full cursor-pointer block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded-lg"
                >
                  {/* Card Container */}
                  <div className="relative dark:bg-neutral-900 dark:border-neutral-800 dark:hover:border-sky-500/50 bg-white border-neutral-200 border hover:border-sky-500/50 rounded-lg overflow-hidden transition-all h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-96 overflow-hidden bg-cover bg-center">
                      <Picture
                        priority={index < 3}
                        src={program.image ?? '/images/vertical-logo-light.png'}
                        alt={program.name}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 dark:bg-black/20 dark:group-hover:bg-black/10 bg-black/10 group-hover:bg-black/5 transition-colors"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 flex-1 flex flex-col">
                      <h2 className="text-lg sm:text-xl font-bold dark:text-white text-neutral-900 mb-2">
                        {program.name}
                      </h2>
                      <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm mb-3 sm:mb-4 flex-1 line-clamp-3">
                        {program.descriptions[0]}
                      </p>

                      {/* CTA */}
                      <div
                        aria-hidden="true"
                        className="flex items-center gap-2 dark:text-sky-400 text-sky-600 font-semibold group-hover:gap-3 transition-all text-xs sm:text-sm"
                      >
                        Learn More
                        <ArrowRight
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      {/* CTA Section */}
      <motion.section
        aria-labelledby="summer-programs-heading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 py-12 sm:py-16 md:py-20 mt-12 sm:mt-16 md:mt-20"
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8 flex items-center justify-center flex-col">
          <div className="space-y-3 sm:space-y-4">
            <h2
              id="summer-programs-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold dark:text-white text-neutral-900"
            >
              Register for our Summer Programs
            </h2>
          </div>

          <a
            href="https://parentportal.bgcl.org/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Register for summer programs - opens in a new tab"
            className="block px-6 sm:px-8 py-2.5 sm:py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors w-fit text-sm sm:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            Register
          </a>
        </div>
      </motion.section>

      {/* Resources Section */}
      <section aria-labelledby="resources-heading" className="py-20 px-6 md:px-12">
        <div className="max-w-334 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 id="resources-heading" className="text-4xl font-black dark:text-white text-neutral-900 mb-4">
              Club Resources
            </h2>
            <p className="text-lg dark:text-neutral-400 text-neutral-600">
              Access important documents, guides, and tools to make the most of your membership.
            </p>
          </motion.div>

          {/* Resources Grid */}
          <motion.ul
            aria-label="Club resources"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {resources.map((resource, r) => (
              <motion.li
                key={resource.id ?? r}
                variants={itemVariants}
                className="dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 border rounded-xl p-6 hover:border-sky-500/50 transition-colors group"
              >
                <h3 className="text-lg font-bold dark:text-white text-neutral-900 mb-2 group-hover:dark:text-sky-400 group-hover:text-sky-600 transition-colors">
                  {resource.title}
                </h3>
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Download ${resource.title} - opens in a new tab`}
                    className="inline-flex items-center gap-2 dark:text-sky-400 text-sky-600 hover:dark:text-sky-300 hover:text-sky-700 font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    Download
                  </a>
                )}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>
    </main>
  )
}
