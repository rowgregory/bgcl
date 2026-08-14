'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Partner } from '@prisma/client'
import { PARTNER_TIERS } from '@/lib/validations/partner.validation'

export default function PublicPartnersClient({ partners, pageData }: { partners: Partner[]; pageData: any }) {
  const t = pageData?.sections?.partners

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:px-4 focus-visible:py-2 focus-visible:bg-sky-600 focus-visible:text-white focus-visible:font-semibold focus-visible:rounded-lg focus-visible:shadow-lg"
      >
        Skip to main content
      </a>

      <main id="main-content" className="dark:bg-neutral-950 bg-white">
        {/* ── Hero ── */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12" aria-label="Partners hero">
          <div className="max-w-334 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 sm:space-y-6"
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

              <dl className="flex flex-wrap gap-6 sm:gap-10 pt-2">
                <div>
                  <dt className="text-[10px] sm:text-xs font-semibold dark:text-neutral-500 text-neutral-500 uppercase tracking-widest">
                    Total Partners
                  </dt>
                  <dd className="text-2xl sm:text-3xl font-black dark:text-white text-neutral-900 tabular-nums">
                    {partners.filter((p) => p.isActive).length}
                  </dd>
                </div>
              </dl>
            </motion.div>
          </div>
        </section>

        {/* ── Tiers ── */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12" aria-label="Partners by tier">
          <div className="max-w-334 mx-auto space-y-16">
            {PARTNER_TIERS.map(({ value, label }) => {
              const tierPartners = partners.filter((p) => p.isActive && p.tier === value)
              if (tierPartners.length === 0) return null

              return (
                <motion.div
                  key={value}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl sm:text-2xl font-black dark:text-white text-neutral-900 mb-6 pb-3 border-b dark:border-neutral-800 border-neutral-200">
                    {label}
                  </h2>
                  <ul role="list" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {tierPartners.map((partner) => (
                      <li
                        key={partner.id}
                        className="flex items-center justify-center px-4 py-5 dark:bg-neutral-900 bg-neutral-50 dark:border-neutral-800 border-neutral-200 border rounded-xl"
                      >
                        <p className="text-sm font-semibold dark:text-neutral-200 text-neutral-800 text-center leading-snug">
                          {partner.name}
                        </p>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </section>

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
                  {t.cta_eyebrow}
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black dark:text-white text-neutral-900 leading-tight">
                  {t.cta_heading}
                </h2>
                <p className="text-sm sm:text-base dark:text-neutral-400 text-neutral-600">{t.cta_subheading}</p>
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
