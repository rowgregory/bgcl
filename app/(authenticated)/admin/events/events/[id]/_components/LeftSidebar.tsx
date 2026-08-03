import { EventTemplates } from '@/components/events/EventTemplates'
import { STATUS_CONFIG } from '../_constants/event-details.constants'
import { Hash, Settings, Zap } from 'lucide-react'
import { SectionHeader } from './SectionHeader'
import { Controller } from 'react-hook-form'
import { EventStatus } from '@prisma/client'
import { FormSwitch } from '@/components/_shared/FormSwitch'
import { sectionCls } from '@/lib/constants/form.constants'

export function LeftSidebar({
  showTemplates,
  handleSelectTemplate,
  control,
  isNew,
  event,
  watchedCapacity,
  totalSold,
  totalCapacity,
  publishedCount,
  tickets
}) {
  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-neutral-900 overflow-y-auto">
      {showTemplates ? (
        <EventTemplates onSelectTemplate={handleSelectTemplate} />
      ) : (
        <div className="p-4 space-y-4">
          {/* Status */}
          <div className={sectionCls}>
            <SectionHeader icon={Settings} title="Status" />
            <Controller
              control={control}
              name="status"
              render={({ field: { value, onChange } }) => (
                <div className="p-3 space-y-2" role="radiogroup" aria-label="Event status">
                  {(Object.keys(STATUS_CONFIG) as EventStatus[]).map((s) => {
                    const cfg = STATUS_CONFIG[s]
                    const isSelected = value === s

                    return (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => onChange(s)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isSelected
                            ? 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30'
                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} aria-hidden="true" />
                        {cfg.label}
                      </button>
                    )
                  })}
                </div>
              )}
            />
          </div>

          {/* Quick Stats */}
          {!isNew && (
            <div className={sectionCls}>
              <SectionHeader icon={Hash} title="At a Glance" />
              <div className="p-3 space-y-3">
                {[
                  { label: 'Attendees', value: `${event?.attendeeCount ?? 0} / ${watchedCapacity}` },
                  {
                    label: 'Guests',
                    value: event?.tickets?.reduce((acc, item) => acc + (item.guestCount || 0), 0) ?? 0
                  },
                  { label: 'Tickets Sold', value: `${totalSold} / ${totalCapacity}` },
                  { label: 'Live Tickets', value: `${publishedCount} of ${tickets.length}` }
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">{label}</span>
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Toggles */}
          <div className={sectionCls}>
            <SectionHeader icon={Zap} title="Options" />
            <div className="p-3 space-y-2">
              <FormSwitch name="isPublic" label="Public" />
              <FormSwitch name="isRaffle" label="Raffle Event" />
              <FormSwitch name="showTicketMarquee" label="Ticket Marquee" />
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
