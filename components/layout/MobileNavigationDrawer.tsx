'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { store, useApplicationSelector } from '@/lib/store/store'
import { setCloseMobileNavigation } from '@/lib/store/slices/appSlice'
import Picture from '../_shared/Picture'
import { X } from 'lucide-react'
import { mainNavigationLinks } from '@/lib/constants/navigation.constants'

export default function MobileNavigationDrawer() {
  const pathname = usePathname()
  const { mobileNavigation } = useApplicationSelector()
  const handleClose = () => store.dispatch(setCloseMobileNavigation())

  return (
    <AnimatePresence>
      {mobileNavigation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-120 2xl:hidden"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

          {/* Drawer Panel */}
          <motion.nav
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] dark:bg-neutral-900 bg-white shadow-2xl overflow-y-auto z-140"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Close button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleClose}
                  aria-label="Close navigation menu"
                  className="p-2 rounded-lg dark:text-neutral-400 text-neutral-500 dark:hover:bg-neutral-800 hover:bg-neutral-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Logo */}
              <div className="mb-8">
                <Picture
                  src="/images/vertical-logo-light.png"
                  alt="Boys & Girls Club of Lynn — home"
                  className="dark:hidden block h-12 w-auto"
                  priority={true}
                />
                <Picture
                  src="/images/vertical-logo-dark.png"
                  alt="Boys & Girls Club of Lynn — home"
                  className="dark:block hidden h-12 w-auto"
                  priority={true}
                />
              </div>

              {/* Navigation Links */}
              <ul role="list" className="space-y-1 list-none p-0 m-0">
                {mainNavigationLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={handleClose}
                      aria-current={item.href === pathname ? 'page' : undefined}
                      className={`block px-4 py-3 rounded-lg font-bold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                        item.href === pathname
                          ? 'dark:bg-sky-600/20 bg-sky-600/10 dark:text-sky-400 text-sky-600'
                          : 'dark:text-neutral-300 text-neutral-700 dark:hover:bg-neutral-800 hover:bg-neutral-100'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Parent Portal Button */}
              <div className="mt-8">
                <a
                  href="https://parentportal.bgcl.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Parent Portal — opens in a new tab"
                  className="block text-center dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 dark:text-black text-white font-bold px-6 py-3 rounded-sm transition-colors shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                >
                  Parent Portal
                </a>
              </div>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
