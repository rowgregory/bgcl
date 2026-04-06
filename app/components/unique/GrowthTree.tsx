import React from 'react'
import { motion } from 'framer-motion'
import { IHero } from '@/types/entities/hero'

const GrowthTree = ({ hero }: { hero: IHero }) => {
  if (!hero?.showGrowthTree) return null

  const percentage = Math.min(Math.round((hero.growthTreeCurrent / (hero.growthTreeGoal || 1)) * 100), 100)
  const numLeaves = Math.floor((percentage / 100) * 30)

  const leafPositions = [
    { x: 100, y: 30, r: 45 },
    { x: 95, y: 35, r: -20 },
    { x: 105, y: 32, r: 60 },
    { x: 92, y: 40, r: 10 },
    { x: 108, y: 38, r: -45 },
    { x: 85, y: 60, r: -30 },
    { x: 115, y: 65, r: 40 },
    { x: 78, y: 72, r: 20 },
    { x: 122, y: 70, r: -50 },
    { x: 100, y: 55, r: 0 },
    { x: 72, y: 110, r: -40 },
    { x: 128, y: 115, r: 35 },
    { x: 65, y: 125, r: 15 },
    { x: 135, y: 120, r: -25 },
    { x: 100, y: 95, r: 50 },
    { x: 90, y: 108, r: -15 },
    { x: 110, y: 105, r: 25 },
    { x: 55, y: 155, r: -35 },
    { x: 145, y: 160, r: 40 },
    { x: 62, y: 168, r: 10 },
    { x: 138, y: 165, r: -20 },
    { x: 50, y: 145, r: 55 },
    { x: 150, y: 150, r: -55 },
    { x: 95, y: 140, r: 30 },
    { x: 105, y: 145, r: -35 },
    { x: 70, y: 138, r: 45 },
    { x: 130, y: 142, r: -40 },
    { x: 88, y: 125, r: 15 },
    { x: 112, y: 128, r: -10 },
    { x: 100, y: 118, r: 0 }
  ]

  const foliageLayers = [
    { cx: 60, cy: 160, r: 35, delay: 0.4, opacity: 0.6 },
    { cx: 140, cy: 160, r: 35, delay: 0.5, opacity: 0.6 },
    { cx: 100, cy: 150, r: 40, delay: 0.6, opacity: 0.7 },
    { cx: 75, cy: 120, r: 32, delay: 0.7, opacity: 0.75 },
    { cx: 125, cy: 120, r: 32, delay: 0.8, opacity: 0.75 },
    { cx: 100, cy: 105, r: 38, delay: 0.9, opacity: 0.8 },
    { cx: 85, cy: 75, r: 28, delay: 1.0, opacity: 0.85 },
    { cx: 115, cy: 75, r: 28, delay: 1.1, opacity: 0.85 },
    { cx: 100, cy: 55, r: 30, delay: 1.2, opacity: 0.9 },
    { cx: 100, cy: 35, r: 25, delay: 1.3, opacity: 0.95 }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-flex flex-col items-center gap-4 px-5 py-4 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-sm border-2 border-white/20 dark:border-white/10"
    >
      {/* Label — matches countdown/thermometer pattern */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-px bg-white/30" aria-hidden="true" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">{hero.growthTreeLabel}</p>
        <div className="w-8 h-px bg-white/30" aria-hidden="true" />
      </div>

      <div className="flex items-center gap-5">
        {/* Tree SVG — scaled down */}
        <div
          className="relative w-24 h-36"
          role="img"
          aria-label={`Growth tree: ${hero.growthTreeCurrent.toLocaleString()} of ${hero.growthTreeGoal.toLocaleString()}`}
        >
          <svg viewBox="0 0 200 300" className="w-full h-full">
            {/* Ground */}
            <ellipse cx="100" cy="285" rx="60" ry="8" fill="#44403c" opacity="0.3" />

            {/* Trunk */}
            <motion.path
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ originY: '100%' } as React.CSSProperties}
              d="M85 285 L88 180 Q90 160 92 140 L108 140 Q110 160 112 180 L115 285 Z"
              fill="#78716c"
            />

            {/* Trunk texture */}
            <motion.path
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.5 }}
              d="M88 260 Q95 255 88 250 M112 265 Q105 260 112 255 M90 230 Q97 225 90 220 M110 235 Q103 230 110 225 M88 200 Q95 195 88 190 M112 205 Q105 200 112 195"
              stroke="#57534e"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Foliage layers */}
            {foliageLayers.map((c, i) => (
              <motion.circle
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: c.delay }}
                cx={c.cx}
                cy={c.cy}
                r={c.r}
                fill={hero.growthTreeColor}
                opacity={c.opacity}
              />
            ))}

            {/* Highlights */}
            {[
              { cx: 90, cy: 45, r: 15, delay: 1.4, opacity: 0.3 },
              { cx: 110, cy: 70, r: 12, delay: 1.4, opacity: 0.2 }
            ].map((h, i) => (
              <motion.circle
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: h.opacity }}
                transition={{ delay: h.delay }}
                cx={h.cx}
                cy={h.cy}
                r={h.r}
                fill="#ffffff"
              />
            ))}

            {/* Leaves */}
            {leafPositions.map((pos, i) => (
              <motion.g
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={i < numLeaves ? { scale: 1, opacity: 0.9 } : { scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, delay: 1.5 + i * 0.03 }}
              >
                <path
                  d="M 0,-5 Q 2.5,-2.5 2.5,0 Q 2.5,2.5 0,5 Q -1,2.5 -1,0 Q -1,-2.5 0,-5 Z"
                  transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.r})`}
                  fill={hero.growthTreeColor}
                  opacity="0.95"
                />
              </motion.g>
            ))}

            {/* Roots */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              d="M85 285 Q75 290 65 295 M115 285 Q125 290 135 295 M100 285 Q95 292 90 298"
              stroke="#78716c"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Glow */}
            <motion.ellipse
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.12 }}
              transition={{ delay: 1.4, duration: 1 }}
              cx="100"
              cy="120"
              rx="70"
              ry="90"
              fill={hero.growthTreeColor}
              style={{ filter: 'blur(15px)' }}
            />
          </svg>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-2xl font-black leading-none tabular-nums"
              style={{ color: hero.growthTreeColor }}
            >
              {hero.growthTreeCurrent.toLocaleString()}
            </motion.span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/50 mt-0.5">Current</span>
          </div>

          <div className="w-full h-px bg-white/10" aria-hidden="true" />

          <div className="flex flex-col">
            <span className="text-sm font-bold text-white/50 leading-none tabular-nums">
              {hero.growthTreeGoal.toLocaleString()}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/50 mt-0.5">Goal</span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-black leading-none" style={{ color: hero.growthTreeColor }}>
              {percentage}%
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/50 mt-0.5">Complete</span>
          </div>

          <div className="text-[9px] text-white/30 font-medium">🌿 {numLeaves} leaves</div>
        </div>
      </div>
    </motion.div>
  )
}

export default GrowthTree
