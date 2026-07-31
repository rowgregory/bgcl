import { Timer } from 'lucide-react'
import { SectionCard } from './SectionCard'
import { Toggle } from './Toggle'
import { AnimatePresence, motion } from 'framer-motion'
import { Field } from './Field'

export function Countdown({ form, set }) {
  return (
    <SectionCard icon={Timer} title="Countdown">
      <Toggle
        enabled={form.showCountdown ?? false}
        onChange={(v) => set('showCountdown', v)}
        label="Show countdown timer"
      />

      <AnimatePresence>
        {form.showCountdown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="space-y-4 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-4">
              <Field
                id="countdown-date"
                label="Target Date"
                type="date"
                value={form.countdownDate ?? ''}
                onChange={(v) => set('countdownDate', v)}
              />
              <Field
                id="countdown-label"
                label="Label"
                value={form.countdownLabel ?? ''}
                onChange={(v) => set('countdownLabel', v)}
                placeholder="Event Starts In"
              />
            </div>

            {/* Countdown preview */}
            {form.countdownDate && (
              <div className="rounded-lg border dark:border-neutral-700 border-neutral-200 overflow-hidden">
                <p className="text-[10px] font-semibold dark:text-neutral-500 text-neutral-400 uppercase tracking-widest px-3 py-1.5 dark:bg-neutral-800 bg-neutral-50">
                  Preview
                </p>
                <div className="p-4 dark:bg-neutral-900 bg-neutral-50 flex flex-col items-center gap-3">
                  <p className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-widest">
                    {form.countdownLabel || 'Event Starts In'}
                  </p>
                  <div className="flex items-center gap-2">
                    {['DD', 'HH', 'MM', 'SS'].map((unit) => (
                      <div key={unit} className="flex flex-col items-center gap-1">
                        <div className="w-11 h-11 dark:bg-neutral-800 bg-white border dark:border-neutral-700 border-neutral-200 rounded-lg flex items-center justify-center">
                          <span className="text-base font-black dark:text-white text-neutral-900">--</span>
                        </div>
                        <span className="text-[9px] dark:text-neutral-500 text-neutral-400 font-semibold uppercase tracking-wider">
                          {unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </SectionCard>
  )
}
