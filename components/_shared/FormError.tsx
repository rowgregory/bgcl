import { useFormSelector } from '@/lib/store/store'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  formName: string
}

export function FormError({ formName }: Props) {
  const { forms } = useFormSelector()
  const inputs = forms?.[formName]?.inputs

  return (
    <AnimatePresence>
      {inputs?.error && (
        <motion.p
          key="error"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          role="alert"
          aria-live="assertive"
          className="text-xs text-red-500 dark:text-red-400 font-mono flex items-start gap-2"
        >
          <span aria-hidden="true" className="shrink-0 mt-0.5">
            ✕
          </span>
          {inputs.error}
        </motion.p>
      )}
    </AnimatePresence>
  )
}
