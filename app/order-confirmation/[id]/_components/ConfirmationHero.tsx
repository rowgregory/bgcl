import { motion } from 'framer-motion'
import Link from 'next/link'
import Picture from '@/components/_shared/Picture'

export const ConfirmationHero = ({ isDonation }: { isDonation: boolean }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      className="inline-flex items-center justify-center rounded-full mb-6"
    >
      <Link href="/" className="flex items-center gap-2 h-20">
        <Picture
          src="/images/vertical-logo-light.png"
          alt="Boys & Girls Club"
          className="h-full w-full block dark:hidden"
          priority
        />
        <Picture
          src="/images/vertical-logo-dark.png"
          alt="Boys & Girls Club"
          className="h-full w-full hidden dark:block"
          priority
        />
      </Link>
    </motion.div>

    <h1 className="text-4xl font-black text-neutral-900 dark:text-white mb-4">
      {isDonation ? 'Thank You for Your Donation!' : 'Your Tickets Are Confirmed!'}
    </h1>
    <p className="text-neutral-600 dark:text-neutral-400 text-lg">
      {isDonation
        ? 'Your generous support helps us empower youth in our community.'
        : 'Check your email for ticket details and event information.'}
    </p>
  </motion.div>
)
