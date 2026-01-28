import { FC, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useDashboardSelector } from '@/app/lib/store/store'
import { setCloseActionMenu, setOpenActionDropdownSubmenu } from '@/app/lib/store/slices/dashboardSlice'
import Backdrop from '../common/Backdrop'
import { setInputs } from '@/app/lib/store/slices/formSlice'
import { ChevronRight } from 'lucide-react'
import { IActionItems } from '@/app/lib/constants/dropdownActionItems'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'

const ActionMenuDropdown: FC<{ actionItems: IActionItems[] }> = ({ actionItems }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { push } = useRouter()
  const onClose = () => dispatch(setCloseActionMenu())
  const { actionMenu, itemAction } = useDashboardSelector()
  const { play } = useSoundEffect('/sound-effects/on.mp3', true)

  useEffect(() => {
    if (actionMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [actionMenu])

  const handleActionClick = async (item: any) => {
    if (item.hasSubmenu) {
      dispatch(setOpenActionDropdownSubmenu(itemAction === item.action ? null : item.action))
      return
    }

    if (item.isUnlocked) {
      if (item.action !== 'toggle-modal') {
        onClose()
      }

      // Handle different types of actions
      if (item.open) {
        const result = item.open()

        // If it returns a Promise, it's an async server action
        if (result instanceof Promise) {
          const res = await result
          if (res.isToggledOn) {
            play()
          }
          router.refresh()
        } else {
          // It's a Redux action creator
          dispatch(result)
        }
      }

      if (item.formName && item.initial) {
        dispatch(setInputs({ formName: item.formName, data: item.initial }))
      }
    } else {
      onClose()
      push(item.linkKey)
    }
  }

  const handleSubmenuClick = (submenuItem: any) => {
    if (submenuItem.isUnlocked) {
      onClose()
      dispatch(submenuItem.open())
      dispatch(setInputs({ formName: submenuItem.formName, data: submenuItem.initial }))
    } else {
      push('/admin/cryo-chamber')
    }
  }

  return (
    <AnimatePresence>
      {actionMenu && (
        <>
          <Backdrop onClose={onClose} />
          <motion.div
            initial={{
              clipPath: 'inset(0 0 100% 0)',
              opacity: 0
            }}
            animate={{
              clipPath: 'inset(0 0 0% 0)',
              opacity: 1
            }}
            exit={{
              clipPath: 'inset(0 0 100% 0)',
              opacity: 0
            }}
            transition={{
              clipPath: {
                duration: 1.35,
                ease: [0.1, 0, 0.9, 1]
              },
              opacity: {
                duration: 1.35,
                ease: 'easeInOut'
              }
            }}
            className="fixed z-50 right-18 top-18 w-60 dark:bg-zinc-800 dark:border-zinc-700 bg-white border-neutral-200 rounded-lg shadow-xl overflow-hidden border"
          >
            <div className="py-2 overflow-y-scroll h-[calc(100vh-150px)] sm:h-fit">
              {actionItems?.map((item, i) => (
                <div key={i} className="relative">
                  <motion.button
                    onClick={() => handleActionClick(item)}
                    className={`w-full px-4 py-3 text-left dark:text-gray-200 dark:hover:text-white text-neutral-700 hover:text-neutral-900 transition-all flex items-center justify-between dark:hover:bg-gray-600/10 hover:bg-gray-500/10 ${
                      item.hasSubmenu && itemAction === item.action ? 'dark:bg-gray-600/20 bg-gray-500/20' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <item.icon className="w-4 h-4 mt-0.5 text-gray-400" />
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{item.label}</span>
                      </div>
                    </div>

                    {item.hasSubmenu && (
                      <ChevronRight
                        className={`w-4 h-4 dark:text-gray-400 text-neutral-500 transition-transform ${
                          itemAction === item.action ? 'rotate-90' : ''
                        }`}
                      />
                    )}
                  </motion.button>

                  {/* Submenu */}
                  <AnimatePresence>
                    {item.hasSubmenu && itemAction === item.action && (
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
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ActionMenuDropdown
