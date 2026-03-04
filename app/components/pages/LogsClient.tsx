'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, AlertTriangle, Info, Filter, X, Calendar, User, FileText, TrendingUp } from 'lucide-react'
import { formatDate } from '@/app/lib/utils/date-utils'

interface Log {
  id: string
  level: string
  message: string
  metadata: any
  userId: string | null
  createdAt: Date
  updatedAt: Date
}

export default function LogsClient({ logs, stats }) {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [selectedLog, setSelectedLog] = useState<Log | null>(null)

  const getLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
      case 'info':
      default:
        return <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
    }
  }

  const getLevelStyles = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      case 'info':
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
    }
  }

  const filterButtons = [
    { label: 'All', value: null, count: stats?.total || 0 },
    { label: 'Errors', value: 'error', count: stats?.errorCount || 0 },
    { label: 'Warnings', value: 'warning', count: stats?.warningCount || 0 },
    { label: 'Info', value: 'info', count: stats?.infoCount || 0 }
  ]

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-334 mx-auto space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                  Total Logs
                </p>
              </div>
              <p className="text-3xl font-black text-neutral-900 dark:text-white">{stats.total}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-neutral-900 border border-red-200 dark:border-red-800 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">Errors</p>
              </div>
              <p className="text-3xl font-black text-red-600 dark:text-red-400">{stats.errorCount}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-neutral-900 border border-yellow-200 dark:border-yellow-800 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide">
                  Warnings
                </p>
              </div>
              <p className="text-3xl font-black text-yellow-600 dark:text-yellow-400">{stats.warningCount}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-neutral-900 border border-blue-200 dark:border-blue-800 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Info</p>
              </div>
              <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{stats.infoCount}</p>
            </motion.div>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">Filter by Level</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((filter) => (
              <button
                key={filter.label}
                onClick={() => setSelectedLevel(filter.value)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-semibold transition-all
                  ${
                    selectedLevel === filter.value
                      ? 'bg-sky-500 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }
                `}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Logs List */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          {logs?.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600 dark:text-neutral-400">No logs found</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {logs?.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedLog(log)}
                  className="p-4 sm:p-6 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors"
                >
                  {/* Desktop Layout */}
                  <div className="hidden sm:grid sm:grid-cols-12 gap-4 items-start">
                    {/* Level Badge */}
                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border ${getLevelStyles(log.level)}`}
                      >
                        {getLevelIcon(log.level)}
                        {log.level}
                      </span>
                    </div>

                    {/* Message */}
                    <div className="col-span-6">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-2">{log.message}</p>
                    </div>

                    {/* User */}
                    <div className="col-span-2">
                      {log.userId ? (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-neutral-400" />
                          <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400 truncate">
                            {log.userId.slice(0, 8)}...
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400">System</span>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className="col-span-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Calendar className="w-4 h-4 text-neutral-400" />
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">
                          {formatDate(new Date(log.createdAt))}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="sm:hidden space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${getLevelStyles(log.level)}`}
                      >
                        {getLevelIcon(log.level)}
                        {log.level}
                      </span>
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">
                        {formatDate(new Date(log.createdAt))}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-2">{log.message}</p>
                    {log.userId && (
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">{log.userId}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Log Detail Drawer */}
      <AnimatePresence>
        {selectedLog && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLog(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full sm:w-150 bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 z-50 overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      selectedLog.level === 'error'
                        ? 'bg-red-100 dark:bg-red-900/20'
                        : selectedLog.level === 'warning'
                          ? 'bg-yellow-100 dark:bg-yellow-900/20'
                          : 'bg-blue-100 dark:bg-blue-900/20'
                    }`}
                  >
                    {getLevelIcon(selectedLog.level)}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">Log Details</h2>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                      {formatDate(new Date(selectedLog.createdAt))}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-4 sm:p-6 space-y-6">
                {/* Level Badge */}
                <div>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide border ${getLevelStyles(selectedLog.level)}`}
                  >
                    {getLevelIcon(selectedLog.level)}
                    {selectedLog.level}
                  </span>
                </div>

                {/* Message */}
                <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                  <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
                    Message
                  </h3>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {selectedLog.message}
                  </p>
                </div>

                {/* User ID */}
                {selectedLog.userId && (
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                    <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-3 uppercase tracking-wide flex items-center gap-2">
                      <User className="w-4 h-4" />
                      User ID
                    </h3>
                    <p className="text-sm font-mono text-neutral-700 dark:text-neutral-300">{selectedLog.userId}</p>
                  </div>
                )}

                {/* Metadata */}
                {selectedLog.metadata && (
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                    <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
                      Metadata
                    </h3>
                    <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-x-auto">
                      <pre className="text-xs font-mono text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap wrap-break-word">
                        {JSON.stringify(selectedLog.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
                {/* Technical Details */}
                <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
                  <details className="text-xs">
                    <summary className="cursor-pointer text-neutral-600 dark:text-neutral-400 font-semibold mb-2">
                      Technical Details
                    </summary>
                    <div className="space-y-1 font-mono text-neutral-500 dark:text-neutral-500 mt-2">
                      <p>Log ID: {selectedLog.id}</p>
                      <p>Created: {formatDate(new Date(selectedLog.createdAt))}</p>
                      <p>Updated: {formatDate(new Date(selectedLog.updatedAt))}</p>
                    </div>
                  </details>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
