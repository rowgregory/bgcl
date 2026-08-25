import Link from 'next/link'
import { ArrowLeft, User } from 'lucide-react'
import { useSession } from 'next-auth/react'

export const ConfirmationHeader = ({ isDonation }: { isDonation: boolean }) => {
  const session = useSession()

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800 sticky top-0 backdrop-blur bg-white/50 dark:bg-neutral-900/50">
      <div className="max-w-6xl mx-auto px-4 py-4 lg:px-8 flex items-center justify-between">
        <Link
          href={isDonation ? '/donate' : '/events'}
          className="inline-flex items-center space-x-1 text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 transition-colors text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{isDonation ? 'Donate' : 'Events'}</span>
        </Link>

        {session?.data?.user?.id && (
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
    </div>
  )
}
