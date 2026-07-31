'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Edit2,
  Mail,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  ShoppingBag,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  Badge
} from 'lucide-react'
import { IUser } from '@/types/entities/user'
import { store } from '@/lib/store/store'
import { setOpenUserDrawer } from '@/lib/store/slices/userSlice'
import { setInputs } from '@/lib/store/slices/formSlice'

const TABS = ['All', 'Super User', 'Admin', 'Program', 'Supporters'] as const
type TabType = (typeof TABS)[number]

const TAB_TO_TYPE = {
  All: 'All' as const,
  'Super User': 'SUPERUSER' as const,
  Admin: 'ADMIN' as const,
  Program: 'PROGRAM' as const,
  Supporters: 'SUPPORTER' as const
}

const ROLE_COLORS: Record<string, string> = {
  SUPERUSER: 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300',
  ADMIN: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  SUPPORTER: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  PROGRAM: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300'
}

const ROLE_LABEL: Record<string, string> = {
  SUPERUSER: 'Super User',
  ADMIN: 'Admin',
  PROGRAM: 'Program',
  SUPPORTER: 'Supporter'
}

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

const PAGE_SIZE = 50

// ─── User Detail Drawer ────────────────────────────────────────────────────────
function UserDetailDrawer({ user, onClose }: { user: IUser | null; onClose: () => void }) {
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

// ─── Main Component ────────────────────────────────────────────────────────────
export const CommandPodClient = ({ users }: { users: IUser[] }) => {
  const [activeTab, setActiveTab] = useState<TabType>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)

  const session = useSession()

  const canManage = (user: IUser) =>
    session?.data?.user?.email === process.env.NEXT_PUBLIC_SUPER_USER_EMAIL ||
    (session?.data?.user?.role === 'ADMIN' && user?.email !== process.env.NEXT_PUBLIC_SUPER_USER_EMAIL)

  const handleEditUser = (e: React.MouseEvent, user: IUser) => {
    e.stopPropagation()
    store.dispatch(setOpenUserDrawer())
    store.dispatch(setInputs({ formName: 'userForm', data: { ...user, isUpdating: true } }))
  }

  const filteredUsers =
    users?.filter((user) => {
      const matchesTab = TAB_TO_TYPE[activeTab] === 'All' || user?.role === TAB_TO_TYPE[activeTab]
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        q === '' ||
        user.firstName?.toLowerCase().includes(q) ||
        user.lastName?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q)
      return matchesTab && matchesSearch
    }) ?? []

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE)
  const paginated = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setPage(1)
  }

  const handleSearch = (q: string) => {
    setSearchQuery(q)
    setPage(1)
  }

  return (
    <>
      <UserDetailDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />

      <div className="h-dvh bg-white dark:bg-neutral-950 flex flex-col">
        {/* Combined Header: tabs + search + pagination */}
        <div className="shrink-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-8">
          <div className="flex items-center justify-between gap-6">
            {/* Tabs with counts */}
            <div className="flex">
              {TABS.map((tab) => {
                const role = TAB_TO_TYPE[tab]
                const count = role === 'All' ? users.length : users.filter((u) => u.role === role).length

                return (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`flex items-center gap-2 py-4 px-1 mr-6 text-sm font-semibold transition-colors relative whitespace-nowrap ${
                      activeTab === tab
                        ? 'text-neutral-900 dark:text-white'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-300'
                    }`}
                  >
                    {tab}
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-medium transition-colors ${
                        activeTab === tab
                          ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                      }`}
                    >
                      {count}
                    </span>
                    {activeTab === tab && (
                      <motion.div
                        layoutId="underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Right: search + pagination */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-52 pl-9 pr-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-neutral-400 dark:text-neutral-500 whitespace-nowrap">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-400 dark:text-neutral-500">
              <Mail className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No users found</p>
            </div>
          ) : (
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {paginated.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15, delay: index * 0.01 }}
                      onClick={() => setSelectedUser(user)}
                      className="bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 cursor-pointer transition-colors group"
                    >
                      <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white whitespace-nowrap">
                        {user.firstName || user.lastName ? (
                          `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
                        ) : (
                          <span className="text-neutral-400 dark:text-neutral-500 italic">No name</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{user.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded text-xs font-semibold ${ROLE_COLORS[user.role] ?? ''}`}
                        >
                          {ROLE_LABEL[user.role] ?? user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {canManage(user) && (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => handleEditUser(e, user)}
                              className="p-1.5 text-neutral-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Bottom Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | '...')[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...')
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, i) =>
                    p === '...' ? (
                      <span key={`ellipsis-${i}`} className="px-2 py-1 text-xs text-neutral-400">
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-7 h-7 text-xs font-medium rounded transition-colors ${
                          page === p
                            ? 'bg-sky-600 text-white'
                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 transition-colors"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
