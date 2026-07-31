import { IHero } from '@/types/entities/hero'
import { motion } from 'framer-motion'

const Thermometer = ({ hero }: { hero: IHero }) => {
  if (!hero?.showThermometer) return null

  const percentage = Math.min(Math.round((hero.thermometerCurrent / (hero.thermometerGoal || 1)) * 100), 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-flex flex-col items-center gap-4 px-5 py-4 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-sm border-2 border-white/20 dark:border-white/10"
    >
      {/* Label */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-px bg-white/30" aria-hidden="true" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">{hero.thermometerLabel}</p>
        <div className="w-8 h-px bg-white/30" aria-hidden="true" />
      </div>

      <div className="flex items-end gap-5">
        {/* Tube */}
        <div className="flex flex-col items-center gap-1.5">
          {/* Top cap */}
          <div
            className="w-5 h-2.5 rounded-t-full border border-white/20"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            aria-hidden="true"
          />

          {/* Tube body */}
          <div
            className="relative w-5 h-32 border border-white/20 overflow-hidden"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}
            role="meter"
            aria-valuenow={hero.thermometerCurrent}
            aria-valuemin={0}
            aria-valuemax={hero.thermometerGoal}
            aria-label={`${hero.thermometerLabel}: ${hero.thermometerCurrent.toLocaleString()} of ${hero.thermometerGoal.toLocaleString()}`}
          >
            {/* Tick marks */}
            {[75, 50, 25].map((tick) => (
              <div
                key={tick}
                className="absolute left-0 right-0 h-px bg-white/15"
                style={{ bottom: `${tick}%` }}
                aria-hidden="true"
              />
            ))}

            {/* Fill */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${percentage}%` }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
              className="absolute bottom-0 left-0 right-0"
              style={{ backgroundColor: hero.thermometerColor }}
              aria-hidden="true"
            >
              {/* Shine */}
              <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent w-1/2" />
            </motion.div>
          </div>

          {/* Bulb */}
          <div
            className="w-9 h-9 rounded-full border border-white/20 relative overflow-hidden -mt-1"
            style={{
              backgroundColor: hero.thermometerColor,
              boxShadow: `0 0 16px ${hero.thermometerColor}60`
            }}
            aria-hidden="true"
          >
            <div className="absolute top-1 left-1 w-3 h-3 bg-white/40 rounded-full blur-sm" />
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-3 pb-1">
          {/* Percentage */}
          <div className="flex flex-col">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-3xl font-black text-white leading-none tabular-nums"
              style={{ color: hero.thermometerColor }}
            >
              {percentage}%
            </motion.span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/50 mt-0.5">Complete</span>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/10" aria-hidden="true" />

          {/* Raised */}
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white leading-none tabular-nums">
              ${hero.thermometerCurrent.toLocaleString()}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/50 mt-0.5">Raised</span>
          </div>

          {/* Goal */}
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white/50 leading-none tabular-nums">
              ${hero.thermometerGoal.toLocaleString()}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/50 mt-0.5">Goal</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Thermometer
