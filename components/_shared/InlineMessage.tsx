import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export type InlineMessageType = 'error' | 'success' | 'info'

export interface InlineMessageState {
  type: InlineMessageType
  message: string
  description?: string
}

const STYLES = {
  error: {
    icon: AlertCircle,
    wrapper: 'dark:bg-red-900/20 dark:border-red-900/40 dark:text-red-300 bg-red-50 border-red-200 text-red-700',
    iconColor: 'dark:text-red-400 text-red-600'
  },
  success: {
    icon: CheckCircle2,
    wrapper:
      'dark:bg-emerald-900/20 dark:border-emerald-900/40 dark:text-emerald-300 bg-emerald-50 border-emerald-200 text-emerald-700',
    iconColor: 'dark:text-emerald-400 text-emerald-600'
  },
  info: {
    icon: Info,
    wrapper: 'dark:bg-sky-900/20 dark:border-sky-900/40 dark:text-sky-300 bg-sky-50 border-sky-200 text-sky-700',
    iconColor: 'dark:text-sky-400 text-sky-600'
  }
} as const

interface InlineMessageProps {
  state: InlineMessageState | null
  onDismiss?: () => void
  className?: string
}

export const InlineMessage = ({ state, onDismiss, className = '' }: InlineMessageProps) => {
  return (
    <AnimatePresence initial={false}>
      {state && (
        <motion.div
          key={`${state.type}-${state.message}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.18 }}
          className="overflow-hidden"
        >
          <div
            role={state.type === 'error' ? 'alert' : 'status'}
            aria-live={state.type === 'error' ? 'assertive' : 'polite'}
            className={`flex items-start gap-2 border px-3 py-2 rounded-lg text-xs ${STYLES[state.type].wrapper} ${className}`}
          >
            {(() => {
              const Icon = STYLES[state.type].icon
              return <Icon className={`w-4 h-4 shrink-0 mt-px ${STYLES[state.type].iconColor}`} />
            })()}
            <div className="flex-1 min-w-0">
              <p className="font-medium">{state.message}</p>
              {state.description && <p className="mt-0.5 opacity-80">{state.description}</p>}
            </div>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                aria-label="Dismiss message"
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
