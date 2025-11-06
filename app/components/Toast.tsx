// src/components/ui/Toast.tsx
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
// import UIfx from 'uifx'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { hideToast } from '@/app/redux/features/toastSlice'

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

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-400" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />
      case 'info':
        return <Info className="w-6 h-6 text-blue-400" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-950/80'
      case 'error':
        return 'bg-red-950/80'
      case 'warning':
        return 'bg-yellow-950/80'
      case 'info':
        return 'bg-blue-950/80'
    }
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{
            opacity: 0,
            x: '100%',
            transition: {
              duration: 0.3,
              ease: 'easeInOut'
            }
          }}
          transition={{
            type: 'tween',
            duration: 0.3,
            ease: 'easeInOut'
          }}
          className={`
          fixed top-4 right-4 left-4 lg:left-auto z-[100] ${getBackgroundColor()} backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-4 lg:max-w-sm
        `}
        >
          <div className="flex items-center space-x-3">
            {getIcon()}
            <div className="flex-1">
              <h3 className="text-white font-semibold">{message}</h3>
              {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
            </div>
            <button onClick={() => dispatch(hideToast())} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast
