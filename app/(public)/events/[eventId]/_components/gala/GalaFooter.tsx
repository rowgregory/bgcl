'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

type Props = {
  missionStatement?: string | null
  host?: string | null
}

export function GalaFooter({ missionStatement, host }: Props) {
  return (
    <footer className="border-t border-white/10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-325 py-16 text-center lg:py-20"
      >
        {missionStatement && (
          <p className="mx-auto max-w-2xl font-pinyon text-2xl leading-relaxed text-white/80 sm:text-3xl">
            {missionStatement}
          </p>
        )}

        {/* Star rule, the invitation's divider */}
        <div className="mx-auto mt-10 flex w-full max-w-xs items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-linear-to-r from-transparent to-white/15" />
          <span className="text-[#9b1b3c]">★</span>
          <span className="h-px flex-1 bg-linear-to-l from-transparent to-white/15" />
        </div>

        {host && <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.3em] text-cyan-400">{host}</p>}

        <p className="mt-3 text-sm text-white/45">A 501(c)(3) charitable nonprofit organization · Tax ID 04-2103924</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <Link
            href="/events"
            className="text-white/60 transition-colors hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a12]"
          >
            All Events
          </Link>
          <Link
            href="/contact"
            className="text-white/60 transition-colors hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a12]"
          >
            Contact
          </Link>
        </div>
      </motion.div>
    </footer>
  )
}
