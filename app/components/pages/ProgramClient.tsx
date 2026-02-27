'use client'

import { FC } from 'react'
import getCurrentPageId from '../../lib/utils/getCurrentPageId'
import { AnimatePresence, motion } from 'framer-motion'
import { store, useDashboardSelector } from '../../lib/store/store'
import { ILayout } from '@/types/common'
import { setCloseProgramSidebar, setToggleProgramSidebar } from '../../lib/store/slices/dashboardSlice'
import { usePathname } from 'next/navigation'
import { ProgramSidebar } from '../../program/sidebar'
import { Menu } from 'lucide-react'
import MobileMenuButton from '../buttons/MobileMenuButton'
import LogoutButton from '../buttons/LogoutButton'
import { programNavigationLinkData } from '@/app/lib/constants/programNavLinks'

export const ProgramClient: FC<ILayout> = ({ children }) => {
  const pathname = usePathname()
  const navigationGroups = programNavigationLinkData(pathname)
  const selectedPage = getCurrentPageId(pathname, navigationGroups)
  const { programSidebar } = useDashboardSelector()
  const onClose = () => store.dispatch(setCloseProgramSidebar())

  return (
    <>
      {/* Desktop Fixed Header */}
      <header
        aria-label="Program dashboard header"
        className="hidden lg:block fixed top-0 left-64 right-0 dark:bg-neutral-950 dark:border-neutral-800 bg-white border-neutral-200 border-b py-2.5 px-6 z-30 h-15.25"
      >
        <div className="flex items-center justify-between">
          <h1
            aria-live="polite"
            aria-atomic="true"
            className="text-lg font-bold dark:text-neutral-100 text-neutral-900 capitalize"
          >
            {selectedPage}
          </h1>
          <div className="flex items-center space-x-2 md:space-x-4 h-full">
            <MobileMenuButton />
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="min-h-screen dark:bg-neutral-950 bg-white flex">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {programSidebar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              aria-hidden="true"
              className="fixed inset-0 dark:bg-black/50 bg-black/30 z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block fixed left-0 top-0 h-screen w-64 z-20" aria-label="Program navigation">
          <ProgramSidebar />
        </div>

        {/* Mobile Sidebar */}
        <motion.div
          initial={false}
          animate={{ x: programSidebar ? 0 : '-100%' }}
          transition={{ duration: 0.3 }}
          aria-hidden={!programSidebar}
          id="mobile-program-sidebar"
          className="fixed lg:hidden inset-y-0 left-0 z-50 w-64"
        >
          <ProgramSidebar />
        </motion.div>

        {/* Main Content */}
        <main
          id="main-content"
          aria-label="Program content"
          className="flex-1 overflow-y-auto flex flex-col lg:ml-64 lg:mt-15"
        >
          {/* Mobile Header */}
          <div
            className="lg:hidden flex items-center justify-between dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border-b px-4 py-4"
            role="banner"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => store.dispatch(setToggleProgramSidebar(programSidebar))}
              aria-label={programSidebar ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={programSidebar}
              aria-controls="mobile-program-sidebar"
              className="p-2 dark:hover:bg-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <Menu className="w-6 h-6 dark:text-white text-neutral-900" aria-hidden="true" />
            </motion.button>

            <h1
              aria-live="polite"
              aria-atomic="true"
              className="text-lg font-bold dark:text-white text-neutral-900 capitalize"
            >
              {selectedPage}
            </h1>

            {/* Spacer — keeps heading centered, aria-hidden so it's not announced */}
            <div className="w-10" aria-hidden="true" />
          </div>

          {children}
        </main>
      </div>
    </>
  )
}
