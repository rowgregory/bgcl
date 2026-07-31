import { STATUS_STYLES } from '@/lib/constants/job-application.constants'
import { CITApplicationStatus } from '@prisma/client'

export function StatusBadge({ status }: { status: CITApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold uppercase tracking-wide rounded-full ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  )
}

export function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-500">{label}</dt>
      <dd className="text-sm text-neutral-800 dark:text-neutral-200 wrap-break-word">{value || '—'}</dd>
    </div>
  )
}

export function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wide text-neutral-900 dark:text-white">{title}</h3>
      {children}
    </section>
  )
}
