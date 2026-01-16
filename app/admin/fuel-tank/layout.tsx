'use client'

import SubNavLink from '@/app/components/navigation/SubNavLink'
import getTheFuelTankNavLinks from '@/app/lib/utils/getTheFuelTankNavLinks'
import { usePathname } from 'next/navigation'

export default function FuelTankLayout({ children }) {
  const path = usePathname()

  return (
    <>
      {/* Navigation */}
      <div className="fixed w-full z-10 bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-700/30">
        <div className="px-2 xs:px-3 sm:px-6">
          <nav className="flex items-center py-2 xs:py-3 sm:py-4 overflow-x-auto scrollbar-none">
            <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-6 lg:space-x-8 min-w-max">
              {getTheFuelTankNavLinks(path).map((item) => (
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
