import { GRADIENTS, SectionHeading } from './CasinoUiElements'
import { motion } from 'framer-motion'
import { store, useCartSelector, useUiSelector } from '@/app/lib/store/store'
import { addToCart, setOpenAddToCartToast } from '@/app/lib/store/slices/cartSlice'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { Clock } from 'lucide-react'
import { TCasinoSponsorTiers } from '@/types/casino.types'

export function CasinoSponsorTiers({ data }: TCasinoSponsorTiers) {
  const { items } = useCartSelector()
  const { soundOn } = useUiSelector()
  const { play } = useSoundEffect('/sound-effects/casino-6.wav', soundOn)

  const handleAddToCart = (ticket: any) => {
    store.dispatch(
      addToCart({
        ticket: {
          ...ticket,
          eventId: data.id,
          eventTitle: data.title,
          ticketSalesEndDate: data.ticketSalesEndDate,
          ticketSalesStartDate: data.ticketSalesStartDate
        },
        quantity: 1
      })
    )
    store.dispatch(
      setOpenAddToCartToast({ ticket: { ...ticket, eventId: data.id, eventTitle: data.title }, quantity: 1 })
    )
    play()
  }

  const now = new Date()
  const sponsorDeadline = data.registrationDeadline ? new Date(data.registrationDeadline) : null
  const sponsorExpired = !!(sponsorDeadline && sponsorDeadline <= now)

  return (
    <section aria-labelledby="sponsors-heading">
      <SectionHeading suit="♦" id="sponsors-heading">
        Sponsorship Tiers
      </SectionHeading>

      {/* Deadline banner */}
      {sponsorDeadline && !sponsorExpired && (
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-3.5 h-3.5 text-amber-400/50 shrink-0" aria-hidden="true" />
          <p className="text-xs text-white/30">
            Sponsorship applications close{' '}
            <span className="text-white/50 font-medium">
              {sponsorDeadline.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </p>
        </div>
      )}

      {sponsorExpired && (
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-3.5 h-3.5 text-red-400/50 shrink-0" aria-hidden="true" />
          <p className="text-xs text-red-400/60">Sponsorship applications are now closed</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
        {data.tickets
          .filter((t: any) => t.ticketType === 'SPONSORSHIP')
          .map((t: any, i: number) => {
            const soldOut = t.totalQuantity - t.quantitySold - t.quantityReserved <= 0
            const available = !soldOut && !sponsorExpired
            const message = soldOut ? 'Sold out' : sponsorExpired ? 'Applications closed' : 'Sales closed'
            const cartItem = items.find((item: any) => item.ticketId === t.id)
            const cartQty = cartItem?.quantity ?? 0
            const grad = GRADIENTS.SPONSORSHIP

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col"
                style={{ filter: available ? 'none' : 'grayscale(60%) brightness(0.5)' }}
              >
                {/* Tier header */}
                <div className="flex items-baseline justify-between gap-4 mb-4 pb-4 border-b border-white/[0.07]">
                  <div>
                    <p className="oswald text-[10px] font-black uppercase tracking-[0.2em] text-amber-600/50 mb-1">
                      <span className="suit">♦</span> Sponsor
                    </p>
                    <h3 className="oswald text-2xl font-black text-white uppercase tracking-wide leading-none">
                      {t.name}
                    </h3>
                  </div>
                  <p
                    className="oswald text-3xl font-black leading-none shrink-0"
                    style={{ color: '#f5e678', textShadow: '0 0 20px rgba(212,175,55,0.5)' }}
                  >
                    ${t.price.toLocaleString()}
                  </p>
                </div>

                {/* Impact */}
                {t.sponsorImpact && (
                  <p className="text-sm text-white/50 leading-relaxed mb-4">
                    <span className="text-amber-400 font-semibold">Impact: </span>
                    {t.sponsorImpact}
                  </p>
                )}

                {/* Perks */}
                {t.sponsorPerks?.length > 0 && (
                  <ul className="space-y-2 mb-6 flex-1" aria-label={`${t.name} perks`}>
                    {t.sponsorPerks.map((perk: string, j: number) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-white/40 leading-relaxed">
                        <span className="text-amber-500 text-[10px] mt-1.5 shrink-0">✦</span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                )}

                {(!t.sponsorPerks || t.sponsorPerks.length === 0) && <div className="flex-1" />}

                {/* CTA */}
                <div className="mt-auto">
                  {cartQty > 0 && (
                    <p className="oswald text-[10px] font-black uppercase tracking-[0.15em] text-amber-400/60 mb-2 text-center">
                      ♦ {cartQty} in cart
                    </p>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => available && handleAddToCart(t)}
                    disabled={!available}
                    aria-label={!available ? message : `Add ${t.name} to cart`}
                    className="relative w-full flex items-center gap-0 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      boxShadow: available ? `0 0 24px ${grad.glow}, 0 4px 20px rgba(0,0,0,0.6)` : 'none',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    {available && (
                      <span
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{
                          background: `linear-gradient(90deg, transparent 25%, ${grad.shimmer} 50%, transparent 75%)`,
                          animation: 'btnShine 3s infinite linear'
                        }}
                        aria-hidden="true"
                      />
                    )}

                    <span
                      className="relative flex items-center justify-center w-12 h-12 shrink-0 text-xl font-black suit"
                      style={{ background: grad.card }}
                      aria-hidden="true"
                    >
                      ♦
                    </span>

                    <span
                      className="relative flex-1 flex items-center justify-center h-12 px-4"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      <span className="oswald text-[13px] font-black uppercase tracking-[0.08em] text-white leading-none whitespace-nowrap">
                        {available ? 'Become a Sponsor' : message}
                      </span>
                    </span>

                    {available && (
                      <span
                        className="relative flex items-center justify-center h-12 px-4 shrink-0"
                        style={{ background: 'rgba(0,0,0,0.3)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <span className="oswald text-[12px] font-black" style={{ color: '#f5e678' }}>
                          ${t.price.toLocaleString()}
                        </span>
                      </span>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
      </div>
    </section>
  )
}
