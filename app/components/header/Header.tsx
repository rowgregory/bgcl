import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import Picture from '../common/Picture'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { store, useApplicationSelector } from '@/app/lib/store/store'
import { setOpenMobileNavigation } from '@/app/lib/store/slices/appSlice'
import { motion } from 'framer-motion'
import { useIsAtTop } from '@/app/lib/hooks/useIsAtTop'
import GoogleTranslate from '../GoogleTranslate'
import { headerNavLinks } from '@/app/lib/constants/headerNavLinks'

export default function Header() {
  const { data, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const isAtTop = useIsAtTop()
  const { mobileNavigation, isSpanish } = useApplicationSelector()

  const getLaunchPath = () => {
    if (status !== 'authenticated') return '/auth/login'
    return ['ADMIN', 'SUPERUSER'].includes(data?.user?.role ?? '')
      ? '/admin/mission-control'
      : data?.user?.role === 'PROGRAM'
        ? '/program/airlock'
        : '/supporter/overview'
  }

  const handleLaunchApp = () => router.push(getLaunchPath())

  return (
    <>
      {/* Top Bar */}
      <div
        className={`${pathname === '/' ? 'max-w-334' : ''} w-full mx-auto dark:bg-neutral-900 dark:border-neutral-700 bg-neutral-50 border-neutral-200 border-b relative z-100 px-4 sm:px-6 lg:px-8 py-3`}
      >
        <div className="max-w-7xl flex items-center justify-between mx-auto">
          <div className="flex items-center space-x-4 lg:space-x-6">
            <GoogleTranslate />
            <div className="hidden sm:flex items-center space-x-4 lg:space-x-6 dark:text-neutral-400 text-neutral-600 text-sm">
              <div>
                Phone:{' '}
                <a href="tel:+17815931772" className="dark:text-white text-neutral-900 hover:underline">
                  781 593 1772
                </a>
              </div>
              <div className="hidden md:block">
                Address: <span className="dark:text-white text-neutral-900">25 N Common St, Lynn, MA 01902</span>
              </div>
              <div className="hidden lg:block">
                Tax ID: <span className="dark:text-white text-neutral-900">04-2103924</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <button
              onClick={handleLaunchApp}
              className="dark:text-neutral-300 dark:hover:text-white text-neutral-700 hover:text-neutral-900 text-sm font-medium transition-colors whitespace-nowrap"
            >
              Launch App
            </button>
          </div>
        </div>
      </div>

      <motion.div
        className={`${pathname === '/' ? 'max-w-334' : ''} w-full mx-auto sticky top-0 dark:border-neutral-700 dark:bg-neutral-950 border-neutral-200 bg-white z-50 px-4 sm:px-6 lg:px-8`}
        animate={{
          paddingTop: isAtTop ? '18px' : '10px',
          paddingBottom: isAtTop ? '10px' : '10px'
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Burger Menu Button */}
          <button
            onClick={() => store.dispatch(setOpenMobileNavigation())}
            className="block 2xl:hidden dark:text-neutral-300 dark:hover:text-white text-neutral-700 hover:text-neutral-900 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileNavigation ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ scale: 1 }}
              animate={{
                scale: isAtTop ? 1 : 0.9
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="overflow-hidden flex items-center justify-center"
                initial={{ height: '56px' }}
                animate={{
                  height: isAtTop ? '56px' : '48px'
                }}
                transition={{ duration: 0.3 }}
              >
                <Picture
                  src="/images/vertical-logo-light.png"
                  alt="Boys & Girls Club"
                  className="dark:hidden block w-auto h-full cursor-pointer hover:opacity-80 transition-opacity"
                  priority={true}
                />
                <Picture
                  src="/images/vertical-logo-dark.png"
                  alt="Boys & Girls Club"
                  className="dark:block hidden w-auto h-full cursor-pointer hover:opacity-80 transition-opacity"
                  priority={true}
                />
              </motion.div>
            </motion.div>
          </Link>

          <nav className={`hidden 2xl:flex items-center ${isSpanish ? 'space-x-4' : 'space-x-6'}`}>
            {headerNavLinks.map((item) => (
              <motion.div
                key={item.label}
                animate={{
                  fontSize: isSpanish
                    ? isAtTop
                      ? '11px'
                      : '9.5px' // Smaller for Spanish
                    : isAtTop
                      ? '13px'
                      : '11.5px' // Normal for English
                }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={item.href}
                  className={`${item.href === pathname ? 'dark:text-sky-500 text-sky-600' : 'dark:text-white text-neutral-900'} dark:hover:text-sky-400 hover:text-sky-600 transition-colors font-black whitespace-nowrap`}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            animate={{
              scale: isAtTop ? 1 : 0.9
            }}
            transition={{ duration: 0.3 }}
          >
            <a
              href="https://parentportal.bgcl.org/"
              target="_blank"
              className="dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 dark:text-black text-white font-bold px-4 sm:px-8 py-2 sm:py-3 rounded-sm transition-colors shadow-lg text-sm sm:text-base block whitespace-nowrap"
            >
              <span className="hidden md:inline">Parent Portal</span>
              <span className="md:hidden">Portal</span>
            </a>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
