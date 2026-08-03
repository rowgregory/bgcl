'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import Backdrop from '@/components/_shared/Backdrop'
import { IActionItems } from '@/lib/constants/dropdownActionItems'
import { useActionMenuStore } from '@/stores/useActionMenuStore'
import { useLockBodyScroll } from '@/lib/hooks/useLockBodyScroll'

export default function ActionMenuDropdown({
  actionItems,
  isModalEnabled
}: {
  actionItems: IActionItems[]
  isModalEnabled: boolean
}) {
  const router = useRouter()

  const isOpen = useActionMenuStore((s) => s.isOpen)
  const openSubmenu = useActionMenuStore((s) => s.openSubmenu)
  const toggleSubmenu = useActionMenuStore((s) => s.toggleSubmenu)
  const onClose = useActionMenuStore((s) => s.close)

  useLockBodyScroll(isOpen)

  const handleActionClick = async (item: any) => {
    if (item.hasSubmenu) {
      toggleSubmenu(item.action)
      return
    }

    if (!item.isUnlocked) {
      onClose()
      router.push(item.linkKey)
      return
    }

    if (item.action !== 'toggle-modal') {
      onClose()
    }

    // `open` either opens a drawer store (sync) or runs a server action (async)
    if (item.open) {
      const result = item.open()

      if (result instanceof Promise) {
        await result
        router.refresh()
      }
    }
  }

  const handleSubmenuClick = (submenuItem: any) => {
    onClose()
    submenuItem.open?.()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClose={onClose} />
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
            animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
            exit={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
            transition={{
              clipPath: { duration: 1.35, ease: [0.1, 0, 0.9, 1] },
              opacity: { duration: 1.35, ease: 'easeInOut' }
            }}
            className="fixed z-50 right-18 top-18 w-60 dark:bg-zinc-800 dark:border-zinc-700 bg-white border-neutral-200 rounded-lg shadow-xl overflow-hidden border"
          >
            <div className="py-2 overflow-y-scroll h-[calc(100vh-150px)] sm:h-fit">
              {actionItems?.map((item, i) => {
                const isSubmenuOpen = openSubmenu === item.action

                return (
                  <div key={i} className="relative">
                    <motion.button
                      type="button"
                      onClick={() => handleActionClick(item)}
                      aria-expanded={item.hasSubmenu ? isSubmenuOpen : undefined}
                      className={`w-full px-4 py-3 text-left dark:text-gray-200 dark:hover:text-white text-neutral-700 hover:text-neutral-900 transition-all flex items-center justify-between dark:hover:bg-gray-600/10 hover:bg-gray-500/10 ${
                        item.hasSubmenu && isSubmenuOpen ? 'dark:bg-gray-600/20 bg-gray-500/20' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <item.icon
                          className={`${
                            item.action === 'toggle-modal' && isModalEnabled ? 'text-green-400' : 'text-gray-400'
                          } w-4 h-4 mt-0.5`}
                          aria-hidden="true"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{item.label}</span>
                        </div>
                      </div>

                      {item.hasSubmenu && (
                        <ChevronRight
                          className={`w-4 h-4 dark:text-gray-400 text-neutral-500 transition-transform ${
                            isSubmenuOpen ? 'rotate-90' : ''
                          }`}
                          aria-hidden="true"
                        />
                      )}
                    </motion.button>

                    {/* Submenu */}
                    <AnimatePresence>
                      {item.hasSubmenu && isSubmenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="dark:bg-gray-900/50 dark:border-gray-700/50 bg-neutral-100 border-neutral-200 border-t"
                        >
                          {item.submenu?.map((submenuItem: any, subIndex: number) => (
                            <motion.button
                              key={subIndex}
                              type="button"
                              onClick={() => handleSubmenuClick(submenuItem)}
                              className="w-full pl-10 pr-4 py-2 text-left dark:text-gray-300 dark:hover:text-white text-neutral-700 hover:text-neutral-900 transition-all flex items-start space-x-3 dark:hover:bg-gray-600/10 hover:bg-gray-500/10"
                            >
                              <div className="flex flex-col">
                                <span className="text-sm">{submenuItem.label}</span>
                                {submenuItem.description && (
                                  <span className="text-xs dark:text-gray-500 text-neutral-500 leading-tight">
                                    {submenuItem.description}
                                  </span>
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
