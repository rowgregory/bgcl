import CustomSwitch from '@/components/_shared/CustomSwitch'
import { LocalTicket } from '@/types/event.types'
import { TicketType } from '@prisma/client'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, ChevronDown, ChevronUp, EyeOff, GripVertical, Trash2 } from 'lucide-react'
import { TICKET_TYPE_CONFIG } from '../_constants/event-details.constants'
import { inputCls, labelCls } from '@/lib/constants/form.constants'

export function TicketRow({
  ticket,
  onUpdate,
  onDelete,
  onToggleExpand,
  isSaving,
  isRaffle
}: {
  ticket: LocalTicket
  onUpdate: (field: string, value: any) => void
  onDelete: () => void
  onToggleExpand: () => void
  isSaving: boolean
  isRaffle: boolean
}) {
  const typeCfg = TICKET_TYPE_CONFIG[(ticket.ticketType as TicketType) ?? 'GENERAL']

  return (
    <div
      className={`border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden transition-all ${
        ticket.isPublished ? '' : 'opacity-70'
      }`}
    >
      {/* Ticket Header Row */}
      <div className="flex items-center gap-3 px-4 py-3.5 bg-neutral-50 dark:bg-neutral-800/50">
        <GripVertical className="w-4 h-4 text-neutral-300 dark:text-neutral-600 shrink-0" />

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={ticket.name ?? ''}
              onChange={(e) => onUpdate('name', e.target.value)}
              placeholder="Ticket name"
              className="flex-1 min-w-0 bg-transparent text-sm font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none border-b border-transparent focus:border-neutral-300 dark:focus:border-neutral-600 transition-colors py-0.5"
            />
            <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${typeCfg.color}`}>
              {typeCfg.label}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-medium">${Number(ticket.price ?? 0).toFixed(2)}</span>
            <span className="text-neutral-300 dark:text-neutral-600">·</span>
            <span>
              {ticket.quantitySold ?? 0}/{ticket.totalQuantity ?? 0} sold
            </span>

            <span className="text-neutral-300 dark:text-neutral-600">·</span>
            <span>Admits {ticket.guestCount}</span>

            <span className="text-neutral-300 dark:text-neutral-600">·</span>
            {ticket.isPublished ? (
              <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Live
              </span>
            ) : (
              <span className="text-neutral-400 flex items-center gap-1">
                <EyeOff className="w-3 h-3" /> Hidden
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onToggleExpand}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            {ticket._expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isSaving}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Fields */}
      <AnimatePresence>
        {ticket._expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 grid grid-cols-2 gap-3 border-t border-neutral-100 dark:border-neutral-700/50">
              {/* Price */}
              <div>
                <label className={labelCls}>Price ($)</label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={ticket.price ?? ''}
                  onChange={(e) => onUpdate('price', parseFloat(e.target.value) || 0)}
                  className={inputCls}
                  placeholder="0.00"
                />
              </div>

              {/* Total Quantity */}
              <div>
                <label className={labelCls}>Total Quantity</label>
                <input
                  type="number"
                  min={0}
                  value={ticket.totalQuantity ?? ''}
                  onChange={(e) => onUpdate('totalQuantity', parseInt(e.target.value) || 0)}
                  className={inputCls}
                  placeholder="100"
                />
              </div>

              {/* Admits */}
              <div className="col-span-2">
                <label className={labelCls}>Admits (guests per ticket)</label>
                <input
                  type="number"
                  min={1}
                  value={ticket.guestCount ?? ''}
                  onChange={(e) => onUpdate('guestCount', parseInt(e.target.value) || 1)}
                  className={inputCls}
                  placeholder="1"
                />
              </div>

              {/* Ticket Type */}
              <div className="col-span-2">
                <label className={labelCls}>Type</label>
                <select
                  value={ticket.ticketType ?? 'GENERAL'}
                  onChange={(e) => onUpdate('ticketType', e.target.value)}
                  className={inputCls}
                >
                  <option value="GENERAL">General</option>
                  <option value="RAFFLE">Raffle</option>
                  <option value="TOURNAMENT">Tournament</option>
                  <option value="SPONSORSHIP">Sponsorship</option>
                </select>
              </div>

              <div className="col-span-2 space-y-2">
                {isRaffle && (
                  <CustomSwitch
                    checked={!!ticket.isRaffleTicket}
                    onChange={(v) => onUpdate('isRaffleTicket', v)}
                    label="Raffle Ticket"
                  />
                )}

                <CustomSwitch
                  checked={!!ticket.isPublished}
                  onChange={(v) => onUpdate('isPublished', v)}
                  label="Published"
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className={labelCls}>Description</label>
                <textarea
                  value={ticket.description ?? ''}
                  onChange={(e) => onUpdate('description', e.target.value)}
                  className={inputCls}
                  rows={4}
                  placeholder="Optional ticket description..."
                />
              </div>

              {/* Sponsor fields — only if SPONSORSHIP */}
              {ticket.ticketType === 'SPONSORSHIP' && (
                <>
                  <div className="col-span-2">
                    <label className={labelCls}>Sponsor Impact</label>
                    <textarea
                      value={ticket.sponsorImpact ?? ''}
                      onChange={(e) => onUpdate('sponsorImpact', e.target.value)}
                      className={inputCls}
                      rows={2}
                      placeholder="Covers 10 campers for the week..."
                    />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Sponsor Perks (one per line)</label>
                    <textarea
                      value={(ticket.sponsorPerks ?? []).join('\n')}
                      onChange={(e) => onUpdate('sponsorPerks', e.target.value.split('\n').filter(Boolean))}
                      className={inputCls}
                      rows={3}
                      placeholder="Company logo on play money&#10;Admission for up to 10 guests"
                    />
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
