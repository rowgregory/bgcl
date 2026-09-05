import { formatCurrency } from '@/lib/utils/currency.utils'
import { motion } from 'framer-motion'
import Link from 'next/link'

const labelCls = 'text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-600'

const HREFS: Record<string, string> = {
  Donations: '/supporter/donations',
  'Event tickets': '/supporter/tickets'
}

export function Stats({ dashboard }) {
  const hero = dashboard?.hero
  const stats = dashboard?.stats ?? []

  if (!hero) return null

  return (
    <motion.dl
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] gap-8 lg:gap-14"
    >
      <div>
        <dt className={labelCls}>{hero.label}</dt>
        <dd className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white tabular-nums">
          {formatCurrency(hero.value)}
        </dd>
        <dd className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{hero.subtext}</dd>
      </div>

      <div className="grid grid-cols-3 gap-x-8 lg:border-l lg:border-neutral-200 lg:dark:border-neutral-800 lg:pl-14">
        {stats.map((stat) => {
          const href = HREFS[stat.label]

          const content = (
            <>
              <dt className={`${labelCls} whitespace-nowrap`}>{stat.label}</dt>
              <dd className="mt-3 text-xl font-semibold text-neutral-900 dark:text-white tabular-nums group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {formatCurrency(stat.value)}
              </dd>
              <dd className="mt-1 text-xs text-neutral-400 dark:text-neutral-600">{stat.subtext}</dd>
            </>
          )

          return href ? (
            <Link
              key={stat.label}
              href={href}
              className="flex flex-col group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
            >
              {content}
            </Link>
          ) : (
            <div key={stat.label} className="flex flex-col">
              {content}
            </div>
          )
        })}
      </div>
    </motion.dl>
  )
}
