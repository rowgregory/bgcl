import { motion } from 'framer-motion'
import { LogOut, X } from 'lucide-react'
import Link from 'next/link'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { magicChargeMana2 } from '@/app/lib/constants/sound-effects'
import { store } from '@/app/lib/store/store'
import { adminNavigationLinkData } from '../lib/constants/adminNavLinks'
import { usePathname, useRouter } from 'next/navigation'
import { setCloseSidebar } from '../lib/store/slices/dashboardSlice'
import { setOpenHeroStudio } from '../lib/store/slices/appSlice'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { setIsLoading } from '../lib/store/slices/formSlice'
import { showToast } from '../lib/store/slices/toastSlice'

const AdminSidebar = () => {
  const { play: cryo } = useSoundEffect(magicChargeMana2, true)
  const pathname = usePathname()
  const session = useSession()
  const router = useRouter()
  const onClose = () => store.dispatch(setCloseSidebar())

  const handleLogout = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    try {
      store.dispatch(setIsLoading(true))
      await signOut({
        redirect: false,
        callbackUrl: '/auth/login'
      })

      router.push('/auth/login')
      setIsLoading(false)
    } catch (error: unknown) {
      store.dispatch(
        showToast({
          type: 'error',
          message: 'Logout Fail',
          description: error instanceof Error ? error.message : 'An error occurred'
        })
      )
    } finally {
      store.dispatch(setIsLoading(true))
    }
  }

  return (
    <aside className="w-64 dark:bg-neutral-950 dark:border-neutral-800 bg-white border-neutral-200 border-r h-screen flex flex-col">
      {/* Header */}
      <div className="dark:border-neutral-800 border-neutral-200 border-b shrink-0">
        <div className="flex items-center justify-between py-4 px-6">
          <Link href="/" className="text-lg font-bold dark:text-neutral-100 text-neutral-900">
            Boys & Girls Club
          </Link>
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="lg:hidden p-2 dark:hover:bg-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 dark:text-neutral-100 text-neutral-900" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="space-y-6 px-6 py-6 flex-1 overflow-y-auto">
        {adminNavigationLinkData(pathname).map((group) => (
          <div key={group.title}>
            <h3 className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase mb-3 px-3">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const IconComponent = item.icon

                if (item.isDrawer) {
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        if (item.isDrawer) {
                          store.dispatch(setOpenHeroStudio())
                        }
                        onClose()
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-left cursor-pointer ${
                        item.active
                          ? 'dark:bg-linear-to-r dark:from-cyan-600 dark:to-sky-600 bg-linear-to-r from-sky-500 to-sky-600 text-white'
                          : 'dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <div className="flex items-center gap-2">{item.label}</div>
                    </button>
                  )
                }

                return (
                  <Link
                    key={item.path}
                    href={item.path || ''}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                      item.active
                        ? 'dark:bg-linear-to-r dark:from-cyan-600 dark:to-sky-600 bg-linear-to-r from-sky-500 to-sky-600 text-white'
                        : 'dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <div className="flex items-center gap-2">{item.label}</div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Section - Sticky Bottom */}
      <div className="shrink-0 border-t dark:border-neutral-800 border-neutral-200 p-4 dark:bg-neutral-950 bg-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-sky-400 to-sky-500 flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {session.data?.user?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2) ||
                session.data?.user?.email?.[0]?.toUpperCase() ||
                '?'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium dark:text-white text-neutral-900 truncate">
              {session.data?.user?.name || 'User'}
            </p>
            <p className="text-xs dark:text-neutral-400 text-neutral-500 truncate">{session.data?.user?.email}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium dark:text-red-400 text-red-600 dark:bg-red-900/20 bg-red-50 dark:hover:bg-red-900/30 hover:bg-red-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </motion.button>
      </div>
    </aside>
  )
}

export default AdminSidebar
