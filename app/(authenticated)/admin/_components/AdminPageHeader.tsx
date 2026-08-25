import { ReactNode } from 'react'

type Props = {
  title: string
  meta?: string
  actions?: ReactNode
}

export function AdminPageHeader({ title, meta, actions }: Props) {
  return (
    <header className="sticky top-0 z-10 h-11 flex items-center justify-between gap-4 px-6 lg:px-8 border-b border-neutral-200 dark:border-neutral-800 bg-white/85 dark:bg-neutral-950/85 backdrop-blur-sm">
      <div className="flex items-baseline gap-2.5 min-w-0">
        <h1 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{title}</h1>

        {meta && (
          <span className="text-xs text-neutral-400 dark:text-neutral-600 tabular-nums truncate shrink-0">{meta}</span>
        )}
      </div>

      {actions && <div className="flex items-center gap-1.5 shrink-0">{actions}</div>}
    </header>
  )
}
