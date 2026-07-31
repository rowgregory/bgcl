'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  EyeOff,
  Ticket,
  Calendar,
  MapPin,
  Users,
  Zap,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Hash,
  AlertCircle,
  CheckCircle,
  Shuffle,
  Settings,
  Tag,
  Sparkles,
  Layers
} from 'lucide-react'
import Link from 'next/link'
import { SerializedEvent } from '@/types/entities/event'
import { ITicket } from '@/types/entities/ticket'
import { updateEvent } from '@/lib/actions/event/updateEvent'
import { createTicket } from '@/lib/actions/ticket/createTicket'
import { updateTicket } from '@/lib/actions/ticket/updateTicket'
import { deleteTicket } from '@/lib/actions/ticket/deleteTicket'
import { formatDatetimeLocalForInput } from '@/lib/utils/date-utils'
import { EventTemplates } from '@/components/events/EventTemplates'
import { createEvent } from '@/lib/actions/event/createEvent'

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Props {
  event: SerializedEvent | null
  isNew: boolean
}

type TicketType = 'GENERAL' | 'RAFFLE' | 'TOURNAMENT' | 'SPONSORSHIP'
type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED' | 'ARCHIVED'

interface LocalTicket extends Partial<ITicket> {
  _tempId?: string
  _isNew?: boolean
  _isDirty?: boolean
  _expanded?: boolean
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<EventStatus, { label: string; color: string; dot: string }> = {
  UPCOMING: { label: 'Upcoming', color: 'text-sky-600 dark:text-sky-400', dot: 'bg-sky-500' },
  ONGOING: { label: 'Ongoing', color: 'text-green-600 dark:text-green-400', dot: 'bg-green-500' },
  COMPLETED: { label: 'Completed', color: 'text-neutral-500', dot: 'bg-neutral-400' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
  POSTPONED: { label: 'Postponed', color: 'text-yellow-600 dark:text-yellow-400', dot: 'bg-yellow-500' },
  ARCHIVED: { label: 'Archived', color: 'text-neutral-400', dot: 'bg-neutral-300' }
}

const TICKET_TYPE_CONFIG: Record<TicketType, { label: string; color: string }> = {
  GENERAL: { label: 'General', color: 'text-sky-600 dark:text-sky-400' },
  RAFFLE: { label: 'Raffle', color: 'text-purple-600 dark:text-purple-400' },
  TOURNAMENT: { label: 'Tournament', color: 'text-orange-600 dark:text-orange-400' },
  SPONSORSHIP: { label: 'Sponsorship', color: 'text-emerald-600 dark:text-emerald-400' }
}

const inputCls =
  'w-full px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors'
const labelCls = 'block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5'
const sectionCls =
  'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden'
const sectionHeaderCls =
  'flex items-center gap-2.5 px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50'

// ─── Panel Header ───────────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, action }: { icon: any; title: string; action?: React.ReactNode }) {
  return (
    <div className={sectionHeaderCls}>
      <Icon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
      <span className="text-sm font-semibold text-neutral-900 dark:text-white flex-1">{title}</span>
      {action}
    </div>
  )
}

// ─── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between w-full px-3 py-2 rounded-lg border text-sm transition-colors ${
        checked
          ? 'bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-sky-300'
          : 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
      }`}
    >
      <span className="font-medium">{label}</span>
      <div
        className={`w-9 h-5 rounded-full relative border transition-colors ${
          checked
            ? 'bg-sky-500 border-sky-500'
            : 'bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600'
        }`}
      >
        <div
          className={`w-3.5 h-3.5 rounded-full absolute top-0.5 transition-all ${
            checked ? 'bg-white left-4.5' : 'bg-neutral-400 dark:bg-neutral-500 left-0.5'
          }`}
        />
      </div>
    </button>
  )
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: EventStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

// ─── Ticket Row ────────────────────────────────────────────────────────────────
function TicketRow({
  ticket,
  onUpdate,
  onDelete,
  onToggleExpand,
  isSaving
}: {
  ticket: LocalTicket
  onUpdate: (field: string, value: any) => void
  onDelete: () => void
  onToggleExpand: () => void
  isSaving: boolean
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

              {/* Raffle ticket toggle */}
              <div className="flex items-end">
                <Toggle
                  checked={!!ticket.isRaffleTicket}
                  onChange={(v) => onUpdate('isRaffleTicket', v)}
                  label="Raffle Ticket"
                />

                {/* isPublished toggle */}
              </div>
              <Toggle checked={!!ticket.isPublished} onChange={(v) => onUpdate('isPublished', v)} label="Published" />

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

// ─── Main Component ────────────────────────────────────────────────────────────
export function AdminEventDetailsClient({ event, isNew }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showTemplates, setShowTemplates] = useState(isNew)

  const [dressCodeItems, setDressCodeItems] = useState<{ label: string; description: string }[]>(
    (event?.dressCodeItems as { label: string; description: string }[]) ?? []
  )
  const [rafflePrizes, setRafflePrizes] = useState<{ place: string; amount: string }[]>(
    (event?.rafflePrizes as { place: string; amount: string }[]) ?? []
  )
  const [raffleSchedule, setRaffleSchedule] = useState<{ time: string; label: string }[]>(
    (event?.raffleSchedule as { time: string; label: string }[]) ?? []
  )

  const [form, setForm] = useState({
    // ── Core ──────────────────────────────────────────────────────────────────
    title: event?.title ?? '',
    description: event?.description ?? '',
    category: event?.category ?? 'Fundraiser',
    type: event?.type ?? 'IN_PERSON',
    status: event?.status ?? 'UPCOMING',
    order: event?.order ?? 0,

    // ── Scheduling ────────────────────────────────────────────────────────────
    date: event?.date ? formatDatetimeLocalForInput(event.date).slice(0, 10) : '',
    time: event?.date ? formatDatetimeLocalForInput(event.date).slice(11, 16) : '',
    duration: event?.duration ?? '',

    ticketSalesStartDate: formatDatetimeLocalForInput(event?.ticketSalesStartDate),
    ticketSalesEndDate: formatDatetimeLocalForInput(event?.ticketSalesEndDate),
    salesStartDate: formatDatetimeLocalForInput(event?.salesStartDate),
    salesEndDate: formatDatetimeLocalForInput(event?.salesEndDate),
    registrationDeadline: formatDatetimeLocalForInput(event?.registrationDeadline),

    // ── Location ──────────────────────────────────────────────────────────────
    location: event?.location ?? '',
    address: event?.address ?? '',

    // ── Capacity ──────────────────────────────────────────────────────────────
    capacity: event?.capacity ?? 200,
    maxAttendees: event?.maxAttendees ?? '',

    // ── Details ───────────────────────────────────────────────────────────────
    host: event?.host ?? '',
    tagline: event?.tagline ?? '',
    subtitle: event?.subtitle ?? '',
    missionStatement: event?.missionStatement ?? '',
    website: event?.website ?? '',
    requirements: event?.requirements ?? '',
    materials: event?.materials ?? '',
    registrationUrl: event?.registrationUrl ?? '',
    meetingUrl: event?.meetingUrl ?? '',

    // ── Flags ─────────────────────────────────────────────────────────────────
    isPublic: event?.isPublic ?? false,
    isRaffle: event?.isRaffle ?? false,
    showTicketMarquee: event?.showTicketMarquee ?? false,

    // ── Dress Code ────────────────────────────────────────────────────────────
    dresscode: event?.dresscode ?? '',
    dressCodeHeadline: event?.dressCodeHeadline ?? '',
    dressCodeNote: event?.dressCodeNote ?? '',
    bestDressedPrizes: event?.bestDressedPrizes ?? '',

    // ── Raffle ────────────────────────────────────────────────────────────────
    raffleDrawDate: formatDatetimeLocalForInput(event?.raffleDrawDate).slice(0, 10),
    raffleTerms: event?.raffleTerms ?? '',
    raffleTicketsPerOrder: event?.raffleTicketsPerOrder ?? 1,
    raffleGrandPrizeLabel: event?.raffleGrandPrizeLabel ?? '',
    raffleOddsLabel: event?.raffleOddsLabel ?? '',
    raffleTicketPrice: event?.raffleTicketPrice ?? '',
    showRaffleTicketNumbers: event?.showRaffleTicketNumbers ?? false
  })

  const set = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }))

  // ── Tickets state ─────────────────────────────────────────────────────────────
  const [tickets, setTickets] = useState<LocalTicket[]>(
    (event?.tickets ?? []).map((t) => ({ ...t, _isNew: false, _isDirty: false, _expanded: false }))
  )

  const addTicket = () => {
    setTickets((prev) => [
      ...prev,
      {
        _tempId: crypto.randomUUID(),
        _isNew: true,
        _isDirty: true,
        _expanded: true,
        name: '',
        price: 0,
        totalQuantity: 100,
        quantitySold: 0,
        quantityReserved: 0,
        sortOrder: prev.length,
        ticketType: 'GENERAL',
        isRaffleTicket: false,
        isPublished: false,
        guestCount: 1,
        sponsorPerks: []
      }
    ])
  }

  const updateTicketLocal = (idx: number, field: string, value: any) => {
    setTickets((prev) => prev.map((t, i) => (i === idx ? { ...t, [field]: value, _isDirty: true } : t)))
  }

  const removeTicket = (idx: number) => {
    setTickets((prev) => prev.filter((_, i) => i !== idx))
  }

  const toggleExpand = (idx: number) => {
    setTickets((prev) => prev.map((t, i) => (i === idx ? { ...t, _expanded: !t._expanded } : t)))
  }

  // ── Save ──────────────────────────────────────────────────────────────────────
  const handleSave = () => {
    setSaveError(null)
    setSaveSuccess(false)

    startTransition(async () => {
      try {
        let eventId = event?.id

        const eventPayload = {
          title: form.title,
          description: form.description || null,
          category: form.category,
          type: form.type as any,
          date: form.date && form.time ? `${form.date}T${form.time}` : form.date,
          duration: form.duration,
          location: form.location,
          address: form.address || null,
          capacity: Number(form.capacity),
          maxAttendees: form.maxAttendees ? Number(form.maxAttendees) : null,
          host: form.host || null,
          isPublic: form.isPublic,
          tagline: form.tagline || null,
          subtitle: form.subtitle || null,
          ticketSalesStartDate: form.ticketSalesStartDate || null,
          ticketSalesEndDate: form.ticketSalesEndDate || null,
          showTicketMarquee: form.showTicketMarquee,
          isRaffle: form.isRaffle,
          raffleDrawDate: form.raffleDrawDate || null,
          raffleTerms: form.raffleTerms || null,
          raffleTicketsPerOrder: Number(form.raffleTicketsPerOrder),
          raffleGrandPrizeLabel: form.raffleGrandPrizeLabel || null,
          raffleOddsLabel: form.raffleOddsLabel || null,
          raffleTicketPrice: form.raffleTicketPrice || null,
          missionStatement: form.missionStatement || null,
          showRaffleTicketNumbers: form.showRaffleTicketNumbers,
          dresscode: form.dresscode || null,
          requirements: form.requirements || null,
          materials: form.materials || null,
          registrationUrl: form.registrationUrl || null,
          meetingUrl: form.meetingUrl || null,
          order: Number(form.order),
          salesStartDate: form.salesStartDate || null,
          salesEndDate: form.salesEndDate || null,
          registrationDeadline: form.registrationDeadline || null,
          dressCodeHeadline: form.dressCodeHeadline || null,
          dressCodeNote: form.dressCodeNote || null,
          bestDressedPrizes: form.bestDressedPrizes || null,
          dressCodeItems: dressCodeItems.length > 0 ? dressCodeItems : null,
          rafflePrizes: rafflePrizes.length > 0 ? rafflePrizes : null,
          raffleSchedule: raffleSchedule.length > 0 ? raffleSchedule : null
        }

        if (isNew) {
          const result = await createEvent(eventPayload)
          if (!result.success) throw new Error(result.error ?? 'Failed to create event')
          eventId = (result as any).data?.id ?? (result as any).eventId
        } else {
          const result = await updateEvent({ ...eventPayload, id: event!.id, isUpdating: true, tickets: [] })
          if (!result.success) throw new Error((result as any).error ?? 'Failed to update event')
        }

        // Save tickets
        if (eventId) {
          for (const ticket of tickets) {
            if (!ticket._isDirty) continue

            const ticketPayload = {
              name: ticket.name ?? '',
              description: ticket.description ?? null,
              price: Number(ticket.price ?? 0),
              totalQuantity: Number(ticket.totalQuantity ?? 0),
              sortOrder: Number(ticket.sortOrder ?? 0),
              ticketType: ticket.ticketType ?? 'GENERAL',
              isRaffleTicket: ticket.isRaffleTicket ?? false,
              sponsorImpact: ticket.sponsorImpact ?? null,
              sponsorPerks: ticket.sponsorPerks ?? [],
              guestCount: Number(ticket.guestCount ?? 1),
              isPublished: ticket.isPublished ?? false
            }

            if (ticket._isNew) {
              await createTicket(eventId, ticketPayload)
            } else if (ticket.id) {
              await updateTicket(ticket.id, ticketPayload)
            }
          }

          // Handle deleted tickets
          const currentIds = tickets.filter((t) => !t._isNew).map((t) => t.id)
          const originalIds = (event?.tickets ?? []).map((t) => t.id)
          const deletedIds = originalIds.filter((id) => !currentIds.includes(id))
          for (const id of deletedIds) {
            await deleteTicket(id)
          }
        }

        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
        if (isNew && eventId) router.replace(`/admin/events/events/${eventId}`)
        else router.refresh()
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : 'Something went wrong')
      }
    })
  }

  const totalSold = tickets.reduce((s, t) => s + (t.quantitySold ?? 0), 0)
  const totalCapacity = tickets.reduce((s, t) => s + (t.totalQuantity ?? 0), 0)
  const publishedCount = tickets.filter((t) => t.isPublished).length

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 w-full">
      {/* ── Top Bar ── */}
      <div className="sticky top-0 z-40 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/events/events"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-sky-600 dark:text-sky-400">
              {isNew ? 'New Event' : 'Event Editor'}
            </p>
            <h1 className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">
              {form.title || 'Untitled Event'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Top Bar — next to Save Changes */}
          {isNew && (
            <button
              type="button"
              onClick={() => setShowTemplates((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-semibold rounded-lg transition-colors border border-neutral-200 dark:border-neutral-700"
            >
              <Layers className="w-4 h-4" />
              Templates
            </button>
          )}
          {!isNew && <StatusBadge status={form.status as EventStatus} />}
          {saveError && (
            <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {saveError}
            </span>
          )}
          {saveSuccess && (
            <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={pending}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {pending ? 'Saving...' : isNew ? 'Create Event' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="flex h-[calc(100vh-57px)]">
        {/* ── Left Sidebar ── */}
        <aside className="w-64 shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-y-auto">
          {showTemplates ? (
            <EventTemplates
              onSelectTemplate={(templateData) => {
                setForm((f) => {
                  const isRaffle = templateData.isRaffle ?? f.isRaffle

                  return {
                    ...f,
                    ...templateData,
                    date: templateData.date ? formatDatetimeLocalForInput(templateData.date).slice(0, 10) : f.date,
                    time: templateData.date ? formatDatetimeLocalForInput(templateData.date).slice(11, 16) : f.time,
                    ticketSalesStartDate: formatDatetimeLocalForInput(templateData.ticketSalesStartDate) || '',
                    ticketSalesEndDate: formatDatetimeLocalForInput(templateData.ticketSalesEndDate) || '',
                    registrationDeadline: formatDatetimeLocalForInput(templateData.registrationDeadline) || '',
                    // Only update raffle fields if template is a raffle event
                    ...(isRaffle && {
                      raffleDrawDate: formatDatetimeLocalForInput(templateData.raffleDrawDate).slice(0, 10),
                      raffleTerms: templateData.raffleTerms ?? f.raffleTerms,
                      raffleTicketsPerOrder: templateData.raffleTicketsPerOrder ?? f.raffleTicketsPerOrder,
                      raffleGrandPrizeLabel: templateData.raffleGrandPrizeLabel ?? f.raffleGrandPrizeLabel,
                      raffleOddsLabel: templateData.raffleOddsLabel ?? f.raffleOddsLabel,
                      raffleTicketPrice: templateData.raffleTicketPrice ?? f.raffleTicketPrice,
                      showRaffleTicketNumbers: templateData.showRaffleTicketNumbers ?? f.showRaffleTicketNumbers
                    })
                  }
                })
                setShowTemplates(false)
              }}
            />
          ) : (
            <div className="p-4 space-y-4">
              {/* Status */}
              <div className={sectionCls}>
                <SectionHeader icon={Settings} title="Status" />
                <div className="p-3 space-y-2">
                  {(Object.keys(STATUS_CONFIG) as EventStatus[]).map((s) => {
                    const cfg = STATUS_CONFIG[s]
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => set('status', s)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          form.status === s
                            ? 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30'
                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Quick Stats */}
              {!isNew && (
                <div className={sectionCls}>
                  <SectionHeader icon={Hash} title="At a Glance" />
                  <div className="p-3 space-y-3">
                    {[
                      { label: 'Attendees', value: `${event?.attendeeCount ?? 0} / ${form.capacity}` },
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
                  <Toggle checked={form.isPublic ?? false} onChange={(v) => set('isPublic', v)} label="Public" />
                  <Toggle checked={form.isRaffle ?? false} onChange={(v) => set('isRaffle', v)} label="Raffle Event" />
                  <Toggle
                    checked={form.showTicketMarquee ?? false}
                    onChange={(v) => set('showTicketMarquee', v)}
                    label="Ticket Marquee"
                  />
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ── Main: Form ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* ── Event Details ── */}
            <div className={sectionCls}>
              <SectionHeader icon={Tag} title="Event Details" />
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelCls}>Title *</label>
                  <input
                    type="text"
                    value={form.title ?? ''}
                    onChange={(e) => set('title', e.target.value)}
                    className={inputCls}
                    placeholder="Cash Madness Casino Night"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Tagline</label>
                  <input
                    type="text"
                    value={form.tagline ?? ''}
                    onChange={(e) => set('tagline', e.target.value)}
                    className={inputCls}
                    placeholder="Join Us For Our Send a Kid to Camp"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Subtitle</label>
                  <input
                    type="text"
                    value={form.subtitle ?? ''}
                    onChange={(e) => set('subtitle', e.target.value)}
                    className={inputCls}
                    placeholder="Viva Las Vegas"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Description</label>
                  <textarea
                    value={form.description ?? ''}
                    onChange={(e) => set('description', e.target.value)}
                    className={inputCls}
                    rows={3}
                    placeholder="Event description..."
                  />
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <input
                    type="text"
                    value={form.category ?? ''}
                    onChange={(e) => set('category', e.target.value)}
                    className={inputCls}
                    placeholder="Fundraiser"
                  />
                </div>
                <div>
                  <label className={labelCls}>Type</label>
                  <select value={form.type} onChange={(e) => set('type', e.target.value)} className={inputCls}>
                    <option value="IN_PERSON">In Person</option>
                    <option value="VIRTUAL">Virtual</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Host</label>
                  <input
                    type="text"
                    value={form.host ?? ''}
                    onChange={(e) => set('host', e.target.value)}
                    className={inputCls}
                    placeholder="Boys & Girls Club of Lynn"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Mission Statement</label>
                  <textarea
                    value={form.missionStatement ?? ''}
                    onChange={(e) => set('missionStatement', e.target.value)}
                    className={inputCls}
                    rows={2}
                    placeholder="To inspire and enable all young people..."
                  />
                </div>
                <div>
                  <label className={labelCls}>Requirements</label>
                  <input
                    type="text"
                    value={form.requirements ?? ''}
                    onChange={(e) => set('requirements', e.target.value)}
                    className={inputCls}
                    placeholder="21+ Only"
                  />
                </div>
                <div>
                  <label className={labelCls}>Materials</label>
                  <input
                    type="text"
                    value={form.materials ?? ''}
                    onChange={(e) => set('materials', e.target.value)}
                    className={inputCls}
                    placeholder="Business Cards"
                  />
                </div>
                <div>
                  <label className={labelCls}>Registration URL</label>
                  <input
                    type="text"
                    value={form.registrationUrl ?? ''}
                    onChange={(e) => set('registrationUrl', e.target.value)}
                    className={inputCls}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className={labelCls}>Meeting URL</label>
                  <input
                    type="text"
                    value={form.meetingUrl ?? ''}
                    onChange={(e) => set('meetingUrl', e.target.value)}
                    className={inputCls}
                    placeholder="https://zoom.us/..."
                  />
                </div>
                <div>
                  <label className={labelCls}>Sort Order</label>
                  <input
                    type="number"
                    min={0}
                    value={form.order ?? ''}
                    onChange={(e) => set('order', e.target.value)}
                    className={inputCls}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* ── Scheduling ── */}
            <div className={sectionCls}>
              <SectionHeader icon={Calendar} title="Scheduling" />
              <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className={labelCls}>Date *</label>
                  <input
                    type="date"
                    value={form.date ?? ''}
                    onChange={(e) => set('date', e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Time *</label>
                  <input
                    type="time"
                    value={form.time ?? ''}
                    onChange={(e) => set('time', e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Duration</label>
                  <input
                    type="text"
                    value={form.duration ?? ''}
                    onChange={(e) => set('duration', e.target.value)}
                    className={inputCls}
                    placeholder="3 hours"
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Ticket Sales Open</label>
                  <input
                    type="datetime-local"
                    value={form.ticketSalesStartDate ?? ''}
                    onChange={(e) => set('ticketSalesStartDate', e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Ticket Sales Close</label>
                  <input
                    type="datetime-local"
                    value={form.ticketSalesEndDate ?? ''}
                    onChange={(e) => set('ticketSalesEndDate', e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Registration Deadline</label>
                  <input
                    type="datetime-local"
                    value={form.registrationDeadline ?? ''}
                    onChange={(e) => set('registrationDeadline', e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* ── Location ── */}
            <div className={sectionCls}>
              <SectionHeader icon={MapPin} title="Location" />
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelCls}>Venue Name *</label>
                  <input
                    type="text"
                    value={form.location ?? ''}
                    onChange={(e) => set('location', e.target.value)}
                    className={inputCls}
                    placeholder="The Nahant Country Club"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Full Address</label>
                  <input
                    type="text"
                    value={form.address ?? ''}
                    onChange={(e) => set('address', e.target.value)}
                    className={inputCls}
                    placeholder="334 Nahant Rd, Nahant, MA 01908"
                  />
                </div>
              </div>
            </div>

            {/* ── Capacity ── */}
            <div className={sectionCls}>
              <SectionHeader icon={Users} title="Capacity" />
              <div className="p-5 grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Capacity *</label>
                  <input
                    type="number"
                    min={1}
                    value={form.capacity ?? ''}
                    onChange={(e) => set('capacity', e.target.value)}
                    className={inputCls}
                    placeholder="200"
                  />
                </div>
                <div>
                  <label className={labelCls}>Max Attendees</label>
                  <input
                    type="number"
                    min={1}
                    value={form.maxAttendees ?? ''}
                    onChange={(e) => set('maxAttendees', e.target.value)}
                    className={inputCls}
                    placeholder="Optional override"
                  />
                </div>
              </div>
            </div>

            {/* ── Dress Code ── */}
            <div className={sectionCls}>
              <SectionHeader icon={Sparkles} title="Dress Code" />
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Dress Code</label>
                    <input
                      type="text"
                      value={form.dresscode ?? ''}
                      onChange={(e) => set('dresscode', e.target.value)}
                      className={inputCls}
                      placeholder="Themed"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Headline</label>
                    <input
                      type="text"
                      value={form.dressCodeHeadline ?? ''}
                      onChange={(e) => set('dressCodeHeadline', e.target.value)}
                      className={inputCls}
                      placeholder="Dress to Impress — or Just Have Fun!"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Note</label>
                    <input
                      type="text"
                      value={form.dressCodeNote ?? ''}
                      onChange={(e) => set('dressCodeNote', e.target.value)}
                      className={inputCls}
                      placeholder="Per Venue: No jeans, t-shirts, or hats allowed."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Best Dressed Prizes</label>
                    <textarea
                      value={form.bestDressedPrizes ?? ''}
                      onChange={(e) => set('bestDressedPrizes', e.target.value)}
                      className={inputCls}
                      rows={2}
                      placeholder="Best Dressed Prizes will be awarded during the event..."
                    />
                  </div>
                </div>

                {/* Dress Code Items */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelCls}>Dress Code Items</label>
                    <button
                      type="button"
                      onClick={() => setDressCodeItems((prev) => [...prev, { label: '', description: '' }])}
                      className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {dressCodeItems.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) =>
                            setDressCodeItems((prev) =>
                              prev.map((it, i) => (i === idx ? { ...it, label: e.target.value } : it))
                            )
                          }
                          className={`${inputCls} w-1/3`}
                          placeholder="Label"
                        />
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            setDressCodeItems((prev) =>
                              prev.map((it, i) => (i === idx ? { ...it, description: e.target.value } : it))
                            )
                          }
                          className={`${inputCls} flex-1`}
                          placeholder="Description"
                        />
                        <button
                          type="button"
                          onClick={() => setDressCodeItems((prev) => prev.filter((_, i) => i !== idx))}
                          className="p-2 text-neutral-400 hover:text-red-500 transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Raffle ── */}
            <AnimatePresence>
              {form.isRaffle && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={sectionCls}
                >
                  <SectionHeader icon={Shuffle} title="Raffle Configuration" />
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Draw Date</label>
                        <input
                          type="date"
                          value={form.raffleDrawDate ?? ''}
                          onChange={(e) => set('raffleDrawDate', e.target.value)}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Tickets Per Order</label>
                        <input
                          type="number"
                          min={1}
                          value={form.raffleTicketsPerOrder ?? ''}
                          onChange={(e) => set('raffleTicketsPerOrder', e.target.value)}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Ticket Price Label</label>
                        <input
                          type="text"
                          value={form.raffleTicketPrice ?? ''}
                          onChange={(e) => set('raffleTicketPrice', e.target.value)}
                          className={inputCls}
                          placeholder="$100 Value"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Grand Prize Label</label>
                        <input
                          type="text"
                          value={form.raffleGrandPrizeLabel ?? ''}
                          onChange={(e) => set('raffleGrandPrizeLabel', e.target.value)}
                          className={inputCls}
                          placeholder="$10,000"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Odds Label</label>
                        <input
                          type="text"
                          value={form.raffleOddsLabel ?? ''}
                          onChange={(e) => set('raffleOddsLabel', e.target.value)}
                          className={inputCls}
                          placeholder="1:50 chance"
                        />
                      </div>
                      <div className="flex items-end">
                        <Toggle
                          checked={form.showRaffleTicketNumbers ?? false}
                          onChange={(v) => set('showRaffleTicketNumbers', v)}
                          label="Show Ticket Numbers"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelCls}>Raffle Terms</label>
                        <textarea
                          value={form.raffleTerms ?? ''}
                          onChange={(e) => set('raffleTerms', e.target.value)}
                          className={inputCls}
                          rows={3}
                          placeholder="Terms and conditions..."
                        />
                      </div>
                    </div>

                    {/* Raffle Prizes */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className={labelCls}>Prizes</label>
                        <button
                          type="button"
                          onClick={() => setRafflePrizes((prev) => [...prev, { place: '', amount: '' }])}
                          className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Prize
                        </button>
                      </div>
                      <div className="space-y-2">
                        {rafflePrizes.map((prize, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={prize.place}
                              onChange={(e) =>
                                setRafflePrizes((prev) =>
                                  prev.map((p, i) => (i === idx ? { ...p, place: e.target.value } : p))
                                )
                              }
                              className={`${inputCls} w-1/3`}
                              placeholder="1st Place"
                            />
                            <input
                              type="text"
                              value={prize.amount}
                              onChange={(e) =>
                                setRafflePrizes((prev) =>
                                  prev.map((p, i) => (i === idx ? { ...p, amount: e.target.value } : p))
                                )
                              }
                              className={`${inputCls} flex-1`}
                              placeholder="$5,000"
                            />
                            <button
                              type="button"
                              onClick={() => setRafflePrizes((prev) => prev.filter((_, i) => i !== idx))}
                              className="p-2 text-neutral-400 hover:text-red-500 transition-colors shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Raffle Schedule */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className={labelCls}>Event Schedule</label>
                        <button
                          type="button"
                          onClick={() => setRaffleSchedule((prev) => [...prev, { time: '', label: '' }])}
                          className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Item
                        </button>
                      </div>
                      <div className="space-y-2">
                        {raffleSchedule.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item.time ?? ''}
                              onChange={(e) =>
                                setRaffleSchedule((prev) =>
                                  prev.map((it, i) => (i === idx ? { ...it, time: e.target.value } : it))
                                )
                              }
                              className={`${inputCls} w-1/3`}
                              placeholder="6:00 PM"
                            />
                            <input
                              type="text"
                              value={item.label ?? ''}
                              onChange={(e) =>
                                setRaffleSchedule((prev) =>
                                  prev.map((it, i) => (i === idx ? { ...it, label: e.target.value } : it))
                                )
                              }
                              className={`${inputCls} flex-1`}
                              placeholder="Doors Open"
                            />
                            <button
                              type="button"
                              onClick={() => setRaffleSchedule((prev) => prev.filter((_, i) => i !== idx))}
                              className="p-2 text-neutral-400 hover:text-red-500 transition-colors shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* ── Right Panel: Tickets ── */}
        <aside className="w-96 shrink-0 border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col overflow-hidden">
          <div className={`${sectionHeaderCls} border-b`}>
            <Ticket className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="text-sm font-semibold text-neutral-900 dark:text-white flex-1">
              Tickets
              <span className="ml-2 text-xs font-normal text-neutral-400">
                {publishedCount}/{tickets.length} live
              </span>
            </span>
            <button
              type="button"
              onClick={addTicket}
              className="flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <Ticket className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mb-2" />
                <p className="text-sm text-neutral-400 dark:text-neutral-500">No tickets yet</p>
                <button
                  type="button"
                  onClick={addTicket}
                  className="mt-2 text-xs text-sky-600 dark:text-sky-400 font-medium hover:underline"
                >
                  Add your first ticket
                </button>
              </div>
            ) : (
              tickets.map((ticket, idx) => (
                <TicketRow
                  key={ticket.id ?? ticket._tempId}
                  ticket={ticket}
                  onUpdate={(field, value) => updateTicketLocal(idx, field, value)}
                  onDelete={() => removeTicket(idx)}
                  onToggleExpand={() => toggleExpand(idx)}
                  isSaving={pending}
                />
              ))
            )}
          </div>

          {/* Ticket footer summary */}
          {tickets.length > 0 && (
            <div className="border-t border-neutral-100 dark:border-neutral-800 px-4 py-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Total capacity</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{totalCapacity}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Sold</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{totalSold}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Remaining</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{totalCapacity - totalSold}</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
