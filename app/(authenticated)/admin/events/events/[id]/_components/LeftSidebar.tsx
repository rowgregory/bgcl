import { EventTemplates } from '@/components/events/EventTemplates'
import { Hash, Zap } from 'lucide-react'
import { SectionHeader } from './SectionHeader'
import { FormSwitch } from '@/components/_shared/FormSwitch'
import { sectionCls } from '@/lib/constants/form.constants'
import { StatusPanel } from './StatusPanel'

export function LeftSidebar({
  showTemplates,
  handleSelectTemplate,
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
          <StatusPanel />

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
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
