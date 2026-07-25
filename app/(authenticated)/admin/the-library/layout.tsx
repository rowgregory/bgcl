'use client'

import { ReactNode } from 'react'
import { SubNavLink } from '@/app/(authenticated)/admin/_components/SubNavLink'
import { usePathname } from 'next/navigation'
import { getTheLibraryLinks } from '@/app/lib/utils/getTheLibraryLinks'

export default function TheLibraryLayout({ children }: { children: ReactNode }) {
  const path = usePathname()

  return (
    <>
      <div className="w-[calc(100vw-255px)] fixed top-18 lg:top-15 z-10 dark:bg-zinc-900/50 dark:backdrop-blur-sm dark:border-zinc-700/30 bg-white/50 backdrop-blur-sm border-neutral-200/30 border-b">
        <nav className="overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 xs:gap-3 sm:gap-6 lg:gap-8 min-w-max px-2 xs:px-3 sm:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap">
            {getTheLibraryLinks(path).map((item) => (
              <SubNavLink key={item.linkKey} handleNav={() => {}} item={item} />
            ))}
          </div>
        </nav>
      </div>
      <main className="pt-17">{children}</main>
    </>
  )
}
