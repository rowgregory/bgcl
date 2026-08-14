import { motion } from 'framer-motion'
import { ArrowRight, Calendar, ChevronRight, Heart } from 'lucide-react'
import Link from 'next/link'

export function CompactCTAs() {
  return (
    <motion.div
      className="flex flex-col sm:flex-row gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      custom={1.5}
    >
      <Link
        href="/donate"
        aria-label="Make a donation to Boys & Girls Club of Lynn"
        className="flex-1 flex items-center justify-between gap-3 px-5 py-4 bg-sky-600 hover:bg-sky-500 rounded-xl transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0" aria-hidden="true">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Make a Donation</p>
            <p className="text-sky-100 text-xs">Support our mission</p>
          </div>
        </div>
        <ArrowRight
          className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform shrink-0"
          aria-hidden="true"
        />
      </Link>

      <Link
        href="/events"
        aria-label="Browse upcoming events"
        className="flex-1 flex items-center justify-between gap-3 px-5 py-4 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-200 border rounded-xl transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg dark:bg-neutral-700 bg-neutral-200 flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <Calendar className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <p className="dark:text-neutral-200 text-neutral-800 font-bold text-sm">Explore Events</p>
            <p className="dark:text-neutral-400 text-neutral-500 text-xs">Browse & register</p>
          </div>
        </div>
        <ChevronRight
          className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition-transform shrink-0"
          aria-hidden="true"
        />
      </Link>
    </motion.div>
  )
}
