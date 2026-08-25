'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { adminNavigationLinkData } from '@/app/(authenticated)/admin/_utils/adminNavigationLinkData'
import { getCurrentPageId } from '@/lib/utils/getCurrentPageId'
import { useSidebarStore } from '@/stores/useSidebarStore'
import AdminSidebar from './sidebar'
import { Role } from '@prisma/client'

export default function AdminLayoutClient({
  children,
  user,
  isModalEnabled
}: {
  children: ReactNode
  user: { role: Role; firstName?: string | null; lastName?: string | null; email?: string | null }
  isModalEnabled: boolean
}) {
  const pathname = usePathname()
  const navigationGroups = adminNavigationLinkData(pathname, user.role)
  const selectedPage = getCurrentPageId(pathname, navigationGroups)
  const adminSidebar = useSidebarStore((s) => s.adminSidebar)
  const toggleAdminSidebar = useSidebarStore((s) => s.toggleAdminSidebar)
  const onClose = useSidebarStore((s) => s.closeAdminSidebar)

  const isEventDetailsPage = pathname.includes('/admin/events/events/')

  return (
    <>
      <div
        className={`dark:bg-neutral-950 bg-white flex ${isEventDetailsPage ? 'fixed inset-0 overflow-hidden' : 'min-h-screen'}`}
      >
        {!isEventDetailsPage && (
          <>
            {/* ── Mobile sidebar backdrop ── */}
            {adminSidebar && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 dark:bg-black/50 bg-black/30 z-40 lg:hidden"
              />
            )}

            {/* ── Desktop sidebar ── */}
            <div className="hidden lg:block fixed left-0 top-0 h-screen w-64 z-20">
              <AdminSidebar user={user} isModalEnabled={isModalEnabled} />
            </div>

            {/* ── Mobile sidebar ── */}
            <motion.div
              initial={false}
              animate={{ x: adminSidebar ? 0 : '-100%' }}
              transition={{ duration: 0.3 }}
              className="fixed lg:hidden inset-y-0 left-0 z-50 w-64"
            >
              <AdminSidebar user={user} isModalEnabled={isModalEnabled} />
            </motion.div>
          </>
        )}

        {/* ── Main content ── */}
        {isEventDetailsPage ? (
          <>{children}</>
        ) : (
          <main className="flex-1 flex flex-col lg:ml-64 overflow-y-auto">
            {/* Mobile header */}
            <div className="fixed w-full z-20 top-0 lg:hidden flex items-center justify-between dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border-b px-4 py-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleAdminSidebar()}
                className="p-2 dark:hover:bg-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-6 h-6 dark:text-white text-neutral-900" aria-hidden="true" />
              </motion.button>
              <h1 className="text-lg font-bold dark:text-white text-neutral-900 capitalize">{selectedPage}</h1>
              <div className="w-10" aria-hidden="true" />
            </div>

            {children}
          </main>
        )}
      </div>
    </>
  )
}
