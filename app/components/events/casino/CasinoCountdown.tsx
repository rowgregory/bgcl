import { Fragment, useEffect, useState } from 'react'

export function CasinoCountdown({ target }: { target: string }) {
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
    <div className="flex items-end gap-2 sm:gap-3">
      {[
        { v: t.d, l: 'Days' },
        { v: t.h, l: 'Hrs' },
        { v: t.m, l: 'Min' },
        { v: t.s, l: 'Sec' }
      ].map(({ v, l }, i) => (
        <Fragment key={l}>
          <div className="text-center">
            <p
              className="oswald text-4xl sm:text-5xl font-black tabular-nums leading-none text-amber-400"
              style={{ textShadow: '0 0 30px rgba(212,175,55,0.8)' }}
            >
              {String(v).padStart(2, '0')}
            </p>
            <p className="oswald text-[9px] font-bold uppercase tracking-[0.2em] mt-1 text-amber-600/60">{l}</p>
          </div>
          {i < 3 && (
            <span className="text-2xl font-black text-amber-500/40 mb-4 leading-none" aria-hidden="true">
              :
            </span>
          )}
        </Fragment>
      ))}
    </div>
  )
}
