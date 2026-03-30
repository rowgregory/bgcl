import { Trophy } from 'lucide-react'
import { SectionHeading } from './CasinoUiElements'
import { motion } from 'framer-motion'

export function CasinoDressCodeAndHighlights({ data }) {
  return (
    <section aria-labelledby="dresscode-heading">
      <SectionHeading suit="♥" id="dresscode-heading">
        {data.dressCodeHeadline ?? 'Dress Code'}
      </SectionHeading>

      {/* Dress code options */}
      {data?.dressCodeItems?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 mb-8">
          {data.dressCodeItems.map((item: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3"
            >
              <span className="text-amber-400 text-xs mt-1.5 shrink-0">✦</span>
              <div>
                <p className="oswald text-base font-black text-white uppercase tracking-wide leading-tight">
                  {item.label}
                </p>
                {item.description && <p className="text-sm text-white/40 leading-relaxed mt-0.5">{item.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Venue note */}
      {data?.dressCodeNote && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-start gap-3 mb-6"
        >
          <span className="text-amber-400/60 text-sm shrink-0 mt-0.5" aria-hidden="true">
            !
          </span>
          <p className="text-sm font-bold text-white/60 italic leading-relaxed">({data.dressCodeNote})</p>
        </motion.div>
      )}

      {/* Best dressed prizes */}
      {data?.bestDressedPrizes && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-start gap-3"
        >
          <Trophy className="w-5 h-5 text-amber-400/60 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-white/50 leading-relaxed">
            <span className="oswald font-black text-white uppercase tracking-wide text-base">
              Best Dressed Prizes&nbsp;
            </span>
            {data.bestDressedPrizes}
          </p>
        </motion.div>
      )}
    </section>
  )
}
