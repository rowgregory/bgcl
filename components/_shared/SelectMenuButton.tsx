import { FC, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface SelectMenuButtonProps {
  items: string[]
  onSelect: (item: string) => void
  label?: string
  icon?: React.ReactNode
  disabled?: boolean
}

const SelectMenuButton: FC<SelectMenuButtonProps> = ({
  items,
  onSelect,
  label = 'Select Action',
  icon = <Trash2 size={16} />,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-900/30 text-red-400 hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors border border-red-700"
        disabled={disabled || items.length === 0}
      >
        {icon}
        {label}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 left-0 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-50 min-w-48"
          >
            <div className="p-3">
              <p className="text-xs text-neutral-400 font-semibold mb-2">Choose:</p>
              <div className="space-y-1">
                {items.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      onSelect(item)
                      setIsOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-900/30 rounded transition-colors capitalize"
                  >
                    {item.replace(/([A-Z])/g, ' $1')}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SelectMenuButton
