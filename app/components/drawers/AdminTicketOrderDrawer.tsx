'use client'

import { setCloseTicketOrderDrawer } from '@/app/lib/store/slices/adminSlice'
import { store, useAdminSelector } from '@/app/lib/store/store'
import { formatCurrency } from '@/app/lib/utils/currency.utils'
import { formatDate } from '@/app/lib/utils/date-utils'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, MapPin, Ticket, User, FileText, Hash, Receipt, DollarSign } from 'lucide-react'

// ── Section wrapper ───────────────────────────────────────────────────────────
const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 dark:text-neutral-500 text-neutral-400 shrink-0" aria-hidden="true" />
      <p className="text-xs font-bold dark:text-neutral-500 text-neutral-400 uppercase tracking-widest">{title}</p>
    </div>
    <div className="dark:bg-neutral-900 bg-neutral-50 border dark:border-neutral-800 border-neutral-200 rounded-xl p-4 space-y-3">
      {children}
    </div>
  </div>
)

// ── Field row ─────────────────────────────────────────────────────────────────
const Field = ({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) => (
  <div className="flex items-start justify-between gap-4 min-w-0">
    <p className="text-xs dark:text-neutral-500 text-neutral-500 shrink-0">{label}</p>
    <p
      className={`text-xs font-semibold dark:text-neutral-200 text-neutral-800 text-right truncate ${mono ? 'font-mono' : ''}`}
    >
      {value ?? '—'}
    </p>
  </div>
)

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    CONFIRMED: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
    PENDING: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    CANCELLED: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
    REFUNDED: 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400',
    FAILED: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
  }
  return (
    <span
      role="status"
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${map[status] ?? map.PENDING}`}
    >
      {status.toLowerCase()}
    </span>
  )
}

// ── Drawer ────────────────────────────────────────────────────────────────────

export const AdminTicketOrderDrawer = () => {
  const { order } = useAdminSelector()
  const event = order?.event ?? order?.orderItems?.[0]?.ticket?.event ?? null
  const totalQuantity = order?.orderItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
  const billingAddress = order?.billingAddress as Record<string, string> | null
  const onClose = () => store.dispatch(setCloseTicketOrderDrawer())

  return (
    <AnimatePresence>
      {order && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={`Order details for ${order.customerName}`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-neutral-950 border-l dark:border-neutral-800 border-neutral-200 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b dark:border-neutral-800 border-neutral-200 shrink-0">
              <div className="min-w-0">
                <p className="text-xs font-semibold dark:text-neutral-500 text-neutral-500 uppercase tracking-widest mb-1">
                  Ticket Order
                </p>
                <h2 className="text-lg font-black dark:text-white text-neutral-900 truncate">{order.customerName}</h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <StatusBadge status={order.status} />
                  <span className="text-xs dark:text-neutral-500 text-neutral-400">
                    {totalQuantity} ticket{totalQuantity !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close order details"
                className="shrink-0 p-2 rounded-lg dark:hover:bg-neutral-800 hover:bg-neutral-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <X className="w-5 h-5 dark:text-neutral-400 text-neutral-600" aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Event */}
              {event && (
                <Section title="Event" icon={Calendar}>
                  <div className="flex items-start gap-3">
                    <div
                      className="shrink-0 w-10 h-10 rounded-lg dark:bg-sky-500/10 bg-sky-50 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <Calendar className="w-5 h-5 text-sky-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold dark:text-white text-neutral-900 truncate">{event.title}</p>
                      {event.date && (
                        <time
                          dateTime={new Date(event.date).toISOString()}
                          className="text-xs dark:text-neutral-500 text-neutral-500 mt-0.5 block"
                        >
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </time>
                      )}
                      {event.location && (
                        <p className="flex items-center gap-1 text-xs dark:text-neutral-500 text-neutral-500 mt-1">
                          <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                </Section>
              )}

              {/* Tickets */}
              {order.orderItems && order.orderItems.length > 0 && (
                <Section title="Tickets" icon={Ticket}>
                  <ul role="list" className="space-y-2 list-none p-0 m-0">
                    {order.orderItems.map((item) => (
                      <li key={item.id} className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2 min-w-0 flex-1">
                          <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5" aria-hidden="true" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold dark:text-neutral-200 text-neutral-800 truncate">
                              {item.ticketName}
                            </p>
                            {item.ticketDescription && (
                              <p className="text-xs dark:text-neutral-600 text-neutral-400 mt-0.5 truncate">
                                {item.ticketDescription}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 text-right">
                          <span
                            className="text-xs dark:text-neutral-500 text-neutral-500"
                            aria-label={`${item.quantity} at ${formatCurrency(item.pricePerUnit)} each`}
                          >
                            x{item.quantity} @ {formatCurrency(item.pricePerUnit)}
                          </span>
                          <span className="text-xs font-bold dark:text-white text-neutral-900 tabular-nums min-w-13">
                            {formatCurrency(item.totalPrice)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Financials */}
              <Section title="Financials" icon={DollarSign}>
                <Field label="Order total" value={formatCurrency(order.totalAmount)} />
                {order.coverFees && <Field label="Fees covered" value={formatCurrency(order.feesCovered)} />}
                <Field label="Payment method" value={order.paymentMethod ?? '—'} />
                <Field
                  label="Paid at"
                  value={order.paidAt ? formatDate(order.paidAt, { hour: '2-digit', minute: '2-digit' }) : '—'}
                />
              </Section>

              {/* Customer */}
              <Section title="Customer" icon={User}>
                <Field label="Name" value={order.customerName} />
                <Field label="Email" value={order.customerEmail} mono />
                {order.customerPhone && <Field label="Phone" value={order.customerPhone} />}
              </Section>

              {/* Billing address */}
              {billingAddress && (
                <Section title="Billing Address" icon={MapPin}>
                  {billingAddress.addressLine1 && <Field label="Street" value={billingAddress.addressLine1} />}
                  {billingAddress.addressLine2 && <Field label="Unit/Apt" value={billingAddress.addressLine2} />}
                  {billingAddress.city && <Field label="City" value={billingAddress.city} />}
                  {billingAddress.state && <Field label="State" value={billingAddress.state} />}
                  {billingAddress.zipPostalCode && <Field label="ZIP" value={billingAddress.zipPostalCode} />}
                  {billingAddress.country && <Field label="Country" value={billingAddress.country} />}
                </Section>
              )}

              {/* Payment IDs */}
              <Section title="References" icon={Hash}>
                <Field label="Order ID" value={order.id} mono />
                {order.paymentIntentId && <Field label="Payment Intent" value={order.paymentIntentId} mono />}
                {order.paymentMethodId && <Field label="Payment Method ID" value={order.paymentMethodId} mono />}
              </Section>

              {/* Notes */}
              {order.notes && (
                <Section title="Notes" icon={FileText}>
                  <p className="text-xs dark:text-neutral-300 text-neutral-700 leading-relaxed">{order.notes}</p>
                </Section>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t dark:border-neutral-800 border-neutral-200 shrink-0">
              <a
                href={`/order-confirmation/${order.id}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View order confirmation page, opens in new tab"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 dark:bg-neutral-800 dark:hover:bg-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:text-neutral-200 text-neutral-700 font-semibold text-sm rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <Receipt className="w-4 h-4" aria-hidden="true" />
                View Order Confirmation
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
