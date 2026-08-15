'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Edit2, Mail, ChevronLeft, ChevronRight } from 'lucide-react'
import { UserWithAddress } from '@/types/user.types'
import { UserDetailDrawer } from './_components/UserDetailDrawer'
import { useUserDrawer } from '@/stores/drawers'

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

const PAGE_SIZE = 50

export const UsersClient = ({ users }: { users: UserWithAddress[] }) => {
  const [activeTab, setActiveTab] = useState<TabType>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<UserWithAddress | null>(null)
  const open = useUserDrawer((s) => s.open)

  const session = useSession()

  const canManage = (user: UserWithAddress) =>
    session?.data?.user?.email === process.env.NEXT_PUBLIC_SUPER_USER_EMAIL ||
    (session?.data?.user?.role === 'ADMIN' && user?.email !== process.env.NEXT_PUBLIC_SUPER_USER_EMAIL)

  const handleEditUser = (e: React.MouseEvent, user: UserWithAddress) => {
    e.stopPropagation()
    open({ ...user })
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
