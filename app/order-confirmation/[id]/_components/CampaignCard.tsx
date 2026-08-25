import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { DetailCard, Field } from './DetailCard'

const MAX_LENGTH = 80

export const CampaignCard = ({ campaign }: { campaign: any }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!campaign) return null

  const description = campaign.description ?? ''
  const shouldTruncate = description.length > MAX_LENGTH
  const displayText = isExpanded ? description : description.slice(0, MAX_LENGTH)

  return (
    <DetailCard title="Campaign" delay={0.6}>
      <div className="space-y-3">
        <Field label="Name">{campaign.name}</Field>

        {description && (
          <div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={isExpanded ? 'expanded' : 'collapsed'}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed overflow-hidden"
              >
                {displayText}
                {shouldTruncate && !isExpanded && '...'}
              </motion.p>
            </AnimatePresence>

            {shouldTruncate && (
              <motion.button
                type="button"
                onClick={() => setIsExpanded((v) => !v)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-expanded={isExpanded}
                className="mt-3 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors inline-flex items-center gap-1"
              >
                <span>{isExpanded ? 'Show less' : 'Read more'}</span>
                <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </motion.span>
              </motion.button>
            )}
          </div>
        )}

        <Field label="Campaign ID" className="font-mono text-xs font-normal text-neutral-700 dark:text-neutral-300">
          {campaign.id}
        </Field>
      </div>
    </DetailCard>
  )
}
