'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Filter, ChevronDown, Edit2, Trash2, Briefcase, LucideIcon, Shield } from 'lucide-react'
import { cardVariants, containerVariants } from '@/app/lib/constants/motion'
import { store } from '@/app/lib/store/store'
import { setInputs } from '@/app/lib/store/slices/formSlice'
import { setOpenUserDrawer } from '@/app/lib/store/slices/userSlice'

export const CommandPodClient = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  const roleConfig: Record<string, { label: string; icon: LucideIcon; color: string }> = {
    ADMIN: { label: 'Admin', icon: Shield, color: 'purple' },
    SUPPORTER: { label: 'Supporter', icon: Briefcase, color: 'indigo' }
  }

  const getRoleStats = () => {
    return {
      admin: users?.filter((m: { role: string }) => m.role === 'ADMIN').length,
      supporters: users?.filter((m: { role: string }) => m.role === 'SUPPORTER').length,
      total: users?.length
    }
  }

  const stats = getRoleStats()

  const handleDelete = (id: number) => {}

  // Move filtering logic here and add useEffect if needed
  const filteredUsers = users?.filter((user) => {
    const matchesRole = filterRole === 'all' || user.role === filterRole

    // Search filter
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      !searchTerm ||
      String(user?.firstName || '')
        .toLowerCase()
        .includes(searchLower) ||
      String(user?.lastName || '')
        .toLowerCase()
        .includes(searchLower) ||
      String(user?.email || '')
        .toLowerCase()
        .includes(searchLower) ||
      String(user?.title || '')
        .toLowerCase()
        .includes(searchLower)

    return matchesRole && matchesSearch
  })

  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Overview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6"
        >
          <motion.div variants={cardVariants} className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Total</h3>
            </div>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </motion.div>

          <motion.div variants={cardVariants} className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Admin</h3>
            </div>
            <p className="text-2xl font-bold text-white">{stats.admin}</p>
          </motion.div>

          <motion.div variants={cardVariants} className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Supporters</h3>
            </div>
            <p className="text-2xl font-bold text-white">{stats.supporters}</p>
          </motion.div>
        </motion.div>

        {/* Actions and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="pl-10 pr-10 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPPORTER">Supporters</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Members Grid */}
        <motion.div
          key={filterRole}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredUsers?.map((user) => {
            const IconComponent = roleConfig[user?.role]?.icon
            const roleColor = roleConfig[user?.role]?.color

            return (
              <motion.div
                key={user?.id}
                variants={cardVariants}
                className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden hover:border-indigo-500/50 transition-all duration-300"
              >
                {/* Header with role badge */}
                <div className={`bg-linear-to-r from-${roleColor}-600 to-${roleColor}-700 p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-white" />
                      <span className="text-xs font-medium text-white uppercase tracking-wide">
                        {roleConfig[user?.role]?.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          store.dispatch(setInputs({ formName: 'userForm', data: { ...user, isUpdating: true } }))
                          store.dispatch(setOpenUserDrawer())
                        }}
                        className="p-1.5 hover:bg-white/20 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => handleDelete(user?.id)}
                        className="p-1.5 hover:bg-white/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Member Info */}
                <div className="p-6">
                  {/* Avatar */}
                  <div className="flex justify-center mb-4">
                    <div
                      className={`w-20 h-20 rounded-full bg-linear-to-br from-${roleColor}-500 to-${roleColor}-600 flex items-center justify-center`}
                    >
                      <span className="text-white font-bold text-2xl">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </span>
                    </div>
                  </div>

                  {/* Name and Title */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-sm text-indigo-400 font-medium">{user?.title}</p>
                  </div>

                  {/* Contact */}
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-neutral-400">{user?.email}</div>
                    <div className="text-sm text-neutral-400">{user?.phone}</div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-neutral-500 line-clamp-3">{user?.bio}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-neutral-900 rounded-lg border border-neutral-800">
            <Users className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
            <p className="text-neutral-400">No users found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
