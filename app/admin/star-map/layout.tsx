'use client'

import { FC, ReactNode } from 'react'
import { glossyLowbitObscureBleep } from '@/app/lib/constants/sound-effects'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { SubNavLink } from '@/app/components/navigation/SubNavLink'
import getStarMapLinks from '@/app/lib/utils/getStarMapLinks'
import { usePathname } from 'next/navigation'

const StarMapLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const path = usePathname()
  const { play } = useSoundEffect(glossyLowbitObscureBleep, true)

  return (
    <>
      {/* Navigation */}
      <div className="fixed w-full z-10 dark:bg-zinc-900/50 dark:backdrop-blur-sm dark:border-zinc-700/30 bg-white/50 backdrop-blur-sm border-neutral-200/30 border-b">
        <div className="px-2 xs:px-3 sm:px-6">
          <nav className="flex items-center py-2 xs:py-3 sm:py-4 overflow-x-auto scrollbar-none">
            <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-6 lg:space-x-8 min-w-max">
              {getStarMapLinks(path).map((item) => (
                <SubNavLink key={item.linkKey} handleNav={() => play()} item={item} />
              ))}
            </div>
          </nav>
        </div>
      </div>
      <main>{children}</main>
    </>
  )
}

export default StarMapLayout
