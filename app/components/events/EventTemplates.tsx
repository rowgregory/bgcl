import { FC } from 'react'
import { eventTemplates } from '@/app/lib/constants/events.constants'
import { motion } from 'framer-motion'
import { EventTemplate } from '@/types/entities/event'

export interface EventTemplatesProps {
  onSelectTemplate: (templateData: EventTemplate['data']) => void
}

export const EventTemplates: FC<EventTemplatesProps> = ({ onSelectTemplate }) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Event Templates</h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
            {eventTemplates.length} templates available
          </p>
        </div>
      </div>

      {/* Template List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {eventTemplates.map((template) => (
          <motion.button
            key={template.id}
            onClick={() => onSelectTemplate(template.data)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-4 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-sky-500 dark:hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-500/5 transition-all text-left group"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-sky-600/10 dark:bg-sky-500/10 rounded-lg text-sky-600 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition-all shrink-0">
                {template.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-0.5 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {template.name}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">{template.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Footer tip */}
      <div className="px-4 py-3 border-t border-neutral-100 dark:border-neutral-800 shrink-0">
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          💡 Templates prefill the form — you can customize everything after selecting.
        </p>
      </div>
    </div>
  )
}
