'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { store, useApplicationSelector } from '../lib/store/store'
import { setCloseMobileNavigation } from '../lib/store/slices/appSlice'
import Picture from './common/Picture'

export default function MobileNavigationDrawer() {
  const pathname = usePathname()
  const { mobileNavigation } = useApplicationSelector()

  const handleClose = () => {
    store.dispatch(setCloseMobileNavigation())
  }

  const navigationItems = [
    { label: 'HOME', href: '/' },
    { label: 'ABOUT', href: '/about' },
    { label: 'TEAM', href: '/team' },
    { label: 'PROGRAMS', href: '/programs' },
    { label: 'CAMPAIGNS', href: '/campaigns' },
    { label: 'EVENTS', href: '/events' },
    { label: 'AWARD WINNERS', href: '/award-winners' },
    { label: 'LATEST NEWS', href: '/latest-news' },
    { label: 'GET INVOLVED', href: '/get-involved' },
    { label: 'CONTACT', href: '/contact' }
  ]

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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Drawer Panel */}
          <motion.nav
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] dark:bg-neutral-900 bg-white shadow-2xl overflow-y-auto z-140"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Logo */}
              <div className="mb-8">
                <Picture
                  src="/images/vertical-logo-light.png"
                  alt="Boys & Girls Club"
                  className="dark:hidden block h-12 w-auto"
                  priority={true}
                />
                <Picture
                  src="/images/vertical-logo-dark.png"
                  alt="Boys & Girls Club"
                  className="dark:block hidden h-12 w-auto"
                  priority={true}
                />
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={handleClose}
                    className={`block px-4 py-3 rounded-lg font-bold text-sm transition-colors ${
                      item.href === pathname
                        ? 'dark:bg-sky-600/20 bg-sky-600/10 dark:text-sky-400 text-sky-600'
                        : 'dark:text-neutral-300 text-neutral-700 dark:hover:bg-neutral-800 hover:bg-neutral-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Parent Portal Button */}
              <div className="mt-8">
                <a
                  href="https://parentportal.bgcl.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 dark:text-black text-white font-bold px-6 py-3 rounded-sm transition-colors shadow-lg"
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
