// app/(authenticated)/admin/users/[userId]/UserDetailsClient.tsx
'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { AdminPageHeader } from '@/app/(authenticated)/admin/_components/AdminPageHeader'
import { StatusBadge } from '@/app/(authenticated)/admin/_components/StatusBadge'
import { formatCurrency } from '@/lib/utils/currency.utils'
import { formatDate } from '@/lib/utils/date-utils'

const ROLE_LABEL: Record<string, string> = {
  SUPERUSER: 'Super user',
  ADMIN: 'Admin',
  PROGRAM: 'Program',
  SUPPORTER: 'Supporter'
}

const ORDER_TYPE_LABEL: Record<string, string> = {
  TICKET_PURCHASE: 'Ticket purchase',
  ONE_TIME_DONATION: 'One-time donation',
  RECURRING_DONATION: 'Recurring donation'
}

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
    <h2 className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
      {title}
    </h2>
    {children}
  </section>
)

const Field = ({ label, value, className = '' }: { label: string; value: ReactNode; className?: string }) => (
  <div>
    <p className="text-xs text-neutral-400 dark:text-neutral-600">{label}</p>
    <div className={`mt-0.5 text-sm text-neutral-900 dark:text-white ${className}`}>{value || '—'}</div>
  </div>
)

export function UserDetailsClient({ user }: { user: any }) {
  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()

  const orders: any[] = user.orders ?? []
  const confirmed = orders.filter((order) => order.status === 'CONFIRMED')
  const totalSpent = confirmed.reduce((sum, order) => sum + Number(order.totalAmount), 0)

  const address = user.address
  const hasStaffInfo = Boolean(user.position || user.department || user.hireDate)

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <AdminPageHeader
        title={fullName || 'User'}
        meta={ROLE_LABEL[user.role] ?? user.role}
        actions={
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 text-sm text-sky-600 dark:text-sky-400 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            Users
          </Link>
        }
      />

      <div className="max-w-4xl px-6 py-8 lg:px-8">
        <div className="space-y-8">
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Total spent
              </p>
              <p className="mt-1 text-3xl font-semibold text-neutral-900 dark:text-white tabular-nums">
                {formatCurrency(totalSpent)}
              </p>
            </div>

            <p className="text-sm text-neutral-500 dark:text-neutral-400 tabular-nums">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'} · {confirmed.length} confirmed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
            <Section title="Contact">
              <div className="space-y-3">
                <Field label="Name" value={fullName} />
                <Field label="Email" value={user.email} className="break-all" />
                <Field label="Phone" value={user.phone} />
              </div>
            </Section>

            {address && (
              <Section title="Address">
                <div className="text-sm text-neutral-900 dark:text-white space-y-0.5">
                  <p>{address.address ?? address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>
                    {address.city}, {address.state} {address.zipCode ?? address.zipPostalCode}
                  </p>
                  {address.country && <p>{address.country}</p>}
                </div>
              </Section>
            )}

            <Section title="Account">
              <div className="space-y-3">
                <Field label="Role" value={ROLE_LABEL[user.role] ?? user.role} />
                <Field label="Joined" value={formatDate(user.createdAt)} />
                <Field label="Last login" value={user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Not recorded'} />
                <Field label="Email verified" value={user.emailVerified ? 'Yes' : 'No'} />
              </div>
            </Section>

            {hasStaffInfo && (
              <Section title="Staff">
                <div className="space-y-3">
                  <Field label="Position" value={user.position} />
                  <Field label="Department" value={user.department} />
                  <Field label="Hired" value={user.hireDate ? formatDate(user.hireDate) : null} />
                  {user.staffStatus && <Field label="Status" value={user.staffStatus} />}
                </div>
              </Section>
            )}

            <Section title="Reference">
              <Field label="User ID" value={user.id} className="font-mono text-xs break-all" />
            </Section>
          </div>

          <Section title="Orders">
            {orders.length === 0 ? (
              <p className="text-sm text-neutral-400 dark:text-neutral-600">No orders on record.</p>
            ) : (
              <ul role="list" className="list-none p-0 m-0 divide-y divide-neutral-100 dark:divide-neutral-900">
                {orders.map((order) => (
                  <li key={order.id} className="py-3">
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm text-neutral-900 dark:text-white truncate">
                          {ORDER_TYPE_LABEL[order.type] ?? order.type}
                          {order.event?.title && (
                            <span className="text-neutral-500 dark:text-neutral-400"> · {order.event.title}</span>
                          )}
                        </p>
                        <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-600 tabular-nums">
                          {formatDate(order.createdAt)}
                          {order.coverFees && ` · ${formatCurrency(Number(order.feesCovered))} fees covered`}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm text-neutral-900 dark:text-white tabular-nums">
                          {formatCurrency(Number(order.totalAmount))}
                        </p>
                        <div className="mt-0.5 flex justify-end">
                          <StatusBadge status={order.status} />
                        </div>
                      </div>
                    </div>

                    {order.orderItems?.length > 0 && (
                      <ul role="list" className="mt-2 pl-4 list-none p-0 m-0 space-y-0.5 max-w-sm">
                        {order.orderItems.map((item: any) => (
                          <li
                            key={item.id}
                            className="flex items-baseline justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400"
                          >
                            <span className="truncate">
                              {item.quantity} × {item.ticketName ?? item.ticket?.name}
                            </span>
                            <span className="shrink-0 tabular-nums">{formatCurrency(Number(item.totalPrice ?? 0))}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      </div>
    </div>
  )
}
