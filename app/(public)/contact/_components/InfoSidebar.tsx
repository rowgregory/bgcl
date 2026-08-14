import { Clock, Heart, ArrowRight, Briefcase } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useVolunteerDrawer } from '@/stores/drawers'

export default function InfoSidebar({ contactInfo, hours }) {
  const open = useVolunteerDrawer((s) => s.open)
  return (
    <motion.aside
      aria-label="Contact information"
      className="space-y-4 sm:space-y-6"
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Contact Cards */}
      {contactInfo.map((info, index) => {
        const Icon = info.icon
        return (
          <a
            key={index}
            href={info.href}
            aria-label={`${info.label}: ${info.value}`}
            className="block p-4 sm:p-6 rounded-lg sm:rounded-xl hover:border-sky-500/50 transition-colors dark:bg-neutral-900/50 bg-neutral-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div
                aria-hidden="true"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg dark:bg-sky-500/10 bg-sky-100 flex items-center justify-center shrink-0"
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 dark:text-sky-400 text-sky-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-wider mb-1">
                  {info.label}
                </p>
                <p className="dark:text-white text-neutral-900 font-semibold transition-colors whitespace-pre-line text-sm sm:text-base">
                  {info.value}
                </p>
              </div>
            </div>
          </a>
        )
      })}

      {/* Hours Card */}
      <div className="dark:bg-neutral-900 bg-white dark:border-neutral-800 border-neutral-200 p-4 sm:p-6 rounded-lg sm:rounded-xl border">
        <div className="flex items-start gap-3 sm:gap-4">
          <div
            aria-hidden="true"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg dark:bg-sky-500/10 bg-sky-100 flex items-center justify-center shrink-0"
          >
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 dark:text-sky-400 text-sky-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xs sm:text-sm font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-wider mb-2 sm:mb-3">
              Fall Hours
            </h2>
            <dl className="space-y-1.5 sm:space-y-2">
              {hours.map((hour, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs sm:text-sm">
                  <dt className="dark:text-neutral-400 text-neutral-600">{hour.period}</dt>
                  <dd className="dark:text-white text-neutral-900 font-semibold">{hour.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Get Involved Card */}
      <div className="dark:bg-neutral-900 bg-white dark:border-neutral-800 border-neutral-200 p-4 sm:p-6 rounded-lg sm:rounded-xl border">
        <h2 className="text-xs sm:text-sm font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-wider mb-3 sm:mb-4">
          Get Involved
        </h2>
        <div className="space-y-2 sm:space-y-3">
          <button
            type="button"
            onClick={() => open()}
            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg dark:bg-sky-500/10 bg-sky-50 dark:hover:bg-sky-500/20 hover:bg-sky-100 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 dark:text-sky-400 text-sky-600" aria-hidden="true" />
            <span className="dark:text-white text-neutral-900 font-medium text-sm sm:text-base">
              Become a Volunteer
            </span>
            <ArrowRight
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 dark:text-sky-400 text-sky-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
              aria-hidden="true"
            />
          </button>
          <Link
            href="/get-involved"
            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg dark:bg-indigo-500/10 bg-indigo-50 dark:hover:bg-indigo-500/20 hover:bg-indigo-100 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 dark:text-indigo-400 text-indigo-600" aria-hidden="true" />
            <span className="dark:text-white text-neutral-900 font-medium text-sm sm:text-base">Join Our Team</span>
            <ArrowRight
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 dark:text-indigo-400 text-indigo-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </motion.aside>
  )
}
