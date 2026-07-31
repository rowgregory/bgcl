import { useEffect } from 'react'
import { CountdownCard } from './CountdownCard'
import { ArrowBigRight, ArrowsUpFromLineIcon, CheckCircle, Phone } from 'lucide-react'
import { FoilText } from './FoilText'
import { formatCurrency } from '@/lib/utils/currency.utils'

// Brand — burgundy/red replacing the template's purple
const RED = '#e0355a' // bright accent (their #a855f7 equivalent)
const RED_DEEP = '#a0284a'
const RED_DARK = '#100103'

export default function GalaEventClient({ data: event }) {
  useEffect(() => {
    const l = document.createElement('link')
    l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400..900&display=swap'

    document.head.appendChild(l)
    return () => {
      document.head.removeChild(l)
    }
  }, [])

  return (
    <div className="bg-[#120308] text-white">
      {/* ══════════ HERO ══════════ */}
      <section className="relative h-250">
        {/* nav */}
        <div className="relative max-w-7xl mx-auto px-6 pt-6">
          <nav
            className="flex items-center justify-between rounded-full px-6 py-3"
            style={{
              background: 'rgba(160,40,74,.22)',
              border: '1px solid rgba(224,53,90,.25)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <span className="font-bold text-xl tracking-tight">
              BGCL <span style={{ color: RED }}>{event.category}</span>
            </span>
            <button
              className="flex items-center gap-2 rounded-full pl-5 pr-1.5 py-1.5 text-sm font-semibold"
              style={{ background: RED }}
            >
              Get Tickets
              <span className="grid place-items-center w-8 h-8 rounded-full bg-white" style={{ color: RED }}>
                <ArrowBigRight />
              </span>
            </button>
          </nav>
        </div>

        {/* hero content */}
        <div className="relative max-w-7xl mx-auto px-6 pt-30 pb-40">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* LEFT */}
            <div>
              <div style={{ width: 'min(420px, 80vw)' }}>
                <FoilText>GALA</FoilText>
              </div>

              <p className="mt-6 max-w-lg leading-relaxed" style={{ color: '#e3c3ca' }}>
                Join us for the {event.subtitle?.toLowerCase()} {event.host} Gala — a night of celebration, and a night
                that sends local kids to summer camp.
              </p>

              <div className="h-px w-full max-w-lg my-8" style={{ background: 'rgba(224,53,90,.3)' }} />

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <button
                  className="flex items-center gap-2 rounded-full pl-6 pr-1.5 py-1.5 font-semibold transition-transform active:scale-[.98]"
                  style={{ background: RED }}
                >
                  Get Tickets
                  <span className="grid place-items-center w-9 h-9 rounded-full bg-white" style={{ color: RED }}>
                    <ArrowBigRight />
                  </span>
                </button>

                <div className="flex items-center gap-3">
                  <span className="grid place-items-center w-12 h-12 rounded-full bg-white" style={{ color: RED }}>
                    <Phone />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Call Now</p>
                    <p className="text-sm" style={{ color: RED }}>
                      {event.phone}
                    </p>
                  </div>
                </div>
              </div>

              <CountdownCard event={event} />
            </div>

            {/* RIGHT — countdown card (frosted, like their form card) */}
          </div>
        </div>

        {/* overlapping ticket cards row (like their category cards) */}
        <div className="relative max-w-6xl mx-auto px-6 -mb-24" style={{ marginTop: '-6rem' }} id="tickets">
          <div className="grid sm:grid-cols-3 gap-5">
            {event?.tickets.map((t, i) => {
              const featured = i === 1
              return (
                <div
                  key={t.id}
                  className="relative rounded-2xl p-7 flex flex-col"
                  style={{
                    background: featured ? `linear-gradient(165deg, ${RED_DEEP}, ${RED_DARK})` : 'rgba(30,7,15,.92)',
                    border: `1px solid ${featured ? 'rgba(255,255,255,.25)' : 'rgba(224,53,90,.22)'}`,
                    backdropFilter: 'blur(12px)',
                    boxShadow: featured ? `0 25px 60px -25px ${RED_DEEP}` : '0 20px 50px -30px rgba(0,0,0,.8)'
                  }}
                >
                  {featured && (
                    <span
                      className="absolute -top-3 left-7 px-3 py-1 rounded-full text-[11px] font-bold"
                      style={{ background: '#fff', color: RED_DEEP }}
                    >
                      MOST POPULAR
                    </span>
                  )}
                  <p className="text-sm font-semibold mb-2" style={{ color: featured ? '#ffd9e1' : RED }}>
                    {t.name}
                  </p>
                  <p className="text-4xl font-extrabold mb-3">{formatCurrency(t.price)}</p>
                  <p className="text-sm mb-5" style={{ color: '#e3c3ca' }}>
                    {t.description}
                  </p>

                  <p
                    className="text-sm font-medium mb-5 pb-5"
                    style={{ color: featured ? '#fff' : '#f0d5db', borderBottom: '1px solid rgba(224,53,90,.22)' }}
                  >
                    {t.sponsorImpact}
                  </p>

                  <ul className="space-y-2.5 mb-7 flex-1">
                    {t.sponsorPerks.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm" style={{ color: '#f0d5db' }}>
                        <span className="mt-0.5 shrink-0" style={{ color: featured ? '#fff' : RED }}>
                          <CheckCircle />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>

                  <button
                    className="w-full flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-transform active:scale-[.98]"
                    style={{
                      background: featured ? '#fff' : RED,
                      color: featured ? RED_DEEP : '#fff'
                    }}
                  >
                    Select <ArrowsUpFromLineIcon />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
