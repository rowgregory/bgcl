import { ExternalLink, Link2, Megaphone } from 'lucide-react'
import { SectionCard } from './SectionCard'
import { Toggle } from './Toggle'
import { AnimatePresence, motion } from 'framer-motion'
import { Field } from './Field'

export function AnnouncementStrip({ form, set, eventIds, campaignIds }) {
  return (
    <SectionCard icon={Megaphone} title="Announcement Strip">
      <Toggle
        enabled={form.showAnnouncement ?? false}
        onChange={(v) => set('showAnnouncement', v)}
        label="Show announcement strip"
      />

      <AnimatePresence>
        {form.showAnnouncement && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="space-y-4"
          >
            <Field
              id="announcement-text"
              label="Announcement Text"
              value={form.announcementText ?? ''}
              onChange={(v) => set('announcementText', v)}
              placeholder="Our Capital Campaign is underway!"
            />

            <div className="grid grid-cols-2 gap-4">
              <Field
                id="announcement-link-label"
                label="Link Label"
                value={form.announcementLinkLabel ?? ''}
                onChange={(v) => set('announcementLinkLabel', v)}
                placeholder="Learn More"
              />
              <Field
                id="announcement-link"
                label="Link URL"
                value={form.announcementLink ?? ''}
                onChange={(v) => set('announcementLink', v)}
                placeholder="/capital-campaign"
              />
              {eventIds.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider">
                    Quick Insert — Event Link
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {eventIds.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => set('announcementLink', `/events/${event.id}`)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${form.announcementLink === `/events/${event.id}` ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : 'dark:bg-neutral-800 bg-neutral-100 dark:text-neutral-300 text-neutral-600 dark:hover:bg-neutral-700 hover:bg-neutral-200 border border-transparent'}`}
                        aria-label={`Insert link to ${event.title}`}
                        aria-pressed={form.announcementLink === `/events/${event.id}`}
                      >
                        <Link2 className="w-3 h-3 shrink-0" aria-hidden="true" />
                        {event.title}
                      </button>
                    ))}
                  </div>
                  {form.announcementLink?.startsWith('/events/') && (
                    <p className="text-[10px] font-mono dark:text-neutral-500 text-neutral-400">
                      {form.announcementLink}
                    </p>
                  )}
                </div>
              )}
              {campaignIds.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider">
                    Quick Insert — Campaign Link
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {campaignIds.map((campaign) => (
                      <button
                        key={campaign.id}
                        type="button"
                        onClick={() => set('announcementLink', `/campaigns/${campaign.id}`)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${form.announcementLink === `/campaigns/${campaign.id}` ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : 'dark:bg-neutral-800 bg-neutral-100 dark:text-neutral-300 text-neutral-600 dark:hover:bg-neutral-700 hover:bg-neutral-200 border border-transparent'}`}
                        aria-label={`Insert link to ${campaign.name}`}
                        aria-pressed={form.announcementLink === `/campaigns/${campaign.id}`}
                      >
                        <Link2 className="w-3 h-3 shrink-0" aria-hidden="true" />
                        {campaign.name}
                      </button>
                    ))}
                  </div>
                  {form.announcementLink?.startsWith('/campaigns/') && (
                    <p className="text-[10px] font-mono dark:text-neutral-500 text-neutral-400">
                      {form.announcementLink}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Link type */}
            <div>
              <p className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider mb-2">
                Link Type
              </p>
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
                    onClick={() => set('announcementLinkType', opt.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                      form.announcementLinkType === opt.value
                        ? 'dark:bg-neutral-700 bg-white shadow dark:text-white text-neutral-900'
                        : 'dark:text-neutral-500 text-neutral-500 hover:dark:text-neutral-300'
                    }`}
                  >
                    <opt.icon className="w-3.5 h-3.5" aria-hidden="true" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient colors */}
            <div>
              <p className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider mb-2">
                Gradient Colors
              </p>
              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    { id: 'color1', label: 'Color 1', key: 'announcementColor1', fallback: '#0ea5e9' },
                    { id: 'color2', label: 'Color 2', key: 'announcementColor2', fallback: '#6366f1' }
                  ] as const
                ).map((c) => (
                  <div key={c.id} className="space-y-1.5">
                    <label
                      htmlFor={c.id}
                      className="block text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider"
                    >
                      {c.label}
                    </label>
                    <div className="flex items-center gap-2.5 px-3 py-2 dark:bg-neutral-900 bg-white border dark:border-neutral-700 border-neutral-200 rounded-lg">
                      <input
                        id={c.id}
                        type="color"
                        value={form[c.key] ?? c.fallback}
                        onChange={(e) => set(c.key, e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent shrink-0"
                        aria-label={`Announcement gradient ${c.label}`}
                      />
                      <span className="text-xs font-mono dark:text-neutral-300 text-neutral-700">
                        {form[c.key] ?? c.fallback}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live preview */}
            {form.announcementText && (
              <div className="rounded-lg overflow-hidden border dark:border-neutral-700 border-neutral-200">
                <p className="text-[10px] font-semibold dark:text-neutral-500 text-neutral-400 uppercase tracking-widest px-3 py-1.5 dark:bg-neutral-800 bg-neutral-50">
                  Preview
                </p>
                <div
                  className="px-4 py-2.5 flex items-center justify-center gap-2 flex-wrap text-white text-sm"
                  style={{
                    backgroundImage: `linear-gradient(270deg, ${form.announcementColor1 ?? '#0ea5e9'}, ${form.announcementColor2 ?? '#6366f1'}, ${form.announcementColor1 ?? '#0ea5e9'})`,
                    backgroundSize: '400% 400%',
                    animation: 'gradientShift 6s ease infinite'
                  }}
                >
                  <span>{form.announcementText}</span>
                  {form.announcementLinkLabel && (
                    <span className="font-semibold underline underline-offset-2 flex items-center gap-1">
                      {form.announcementLinkLabel}
                      {form.announcementLinkType === 'external' && (
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </SectionCard>
  )
}
