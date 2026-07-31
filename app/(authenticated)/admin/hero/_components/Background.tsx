import { Film, ImageIcon } from 'lucide-react'
import { SectionCard } from './SectionCard'
import { AnimatePresence, motion } from 'framer-motion'
import { UploadZone } from './UploadZone'

export function Background({ form, set }) {
  return (
    <SectionCard icon={ImageIcon} title="Background">
      {/* Type switcher */}
      <div>
        <p className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider mb-2">
          Type
        </p>
        <div className="flex items-center gap-1 p-1 dark:bg-neutral-800 bg-neutral-100 rounded-lg w-fit">
          {(['video', 'image'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set('backgroundType', t)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                form.backgroundType === t
                  ? 'dark:bg-neutral-700 bg-white shadow dark:text-white text-neutral-900'
                  : 'dark:text-neutral-500 text-neutral-500 hover:dark:text-neutral-300'
              }`}
            >
              {t === 'video' ? (
                <Film className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {form.backgroundType === 'video' ? (
          <motion.div
            key="video"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <UploadZone
              type="video"
              currentUrl={form.backgroundVideo ?? ''}
              onUploadComplete={(url) => set('backgroundVideo', url)}
              label="Hero Video"
            />
          </motion.div>
        ) : (
          <motion.div
            key="image"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <UploadZone
              type="image"
              currentUrl={form.backgroundImage ?? ''}
              onUploadComplete={(url) => set('backgroundImage', url)}
              label="Hero Image"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay opacity */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="overlay-opacity"
            className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider"
          >
            Overlay Opacity
          </label>
          <span className="text-xs font-mono dark:text-neutral-400 text-neutral-500">
            {Math.round((form.overlayOpacity ?? 0.5) * 100)}%
          </span>
        </div>
        <input
          id="overlay-opacity"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={form.overlayOpacity ?? 0.5}
          onChange={(e) => set('overlayOpacity', parseFloat(e.target.value))}
          className="w-full accent-sky-500"
          aria-label="Background overlay opacity"
        />
        <div className="flex justify-between text-[10px] dark:text-neutral-600 text-neutral-400">
          <span>Transparent</span>
          <span>Opaque</span>
        </div>
      </div>
    </SectionCard>
  )
}
