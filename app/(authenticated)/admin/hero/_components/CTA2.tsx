import { AnimatePresence, motion } from 'framer-motion'
import { Toggle } from './Toggle'
import { ExternalLink, Link2 } from 'lucide-react'
import { Field } from './Field'

export function CTA2({ form, set }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider">
          Button 2
        </p>
        <Toggle enabled={form.showCta2 ?? false} onChange={(v) => set('showCta2', v)} label="Show" />
      </div>

      <AnimatePresence>
        {form.showCta2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-4">
              <Field
                id="hero-cta2-text"
                label="Text"
                value={form.cta2Text ?? ''}
                onChange={(v) => set('cta2Text', v)}
                placeholder="Learn More"
              />
              <Field
                id="hero-cta2-link"
                label="Link"
                value={form.cta2Link ?? ''}
                onChange={(v) => set('cta2Link', v)}
                placeholder="/about"
              />
            </div>
            <div className="flex items-center gap-1 p-1 dark:bg-neutral-800 bg-neutral-100 rounded-lg w-fit">
              {(
                [
                  { value: 'internal', icon: Link2, label: 'Internal' },
                  { value: 'external', icon: ExternalLink, label: 'External' }
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('cta2LinkType', opt.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                    form.cta2LinkType === opt.value
                      ? 'dark:bg-neutral-700 bg-white shadow dark:text-white text-neutral-900'
                      : 'dark:text-neutral-500 text-neutral-500 hover:dark:text-neutral-300'
                  }`}
                >
                  <opt.icon className="w-3.5 h-3.5" aria-hidden="true" />
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
