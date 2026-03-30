'use client'

import { SubNavLink } from '@/app/components/navigation/SubNavLink'
import { getCapsuleNavLinks } from '@/app/lib/utils/getCapsuleNavLinks'
import { usePathname } from 'next/navigation'

export default function CapsuleLayout({ children }) {
  const path = usePathname()

  return (
    <>
      {/* Navigation */}
      <div className="fixed top-18 lg:top-15 w-full z-10 dark:bg-zinc-900/50 dark:backdrop-blur-sm dark:border-zinc-700/30 bg-white/50 backdrop-blur-sm border-neutral-200/30 border-b">
        <div className="px-2 xs:px-3 sm:px-6">
          <nav className="flex items-center py-2 xs:py-3 sm:py-4 overflow-x-auto scrollbar-none">
            <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-6 lg:space-x-8 min-w-max">
              {getCapsuleNavLinks(path).map((item) => (
                <SubNavLink key={item.linkKey} handleNav={() => {}} item={item} />
              ))}
            </div>
          </nav>
        </div>
      </div>
      <main className="pt-17">{children}</main>
    </>
  )
}
