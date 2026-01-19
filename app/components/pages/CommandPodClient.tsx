'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Mail, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { store } from '@/app/lib/store/store'
import { setOpenUserDrawer } from '@/app/lib/store/slices/userSlice'
import { setInputs } from '@/app/lib/store/slices/formSlice'
import { IUser } from '@/types/entities/user'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { deleteUser } from '@/app/lib/actions/deleteUser'
import { useSession } from 'next-auth/react'

const TABS = ['All', 'Super User', 'Admin', 'Staff', 'Supporters'] as const
type TabType = (typeof TABS)[number]

const TAB_TO_TYPE = {
  All: 'All' as const,
  'Super User': 'SUPERUSER' as const,
  Admin: 'ADMIN' as const,
  Supporters: 'SUPPORTER' as const,
  Parents: 'PARENT' as const
}

export const CommandPodClient = ({ users }) => {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const session = useSession()
  const router = useRouter()

  const filterByTab = (tab: TabType) => setActiveTab(tab)

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true)
      await deleteUser(id)
      router.refresh()
      store.dispatch(showToast({ message: 'Successfully deleted user' }))
    } catch {
      store.dispatch(showToast({ message: 'Failed to delete user', type: 'error' }))
    } finally {
      setDeleting(false)
    }
  }

  const filteredUsers = users?.filter((user: IUser) => {
    const matchesTab = TAB_TO_TYPE[activeTab] === 'All' || user?.role === TAB_TO_TYPE[activeTab]

    const matchesSearch =
      searchQuery === '' ||
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesSearch
  })

  const typeColors = {
    SUPERUSER: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
    ADMIN: 'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300',
    SUPPORTER: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    PARENT: ''
  }

  const handleEditUser = async (user: IUser) => {
    store.dispatch(setOpenUserDrawer())
    store.dispatch(setInputs({ formName: 'userForm', data: { ...user, isUpdating: true } }))
  }

  return (
    <div className="h-screen bg-white dark:bg-neutral-950 flex flex-col">
      <div className="fixed w-full border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-8 pb-3 lg:pb-0">
        <div className="flex flex-col lg:flex-row lg:items-center gap-y-3 lg:gap-x-8">
          <div className="flex gap-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => filterByTab(tab)}
                className={`py-4 text-sm font-semibold transition-colors relative whitespace-nowrap ${
                  activeTab === tab
                    ? 'dark:text-white text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-300'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-sky-600"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 pb-6 pt-36 lg:pt-17">
        <div className="mx-auto">
          {/* Stats */}
          <div className="flex gap-6 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Total Users:</span>
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">{users?.length || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Admins:</span>
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                {users?.filter((user: IUser) => user.role === 'ADMIN' || user.role === 'SUPERUSER').length || 0}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Supporters:</span>
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                {users?.filter((user: IUser) => user.role === 'SUPPORTER').length || 0}
              </span>
            </div>
          </div>

          {filteredUsers?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500 dark:text-neutral-400">
              <Mail className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-lg font-medium">No {activeTab}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* User List */}
              {filteredUsers?.map((user: IUser, index: number) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold dark:text-white text-neutral-900 truncate">{user.email}</p>
                        <span
                          className={`inline-flex px-2.5 py-1 rounded text-xs font-semibold shrink-0 ${
                            typeColors[user?.role]
                          }`}
                        >
                          {user?.role === 'SUPERUSER'
                            ? 'Super User'
                            : user?.role === 'ADMIN'
                              ? 'Admin'
                              : user?.role === 'SUPPORTER'
                                ? 'Supporter'
                                : 'Parent'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500">
                        Name {user?.firstName} {user?.lastName}
                      </p>
                    </div>

                    {(session.data.user.email === process.env.NEXT_PUBLIC_SUPER_USER_EMAIL ||
                      (session.data.user.role === 'ADMIN' &&
                        user.email !== process.env.NEXT_PUBLIC_SUPER_USER_EMAIL)) && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditUser(user)}
                          className="p-1.5 dark:text-neutral-600 dark:hover:text-sky-400 dark:hover:bg-neutral-800 text-neutral-600 hover:text-sky-600 hover:bg-neutral-200 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            handleDelete(user.id)
                            setDeleteId(user.id)
                          }}
                          className="p-1.5 dark:text-neutral-600 dark:hover:text-red-400 dark:hover:bg-neutral-800 text-neutral-600 hover:text-red-600 hover:bg-neutral-200 rounded transition-colors"
                        >
                          {deleting && deleteId === user.id ? (
                            <div className="w-4 h-4 rounded-full border-2 border-neutral-300 dark:border-neutral-600 border-t-red-600 dark:border-t-red-400 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </motion.button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
