import { STATUS_STYLES } from '@/lib/constants/job-application.constants'
import { ORDER_TYPE_LABEL, ROLE_STYLES } from '@/lib/constants/super'
import { usd } from '@/lib/utils/currency.utils'
import { fmt } from '@/lib/utils/date-utils'
import { OrderStatus, User } from '@/types/super'
import { AnimatePresence, motion } from 'framer-motion'
import { CreditCard, MapPin, ShoppingBag, X } from 'lucide-react'

export function SuperUserDrawer({ user, onClose }: { user: User | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {user && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
              <div>
                <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                  {user.firstName || user.lastName
                    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
                    : 'No name'}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{user.email}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              {/* Role + meta */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${ROLE_STYLES[user.role] ?? ''}`}>
                  {user.role}
                </span>
                <span className="text-xs text-neutral-400">Joined {fmt(user.createdAt)}</span>
                {user.lastLoginAt && (
                  <span className="text-xs text-neutral-400">· Last login {fmt(user.lastLoginAt)}</span>
                )}
              </div>

              {/* Stripe */}
              {user.stripeCustomerId && (
                <div>
                  <p className="text-[10px] font-mono tracking-wider uppercase text-neutral-400 mb-1">Stripe ID</p>
                  <p className="text-xs font-mono text-neutral-600 dark:text-neutral-300">{user.stripeCustomerId}</p>
                </div>
              )}

              {/* Address */}
              <section>
                <p className="text-[10px] font-mono tracking-wider uppercase text-neutral-400 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> Address
                </p>
                {user.address ? (
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 space-y-0.5">
                    {user.address.address && <p>{user.address.address}</p>}
                    {user.address.addressLine2 && <p>{user.address.addressLine2}</p>}
                    <p>
                      {[user.address.city, user.address.state, user.address.zipCode || user.address.zipPostalCode]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                    {user.address.country && <p className="text-neutral-400">{user.address.country}</p>}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 italic">No address on file</p>
                )}
              </section>

              {/* Payment Methods */}
              <section>
                <p className="text-[10px] font-mono tracking-wider uppercase text-neutral-400 mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-3 h-3" /> Payment Methods
                </p>
                {user.paymentMethods.length > 0 ? (
                  <div className="space-y-2">
                    {user.paymentMethods.map((pm) => (
                      <div
                        key={pm.id}
                        className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg"
                      >
                        <div className="flex items-center gap-2.5">
                          <CreditCard className="w-4 h-4 text-neutral-400" />
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white capitalize">
                              {pm.brand} •••• {pm.last4}
                            </p>
                            <p className="text-xs text-neutral-400">
                              Exp {pm.expMonth}/{pm.expYear}
                            </p>
                          </div>
                        </div>
                        {pm.isDefault && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 italic">No payment methods on file</p>
                )}
              </section>

              {/* Recent Orders */}
              <section>
                <p className="text-[10px] font-mono tracking-wider uppercase text-neutral-400 mb-2 flex items-center gap-1.5">
                  <ShoppingBag className="w-3 h-3" /> Orders ({user._count.orders} total)
                </p>
                {user.orders.length > 0 ? (
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {user.orders.map((o) => (
                          <tr key={o.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                            <td className="px-3 py-2.5 text-neutral-400">{fmt(o.createdAt)}</td>
                            <td className="px-3 py-2.5 text-neutral-600 dark:text-neutral-300">
                              {ORDER_TYPE_LABEL[o.type] ?? o.type}
                            </td>
                            <td className="px-3 py-2.5">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${STATUS_STYLES[o.status as OrderStatus] ?? ''}`}
                              >
                                {o.status}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-right font-semibold text-neutral-900 dark:text-white">
                              {usd(o.totalAmount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 italic">No orders</p>
                )}
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
