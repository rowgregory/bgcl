import { UserWithAddress } from '@/types/user.types'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, X, User, ShoppingBag, Phone, MapPin, Calendar, Briefcase, Building2, Badge } from 'lucide-react'
import { ROLE_COLORS, ROLE_LABEL } from '../UsersClient'

const ORDER_TYPE_LABEL: Record<string, string> = {
  TICKET_PURCHASE: 'Ticket Purchase',
  ONE_TIME_DONATION: 'One-Time Donation',
  RECURRING_DONATION: 'Recurring Donation'
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  FAILED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  REFUNDED: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
}

export function UserDetailDrawer({ user, onClose }: { user: UserWithAddress | null; onClose: () => void }) {
  const orders: any[] = (user as any)?.orders ?? []

  const totalSpent = orders.filter((o) => o.status === 'CONFIRMED').reduce((s, o) => s + o.totalAmount, 0)
  const confirmedCount = orders.filter((o) => o.status === 'CONFIRMED').length

  return (
    <AnimatePresence>
      {user && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 z-50 flex flex-col overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <User className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                    {user.firstName || user.lastName
                      ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
                      : 'No Name'}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{user.email}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Role Badge */}
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded text-xs font-semibold ${ROLE_COLORS[user.role] ?? ''}`}>
                  {ROLE_LABEL[user.role] ?? user.role}
                </span>
                {(user as any).staffStatus && (
                  <span className="px-2.5 py-1 rounded text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    {(user as any).staffStatus}
                  </span>
                )}
              </div>

              {/* Contact Info */}
              <section className="space-y-3">
                <h4 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                  Contact
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span className="text-neutral-900 dark:text-white break-all">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                      <span className="text-neutral-900 dark:text-white">{user.phone}</span>
                    </div>
                  )}
                  {(user as any).address && (
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                      <span className="text-neutral-900 dark:text-white">
                        {[
                          (user as any).address.address,
                          (user as any).address.city,
                          (user as any).address.state,
                          (user as any).address.zipCode
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </section>

              {/* Staff Info (if applicable) */}
              {((user as any).position || (user as any).department || (user as any).hireDate) && (
                <section className="space-y-3">
                  <h4 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    Staff
                  </h4>
                  <div className="space-y-2.5">
                    {(user as any).position && (
                      <div className="flex items-center gap-3 text-sm">
                        <Badge className="w-4 h-4 text-neutral-400 shrink-0" />
                        <span className="text-neutral-900 dark:text-white">{(user as any).position}</span>
                      </div>
                    )}
                    {(user as any).department && (
                      <div className="flex items-center gap-3 text-sm">
                        <Building2 className="w-4 h-4 text-neutral-400 shrink-0" />
                        <span className="text-neutral-900 dark:text-white">{(user as any).department}</span>
                      </div>
                    )}
                    {(user as any).hireDate && (
                      <div className="flex items-center gap-3 text-sm">
                        <Briefcase className="w-4 h-4 text-neutral-400 shrink-0" />
                        <span className="text-neutral-900 dark:text-white">
                          Hired{' '}
                          {new Date((user as any).hireDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Account */}
              <section className="space-y-3">
                <h4 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                  Account
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span className="text-neutral-500 dark:text-neutral-400">Joined</span>
                    <span className="text-neutral-900 dark:text-white ml-auto">
                      {new Date((user as any).createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {(user as any).lastLoginAt && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-neutral-400 shrink-0" />
                      <span className="text-neutral-500 dark:text-neutral-400">Last login</span>
                      <span className="text-neutral-900 dark:text-white ml-auto">
                        {new Date((user as any).lastLoginAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span className="text-neutral-500 dark:text-neutral-400">Email verified</span>
                    <span
                      className={`ml-auto font-medium ${(user as any).emailVerified ? 'text-green-600 dark:text-green-400' : 'text-neutral-400'}`}
                    >
                      {(user as any).emailVerified ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </section>

              {/* Orders */}
              <section className="space-y-3">
                <h4 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag className="w-3.5 h-3.5" /> Orders
                </h4>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Total Orders', value: orders.length },
                    { label: 'Confirmed', value: confirmedCount },
                    {
                      label: 'Total Spent',
                      value: `$${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                    }
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-center"
                    >
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">{label}</p>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Order Table */}
                {orders.length > 0 ? (
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                          <th className="text-left px-3 py-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                            Date
                          </th>
                          <th className="text-left px-3 py-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                            Type
                          </th>
                          <th className="text-left px-3 py-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                            Status
                          </th>
                          <th className="text-right px-3 py-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {orders.map((order) => (
                          <tr
                            key={order.id}
                            className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                          >
                            <td className="px-3 py-2.5 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: '2-digit',
                                year: '2-digit'
                              })}
                            </td>
                            <td className="px-3 py-2.5 text-neutral-900 dark:text-white">
                              {ORDER_TYPE_LABEL[order.type] ?? order.type}
                            </td>
                            <td className="px-3 py-2.5">
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[order.status] ?? ''}`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-right font-semibold text-neutral-900 dark:text-white whitespace-nowrap">
                              ${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400 dark:text-neutral-500 text-center py-6">
                    No orders on record.
                  </p>
                )}
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
