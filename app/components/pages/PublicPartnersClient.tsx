'use client'

import {
  containerVariants,
  containerVariantsTwo,
  itemVariants,
  itemVariantsTwo,
  sectionVariants
} from '@/app/lib/constants/motion'
import { IPartner } from '@/types/entities/partner'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Picture from '../common/Picture'

// ── Partner card ──────────────────────────────────────────────────────────────
function PartnerCard({ partner }: { partner: IPartner }) {
  return (
    <motion.article
      variants={itemVariants}
      className="group dark:bg-neutral-900 bg-white dark:border-neutral-800 border-neutral-200 border rounded-xl overflow-hidden hover:border-sky-500/50 transition-colors focus-within:border-sky-500/50"
    >
      <Link
        href={partner?.externalLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${partner?.name} website (opens in new tab)`}
        className="flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-inset rounded-xl"
      >
        {/* Logo */}
        <div className="h-32 sm:h-36 w-full dark:bg-neutral-800 bg-neutral-100 flex items-center justify-center p-5 relative overflow-hidden">
          {partner?.image ? (
            <Picture
              src={partner?.image}
              alt={`${partner?.name} logo`}
              className="object-contain group-hover:scale-105 transition-transform duration-300 w-full h-full"
            />
          ) : (
            <>
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#0ea5e9_1px,transparent_0)] bg-size-[16px_16px]" />
              <span
                aria-hidden="true"
                className="text-xs md:text-lg xl:text-2xl font-black dark:text-neutral-600 text-neutral-300 select-none text-center"
              >
                {partner?.name}
              </span>
            </>
          )}
        </div>

        {/* Name */}
        <div className="px-3 py-3 flex flex-col gap-2 border-t dark:border-neutral-800 border-neutral-200">
          <div className="flex items-start justify-between gap-1.5">
            <p
              className="text-xs font-black dark:text-white text-neutral-900 leading-tight line-clamp-2 wrap-break-word"
              title={partner?.name}
            >
              {partner?.name}
            </p>
            <svg
              aria-hidden="true"
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              className="shrink-0 mt-0.5 dark:text-neutral-600 text-neutral-400 group-hover:text-sky-500 transition-colors"
            >
              <path
                d="M2 10L10 2M10 2H4M10 2V8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

const FeaturedSpotlight = ({ featured }) => {
  return (
    <section
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 dark:bg-neutral-900/50 bg-neutral-50"
      aria-label="Featured partners"
    >
      <div className="max-w-334 mx-auto">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black dark:text-white text-neutral-900 mb-3 sm:mb-4">
            Featured Partners
          </h2>
          <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">
            Spotlight on the organizations making an extraordinary difference.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          variants={containerVariantsTwo}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featured?.map((partner) => (
            <motion.article
              key={partner?.id}
              variants={itemVariantsTwo}
              className="group dark:bg-neutral-900 bg-white dark:border-neutral-800 border-neutral-200 border rounded-xl sm:rounded-2xl overflow-hidden hover:border-sky-500/50 transition-colors focus-within:border-sky-500/50"
            >
              <Link
                href={partner?.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${partner?.name} website (opens in new tab)`}
                className="flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-inset rounded-xl sm:rounded-2xl"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden dark:bg-neutral-800 bg-neutral-100 flex items-center justify-center p-6">
                  {partner?.image ? (
                    <Picture
                      priority={true}
                      src={partner?.image}
                      alt={`${partner?.name} logo`}
                      className="object-contain group-hover:scale-105 transition-transform duration-300 max-h-full max-w-full w-full"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#0ea5e9_1px,transparent_0)] bg-size-[16px_16px]" />

                      <div
                        aria-hidden="true"
                        className="text-3xl font-black dark:text-neutral-600 text-neutral-300 select-none"
                      >
                        {partner?.name}
                      </div>
                    </>
                  )}
                  {/* Featured badge */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30">
                      Featured
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex flex-col gap-2 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-lg sm:text-xl font-black dark:text-white text-neutral-900 leading-tight">
                      {partner?.name}
                    </p>
                  </div>
                  {partner?.description && (
                    <p className="text-xs sm:text-sm dark:text-neutral-400 text-neutral-600 line-clamp-3">
                      {partner?.description}
                    </p>
                  )}
                  {partner?.amount && (
                    <p className="text-xs font-semibold dark:text-neutral-500 text-neutral-500 uppercase tracking-widest">
                      {partner?.amount}
                    </p>
                  )}
                  <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 group-hover:gap-2 transition-all">
                    Visit website
                    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 10L10 2M10 2H4M10 2V8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PublicPartnersClient({ partners }: { partners: IPartner[] }) {
  // Featured partners (any tier, shown in hero spotlight)
  const featured = partners.filter((p) => p.isActive && p.isFeatured).sort((a, b) => a.order - b.order)
  const rest = partners.filter((p) => p.isActive && !p.isFeatured).sort((a, b) => a.order - b.order)

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sky-600 focus:text-white focus:font-semibold focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      <main id="main-content" className="dark:bg-neutral-950 bg-white">
        {/* ── Hero ── */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12" aria-label="Partners hero">
          <div className="max-w-334 mx-auto">
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-3 sm:space-y-4">
                <p className="text-[10px] sm:text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
                  Community & Corporate Support
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
                  Our Partners
                </h1>
                <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">
                  The Boys &amp; Girls Club of Lynn is powered by the generosity of our community partners?. Together,
                  we create opportunities that change the lives of young people every day.
                </p>
              </div>

              {/* Stats strip */}
              <dl className="flex flex-wrap gap-6 sm:gap-10 pt-2">
                {(
                  [
                    { label: 'Total Partners', value: partners?.filter((p) => p.isActive).length },
                    { label: 'Featured Sponsors', value: featured.length }
                  ] as { label: string; value: number }[]
                ).map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-[10px] sm:text-xs font-semibold dark:text-neutral-500 text-neutral-500 uppercase tracking-widest">
                      {label}
                    </dt>
                    <dd className="text-2xl sm:text-3xl font-black dark:text-white text-neutral-900 tabular-nums">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </div>
        </section>

        {/* ── Featured spotlight (if any) ── */}
        {featured.length > 0 && <FeaturedSpotlight featured={featured} />}

        {/* Everyone else — uniform grid */}
        {rest.length > 0 && (
          <section
            className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 dark:bg-neutral-950 bg-white"
            aria-label="All partners"
          >
            <div className="max-w-334 mx-auto">
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mb-8 sm:mb-12"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black dark:text-white text-neutral-900 mb-3 sm:mb-4">
                  Our Partners
                </h2>
                <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">
                  Organizations supporting the Boys & Girls Club of Lynn.
                </p>
              </motion.div>
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {rest.map((partner) => (
                  <PartnerCard key={partner?.id} partner={partner} />
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* ── Become a partner CTA ── */}
        <section
          className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 dark:bg-neutral-900/50 bg-neutral-50"
          aria-label="Become a partner"
        >
          <div className="max-w-334 mx-auto">
            <motion.div
              className="dark:bg-neutral-900 bg-white dark:border-neutral-800 border-neutral-200 border rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-3 max-w-xl">
                <p className="text-[10px] sm:text-xs font-semibold dark:text-neutral-500 text-neutral-500 uppercase tracking-widest">
                  Get Involved
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black dark:text-white text-neutral-900 leading-tight">
                  Become a Partner
                </h2>
                <p className="text-sm sm:text-base dark:text-neutral-400 text-neutral-600">
                  Join our network of community champions. Your support directly funds programs, mentors, and
                  opportunities for the young people of Lynn.
                </p>
              </div>
              <Link
                href="/contact?subject=other"
                className="shrink-0 inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-sm sm:text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-offset-white whitespace-nowrap"
              >
                Get in Touch
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8H13M13 8L9 4M13 8L9 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  )
}
