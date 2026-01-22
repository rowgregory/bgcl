import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import Picture from '../common/Picture'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { store, useApplicationSelector } from '@/app/lib/store/store'
import { setOpenLanguageDropdown } from '@/app/lib/store/slices/appSlice'
import { motion } from 'framer-motion'
import { useIsAtTop } from '@/app/lib/hooks/useIsAtTop'

export default function Header() {
  const { data, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const { languageDropdown, selectedLanguage } = useApplicationSelector()
  const isAtTop = useIsAtTop()

  const handleLaunchApp = () => {
    if (status === 'authenticated') {
      if (data.user?.role === 'ADMIN' || data.user?.role === 'SUPERUSER') {
        router.push('/admin/star-map/home')
      } else {
        router.push('/supporter/overview')
      }
    } else {
      router.push('/auth/login')
    }
  }

  return (
    <>
      {/* Top Bar */}
      <div
        className={`${pathname === '/' ? 'max-w-334' : ''} w-full mx-auto dark:bg-neutral-900 dark:border-neutral-700 bg-neutral-50 border-neutral-200 border-b relative z-100 px-4 sm:px-6 lg:px-8 py-3`}
      >
        <div className="max-w-7xl flex items-center justify-between mx-auto">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => store.dispatch(setOpenLanguageDropdown())}
              className="flex items-center space-x-2 dark:text-white text-neutral-900 text-sm font-medium dark:hover:text-neutral-300 hover:text-neutral-700 transition-colors"
            >
              <span>{selectedLanguage}</span>
              <motion.div animate={{ rotate: languageDropdown ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown className="w-4 h-4 dark:text-neutral-400 text-neutral-600" />
              </motion.div>
            </button>
            <div className="dark:text-neutral-400 text-neutral-600 text-sm">
              Phone: <span className="dark:text-white text-neutral-900">781 593 1772</span>{' '}
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

      {/* Main Header */}
      <motion.div
        className={`${pathname === '/' ? 'max-w-334' : ''} w-full mx-auto sticky top-0 dark:border-neutral-700 dark:bg-neutral-950 border-neutral-200 bg-white z-50 px-4 sm:px-6 lg:px-8`}
        animate={{
          paddingTop: isAtTop ? '18px' : '10px',
          paddingBottom: isAtTop ? '18px' : '10px'
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
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

          <nav className="hidden xl:flex items-center space-x-8">
            {[
              { label: 'HOME', href: '/' },
              { label: 'ABOUT', href: '/about' },
              { label: 'TEAM', href: '/team' },
              { label: 'PROGRAMS', href: '/programs' },
              { label: 'CAMPAIGNS', href: '/campaigns' },
              { label: 'EVENTS', href: '/events' },
              { label: 'STORIES', href: '/stories' },
              { label: 'HUB', href: '/hub' },
              { label: 'GET INVOLVED', href: '/get-involved' },
              { label: 'CONTACT', href: '/contact' }
            ].map((item) => (
              <motion.div
                key={item.label}
                animate={{
                  fontSize: isAtTop ? '13px' : '12px'
                }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={item.href}
                  className={`${item.href === pathname ? 'dark:text-sky-500 text-sky-600' : 'dark:text-white text-neutral-900'} dark:hover:text-sky-400 hover:text-sky-600 transition-colors font-black`}
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
              className="dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 dark:text-black text-white font-bold px-8 py-3 rounded-sm transition-colors shadow-lg"
            >
              Parent Portal
            </a>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
