import { motion } from 'framer-motion'

export function CasinoRaffleStats({ data }) {
  return (
    <section aria-label="Raffle statistics" className="grid grid-cols-1 sm:grid-cols-3">
      {[
        data?.raffleGrandPrizeLabel && { label: 'Grand Prize', value: data.raffleGrandPrizeLabel, gold: true },
        data?.raffleTicketPrice && { label: 'Ticket Price', value: data.raffleTicketPrice, gold: false },
        data?.raffleOddsLabel && { label: 'Winning Odds', value: data.raffleOddsLabel, gold: false }
      ]
        .filter(Boolean)
        .map(({ label, value, gold }: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center py-8 px-5"
          >
            <p className="oswald text-[9px] font-black uppercase tracking-[0.25em] text-white/25 mb-2.5">{label}</p>
            <p
              className="oswald font-black leading-none"
              style={{
                fontSize: 'clamp(28px, 6vw, 52px)',
                color: gold ? '#f5e678' : '#fff',
                textShadow: gold ? '0 0 30px rgba(212,175,55,0.8)' : 'none'
              }}
            >
              {value}
            </p>
          </motion.div>
        ))}
    </section>
  )
}
