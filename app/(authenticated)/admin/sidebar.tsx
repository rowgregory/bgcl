import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, LogOut, ShieldAlert, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { adminNavigationLinkData, NavItem } from '@/app/(authenticated)/admin/_utils/adminNavigationLinkData'
import { useSidebarStore } from '@/stores/useSidebarStore'
import extractErrorMessage from '@/lib/utils/extractErrorMessage'
import { InlineMessage, InlineMessageState } from '@/components/_shared/InlineMessage'
import { Role } from '@prisma/client'
import { ModalToggle } from './_components/ModalToggle'

type SidebarUser = {
  role: Role
  firstName?: string | null
  lastName?: string | null
  email?: string | null
}

export default function AdminSidebar({ user, isModalEnabled }: { user: SidebarUser; isModalEnabled: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const onClose = useSidebarStore((s) => s.closeAdminSidebar)
  const [message, setMessage] = useState<InlineMessageState | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const groups = adminNavigationLinkData(pathname, user.role)

  const isOpen = (item: NavItem) => expanded[item.label] ?? item.inSection

  const navLinkCls = 'flex items-center gap-2.5 px-2 py-1.5 rounded text-[13px] transition-colors'
  const navIdle =
    'dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email

  const handleLogout = async () => {
    setMessage(null)
    setIsSigningOut(true)

    try {
      await signOut({ redirect: false })
      router.push('/auth/login')
      router.refresh()
    } catch (error: unknown) {
      setMessage({ type: 'error', message: 'Logout failed', description: extractErrorMessage(error) })
      setIsSigningOut(false)
    }
  }

  return (
    <aside className="w-64 dark:bg-neutral-950 dark:border-neutral-800 bg-white border-neutral-200 border-r h-screen flex flex-col">
      <div className="h-11 flex items-center justify-between py-3 px-4 border-b dark:border-neutral-800 border-neutral-200 shrink-0">
        <Link href="/" className="text-sm font-bold dark:text-neutral-100 text-neutral-900 truncate">
          Boys &amp; Girls Club of Lynn
        </Link>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          aria-label="Close sidebar"
          className="lg:hidden p-1.5 dark:hover:bg-neutral-800 hover:bg-neutral-100 rounded transition-colors shrink-0"
        >
          <X className="w-4 h-4 dark:text-neutral-100 text-neutral-900" />
        </motion.button>
      </div>

      <nav className="space-y-5 px-3 py-4 flex-1 overflow-y-auto">
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="text-[10px] font-semibold dark:text-neutral-600 text-neutral-500 uppercase tracking-wider mb-1.5 px-2">
              {group.title}
            </h3>

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon

                if (!item.children) {
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`${navLinkCls} ${item.active ? 'bg-sky-600 text-white' : navIdle}`}
                    >
                      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  )
                }

                const open = isOpen(item)

                return (
                  <div key={item.label}>
                    <button
                      type="button"
                      onClick={() => setExpanded((prev) => ({ ...prev, [item.label]: !open }))}
                      aria-expanded={open}
                      className={`${navLinkCls} w-full ${
                        item.inSection ? 'dark:text-white text-neutral-900 font-medium' : navIdle
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span className="truncate flex-1 text-left">{item.label}</span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}
                        aria-hidden="true"
                      />
                    </button>

                    {open && (
                      <div className="mt-0.5 ml-6.25 pl-2.5 border-l dark:border-neutral-800 border-neutral-200 space-y-0.5">
                        {item.children.map((c) => (
                          <Link
                            key={c.path}
                            href={c.path}
                            className={`block px-2 py-1 rounded text-[13px] truncate transition-colors ${
                              c.active
                                ? 'bg-sky-600 text-white'
                                : 'dark:text-neutral-500 dark:hover:bg-neutral-900 dark:hover:text-neutral-300 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                            }`}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {(user.role === 'ADMIN' || user.role === 'SUPERUSER') && (
        <div className="shrink-0 border-t dark:border-neutral-800 border-neutral-200 px-3 py-2 space-y-0.5">
          <ModalToggle initialEnabled={isModalEnabled} />

          {user.role === 'SUPERUSER' && (
            <Link
              href="/super"
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded text-[13px] transition-colors ${
                pathname.startsWith('/super')
                  ? 'bg-sky-600 text-white'
                  : 'dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">Super</span>
            </Link>
          )}
        </div>
      )}

      <div className="shrink-0 border-t dark:border-neutral-800 border-neutral-200 p-3">
        <InlineMessage state={message} onDismiss={() => setMessage(null)} className="mb-2" />

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-white">{user.email?.[0]?.toUpperCase()}</span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium dark:text-white text-neutral-900 truncate leading-tight">
              {displayName}
            </p>
            <p className="text-[11px] dark:text-neutral-500 text-neutral-500 truncate">{user.email}</p>
          </div>

          <motion.button
            whileTap={{ scale: isSigningOut ? 1 : 0.95 }}
            onClick={handleLogout}
            disabled={isSigningOut}
            aria-label="Sign out"
            title="Sign out"
            className="p-1.5 rounded dark:text-neutral-500 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 dark:hover:bg-neutral-900 hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <LogOut className={`w-4 h-4 ${isSigningOut ? 'animate-pulse' : ''}`} aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </aside>
  )
}
