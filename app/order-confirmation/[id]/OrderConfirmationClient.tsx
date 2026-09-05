'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCartStore } from '@/stores/useCartStore'
import { formatEnumLabel } from '@/lib/utils/formatEnumLabel'
import { formatDate } from '@/lib/utils/date-utils'
import { Field, Section } from './_components/DetailCard'
import { ConfirmationHeader } from './_components/ConfirmationHeader'
import { ConfirmationHero } from './_components/ConfirmationHero'
import { TicketsGrid } from './_components/TicketsGrid'
import { IOrder } from '@/types/entities/order'
import { formatCurrency } from '@/lib/utils/currency.utils'

export default function OrderConfirmationClient({ order }: { order: IOrder }) {
  const isDonation = Boolean(order?.type?.includes('DONATION'))
  const isRecurring = order?.type === 'RECURRING_DONATION'
  const isTicket = order?.type === 'TICKET_PURCHASE'

  const address = (order?.billingAddress ?? null) as Record<string, string | null> | null
  const event = order?.event

  const clearCart = useCartStore((s) => s.clearCart)

  const label = isDonation ? (isRecurring ? `${order.recurringFrequency} donation` : 'One-time donation') : 'Ticket purchase'

  useEffect(() => {
    window.scrollTo(0, 0)
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-900">
      <ConfirmationHeader />

      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 lg:px-8 lg:py-12">
        <ConfirmationHero isDonation={isDonation} />

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
          >
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{label}</p>
              <p className="mt-1 text-3xl font-semibold text-neutral-900 dark:text-white tabular-nums">
                {formatCurrency(order?.totalAmount)}
              </p>
            </div>

            <p className="text-sm text-neutral-500 dark:text-neutral-400 tabular-nums">
              {formatDate(order?.paidAt || order?.createdAt, true)}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
            <Section title="Customer">
              <Field label="Name">{order?.customerName}</Field>
              <Field label="Email" className="break-all">
                {order?.customerEmail}
              </Field>
              {order?.customerPhone && <Field label="Phone">{order.customerPhone}</Field>}
            </Section>

            {address && (
              <Section title="Address">
                <div className="text-sm text-neutral-900 dark:text-white space-y-0.5">
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>
                    {address.city}, {address.state} {address.zipPostalCode}
                  </p>
                  <p>{address.country}</p>
                </div>
              </Section>
            )}

            <Section title="Payment">
              <Field label="Method" className="capitalize">
                {order?.paymentMethod}
              </Field>
              <Field label="Status">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" aria-hidden="true" />
                  {formatEnumLabel(order?.status)}
                </span>
              </Field>
            </Section>

            {isDonation && (
              <Section title="Donation">
                <Field label="Type">{formatEnumLabel(order?.type)}</Field>
                {isRecurring && (
                  <>
                    <Field label="Frequency" className="capitalize">
                      {order?.recurringFrequency}
                    </Field>
                    {order?.nextBillingDate && <Field label="Next billing">{formatDate(order.nextBillingDate)}</Field>}
                  </>
                )}
              </Section>
            )}

            <Section title="Fees">
              <Field label="Fees covered">{order?.coverFees ? 'Yes' : 'No'}</Field>
              {order?.coverFees && (
                <Field label="Amount covered" className="tabular-nums">
                  {formatCurrency(order?.feesCovered)}
                </Field>
              )}
            </Section>

            {order?.campaign && (
              <Section title="Campaign">
                <Field label="Name">{order.campaign.name}</Field>
              </Section>
            )}

            {isTicket && event && (
              <Section title="Event">
                <Field label="Name">{event.title}</Field>
                {event.date && <Field label="Date">{formatDate(event.date)}</Field>}
                {event.location && <Field label="Location">{event.location}</Field>}
              </Section>
            )}

            <Section title="Order IDs">
              <Field label="Order" className="font-mono text-xs break-all">
                {order?.id}
              </Field>
              {order?.paymentIntentId && (
                <Field label="Payment intent" className="font-mono text-xs break-all">
                  {order.paymentIntentId}
                </Field>
              )}
              {order?.paymentMethodId && (
                <Field label="Payment method" className="font-mono text-xs break-all">
                  {order.paymentMethodId}
                </Field>
              )}
            </Section>

            {order?.notes && (
              <Section title="Notes">
                <p className="text-sm text-neutral-900 dark:text-white whitespace-pre-line">{order.notes}</p>
              </Section>
            )}
          </div>

          {isTicket && <TicketsGrid order={order} />}

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="pt-4 border-t border-neutral-200 dark:border-neutral-800"
          >
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Your donations, tickets, payment methods, and account details are all available in your{' '}
              <Link href="/supporter/overview" className="text-sky-600 dark:text-sky-400 hover:underline">
                supporter overview
              </Link>
              .{isRecurring && ' You can manage or cancel your subscription there at any time.'}
            </p>
          </motion.div>
        </div>
      </div>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-6 lg:px-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="text-xs text-neutral-400 dark:text-neutral-600">
            Boys &amp; Girls Club of Lynn · {new Date().getFullYear()}
          </p>

          <p className="text-xs text-neutral-400 dark:text-neutral-600">
            Secured by Stripe · Powered by{' '}
            <Link className="sqysh-gradient hover:underline" href="https://sqysh.com">
              Sqysh
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
