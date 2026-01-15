import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import Link from 'next/link'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { magicChargeMana2 } from '@/app/lib/constants/sound-effects'
import { store } from '@/app/lib/store/store'
import { adminNavigationLinkData } from '../lib/constants/adminNavLinks'
import { usePathname } from 'next/navigation'
import { setCloseSidebar } from '../lib/store/slices/dashboardSlice'
import { setOpenHeroStudio } from '../lib/store/slices/appSlice'

const AdminSidebar = () => {
  const { play: cryo } = useSoundEffect(magicChargeMana2, true)
  const pathname = usePathname()
  const onClose = () => store.dispatch(setCloseSidebar())

  return (
    <aside className="w-64 bg-neutral-950 border-r border-neutral-800 h-screen overflow-y-auto flex flex-col">
      <div className="border-b border-neutral-800">
        <div className="flex items-center justify-between py-4 px-6">
          <Link href="/" className="text-lg font-bold text-neutral-100">
            Boys & Girls Club
          </Link>
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-neutral-800 rounded-lg"
            >
              <X className="w-5 h-5 text-neutral-100" />
            </motion.button>
          )}
        </div>
      </div>

      <nav className="space-y-6 px-6 py-6 flex-1">
        {adminNavigationLinkData(pathname).map((group) => (
          <div key={group.title}>
            <h3 className="text-xs font-semibold text-neutral-500 uppercase mb-3 px-3">{group.title}</h3>
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
                          ? 'bg-linear-to-r from-purple-600 to-indigo-600 text-white'
                          : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
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
                        ? 'bg-linear-to-r from-purple-600 to-indigo-600 text-white'
                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
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
    </aside>
  )
}

export default AdminSidebar
