import { AnimatePresence, motion } from 'framer-motion'
import { SectionCard } from './SectionCard'
import { Toggle } from './Toggle'
import { Target } from 'lucide-react'
import { Field } from './Field'

export function Thermometer({ form, set }) {
  return (
    <SectionCard icon={Target} title="Thermometer Widget">
      <Toggle
        enabled={form.showThermometer ?? false}
        onChange={(v) => set('showThermometer', v)}
        label="Show thermometer widget"
      />

      <AnimatePresence>
        {form.showThermometer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="space-y-4"
          >
            <Field
              id="thermometer-label"
              label="Label"
              value={form.thermometerLabel ?? ''}
              onChange={(v) => set('thermometerLabel', v)}
              placeholder="Campaign Progress"
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="thermo-goal"
                  className="block text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider"
                >
                  Goal ($)
                </label>
                <input
                  id="thermo-goal"
                  type="number"
                  min={0}
                  value={form.thermometerGoal ?? 100000}
                  onChange={(e) => set('thermometerGoal', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 dark:bg-neutral-900 bg-white dark:border-neutral-700 border-neutral-200 border rounded-lg text-sm dark:text-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="thermo-current"
                  className="block text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider"
                >
                  Raised ($)
                </label>
                <input
                  id="thermo-current"
                  type="number"
                  min={0}
                  value={form.thermometerCurrent ?? 0}
                  onChange={(e) => set('thermometerCurrent', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 dark:bg-neutral-900 bg-white dark:border-neutral-700 border-neutral-200 border rounded-lg text-sm dark:text-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Color picker */}
            <div className="space-y-1.5">
              <label
                htmlFor="thermo-color"
                className="block text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider"
              >
                Color
              </label>
              <div className="flex items-center gap-2.5 px-3 py-2 dark:bg-neutral-900 bg-white border dark:border-neutral-700 border-neutral-200 rounded-lg w-fit">
                <input
                  id="thermo-color"
                  type="color"
                  value={form.thermometerColor ?? '#0ea5e9'}
                  onChange={(e) => set('thermometerColor', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent shrink-0"
                  aria-label="Thermometer color"
                />
                <span className="text-xs font-mono dark:text-neutral-300 text-neutral-700">
                  {form.thermometerColor ?? '#0ea5e9'}
                </span>
              </div>
            </div>

            {/* Progress readout */}
            <div className="dark:bg-neutral-800 bg-neutral-100 rounded-lg px-4 py-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="dark:text-neutral-400 text-neutral-500 font-medium">Progress</span>
                <span className="font-bold dark:text-white text-neutral-900">
                  {Math.min(Math.round(((form.thermometerCurrent ?? 0) / (form.thermometerGoal || 1)) * 100), 100)}%
                </span>
              </div>
              <div className="w-full h-2 dark:bg-neutral-700 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(((form.thermometerCurrent ?? 0) / (form.thermometerGoal || 1)) * 100, 100)}%`,
                    backgroundColor: form.thermometerColor ?? '#0ea5e9'
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] dark:text-neutral-500 text-neutral-400 font-mono">
                <span>${(form.thermometerCurrent ?? 0).toLocaleString()} raised</span>
                <span>${(form.thermometerGoal ?? 0).toLocaleString()} goal</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionCard>
  )
}
