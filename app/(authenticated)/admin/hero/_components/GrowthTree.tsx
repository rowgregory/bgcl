import { Leaf } from 'lucide-react'
import { SectionCard } from './SectionCard'
import { Toggle } from './Toggle'
import { AnimatePresence, motion } from 'framer-motion'
import { Field } from './Field'

export function GrowthTree({ form, set }) {
  return (
    <SectionCard icon={Leaf} title="Growth Tree Widget">
      <Toggle
        enabled={form.showGrowthTree ?? false}
        onChange={(v) => set('showGrowthTree', v)}
        label="Show growth tree widget"
      />

      <AnimatePresence>
        {form.showGrowthTree && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="space-y-4"
          >
            <Field
              id="tree-label"
              label="Label"
              value={form.growthTreeLabel ?? ''}
              onChange={(v) => set('growthTreeLabel', v)}
              placeholder="Community Members"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="tree-current"
                  className="block text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider"
                >
                  Current
                </label>
                <input
                  id="tree-current"
                  type="number"
                  min={0}
                  value={form.growthTreeCurrent ?? 0}
                  onChange={(e) => set('growthTreeCurrent', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 dark:bg-neutral-900 bg-white dark:border-neutral-700 border-neutral-200 border rounded-lg text-sm dark:text-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="tree-goal"
                  className="block text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider"
                >
                  Goal
                </label>
                <input
                  id="tree-goal"
                  type="number"
                  min={0}
                  value={form.growthTreeGoal ?? 10000}
                  onChange={(e) => set('growthTreeGoal', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 dark:bg-neutral-900 bg-white dark:border-neutral-700 border-neutral-200 border rounded-lg text-sm dark:text-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="tree-color"
                className="block text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider"
              >
                Color
              </label>
              <div className="flex items-center gap-2.5 px-3 py-2 dark:bg-neutral-900 bg-white border dark:border-neutral-700 border-neutral-200 rounded-lg w-fit">
                <input
                  id="tree-color"
                  type="color"
                  value={form.growthTreeColor ?? '#10b981'}
                  onChange={(e) => set('growthTreeColor', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent shrink-0"
                  aria-label="Growth tree color"
                />
                <span className="text-xs font-mono dark:text-neutral-300 text-neutral-700">
                  {form.growthTreeColor ?? '#10b981'}
                </span>
              </div>
            </div>

            {/* Progress readout */}
            <div className="dark:bg-neutral-800 bg-neutral-100 rounded-lg px-4 py-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="dark:text-neutral-400 text-neutral-500 font-medium">Progress</span>
                <span className="font-bold dark:text-white text-neutral-900">
                  {Math.min(Math.round(((form.growthTreeCurrent ?? 0) / (form.growthTreeGoal || 1)) * 100), 100)}%
                </span>
              </div>
              <div className="w-full h-2 dark:bg-neutral-700 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(((form.growthTreeCurrent ?? 0) / (form.growthTreeGoal || 1)) * 100, 100)}%`,
                    backgroundColor: form.growthTreeColor ?? '#10b981'
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] dark:text-neutral-500 text-neutral-400 font-mono">
                <span>{(form.growthTreeCurrent ?? 0).toLocaleString()} current</span>
                <span>{(form.growthTreeGoal ?? 0).toLocaleString()} goal</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionCard>
  )
}
