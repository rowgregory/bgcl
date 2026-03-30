import { Fragment, useEffect, useState } from 'react'

export function TicketSalesCountdown({ target }: { target: Date }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    const calc = () => {
      const diff = new Date(target).getTime() - Date.now()
      if (diff <= 0) return
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000)
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [target])

  return (
    <div className="flex items-end justify-center gap-2 sm:gap-3">
      {[
        { v: t.d, l: 'Days' },
        { v: t.h, l: 'Hrs' },
        { v: t.m, l: 'Min' },
        { v: t.s, l: 'Sec' }
      ].map(({ v, l }, i) => (
        <Fragment key={l}>
          <div className="text-center">
            <div className="dark:bg-neutral-900 bg-white dark:border-neutral-700 border-neutral-300 border rounded-xl w-12 h-12 flex items-center justify-center">
              <span className="text-xl font-black tabular-nums dark:text-white text-neutral-900 leading-none">
                {String(v).padStart(2, '0')}
              </span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest dark:text-neutral-500 text-neutral-400 mt-1.5">
              {l}
            </p>
          </div>
          {i < 3 && (
            <span
              className="text-lg font-black dark:text-neutral-600 text-neutral-300 mb-5 leading-none"
              aria-hidden="true"
            >
              :
            </span>
          )}
        </Fragment>
      ))}
    </div>
  )
}
