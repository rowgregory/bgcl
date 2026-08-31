import { STATUS_STYLES } from '@/lib/constants/job-application.constants'
import { CITApplicationStatus } from '@prisma/client'
import { ddCls, dtCls, labelCls } from '../_constants/cit-application.constants'

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

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <p className={`${labelCls} mb-3`}>{title}</p>
      {children}
    </section>
  )
}

export function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (value === null || value === undefined || value === '') return null

  return (
    <>
      <dt className={dtCls}>{label}</dt>
      <dd className={`${ddCls} truncate`}>{value}</dd>
    </>
  )
}
