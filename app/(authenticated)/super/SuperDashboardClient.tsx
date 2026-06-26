'use client'

import { useState, useTransition } from 'react'
import { RefreshCw } from 'lucide-react'
import { getLogs } from '@/app/lib/actions/log/getLogs'
import Link from 'next/link'
import { timeAgo } from '@/app/lib/utils/time-utils'

interface Log {
  id: string
  level: string
  message: string
  metadata: any
  userId: string | null
  createdAt: string
}

interface Props {
  logs: Log[]
}

const COLUMNS = [
  {
    level: 'error',
    label: 'Errors',
    dot: 'bg-red-500',
    border: 'border-red-200 dark:border-red-900/50',
    header: 'bg-red-50 dark:bg-red-950/30',
    headerText: 'text-red-700 dark:text-red-400',
    countBg: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
  },
  {
    level: 'warn',
    label: 'Warnings',
    dot: 'bg-yellow-500',
    border: 'border-yellow-200 dark:border-yellow-900/50',
    header: 'bg-yellow-50 dark:bg-yellow-950/30',
    headerText: 'text-yellow-700 dark:text-yellow-400',
    countBg: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400'
  },
  {
    level: 'info',
    label: 'Info',
    dot: 'bg-sky-500',
    border: 'border-sky-200 dark:border-sky-900/50',
    header: 'bg-sky-50 dark:bg-sky-950/20',
    headerText: 'text-sky-700 dark:text-sky-400',
    countBg: 'bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400'
  }
] as const

function LogCard({ log }: { log: Log }) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 overflow-hidden">
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-neutral-900 dark:text-white leading-snug">{log.message}</p>

        {log.metadata && (
          <div className="mt-2 space-y-0.5">
            {Object.entries(typeof log.metadata === 'string' ? JSON.parse(log.metadata) : log.metadata).map(
              ([k, v]) => (
                <p key={k} className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 break-all">
                  {k}: {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                </p>
              )
            )}
          </div>
        )}

        <p className="text-[10px] text-neutral-400 mt-2">{timeAgo(log.createdAt)}</p>
      </div>
    </div>
  )
}

export default function SuperDashboardClient({ logs: initialLogs }: Props) {
  const [logs, setLogs] = useState<Log[]>(initialLogs)
  const [pending, startTransition] = useTransition()

  const handleRefresh = () => {
    startTransition(async () => {
      const result = await getLogs()
      if (result.success && result.data) setLogs(result.data)
    })
  }

  const filtered = (level: string) =>
    logs.filter((l) => {
      const matchesLevel = l.level.toLowerCase() === level
      return matchesLevel
    })

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-sky-600 dark:text-sky-400 mb-0.5">
                Superuser
              </p>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">System Logs</h1>
            </div>
            <span className="text-sm text-neutral-400">{logs.length} entries</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="text-xs font-mono text-neutral-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
            >
              ← Admin
            </Link>
            <button
              onClick={handleRefresh}
              disabled={pending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-neutral-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${pending ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Three columns */}
      <div className="px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {COLUMNS.map(({ level, label, dot, border, header, headerText, countBg }) => {
          const colLogs = filtered(level)
          return (
            <div key={level} className={`border ${border} rounded-xl overflow-hidden flex flex-col`}>
              {/* Column header */}
              <div className={`${header} px-4 py-3 flex items-center justify-between border-b ${border}`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                  <span className={`text-xs font-bold uppercase tracking-wider ${headerText}`}>{label}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${countBg}`}>{colLogs.length}</span>
                </div>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto max-h-[calc(100vh-220px)] p-3 space-y-2 bg-neutral-50 dark:bg-neutral-950">
                {colLogs.length > 0 ? (
                  colLogs.map((log) => <LogCard key={log.id} log={log} />)
                ) : (
                  <p className="text-xs text-neutral-400 italic text-center py-8">No {label.toLowerCase()}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
