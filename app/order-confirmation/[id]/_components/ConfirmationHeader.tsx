'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useSession } from 'next-auth/react'

export const ConfirmationHeader = () => {
  const { data: session } = useSession()

  return (
    <div className="sticky top-0 z-10 border-b border-neutral-200 dark:border-neutral-800 backdrop-blur bg-white/80 dark:bg-neutral-900/80">
      <div className="max-w-4xl mx-auto px-6 py-3 lg:px-8 flex items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-sky-600 dark:text-sky-400 hover:underline">
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          Home
        </Link>

        {session?.user?.id && (
          <Link
            href="/supporter/overview"
            className="hidden sm:block min-w-0 text-sm text-neutral-500 dark:text-neutral-400 truncate hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Supporter Overview
          </Link>
        )}
      </div>
    </div>
  )
}
