import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'

type Props = {
  dashboard: any
  firstName: string
  lastName: string
}

export function SupporterOverviewHeader({ dashboard, firstName, lastName }: Props) {
  const session = useSession()
  const hasActivity = (dashboard?.donationCount ?? 0) > 0 || (dashboard?.myUpcomingEvents?.length ?? 0) > 0

  const displayName =
    [firstName, lastName].filter(Boolean).join(' ') || session.data?.user?.name || session.data?.user?.email

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Welcome, {displayName}</h1>

      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        {hasActivity
          ? 'Your giving history and account details'
          : 'Start making a difference with a donation or event registration'}
      </p>
    </motion.div>
  )
}
