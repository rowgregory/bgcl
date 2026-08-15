import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'

type Props = {
  dashboard: any
  firstName: string
  lastName: string
}

export function PageHeader({ dashboard, firstName, lastName }: Props) {
  const session = useSession()
  const hasActivity = dashboard?.recentDonations.length > 0 || dashboard?.upcomingEvents.length > 0

  const displayName =
    [firstName, lastName].filter(Boolean).join(' ') || session.data?.user?.name || session.data?.user?.email

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      custom={0.5}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 relative">
          <p className="text-xs font-semibold dark:text-neutral-600 text-neutral-500 uppercase tracking-widest mb-2">
            Your Impact
          </p>

          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black dark:text-white text-neutral-900 leading-tight">
              Welcome, {displayName}
            </h1>
          </div>

          <p className="dark:text-neutral-500 text-neutral-600 text-base mt-2">
            {hasActivity
              ? `Here's what you've accomplished with Boys & Girls Club of Lynn`
              : 'Start making a difference with a donation or event registration'}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
