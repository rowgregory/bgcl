import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Picture from '@/components/_shared/Picture'

export function DonateFormHeader() {
  const session = useSession()
  const isAuthed = session.status === 'authenticated'
  const email = session.data?.user?.email

  return (
    <header className="sticky top-0 z-10 h-14 px-6 lg:px-8 flex items-center border-b border-neutral-200 dark:border-neutral-800 bg-white/85 dark:bg-neutral-950/85 backdrop-blur-sm">
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/"
            aria-label="Boys and Girls Club of Lynn, home"
            className="flex w-28 h-auto shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
          >
            <Picture
              src="/images/horizontal-logo-light.png"
              alt="Boys & Girls Club of Lynn"
              className="dark:hidden block w-full h-full object-contain hover:opacity-80 transition-opacity"
              priority
            />
            <Picture
              src="/images/horizontal-logo-dark.png"
              alt="Boys & Girls Club of Lynn"
              className="dark:block hidden w-full h-full object-contain hover:opacity-80 transition-opacity"
              priority
            />
          </Link>

          <span className="h-5 w-px bg-neutral-200 dark:bg-neutral-800 shrink-0 hidden sm:block" aria-hidden="true" />

          <h1 className="text-sm font-semibold text-neutral-900 dark:text-white shrink-0 hidden sm:block">Donate</h1>
        </div>

        <div className="flex items-center gap-4 min-w-0">
          {isAuthed && email && (
            <Link
              href="/supporter/overview"
              title={email}
              className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors truncate hidden md:inline max-w-40"
            >
              {email}
            </Link>
          )}

          <Link
            href="/"
            className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors shrink-0 whitespace-nowrap"
          >
            Back to site
          </Link>
        </div>
      </div>
    </header>
  )
}
