import { motion } from 'framer-motion'
import Link from 'next/link'
import Picture from '@/components/_shared/Picture'

export const ConfirmationHero = ({ isDonation }: { isDonation: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="flex items-center gap-4 mb-8"
  >
    <Link href="/" className="shrink-0 h-10">
      <Picture
        src="/images/vertical-logo-light.png"
        alt="Boys & Girls Club"
        className="h-full w-auto block dark:hidden"
        priority
      />
      <Picture
        src="/images/vertical-logo-dark.png"
        alt="Boys & Girls Club"
        className="h-full w-auto hidden dark:block"
        priority
      />
    </Link>

    <div className="min-w-0">
      <h1 className="text-lg font-semibold text-neutral-900 dark:text-white leading-tight">
        {isDonation ? 'Thank you for your donation' : 'Your tickets are confirmed'}
      </h1>
      <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
        Your support helps us empower youth in our community.
      </p>
    </div>
  </motion.div>
)
