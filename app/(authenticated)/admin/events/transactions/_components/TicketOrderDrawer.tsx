'use client'

import { StatusBadge } from '@/app/(authenticated)/admin/_components/StatusBadge'
import { formatCurrency } from '@/lib/utils/currency.utils'
import { formatDate } from '@/lib/utils/date-utils'
import { IOrder } from '@/types/entities/order'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
    <h3 className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">{title}</h3>
    <div className="space-y-2">{children}</div>
  </section>
)

const Field = ({ label, value, mono = false }: { label: string; value: ReactNode; mono?: boolean }) => (
  <div className="flex items-baseline justify-between gap-4">
    <p className="text-xs text-neutral-400 dark:text-neutral-600 shrink-0">{label}</p>
    <p className={`text-[13px] text-neutral-900 dark:text-white text-right break-all ${mono ? 'font-mono text-xs' : ''}`}>
      {value ?? '—'}
    </p>
  </div>
)

export const TicketOrderDrawer = ({ order, open, onClose }: { order: IOrder; open: boolean; onClose: () => void }) => {
  const event = order?.event ?? order?.orderItems?.[0]?.ticket?.event ?? null
  const totalQuantity = order?.orderItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
  const billingAddress = order?.billingAddress as Record<string, string> | null

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-neutral-950/40 z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={`Order details for ${order.customerName}`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="shrink-0 h-11 flex items-center justify-between gap-4 px-5 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{order.customerName}</h2>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close order details"
                className="shrink-0 p-1.5 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
              {/* Amount, mirroring the confirmation page */}
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Ticket purchase
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-white tabular-nums">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>

                <StatusBadge status={order.status} />
              </div>

              {event && (
                <Section title="Event">
                  <Field label="Name" value={event.title} />
                  {event.date && <Field label="Date" value={formatDate(event.date)} />}
                  {event.location && <Field label="Location" value={event.location} />}
                </Section>
              )}

              {order.orderItems && order.orderItems.length > 0 && (
                <Section title={`Tickets · ${totalQuantity}`}>
                  <ul role="list" className="list-none p-0 m-0 space-y-2">
                    {order.orderItems.map((item) => (
                      <li key={item.id} className="flex items-baseline justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[13px] text-neutral-900 dark:text-white truncate">{item.ticketName}</p>
                          <p className="text-xs text-neutral-400 dark:text-neutral-600 tabular-nums">
                            {item.quantity} × {formatCurrency(item.pricePerUnit)}
                          </p>
                        </div>

                        <span className="shrink-0 text-[13px] text-neutral-900 dark:text-white tabular-nums">
                          {formatCurrency(item.totalPrice)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              <Section title="Payment">
                {order.coverFees && <Field label="Fees covered" value={formatCurrency(order.feesCovered)} />}
                <Field label="Method" value={order.paymentMethod} />
                <Field
                  label="Paid"
                  value={order.paidAt ? formatDate(order.paidAt, { hour: '2-digit', minute: '2-digit' }) : '—'}
                />
              </Section>

              <Section title="Customer">
                <Field label="Email" value={order.customerEmail} />
                {order.customerPhone && <Field label="Phone" value={order.customerPhone} />}
              </Section>

              {billingAddress && (
                <Section title="Billing address">
                  <div className="text-[13px] text-neutral-900 dark:text-white space-y-0.5">
                    <p>{billingAddress.addressLine1}</p>
                    {billingAddress.addressLine2 && <p>{billingAddress.addressLine2}</p>}
                    <p>
                      {billingAddress.city}, {billingAddress.state} {billingAddress.zipPostalCode}
                    </p>
                    <p>{billingAddress.country}</p>
                  </div>
                </Section>
              )}

              <Section title="References">
                <Field label="Order" value={order.id} mono />
                {order.paymentIntentId && <Field label="Payment intent" value={order.paymentIntentId} mono />}
                {order.paymentMethodId && <Field label="Payment method" value={order.paymentMethodId} mono />}
              </Section>

              {order.notes && (
                <Section title="Notes">
                  <p className="text-[13px] text-neutral-900 dark:text-white whitespace-pre-line">{order.notes}</p>
                </Section>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
              <a
                href={`/order-confirmation/${order.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-sky-600 dark:text-sky-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              >
                View confirmation
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
