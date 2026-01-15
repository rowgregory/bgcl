import { FC } from 'react'
import { templates } from '@/app/lib/constants/events'
import { motion } from 'framer-motion'
import { EventTemplate } from '@/types/entities/event'

export interface EventTemplatesProps {
  onSelectTemplate: (templateData: EventTemplate['data']) => void
}

const EventTemplates: FC<EventTemplatesProps> = ({ onSelectTemplate }) => {
  return (
    <div className="w-96 bg-neutral-800 border-r border-neutral-700 overflow-y-auto">
      <div className="p-6">
        <h3 className="text-white font-semibold text-sm mb-2">Event Templates</h3>
        <p className="text-neutral-400 text-xs mb-6">Choose a template to quickly fill in event details</p>

        <div className="space-y-3">
          {templates.map((template) => (
            <motion.button
              key={template.id}
              onClick={() => onSelectTemplate(template.data)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 bg-neutral-900 border border-neutral-700 rounded-lg hover:border-indigo-500 hover:bg-neutral-900/80 transition-all text-left group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-600/10 rounded-lg text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {template.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-medium mb-1 group-hover:text-indigo-400 transition-colors">
                    {template.name}
                  </h4>
                  <p className="text-neutral-500 text-xs line-clamp-2">{template.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-neutral-900/50 border border-neutral-700 rounded-lg">
          <p className="text-neutral-400 text-xs">
            💡 <span className="font-medium">Tip:</span> Templates prefill the form with common settings. You can still
            customize all fields after selecting.
          </p>
        </div>
      </div>
    </div>
  )
}

export default EventTemplates
