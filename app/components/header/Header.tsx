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
        router.push('/admin/mission-control')
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
        className={`${pathname === '/' ? 'max-w-334' : ''} w-full mx-auto bg-neutral-900 border-b border-neutral-700 relative z-100 px-4 sm:px-6 lg:px-8 py-3`}
      >
        <div className="max-w-7xl flex items-center justify-between mx-auto">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => store.dispatch(setOpenLanguageDropdown())}
              className="flex items-center space-x-2 text-white text-sm font-medium hover:text-neutral-300 transition-colors"
            >
              <span>{selectedLanguage}</span>
              <motion.div animate={{ rotate: languageDropdown ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              </motion.div>
            </button>
            <div className="text-neutral-400 text-sm">
              Phone: <span className="text-white">781 593 1772</span>{' '}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <button
              onClick={handleLaunchApp}
              className="text-neutral-300 hover:text-white text-sm font-medium transition-colors whitespace-nowrap"
            >
              Launch App
            </button>
            <a
              href="https://parentportal.bgcl.org/"
              target="_blank"
              className="text-neutral-300 hover:text-white text-sm font-medium transition-colors whitespace-nowrap"
            >
              Parent Portal (Legacy)
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <motion.div
        className={`${pathname === '/' ? 'max-w-334' : ''} w-full mx-auto sticky top-0 border-b border-neutral-700 bg-neutral-950 z-50 px-4 sm:px-6 lg:px-8`}
        animate={{
          paddingTop: isAtTop ? '24px' : '16px',
          paddingBottom: isAtTop ? '24px' : '16px'
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
                className="overflow-hidden"
                initial={{ height: '40px' }}
                animate={{
                  height: isAtTop ? '40px' : '32px'
                }}
                transition={{ duration: 0.3 }}
              >
                <Picture
                  src="/images/logo-1.webp"
                  alt="Boys & Girls Club"
                  className="w-auto h-full cursor-pointer hover:opacity-80 transition-opacity"
                  priority
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 1 }}
                animate={{
                  opacity: isAtTop ? 1 : 0.8
                }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-white font-bold text-lg">Boys & Girls Club</h1>
                <p className="text-sky-400 text-xs font-semibold tracking-wide">of Lynn</p>
              </motion.div>
            </motion.div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {[
              { label: 'HOME', href: '/' },
              { label: 'ABOUT', href: '/about' },
              { label: 'PROGRAMS', href: '/programs' },
              { label: 'EVENTS', href: '/events' },
              { label: 'NEWS', href: '/news' },
              { label: 'CAREERS', href: '/careers' }
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
                  className={`${item.href === pathname ? 'text-sky-500' : 'text-white'} hover:text-sky-400 transition-colors font-black`}
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
              // boxShadow: ['0 0 0 0 rgba(6, 182, 212, 0.4)', '0 0 0 10px rgba(6, 182, 212, 0)'],
              scale: isAtTop ? 1 : 0.9
            }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href="/donate"
              className="bg-sky-500 hover:bg-sky-600 text-black font-bold px-8 py-3 rounded-sm transition-colors shadow-lg"
            >
              DONATE
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
