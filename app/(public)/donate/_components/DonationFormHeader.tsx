import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { MotionLink } from '@/components/_shared/MotionLink'
import Picture from '@/components/_shared/Picture'
import Link from 'next/link'
import { User } from 'lucide-react'

export function DonationFormHeader() {
  const session = useSession()
  const isAuthed = session.status === 'authenticated'

  return (
    <div className="px-4 sm:px-6 md:px-12 py-8 sm:py-10 dark:border-neutral-800 border-b border-neutral-200">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col space-y-4 sm:space-y-5"
        >
          {/* Logo + signed in indicator */}
          <div className="flex items-center justify-between gap-4">
            <MotionLink href="/" className="flex space-x-3 w-60 h-auto">
              <Picture
                src="/images/horizontal-logo-light.png"
                alt="Boys & Girls Club"
                className="dark:hidden block w-full h-full cursor-pointer hover:opacity-80 transition-opacity object-contain"
                priority
              />
              <Picture
                src="/images/horizontal-logo-dark.png"
                alt="Boys & Girls Club"
                className="dark:block hidden w-full h-full cursor-pointer hover:opacity-80 transition-opacity object-contain"
                priority
              />
            </MotionLink>

            {isAuthed && (
              <Link href="/supporter/overview" className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                </div>
                <div className="min-w-0 hidden sm:block">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Signed in as</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white leading-none truncate">
                    {session.data.user.email}
                  </p>
                </div>
              </Link>
            )}
          </div>

          {/* Heading */}
          <div className="max-w-2xl space-y-2 sm:space-y-3">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
              Make a Difference
            </h1>
            <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600 leading-relaxed">
              Support Boys & Girls Club campaigns that empower youth in our community.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
