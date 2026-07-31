import { Fragment } from 'react/jsx-runtime'
import { SectionHeading } from './CasinoUiElements'
import { motion } from 'framer-motion'

export function CasinoPrizes({ prizes }) {
  return (
    <Fragment>
      {prizes.length > 0 && (
        <section aria-labelledby="prizes-heading">
          <SectionHeading suit="♦" id="prizes-heading">
            Prize Ladder
          </SectionHeading>
          <div>
            {prizes.map((prize: any, i: number) => {
              const colors = ['#f5e678', '#c0c0c0', '#cd7f32']
              const color = colors[i] ?? 'rgba(255,255,255,0.3)'
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center justify-between gap-4 py-4 ${i < prizes.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className="oswald text-[32px] font-black leading-none w-7 text-center"
                      style={{ color, textShadow: i === 0 ? `0 0 20px ${color}` : 'none' }}
                    >
                      {prize.place}
                    </span>
                    <span className="text-sm text-white/40">{prize.label}</span>
                  </div>
                  <span
                    className="oswald text-2xl font-black"
                    style={{ color, textShadow: i === 0 ? `0 0 20px ${color}80` : 'none' }}
                  >
                    {prize.amount}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </section>
      )}
    </Fragment>
  )
}
