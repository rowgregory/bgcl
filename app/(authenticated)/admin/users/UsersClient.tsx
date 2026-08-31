'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { UserWithAddress } from '@/types/user.types'
import { UserDetailDrawer } from './_components/UserDetailDrawer'
import { useUserDrawer } from '@/stores/drawers'
import { AdminPageHeader } from '@/app/(authenticated)/admin/_components/AdminPageHeader'
import { Role } from '@prisma/client'

const TABS = ['All', 'Admin', 'Program', 'Supporters'] as const
type TabType = (typeof TABS)[number]

const TAB_TO_TYPE = {
  All: 'All' as const,
  Admin: 'ADMIN' as const,
  Program: 'PROGRAM' as const,
  Supporters: 'SUPPORTER' as const
}

const ROLE_LABEL: Record<string, string> = {
  SUPERUSER: 'Super user',
  ADMIN: 'Admin',
  PROGRAM: 'Program',
  SUPPORTER: 'Supporter'
}

const thCls =
  'py-2 pr-4 text-[11px] font-medium text-neutral-400 dark:text-neutral-600 uppercase tracking-wider whitespace-nowrap'

const PAGE_SIZE = 50

export const UsersClient = ({
  users,
  currentUser
}: {
  users: UserWithAddress[]
  currentUser?: { email?: string | null; role?: Role }
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<UserWithAddress | null>(null)
  const open = useUserDrawer((s) => s.open)

  const superEmail = process.env.NEXT_PUBLIC_SUPER_USER_EMAIL

  const canManage = (user: UserWithAddress) =>
    currentUser?.email === superEmail || (currentUser?.role === 'ADMIN' && user?.email !== superEmail)

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return (users ?? []).filter((user) => {
      if (TAB_TO_TYPE[activeTab] !== 'All' && user?.role !== TAB_TO_TYPE[activeTab]) return false
      if (!q) return true
      if (user.role === 'SUPERUSER') return false

      return (
        user.firstName?.toLowerCase().includes(q) ||
        user.lastName?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q)
      )
    })
  }, [users, activeTab, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE))
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

      <div className="min-h-screen bg-white dark:bg-neutral-950">
        <AdminPageHeader
          title="Users"
          meta={`${filteredUsers.length} ${filteredUsers.length === 1 ? 'user' : 'users'}`}
        />

        <div className="px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 pt-5">
            <div className="relative w-full sm:w-72">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600"
                aria-hidden="true"
              />
              <input
                type="search"
                aria-label="Search users by email or name"
                placeholder="Search email or name"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-[13px] text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>

            <select
              value={activeTab}
              onChange={(e) => handleTabChange(e.target.value as TabType)}
              aria-label="Filter by role"
              className="py-1.5 pl-2.5 pr-8 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-[13px] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {TABS.map((tab) => {
                const role = TAB_TO_TYPE[tab]
                const count = role === 'All' ? users.length : users.filter((u) => u.role === role).length

                return (
                  <option key={tab} value={tab}>
                    {tab} ({count})
                  </option>
                )
              })}
            </select>

            {(searchQuery.trim() || activeTab !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setActiveTab('All')
                  setPage(1)
                }}
                className="text-xs text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <div className="py-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th scope="col" className={`text-left ${thCls}`}>
                      Email
                    </th>
                    <th scope="col" className={`text-left ${thCls} pr-0`}>
                      Role
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-16 text-center text-sm text-neutral-400 dark:text-neutral-600">
                        No users match this filter.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((user) => (
                      <tr
                        key={user.id}
                        onClick={() => (canManage(user) ? open({ ...user }) : setSelectedUser(user))}
                        className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                      >
                        <td className="py-3 pr-4 text-neutral-900 dark:text-white max-w-96 truncate">{user.email}</td>

                        <td className="py-3 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                          {ROLE_LABEL[user.role] ?? user.role}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                <span className="text-xs text-neutral-400 dark:text-neutral-600 tabular-nums">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredUsers.length)} of{' '}
                  {filteredUsers.length}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    aria-label="Previous page"
                    className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <span className="text-xs text-neutral-500 dark:text-neutral-400 tabular-nums px-2">
                    {page} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    aria-label="Next page"
                    className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
