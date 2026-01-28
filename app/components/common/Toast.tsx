// src/components/ui/Toast.tsx
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
// import UIfx from 'uifx'
import { RootState, useAppDispatch, useAppSelector } from '@/app/lib/store/store'
import { hideToast } from '@/app/lib/store/slices/toastSlice'

// Import your sound files
// const successSound = new UIfx('/path/to/success-sound.mp3', { volume: 0.4 })
// const errorSound = new UIfx('/path/to/error-sound.mp3', { volume: 0.4 })

const Toast: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isVisible, type, message, description, duration } = useAppSelector((state: RootState) => state.toast)

  useEffect(() => {
    if (isVisible) {
      // Play sound based on toast type
      switch (type) {
        case 'success':
          // successSound.play()
          break
        case 'error':
          // errorSound.play()
          break
      }

      // Auto-hide toast
      const timer = setTimeout(() => {
        dispatch(hideToast())
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, type, dispatch, duration])

  const getBackgroundColor = () => {
    const base = 'bg-white dark:bg-neutral-900'

    switch (type) {
      case 'success':
        return `${base} border-emerald-200 dark:border-emerald-800`
      case 'error':
        return `${base} border-red-200 dark:border-red-800`
      case 'warning':
        return `${base} border-yellow-200 dark:border-yellow-800`
      case 'info':
      default:
        return `${base} border-blue-200 dark:border-blue-800`
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-emerald-200 dark:border-emerald-800/50'
      case 'error':
        return 'border-red-200 dark:border-red-800/50'
      case 'warning':
        return 'border-yellow-200 dark:border-yellow-800/50'
      case 'info':
      default:
        return 'border-blue-200 dark:border-blue-800/50'
    }
  }

  const getTextColor = () => {
    return 'text-neutral-900 dark:text-white'
  }

  const getIcon = () => {
    const iconClasses = 'w-5 h-5 sm:w-6 sm:h-6'

    switch (type) {
      case 'success':
        return (
          <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <CheckCircle className={`${iconClasses} text-emerald-600 dark:text-emerald-400`} />
          </div>
        )
      case 'error':
        return (
          <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <AlertCircle className={`${iconClasses} text-red-600 dark:text-red-400`} />
          </div>
        )
      case 'warning':
        return (
          <div className="p-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <AlertTriangle className={`${iconClasses} text-yellow-600 dark:text-yellow-400`} />
          </div>
        )
      case 'info':
      default:
        return (
          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Info className={`${iconClasses} text-blue-600 dark:text-blue-400`} />
          </div>
        )
    }
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{
            opacity: 0,
            y: -20,
            scale: 0.95,
            transition: {
              duration: 0.2,
              ease: 'easeInOut'
            }
          }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 300
          }}
          className={`
        fixed top-4 right-4 left-4 sm:left-auto z-160 
        ${getBackgroundColor()} 
        border ${getBorderColor()}
        rounded-xl shadow-lg 
        p-4 sm:max-w-md w-full sm:w-auto
      `}
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-sm sm:text-base ${getTextColor()}`}>{message}</h3>
              {description && (
                <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm mt-1 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={() => dispatch(hideToast())}
              className="shrink-0 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-500 dark:text-neutral-400" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast
