import { GRADIENTS, SectionHeading } from './CasinoUiElements'
import { motion } from 'framer-motion'
import useSoundEffect from '@/lib/hooks/useSoundEffect'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { TCasinoSponsorTiers } from '@/types/casino.types'
import { useCartStore } from '@/stores/useCartStore'
import { useAddToCartToast } from '@/stores/useAddToCartToast'
import { usePreferencesStore } from '@/stores/usePreferencesStore'

export function CasinoBlackjackTicket({ data }: TCasinoSponsorTiers) {
  const addToCart = useCartStore((s) => s.addToCart)
  const showToast = useAddToCartToast((s) => s.show)
  const soundOn = usePreferencesStore((s) => s.soundOn)
  const { play } = useSoundEffect('/sound-effects/casino-6.wav', soundOn)

  const handleAddToCart = (ticket: any) => {
    const enriched = {
      ...ticket,
      eventId: data.id,
      eventTitle: data.title,
      ticketSalesStartDate: data.ticketSalesStartDate,
      ticketSalesEndDate: data.ticketSalesEndDate
    }

    addToCart(enriched, 1)
    showToast(enriched, 1)
    play()
  }

  return (
    <section aria-labelledby="individual-ticket-heading">
      <SectionHeading suit="♦" id="individual-ticket-heading">
        Blackjack Tournament
      </SectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
        {data.tickets
          .filter((t: any) => t.ticketType === 'TOURNAMENT')
          .map((t: any, i: number) => {
            const soldPct = Math.min((t.quantitySold / t.totalQuantity) * 100, 100)
            const soldOut = t.totalQuantity - t.quantitySold - t.quantityReserved <= 0
            const available = !soldOut
            const message = soldOut ? 'Sold out' : 'Sales closed'
            const items = useCartStore.getState().items
            const cartItem = items?.find((item: any) => item.ticketId === t.id)
            const cartQty = cartItem?.quantity ?? 0
            const grad = GRADIENTS.TOURNAMENT
            const remaining = t.totalQuantity - t.quantitySold - t.quantityReserved
            const almostGone = available && remaining <= 10

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
                      <span className="suit">♣</span> {t.name}
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

                {/* Description */}
                {t.description && <p className="text-xs text-white/35 leading-relaxed line-clamp-2">{t.description}</p>}

                {/* Availability */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-1.5">
                    <span
                      className={`text-[10px] font-bold flex items-center gap-1 ${almostGone ? 'text-orange-400' : available ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                      {available ? (
                        almostGone ? (
                          <>
                            <AlertCircle className="w-2.5 h-2.5" aria-hidden="true" />
                            Only {remaining} left!
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-2.5 h-2.5" aria-hidden="true" />
                            Available
                          </>
                        )
                      ) : (
                        message
                      )}
                    </span>
                    <span className="text-[10px] text-white/20 tabular-nums">
                      {t.quantitySold}/{t.totalQuantity}
                    </span>
                  </div>
                  <div
                    className="h-0.5 rounded-full bg-white/6 overflow-hidden"
                    role="progressbar"
                    aria-valuenow={t.quantitySold}
                    aria-valuemin={0}
                    aria-valuemax={t.totalQuantity}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${soldPct}%` }}
                      transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: available ? grad.card : 'rgba(255,255,255,0.12)' }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-auto">
                  {cartQty > 0 && (
                    <p className="oswald text-[10px] font-black uppercase tracking-[0.15em] text-amber-400/60 mb-2 text-center">
                      ♣ {cartQty} in cart
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
                      ♣
                    </span>

                    <span
                      className="relative flex-1 flex items-center justify-center h-12 px-4"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      <span className="oswald text-[13px] font-black uppercase tracking-[0.08em] text-white leading-none whitespace-nowrap">
                        {available ? t.name : message}
                      </span>
                    </span>

                    {available && (
                      <span
                        className="relative flex items-center justify-center h-12 px-4 shrink-0"
                        style={{ background: 'rgba(0,0,0,0.3)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <span className="oswald text-[12px] font-black text-[#f5e678]">
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
