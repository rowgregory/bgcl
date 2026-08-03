import { FC } from 'react'
import { motion } from 'framer-motion'
import { TicketTemplate } from '@/types/ticket.types'
import { ticketTemplates } from '@/lib/constants/ticket.constants'

export interface TicketTemplatesProps {
  onSelectTemplate: (templateData: TicketTemplate['data']) => void
}

export const TicketTemplates: FC<TicketTemplatesProps> = ({ onSelectTemplate }) => {
  return (
    <>
      {/* Mobile — horizontal scroll strip */}
      <div className="lg:hidden border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
        <div className="px-4 pt-4 pb-1 flex items-center justify-between">
          <p className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider">
            Templates
          </p>
          <p className="text-xs dark:text-neutral-500 text-neutral-400">{ticketTemplates.length} available</p>
        </div>
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-none">
          {ticketTemplates.map((template) => (
            <motion.button
              key={template.id}
              onClick={() => onSelectTemplate(template.data)}
              whileTap={{ scale: 0.97 }}
              className="shrink-0 flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 hover:border-sky-500 dark:hover:border-sky-500 transition-all text-left group"
            >
              <div className="p-1.5 bg-sky-600/10 rounded-lg text-sky-600 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition-all shrink-0">
                {template.icon}
              </div>
              <p className="text-xs font-semibold dark:text-white text-neutral-900 whitespace-nowrap group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {template.name}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Desktop — vertical sidebar */}
      <div className="hidden lg:block max-w-80 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between">
            <h3 className="text-neutral-900 dark:text-white font-semibold text-sm mb-2">Ticket Templates</h3>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs mb-6">
            Choose a template to quickly fill in ticket details
          </p>

          <div className="space-y-3">
            {ticketTemplates.map((template) => (
              <motion.button
                key={template.id}
                onClick={() => onSelectTemplate(template.data)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-sky-500 dark:hover:border-sky-500 hover:bg-neutral-100 dark:hover:bg-neutral-900/80 transition-all text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-sky-600/10 rounded-lg text-sky-600 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition-all">
                    {template.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-neutral-900 dark:text-white text-sm font-medium mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {template.name}
                    </h4>
                    <p className="text-neutral-500 dark:text-neutral-500 text-xs line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <p className="text-neutral-500 dark:text-neutral-400 text-xs">
              💡 <span className="font-medium">Tip:</span> Templates prefill the form with common settings. You can
              still customize all fields after selecting.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
